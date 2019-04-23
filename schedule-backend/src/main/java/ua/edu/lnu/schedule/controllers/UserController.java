package ua.edu.lnu.schedule.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.dataaccess.models.Class;
import ua.edu.lnu.schedule.dataaccess.models.*;
import ua.edu.lnu.schedule.dataaccess.repositories.*;
import ua.edu.lnu.schedule.dataaccess.viewmodels.ChangePasswordModel;
import ua.edu.lnu.schedule.security.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	private AuthorityRepository authorities;
	private ClassRepository classes;
	private SubjectRepository subjects;
	private UserRepository users;
	private WishRepository wishes;
	
	private UserService userService;
	
	@Autowired
	public void setAuthorities(AuthorityRepository authorities) {
		this.authorities = authorities;
	}
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setSubjects(SubjectRepository subjects) {
		this.subjects = subjects;
	}
	
	@Autowired
	public void setUsers(UserRepository users) {
		this.users = users;
	}
	
	@Autowired
	public void setWishes(WishRepository wishes) {
		this.wishes = wishes;
	}
	
	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	@GetMapping
	public @ResponseBody Iterable<User> getAll() {
		return this.users.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody User getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return user;
	}
	
	@GetMapping("/current")
	public @ResponseBody User getCurrentUser(Principal p) {
		return this.users.findByUsername(p.getName());
	}
	
	@GetMapping("/role/{role}")
	public @ResponseBody Iterable<User> getByRole(
		@PathVariable("role") String role) {
		Authority authority = this.authorities.findByName(
			this.userService.getAuthorityName(role));
		
		return authority == null
			? new ArrayList<>()
			: this.users.findAllByAuthoritiesContaining(authority);
	}
	
	@GetMapping("/facultyId/{facultyId}")
	public @ResponseBody Iterable<User> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.users.findAllByFaculty_Id(facultyId);
	}
	
	@GetMapping("/role/{role}/facultyId/{facultyId}")
	public @ResponseBody Iterable<User> getByRoleAndFaculty(
		@PathVariable("role") String role,
		@PathVariable("facultyId") int facultyId) {
		Authority authority = this.authorities.findByName(
			this.userService.getAuthorityName(role));
		
		return authority == null
			? new ArrayList<>()
			: this.users.findAllByFaculty_IdAndAuthoritiesContaining(
				facultyId,
				this.authorities.findByName(
					this.userService.getAuthorityName(role)));
	}
	
	@GetMapping("/subjectId/{subjectId}")
	public @ResponseBody Iterable<User> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		Subject subject = this.subjects.findOne(subjectId);
		
		return subject == null
			? new ArrayList<>()
			: this.users.findAllBySubjectsContaining(subject);
	}
	
	@GetMapping("/classId/{classId}")
	public @ResponseBody Iterable<User> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.users.findAllByClassesContaining(c);
	}
	
	@GetMapping(
		"/available/facultyId/{facultyId}/subjectId/{subjectId}" +
		"/day/{day}/number/{number}/frequency/{frequency}")
	public @ResponseBody Iterable<User> getAvailable(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("subjectId") int subjectId,
		@PathVariable("day") int day,
		@PathVariable("number") int number,
		@PathVariable("frequency") String frequencyName) {
		Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
		
		Semester currentSemester =
			Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
		
		Class.Frequency frequency =
			Class.Frequency.valueOf(frequencyName.toUpperCase());
		
		int currentYear = currentSemester == Semester.FIRST
			? calendar.get(Calendar.YEAR)
			: calendar.get(Calendar.YEAR) - 1;
		Class.Frequency weekly = Class.Frequency.WEEKLY;
		
		List<Class> potentialClasses = frequency == weekly
			? this.classes.findAllByDayOfWeekAndNumberAndYearAndSemester(
				DayOfWeek.of(day), number, currentYear, currentSemester)
			: this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
				DayOfWeek.of(day), number, frequency, currentYear, currentSemester);
		
		if (frequency != weekly) {
			potentialClasses.addAll(
				this.classes.findAllByDayOfWeekAndNumberAndFrequencyAndYearAndSemester(
					DayOfWeek.of(day), number, weekly, currentYear, currentSemester));
		}
		
		Subject subject = this.subjects.findOne(subjectId);
		
		return subject == null
			? new ArrayList<>()
			: this.users.findAllByFaculty_IdAndSubjectsContaining(facultyId, subject)
			.stream()
			.filter(lecturer -> potentialClasses.stream()
				.flatMap(c -> c.getLecturers().stream())
				.noneMatch(l -> Objects.equals(l.getId(), lecturer.getId())))
			.collect(Collectors.toList());
	}
	
	@GetMapping("/wishId/{wishId}")
	public @ResponseBody User getByWish(
		@PathVariable("wishId") int wishId, HttpServletResponse response) {
		Wish wish = this.wishes.findOne(wishId);
		
		if (wish == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.users.findByWishesContaining(wish);
	}
	
	@PostMapping
	public ResponseEntity<?> post(
		@RequestBody User user)
		throws URISyntaxException {
		this.userService.save(user);
		
		return ResponseEntity.created(new URI("/users/" + user.getId())).build();
	}
	
	@PostMapping("/{id}/roles/add/{role}")
	public ResponseEntity<?> addUserToRole(
		@PathVariable("id") int id,
		@PathVariable("role") String role) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			return ResponseEntity.notFound().build();
		}
		
		this.userService.addUserToRole(user, role);
		this.users.save(user);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/{id}/roles/remove/{role}")
	public ResponseEntity<?> removeUserFromRole(
		@PathVariable("id") int id,
		@PathVariable("role") String role) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			return ResponseEntity.notFound().build();
		}
		
		this.userService.removeUserFromRole(user, role);
		this.users.save(user);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/current/changePassword")
	public ResponseEntity<?> changePassword(
		@RequestBody ChangePasswordModel model,
		Authentication authentication) {
		User user = this.users.findByUsername(
			((UserDetails)authentication.getPrincipal()).getUsername());
		
		boolean success = this.userService.changePassword(
			user, model.getOldPassword(), model.getNewPassword());
		
		return success
			? ResponseEntity.noContent().build()
			: ResponseEntity.status(HttpStatus.FORBIDDEN).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody User user,
		Authentication authentication) {
		User userToChange = this.users.findOne(id);
		
		if (userToChange == null) {
			return ResponseEntity.notFound().build();
		}
		
		if (user.getFirstName() != null) {
			userToChange.setFirstName(user.getFirstName());
		}
		
		if (user.getMiddleName() != null) {
			userToChange.setMiddleName(user.getMiddleName());
		}
		
		if (user.getLastName() != null) {
			userToChange.setLastName(user.getLastName());
		}
		
		if (user.getPosition() != null) {
			userToChange.setPosition(user.getPosition());
		}
		
		this.users.save(userToChange);
		
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/current")
	public ResponseEntity<?> putCurrent(
		@RequestBody ChangePasswordModel model,
		Principal p) {
		User user = this.users.findByUsername(p.getName());
		
		if (user.getFirstName() != null) {
			user.setFirstName(user.getFirstName());
		}
		
		if (user.getMiddleName() != null) {
			user.setMiddleName(user.getMiddleName());
		}
		
		if (user.getLastName() != null) {
			user.setLastName(user.getLastName());
		}
		
		this.users.save(user);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.users.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.users.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

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

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.viewmodels.ChangePasswordModel;
import ua.edu.lnu.schedule.repositories.*;
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
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getAll() {
		return this.users.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody User getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return user;
	}
	
	@RequestMapping(value = "/current", method = RequestMethod.GET)
	public @ResponseBody User getCurrentUser(Principal p) {
		return this.users.findByUsername(p.getName());
	}
	
	@RequestMapping(value = "/role/{role}", method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getByRole(
		@PathVariable("role") String role) {
		Authority authority = this.authorities.findByName(
			this.userService.getAuthorityName(role));
		
		return authority == null
			? new ArrayList<>()
			: this.users.findAllByAuthoritiesContaining(authority);
	}
	
	@RequestMapping(value = "/facultyId/{facultyId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.users.findAllByFaculty_Id(facultyId);
	}
	
	@RequestMapping(
		value = "/role/{role}/facultyId/{facultyId}",
		method = RequestMethod.GET)
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
	
	@RequestMapping(value = "/subjectId/{subjectId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		Subject subject = this.subjects.findOne(subjectId);
		
		return subject == null
			? new ArrayList<>()
			: this.users.findAllBySubjectsContaining(subject);
	}
	
	@RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.users.findAllByClassesContaining(c);
	}
	
	@RequestMapping(value = "/wishId/{wishId}", method = RequestMethod.GET)
	public @ResponseBody User getByWish(
		@PathVariable("wishId") int wishId, HttpServletResponse response) {
		Wish wish = this.wishes.findOne(wishId);
		
		if (wish == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.users.findByWishesContaining(wish);
	}
	
	@RequestMapping(
		value = "/role/lecturer/available/facultyId/{facultyId}" +
			"/subjectId/{subjectId}/day/{day}/number/{number}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getAvailable(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("subjectId") int subjectId,
		@PathVariable("day") int day,
		@PathVariable("number") int number) {
		Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
		
		Semester currentSemester =
			Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
		
		int currentYear = currentSemester == Semester.FIRST
			? calendar.get(Calendar.YEAR)
			: calendar.get(Calendar.YEAR) - 1;
		
		List<Class> potentialClasses =
			this.classes.findAllByDayOfWeekAndNumberAndYearAndSemester(
				DayOfWeek.of(day), number, currentYear, currentSemester);
		
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
	
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<?> post(
		@RequestBody User user,
		@RequestParam("roles") String rolesParam)
		throws URISyntaxException {
		String[] roles = rolesParam.split(",");
		
		if (!Arrays.stream(roles).allMatch(role -> {
			role = role.toLowerCase();
			return role.equals("admin") ||
				   role.equals("editor") ||
				   role.equals("lecturer");
		})) {
			return ResponseEntity.badRequest().build();
		}
		
		user.setAuthorities(new HashSet<>());
		
		for (String role : roles) {
			this.userService.addUserToRole(user, role);
		}
		
		this.userService.save(user);
		
		return ResponseEntity.created(new URI("/users/" + user.getId())).build();
	}
	
	@RequestMapping(value = "/{id}/roles/add/{role}", method = RequestMethod.POST)
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
	
	@RequestMapping(value = "/{id}/roles/remove/{role}", method = RequestMethod.POST)
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
	
	@RequestMapping(value = "/current/changePassword", method = RequestMethod.POST)
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
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
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
	
	@RequestMapping(value = "/current", method = RequestMethod.PUT)
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
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.users.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.users.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

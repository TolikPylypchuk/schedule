package ua.edu.lnu.schedule.controllers;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
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
	private ClassRepository classes;
	private SubjectRepository subjects;
	private UserRepository users;
	private WishRepository wishes;
	
	private UserService userService;
	
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
	
	@RequestMapping(value = "/facultyId/{facultyId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<User> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.users.findAllByFaculty_Id(facultyId);
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
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(
		@RequestBody User user,
		@RequestParam("roles") String rolesParam,
		HttpServletResponse response) {
		String[] roles = rolesParam.split(",");
		
		if (!Arrays.stream(roles).allMatch(role -> {
			role = role.toLowerCase();
			return role.equals("admin") ||
				   role.equals("editor") ||
				   role.equals("lecturer");
		})) {
			response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		
		user.setAuthorities(new HashSet<>());
		
		for (String role : roles) {
			this.userService.addUserToRole(user, role);
		}
		
		this.userService.save(user);
		
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}/roles/add/{role}", method = RequestMethod.POST)
	public void addUserToRole(
		@PathVariable("id") int id,
		@PathVariable("role") String role,
		HttpServletResponse response) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		this.userService.addUserToRole(user, role);
		this.users.save(user);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}/roles/remove/{role}", method = RequestMethod.POST)
	public void removeUserFromRole(
		@PathVariable("id") int id,
		@PathVariable("role") String role,
		HttpServletResponse response) {
		User user = this.users.findOne(id);
		
		if (user == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		this.userService.removeUserFromRole(user, role);
		this.users.save(user);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/current/changePassword", method = RequestMethod.POST)
	public void changePassword(
		@RequestBody ChangePasswordModel model,
		HttpServletResponse response,
		Authentication authentication) {
		User user = this.users.findByUsername(
			((UserDetails)authentication.getPrincipal()).getUsername());
		
		boolean success = this.userService.changePassword(
			user, model.getOldPassword(), model.getNewPassword());
		
		response.setStatus(
			success
				? HttpServletResponse.SC_NO_CONTENT
				: HttpServletResponse.SC_FORBIDDEN);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody User user,
		HttpServletResponse response,
		Authentication authentication) {
		User userToChange = this.users.findOne(id);
		
		if (userToChange == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
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
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/current", method = RequestMethod.PUT)
	public void putCurrent(
		@RequestBody ChangePasswordModel model,
		HttpServletResponse response,
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
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.users.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		this.users.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

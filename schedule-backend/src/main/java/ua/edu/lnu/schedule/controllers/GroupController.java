package ua.edu.lnu.schedule.controllers;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.dataaccess.models.Group;
import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.services.GroupService;
import ua.edu.lnu.schedule.dataaccess.models.Class;

@RestController
@RequestMapping("/groups")
public class GroupController {
	private GroupService groupService;
	
	@Autowired
	public void setService(GroupService service) {
		this.groupService = service;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Group> getAll() {
		return this.groupService.getAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Group getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Group group = this.groupService.getById(id);
		
		if (group == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return group;
	}
	
	@GetMapping("/year/{year}")
	public @ResponseBody Iterable<Group> getByYear(
		@PathVariable("year") int year) {
		return this.groupService.getByYear(year);
		
	}
	
	@GetMapping("/classId/{classId}")
	public @ResponseBody Iterable<Group> getByClass(
		@PathVariable("classId") int classId) {
		return this.groupService.getByClass(classId);
		
	}
	
	@GetMapping("/facultyId/{facultyId}")
	public @ResponseBody Iterable<Group> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.groupService.getByFaculty(facultyId);
	}
	
	@GetMapping("/facultyId/{facultyId}/year/{year}")
	public @ResponseBody Iterable<Group> getByFacultyAndYear(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("year") int year) {
		return this.groupService.getByFacultyAndYear(facultyId, year);
	}
	
	@GetMapping("/facultyId/{facultyId}/since/{year}")
	public @ResponseBody Iterable<Group> getByFacultyAndYearSince(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("year") int year) {
		return this.groupService.getByFacultyAndYearSince(
			facultyId, year);
	}
	
	@GetMapping("/planId/{planId}")
	public @ResponseBody Group getByPlan(
		@PathVariable("planId") int planId, HttpServletResponse response) {
		return this.groupService.getByPlan(planId);
	}
	
	@GetMapping(
		"/available/facultyId/{facultyId}/subjectId/{subjectId}" +
		"/day/{day}/number/{number}/frequency/{frequency}")
	public @ResponseBody Iterable<Group> getAvailable(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("subjectId") int subjectId,
		@PathVariable("day") int day,
		@PathVariable("number") int number,
		@PathVariable("frequency") String frequencyName) {
		return this.groupService.getAvailable(facultyId,  subjectId, day, number, frequencyName);
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Group group)
		throws URISyntaxException {
		this.groupService.add(group);
		
		return ResponseEntity.created(
			new URI("/groups/" + group.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Group group) {
		
		this.groupService.update(id, group);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {		
		this.groupService.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

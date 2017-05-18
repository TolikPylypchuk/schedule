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

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.GroupRepository;
import ua.edu.lnu.schedule.repositories.PlanRepository;

@RestController
@RequestMapping("/groups")
public class GroupController {
	private ClassRepository classes;
	private GroupRepository groups;
	private PlanRepository plans;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Group> getAll() {
		return this.groups.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Group getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Group group = this.groups.findOne(id);
		
		if (group == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return group;
	}
	
	@GetMapping("/year/{year}")
	public @ResponseBody Iterable<Group> getByYear(
		@PathVariable("year") int year) {
		return this.groups.findAllByYear(year);
		
	}
	
	@GetMapping("/classId/{classId}")
	public @ResponseBody Iterable<Group> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.groups.findAllByClassesContaining(c);
		
	}
	
	@GetMapping("/facultyId/{facultyId}")
	public @ResponseBody Iterable<Group> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.groups.findAllByFaculty_Id(facultyId);
	}
	
	@GetMapping("/facultyId/{facultyId}/year/{year}")
	public @ResponseBody Iterable<Group> getByFacultyAndYear(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("year") int year) {
		return this.groups.findAllByFaculty_IdAndYear(facultyId, year);
	}
	
	@GetMapping("/facultyId/{facultyId}/since/{year}")
	public @ResponseBody Iterable<Group> getByFacultyAndYearSince(
		@PathVariable("facultyId") int facultyId,
		@PathVariable("year") int year) {
		return this.groups.findAllByFaculty_IdAndYearGreaterThanEqual(
			facultyId, year);
	}
	
	@GetMapping("/planId/{planId}")
	public @ResponseBody Group getByPlan(
		@PathVariable("planId") int planId, HttpServletResponse response) {
		Plan plan = this.plans.findOne(planId);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.groups.findByPlansContaining(plan);
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
		Calendar calendar = Calendar.getInstance(Locale.forLanguageTag("uk-UA"));
		
		Semester currentSemester =
			Semester.fromNumber(calendar.get(Calendar.MONTH) < 6 ? 2 : 1);
		
		Class.Frequency frequency =
			Class.Frequency.valueOf(frequencyName.toUpperCase());
		
		int currentYear = currentSemester == Semester.FIRST
			? calendar.get(Calendar.YEAR)
			: calendar.get(Calendar.YEAR) - 1;
		
		List<Plan> plans = this.plans.findAllBySubject_IdAndYearAndSemester(
			subjectId, currentYear, currentSemester);
		
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
		
		return this.groups.findAllByFaculty_Id(facultyId).stream()
			.filter(group -> plans.stream()
				.anyMatch(plan -> Objects.equals(plan.getGroup().getId(), group.getId())))
			.filter(group -> potentialClasses.stream()
				.flatMap(c -> c.getGroups().stream())
				.noneMatch(g -> Objects.equals(g.getId(), group.getId())))
			.collect(Collectors.toList());
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Group group)
		throws URISyntaxException {
		this.groups.save(group);
		
		return ResponseEntity.created(
			new URI("/groups/" + group.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Group group) {
		if (!this.groups.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		group.setId(id);
		this.groups.save(group);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.groups.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.groups.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.services.PlanService;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/plans")
public class PlanController {
	private PlanService planService;
	
	@Autowired
	public void setPlans(PlanService service) {
		this.planService = service;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Plan> getAll() {
		return this.planService.getAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Plan getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Plan plan = this.planService.getById(id);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return plan;
	}
	
	@GetMapping("/departmentId/{departmentId}")
	public @ResponseBody Iterable<Plan> getByDepartment(
		@PathVariable("departmentId") int departmentId) {
		return this.planService.getByDepartment(departmentId);
	}

	@GetMapping("/groupId/{groupId}")
	public @ResponseBody Iterable<Plan> getByGroup(
			@PathVariable("groupId") int groupId) {
		return this.planService.getByGroup(groupId);
	}
	
	@GetMapping("/groupId/{groupId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.planService.getByGroupYearSemester(
			groupId, year, semester);
	}
	
	@GetMapping("/subjectId/{subjectId}")
	public @ResponseBody Iterable<Plan> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		return this.planService.getBySubject(subjectId);
	}
	
	@GetMapping("/subjectId/{subjectId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getBySubjectYearSemester(
		@PathVariable("subjectId") int subjectId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.planService.getBySubjectYearSemester(
			subjectId, year, semester);
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Plan plan)
		throws URISyntaxException {
		this.planService.add(plan);

		return ResponseEntity.created(
			new URI("/plans/" + plan.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Plan plan) {
		this.planService.update(id, plan);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		this.planService.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

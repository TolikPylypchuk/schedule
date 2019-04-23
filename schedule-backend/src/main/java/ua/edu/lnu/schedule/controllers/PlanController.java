package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.dataaccess.repositories.PlanRepository;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
@RequestMapping("/plans")
public class PlanController {
	private PlanRepository plans;
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@GetMapping
	public @ResponseBody Iterable<Plan> getAll() {
		return this.plans.findAll();
	}
	
	@GetMapping("/{id}")
	public @ResponseBody Plan getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Plan plan = this.plans.findOne(id);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return plan;
	}
	
	@GetMapping("/departmentId/{departmentId}")
	public @ResponseBody Iterable<Plan> getByDepartment(
		@PathVariable("departmentId") int departmentId) {
		return this.plans.findAllByDepartment_Id(departmentId);
	}

	@GetMapping("/groupId/{groupId}")
	public @ResponseBody Iterable<Plan> getByGroup(
			@PathVariable("groupId") int groupId) {
		return this.plans.findAllByGroup_Id(groupId);
	}
	
	@GetMapping("/groupId/{groupId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.plans.findAllByGroup_IdAndYearAndSemester(
			groupId, year, Semester.fromNumber(semester));
	}
	
	@GetMapping("/subjectId/{subjectId}")
	public @ResponseBody Iterable<Plan> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		return this.plans.findAllBySubject_Id(subjectId);
	}
	
	@GetMapping("/subjectId/{subjectId}/year/{year}/semester/{semester}")
	public @ResponseBody Iterable<Plan> getBySubjectYearSemester(
		@PathVariable("subjectId") int subjectId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.plans.findAllBySubject_IdAndYearAndSemester(
			subjectId, year, Semester.fromNumber(semester));
	}
	
	@PostMapping
	public ResponseEntity<?> post(@RequestBody Plan plan)
		throws URISyntaxException {
		this.plans.save(plan);

		return ResponseEntity.created(
			new URI("/plans/" + plan.getId())).build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Plan plan) {
		if (!this.plans.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		plan.setId(id);
		this.plans.save(plan);
		
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.plans.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.plans.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

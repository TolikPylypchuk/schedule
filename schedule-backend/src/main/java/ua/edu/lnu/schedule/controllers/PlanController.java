package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Semester;
import ua.edu.lnu.schedule.repositories.PlanRepository;

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
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Plan> getAll() {
		return this.plans.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Plan getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Plan plan = this.plans.findOne(id);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return plan;
	}
	
	@RequestMapping(value = "/groupId/{groupId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Plan> getByGroup(
		@PathVariable("groupId") int groupId) {
		return this.plans.findAllByGroup_Id(groupId);
	}
	
	@RequestMapping(
		value = "/groupId/{groupId}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Plan> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.plans.findAllByGroup_IdAndYearAndSemester(
			groupId, year, Semester.fromNumber(semester));
	}
	
	@RequestMapping(value = "/subjectId/{subjectId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Plan> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		return this.plans.findAllBySubject_Id(subjectId);
	}
	
	@RequestMapping(
		value = "/subjectId/{subjectId}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Plan> getBySubjectYearSemester(
		@PathVariable("subjectId") int subjectId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.plans.findAllBySubject_IdAndYearAndSemester(
			subjectId, year, Semester.fromNumber(semester));
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public ResponseEntity<?> post(@RequestBody Plan plan)
		throws URISyntaxException {
		this.plans.save(plan);

		return ResponseEntity.created(
			new URI("/plans/" + plan.getId())).build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
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
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.plans.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.plans.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

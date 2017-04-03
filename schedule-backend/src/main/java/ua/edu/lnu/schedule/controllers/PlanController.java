package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.repositories.PlanRepository;

@RestController
@RequestMapping("/api/plans")
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
	public @ResponseBody Plan getById(@PathVariable("id") int id) {
		return this.plans.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Plan plan, HttpServletResponse response) {
		this.plans.save(plan);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Plan plan,
		HttpServletResponse response) {
		if (!this.plans.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		plan.setId(id);
		this.plans.save(plan);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.plans.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.plans.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

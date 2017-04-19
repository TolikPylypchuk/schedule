package ua.edu.lnu.schedule.controllers;

import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Group;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.GroupRepository;
import ua.edu.lnu.schedule.repositories.PlanRepository;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
	private GroupRepository groups;
	private ClassRepository classes;
	private PlanRepository plans;
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Group> getAll() {
		return this.groups.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Group getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Group group = this.groups.findOne(id);
		
		if (group == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return group;
	}
	
	@RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Group> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.groups.findAllByClassesContaining(c);
		
	}
	
	@RequestMapping(value = "/facultyId/{facultyId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Group> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.groups.findAllByFaculty_Id(facultyId);
	}
	
	@RequestMapping(value = "/planId/{planId}", method = RequestMethod.GET)
	public @ResponseBody Group getByPlan(
		@PathVariable("planId") int planId, HttpServletResponse response) {
		Plan plan = this.plans.findOne(planId);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.groups.findByPlansContaining(plan);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Group group, HttpServletResponse response) {
		this.groups.save(group);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Group group,
		HttpServletResponse response) {
		if (!this.groups.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		group.setId(id);
		this.groups.save(group);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.groups.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.groups.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

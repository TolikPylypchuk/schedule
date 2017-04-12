package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Group;
import ua.edu.lnu.schedule.repositories.GroupRepository;

@RestController
@RequestMapping("/api/groups")
public class GroupController {
	private GroupRepository groups;
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Group> getAll() {
		return this.groups.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Group getById(@PathVariable("id") int id) {
		return this.groups.findOne(id);
	}
	
	@RequestMapping(value = "/facultyId/{facultyId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Group> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.groups.findAllByFaculty_Id(facultyId);
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

package ua.edu.lnu.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.models.Class;
import ua.edu.lnu.repositories.ClassRepository;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
	private ClassRepository classes;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getAll() {
		return this.classes.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Class getById(@PathVariable("id") int id) {
		return this.classes.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Class c, HttpServletResponse response) {
		this.classes.save(c);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Class c,
		HttpServletResponse response) {
		if (!this.classes.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		c.setId(id);
		this.classes.save(c);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.classes.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.classes.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

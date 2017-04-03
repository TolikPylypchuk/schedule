package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Subject;
import ua.edu.lnu.schedule.repositories.SubjectRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	private SubjectRepository subjects;
	
	@Autowired
	public void setSubjects(SubjectRepository subjects) {
		this.subjects = subjects;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Subject> getAll() {
		return this.subjects.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Subject getById(@PathVariable("id") int id) {
		return this.subjects.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Subject subject, HttpServletResponse response) {
		this.subjects.save(subject);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Subject subject,
		HttpServletResponse response) {
		if (!this.subjects.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		subject.setId(id);
		this.subjects.save(subject);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.subjects.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.subjects.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

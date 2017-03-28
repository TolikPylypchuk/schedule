package ua.edu.lnu.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.models.Classroom;
import ua.edu.lnu.repositories.ClassroomRepository;

@RestController
@RequestMapping("/api/classrooms")
public class ClassroomController {
	private ClassroomRepository classrooms;
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms) {
		this.classrooms = classrooms;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getAll() {
		return this.classrooms.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Classroom getById(@PathVariable("id") int id) {
		return this.classrooms.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Classroom classroom, HttpServletResponse response) {
		this.classrooms.save(classroom);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Classroom classroom,
		HttpServletResponse response) {
		if (!this.classrooms.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		classroom.setId(id);
		this.classrooms.save(classroom);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.classrooms.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.classrooms.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

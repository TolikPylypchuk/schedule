package ua.edu.lnu.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.models.Lecturer;
import ua.edu.lnu.repositories.LecturerRepository;

@RestController
@RequestMapping("/api/lecturers")
public class LecturerController {
	private LecturerRepository lecturers;
	
	@Autowired
	public void setLecturers(LecturerRepository lecturers) {
		this.lecturers = lecturers;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Lecturer> getAll() {
		return this.lecturers.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Lecturer getById(@PathVariable("id") int id) {
		return this.lecturers.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Lecturer lecturer, HttpServletResponse response) {
		this.lecturers.save(lecturer);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Lecturer lecturer,
		HttpServletResponse response) {
		if (!this.lecturers.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		lecturer.setId(id);
		this.lecturers.save(lecturer);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.lecturers.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		}
		
		this.lecturers.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

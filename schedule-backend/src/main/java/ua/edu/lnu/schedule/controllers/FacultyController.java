package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Faculty;
import ua.edu.lnu.schedule.repositories.FacultyRepository;

@RestController
@RequestMapping("/faculties")
public class FacultyController {
	private FacultyRepository faculties;
	
	@Autowired
	public void setFaculties(FacultyRepository faculties) {
		this.faculties = faculties;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Faculty> getAll() {
		return this.faculties.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Faculty getById(@PathVariable("id") int id) {
		return this.faculties.findOne(id);
	}
	
	@RequestMapping(method = RequestMethod.POST)
	public void post(@RequestBody Faculty faculty, HttpServletResponse response) {
		this.faculties.save(faculty);
		response.setStatus(HttpServletResponse.SC_CREATED);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public void put(
		@PathVariable("id") int id,
		@RequestBody Faculty faculty,
		HttpServletResponse response) {
		if (!this.faculties.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		faculty.setId(id);
		this.faculties.save(faculty);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public void delete(@PathVariable("id") int id, HttpServletResponse response) {
		if (!this.faculties.exists(id)) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return;
		}
		
		this.faculties.delete(id);
		
		response.setStatus(HttpServletResponse.SC_NO_CONTENT);
	}
}

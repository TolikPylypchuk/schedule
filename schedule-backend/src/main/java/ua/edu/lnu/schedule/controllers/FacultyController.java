package ua.edu.lnu.schedule.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Faculty;
import ua.edu.lnu.schedule.repositories.FacultyRepository;

import java.net.URI;
import java.net.URISyntaxException;

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
	public ResponseEntity<?> post(@RequestBody Faculty faculty)
		throws URISyntaxException {
		this.faculties.save(faculty);
		
		return ResponseEntity.created(
			new URI("/faculties" + faculty.getId())).build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<?> put(
		@PathVariable("id") int id,
		@RequestBody Faculty faculty) {
		if (!this.faculties.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		faculty.setId(id);
		this.faculties.save(faculty);
		
		return ResponseEntity.noContent().build();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<?> delete(@PathVariable("id") int id) {
		if (!this.faculties.exists(id)) {
			return ResponseEntity.notFound().build();
		}
		
		this.faculties.delete(id);
		
		return ResponseEntity.noContent().build();
	}
}

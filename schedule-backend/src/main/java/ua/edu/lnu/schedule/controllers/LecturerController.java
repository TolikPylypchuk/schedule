package ua.edu.lnu.schedule.controllers;

import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Lecturer;
import ua.edu.lnu.schedule.models.Subject;
import ua.edu.lnu.schedule.models.Wish;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.LecturerRepository;
import ua.edu.lnu.schedule.repositories.SubjectRepository;
import ua.edu.lnu.schedule.repositories.WishRepository;

@RestController
@RequestMapping("/lecturers")
public class LecturerController {
	private LecturerRepository lecturers;
	private SubjectRepository subjects;
	private ClassRepository classes;
	private WishRepository wishes;
	
	@Autowired
	public void setLecturers(LecturerRepository lecturers) {
		this.lecturers = lecturers;
	}
	
	@Autowired
	public void setSubjects(SubjectRepository subjects) {
		this.subjects = subjects;
	}
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setWishes(WishRepository wishes) {
		this.wishes = wishes;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Lecturer> getAll() {
		return this.lecturers.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Lecturer getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Lecturer lecturer = this.lecturers.findOne(id);
		
		if (lecturer == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return lecturer;
	}
	
	@RequestMapping(value = "/facultyId/{facultyId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Lecturer> getByFaculty(
		@PathVariable("facultyId") int facultyId) {
		return this.lecturers.findAllByFaculty_Id(facultyId);
	}
	
	@RequestMapping(value = "/subjectId/{subjectId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Lecturer> getBySubject(
		@PathVariable("subjectId") int subjectId) {
		Subject subject = this.subjects.findOne(subjectId);
		
		return subject == null
			? new ArrayList<>()
			: this.lecturers.findAllBySubjectsContaining(subject);
	}
	
	@RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Lecturer> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.lecturers.findAllByClassesContaining(c);
	}
	
	@RequestMapping(value = "/wishId/{wishId}", method = RequestMethod.GET)
	public @ResponseBody Lecturer getByWish(
		@PathVariable("wishId") int wishId, HttpServletResponse response) {
		Wish wish = this.wishes.findOne(wishId);
		
		if (wish == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.lecturers.findByWishesContaining(wish);
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

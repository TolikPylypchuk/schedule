package ua.edu.lnu.schedule.controllers;

import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Lecturer;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Subject;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.LecturerRepository;
import ua.edu.lnu.schedule.repositories.PlanRepository;
import ua.edu.lnu.schedule.repositories.SubjectRepository;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {
	private ClassRepository classes;
	private LecturerRepository lecturers;
	private PlanRepository plans;
	private SubjectRepository subjects;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setLecturers(LecturerRepository lecturers) {
		this.lecturers = lecturers;
	}
	
	@Autowired
	public void setPlans(PlanRepository plans) {
		this.plans = plans;
	}
	
	@Autowired
	public void setSubjects(SubjectRepository subjects) {
		this.subjects = subjects;
	}
	
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Subject> getAll() {
		return this.subjects.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Subject getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Subject subject = this.subjects.findOne(id);
		
		if (subject == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return subject;
	}
	
	@RequestMapping(value = "/planId/{planId}", method = RequestMethod.GET)
	public @ResponseBody Subject getByPlan(
		@PathVariable("planId") int planId, HttpServletResponse response) {
		Plan plan = this.plans.findOne(planId);
		
		if (plan == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.subjects.findByPlansContaining(plan);
	}
	
	@RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
	public @ResponseBody Subject getByClass(
		@PathVariable("classId") int classId, HttpServletResponse response) {
		Class c = this.classes.findOne(classId);
		
		if (c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.subjects.findByClassesContaining(c);
	}
	
	@RequestMapping(value = "/lecturerId/{lecturerId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Subject> getByLecturer(
		@PathVariable("lecturerId") int lecturerId, HttpServletResponse response) {
		Lecturer lecturer = this.lecturers.findOne(lecturerId);
		
		if (lecturer == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return this.subjects.findAllByLecturersContaining(lecturer);
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

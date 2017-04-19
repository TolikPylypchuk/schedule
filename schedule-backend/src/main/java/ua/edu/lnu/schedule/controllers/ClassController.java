package ua.edu.lnu.schedule.controllers;

import java.time.DayOfWeek;
import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.ClassroomRepository;
import ua.edu.lnu.schedule.repositories.GroupRepository;
import ua.edu.lnu.schedule.repositories.LecturerRepository;

@RestController
@RequestMapping("/api/classes")
public class ClassController {
	private ClassRepository classes;
	private GroupRepository groups;
	private ClassroomRepository classrooms;
	private LecturerRepository lecturers;
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}
	
	@Autowired
	public void setGroups(GroupRepository groups) {
		this.groups = groups;
	}
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms) {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setLecturers(LecturerRepository lecturers) {
		this.lecturers = lecturers;
	}
	
	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getAll() {
		return this.classes.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Class getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Class c = this.classes.findOne(id);
		
		if (c == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return c;
	}
	
	@RequestMapping(value = "/groupId/{groupId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByGroup(
		@PathVariable("groupId") int groupId) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContaining(group);
		
	}
	
	@RequestMapping(
		value = "/groupId/{groupId}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByGroupYearSemester(
		@PathVariable("groupId") int groupId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Group group = this.groups.findOne(groupId);
		
		return group == null
			? new ArrayList<>()
			: this.classes.findAllByGroupsContainingAndYearAndSemester(
				group, year, Semester.fromNumber(semester));
		
	}
	
	@RequestMapping(value = "/classroomId/{classroomId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByClassroom(
		@PathVariable("classroomId") int classroomId) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContaining(classroom);
		
	}
	
	@RequestMapping(
		value = "/classroomId/{classroomId}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByClassroomYearSemester(
		@PathVariable("classroomId") int classroomId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Classroom classroom = this.classrooms.findOne(classroomId);
		
		return classroom == null
			? new ArrayList<>()
			: this.classes.findAllByClassroomsContainingAndYearAndSemester(
				classroom, year, Semester.fromNumber(semester));
		
	}
	
	@RequestMapping(value = "/lecturerId/{lecturerId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByLecturer(
		@PathVariable("lecturerId") int lecturerId) {
		Lecturer lecturer = this.lecturers.findOne(lecturerId);
		
		return lecturer == null
			? new ArrayList<>()
			: this.classes.findAllByLecturersContaining(lecturer);
		
	}
	
	@RequestMapping(
		value = "/lecturerId/{lecturerId}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByLecturerYearSemester(
		@PathVariable("lecturerId") int lecturerId,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		Lecturer lecturer = this.lecturers.findOne(lecturerId);
		
		return lecturer == null
			? new ArrayList<>()
			: this.classes.findAllByLecturersContainingAndYearAndSemester(
				lecturer, year, Semester.fromNumber(semester));
		
	}
	
	@RequestMapping(value = "/day/{day}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByDay(@PathVariable("day") int day) {
		return this.classes.findAllByDayOfWeek(DayOfWeek.of(day));
	}
	
	@RequestMapping(
		value = "/day/{day}/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByDayYearSemester(
		@PathVariable("day") int day,
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByDayOfWeekAndYearAndSemester(
			DayOfWeek.of(day), year, Semester.fromNumber(semester));
	}
	
	@RequestMapping(
		value = "/year/{year}/semester/{semester}",
		method = RequestMethod.GET)
	public @ResponseBody Iterable<Class> getByYearSemester(
		@PathVariable("year") int year,
		@PathVariable("semester") int semester) {
		return this.classes.findAllByYearAndSemester(year, Semester.fromNumber(semester));
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

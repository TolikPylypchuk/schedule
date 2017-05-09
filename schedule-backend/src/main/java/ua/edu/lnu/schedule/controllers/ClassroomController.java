package ua.edu.lnu.schedule.controllers;

import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.ClassroomType;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.ClassroomRepository;
import ua.edu.lnu.schedule.repositories.ClassroomTypeRepository;

@RestController
@RequestMapping("/classrooms")
public class ClassroomController {
	private ClassroomRepository classrooms;
	private ClassroomTypeRepository classroomTypes;
	private ClassRepository classes;
	
	@Autowired
	public void setClassrooms(ClassroomRepository classrooms)  {
		this.classrooms = classrooms;
	}
	
	@Autowired
	public void setClasses(ClassRepository classes) {
		this.classes = classes;
	}

	@Autowired
	public void setClassroomTypes(ClassroomTypeRepository classroomTypes) {
		this.classroomTypes = classroomTypes;
	}

	@RequestMapping(method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getAll() {
		return this.classrooms.findAll();
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public @ResponseBody Classroom getById(
		@PathVariable("id") int id, HttpServletResponse response) {
		Classroom classroom = this.classrooms.findOne(id);
		
		if (classroom == null) {
			response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		
		return classroom;
	}
	
	@RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getByClass(
		@PathVariable("classId") int classId) {
		Class c = this.classes.findOne(classId);
		
		return c == null
			? new ArrayList<>()
			: this.classrooms.findAllByClassesContaining(c);
		
	}
	
	@RequestMapping(value = "/buildingId/{buildingId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getByBuilding(
		@PathVariable("buildingId") int buildingId) {
		return this.classrooms.findAllByBuilding_Id(buildingId);
	}
	
	@RequestMapping(value = "/capacity/{capacity}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getByCapacity(
		@PathVariable("capacity") int capacity) {
		return this.classrooms.findAllByCapacityIsLessThanEqual(capacity);
	}

	@RequestMapping(value = "/typeId/{typeId}", method = RequestMethod.GET)
	public @ResponseBody Iterable<Classroom> getByType(
			@PathVariable("typeId") int typeId) {
		ClassroomType type = this.classroomTypes.findOne(typeId);

		return type.getType() == "Будь-яка"
				? this.classrooms.findAll()
				: this.classrooms.findAllByType_Id(typeId);
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

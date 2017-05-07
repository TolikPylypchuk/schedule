package ua.edu.lnu.schedule.controllers;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import ua.edu.lnu.schedule.models.ClassroomType;
import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.repositories.ClassRepository;
import ua.edu.lnu.schedule.repositories.ClassroomRepository;
import ua.edu.lnu.schedule.repositories.ClassroomTypeRepository;

@RestController
@RequestMapping("/api/classroomTypes")
public class ClassroomTypeController {
    private ClassroomTypeRepository classroomTypes;
    private ClassroomRepository classrooms;
    private ClassRepository classes;

    @Autowired
    public void setClassroomTypes(ClassroomTypeRepository classroomTypes) {
        this.classroomTypes = classroomTypes;
    }

    @Autowired
    public void setClassrooms(ClassroomRepository classrooms) {
        this.classrooms = classrooms;
    }

    @Autowired
    public void setClasss(ClassRepository classes) {
        this.classes = classes;
    }

    @RequestMapping(method = RequestMethod.GET)
    public @ResponseBody Iterable<ClassroomType> getAll() {
        return this.classroomTypes.findAll();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public @ResponseBody ClassroomType getById(
            @PathVariable("id") int id, HttpServletResponse response) {
        ClassroomType classroomType = this.classroomTypes.findOne(id);

        if (classroomType == null) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        return classroomType;
    }

    @RequestMapping(value = "/classroomId/{classroomId}", method = RequestMethod.GET)
    public @ResponseBody ClassroomType getByClassroom(
            @PathVariable("classroomId") int classroomId, HttpServletResponse response) {
        Classroom c = this.classrooms.findOne(classroomId);

        if(c == null){
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        return this.classroomTypes.findByClassroomsContaining(c);
    }

    @RequestMapping(value = "/classId/{classId}", method = RequestMethod.GET)
    public @ResponseBody ClassroomType getByClass(
            @PathVariable("classId") int classId, HttpServletResponse response) {
        Class c = this.classes.findOne(classId);

        if(c == null){
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            return null;
        }

        return this.classroomTypes.findByClasssContaining(c);
    }

    @RequestMapping(method = RequestMethod.POST)
    public void post(@RequestBody ClassroomType classroomType, HttpServletResponse response) {
        this.classroomTypes.save(classroomType);
        response.setStatus(HttpServletResponse.SC_CREATED);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public void put(
            @PathVariable("id") int id,
            @RequestBody ClassroomType classroomType,
            HttpServletResponse response) {
        if (!this.classrooms.exists(id)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }

        classroomType.setId(id);
        this.classroomTypes.save(classroomType);

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") int id, HttpServletResponse response) {
        if (!this.classroomTypes.exists(id)) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        }

        this.classroomTypes.delete(id);

        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }
}

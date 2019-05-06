package ua.edu.lnu.schedule.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ua.edu.lnu.schedule.models.Department;
import ua.edu.lnu.schedule.models.Faculty;
import ua.edu.lnu.schedule.repositories.DepartmentRepository;
import ua.edu.lnu.schedule.repositories.FacultyRepository;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@RestController
@RequestMapping("/department")
public class DepartmentController {
    private DepartmentRepository departments;

    @Autowired
    public void setDepartments(DepartmentRepository departments) {
        this.departments = departments;
    }

    @GetMapping
    public @ResponseBody
    Iterable<Department> getAll() {
        return this.departments.findAll();
    }

    @GetMapping("/{id}")
    public @ResponseBody Department getById(@PathVariable("id") int id) {
        return this.departments.findOne(id);
    }

    @GetMapping("/faculty/{facultyId}")
    public @ResponseBody
    List<Department> getByFaculty(@PathVariable("facultyId") int facultyId) {
        return this.departments.findAllByFaculty_Id(facultyId);
    }

    @PostMapping
    public ResponseEntity<?> post(@RequestBody Department department)
            throws URISyntaxException {
        this.departments.save(department);

        return ResponseEntity.created(
                new URI("/departments/" + department.getId())).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> put(
            @PathVariable("id") int id,
            @RequestBody Department department) {
        if (!this.departments.exists(id)) {
            return ResponseEntity.notFound().build();
        }

        department.setId(id);
        this.departments.save(department);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id) {
        if (!this.departments.exists(id)) {
            return ResponseEntity.notFound().build();
        }

        this.departments.delete(id);

        return ResponseEntity.noContent().build();
    }
}

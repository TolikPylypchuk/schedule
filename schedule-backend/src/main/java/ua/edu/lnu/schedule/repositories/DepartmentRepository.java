package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Department;
import ua.edu.lnu.schedule.models.Group;

public interface DepartmentRepository extends CrudRepository<Department, Integer> {
    List<Department> findAllByFaculty_Id(Integer id);

}

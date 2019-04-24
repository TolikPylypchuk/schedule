package ua.edu.lnu.schedule.dataaccess.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Department;
import ua.edu.lnu.schedule.dataaccess.models.Group;

public interface DepartmentRepository extends CrudRepository<Department, Integer> {
	List<Department> findAllByFaculty_Id(Integer id);
	
}

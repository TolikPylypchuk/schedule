package ua.edu.lnu.schedule.dataaccess.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Group;
import ua.edu.lnu.schedule.dataaccess.models.Class;
import ua.edu.lnu.schedule.dataaccess.models.Department;

public interface GroupRepository extends CrudRepository<Group, Integer> {
	List<Group> findAllByYear(int year);
	List<Group> findAllByClassesContaining(Class c);
	List<Group> findAllByDepartment_Id(Integer id);
	List<Group> findAllByDepartment_IdIn(List<Integer> ids);
	List<Group> findAllByDepartment_IdAndYear(Integer id, int year);
	List<Group> findAllByDepartment_IdAndYearGreaterThanEqual(Integer id, int year);
	Group findByDepartmentsContaining(Department department);
}

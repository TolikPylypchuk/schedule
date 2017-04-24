package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Group;
import ua.edu.lnu.schedule.models.Plan;

public interface GroupRepository extends CrudRepository<Group, Integer> {
	List<Group> findAllByYear(int year);
	List<Group> findAllByClassesContaining(Class c);
	List<Group> findAllByFaculty_Id(Integer id);
	Group findByPlansContaining(Plan plan);
}

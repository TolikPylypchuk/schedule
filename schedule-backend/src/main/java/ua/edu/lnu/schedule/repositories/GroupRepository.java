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
	List<Group> findAllByFaculty_IdAndYear(Integer id, int year);
	List<Group> findAllByFaculty_IdAndYearGreaterThanEqual(Integer id, int year);
	Group findByPlansContaining(Plan plan);
}

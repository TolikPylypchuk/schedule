package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Classroom;
import ua.edu.lnu.schedule.models.Class;

public interface ClassroomRepository extends CrudRepository<Classroom, Integer> {
	List<Classroom> findAllByClassesContaining(Class c);
	List<Classroom> findAllByBuilding_Id(Integer id);
	List<Classroom> findAllByCapacityIsLessThanEqual(int capacity);
	List<Classroom> findAllByType(String type);
}

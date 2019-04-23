package ua.edu.lnu.schedule.dataaccess.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.ClassroomType;
import ua.edu.lnu.schedule.dataaccess.models.Classroom;
import ua.edu.lnu.schedule.dataaccess.models.Class;

public interface ClassroomTypeRepository extends CrudRepository<ClassroomType, Integer> {
	ClassroomType findByClassroomsContaining(Classroom classroom);
	ClassroomType findByClassesContaining(Class c);
}

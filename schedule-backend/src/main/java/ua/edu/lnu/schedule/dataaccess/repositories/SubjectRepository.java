package ua.edu.lnu.schedule.dataaccess.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Class;
import ua.edu.lnu.schedule.dataaccess.models.User;
import ua.edu.lnu.schedule.dataaccess.models.Plan;
import ua.edu.lnu.schedule.dataaccess.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
	Subject findByPlansContaining(Plan plan);
	Subject findByClassesContaining(Class c);
	List<Subject> findAllByLecturersContaining(User l);
}

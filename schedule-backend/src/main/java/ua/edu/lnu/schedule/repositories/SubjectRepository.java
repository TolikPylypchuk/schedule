package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Lecturer;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
	Subject findByPlansContaining(Plan plan);
	Subject findByClassesContaining(Class c);
	List<Subject> findAllByLecturersContaining(Lecturer l);
}

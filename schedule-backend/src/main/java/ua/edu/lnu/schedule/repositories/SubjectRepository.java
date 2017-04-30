package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
	Subject findByPlansContaining(Plan plan);
	Subject findByClassesContaining(Class c);
}

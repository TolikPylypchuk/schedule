package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.Lecturer;
import ua.edu.lnu.schedule.models.Subject;
import ua.edu.lnu.schedule.models.Wish;

public interface LecturerRepository extends CrudRepository<Lecturer, Integer> {
	List<Lecturer> findAllBySubjectsContaining(Subject subject);
	List<Lecturer> findAllByClassesContaining(Class c);
	Lecturer findByWishesContaining(Wish wish);
}

package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;
import ua.edu.lnu.schedule.models.User;
import ua.edu.lnu.schedule.models.Subject;
import ua.edu.lnu.schedule.models.Wish;

public interface UserRepository extends CrudRepository<User, Integer> {
	User findByUsername(String username);
	List<User> findAllByFaculty_Id(Integer id);
	List<User> findAllBySubjectsContaining(Subject subject);
	List<User> findAllByClassesContaining(Class c);
	User findByWishesContaining(Wish wish);
}

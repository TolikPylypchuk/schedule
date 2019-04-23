package ua.edu.lnu.schedule.dataaccess.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.dataaccess.models.Wish;

public interface WishRepository extends CrudRepository<Wish, Integer> {
	List<Wish> findAllByLecturer_Id(Integer id);
	List<Wish> findAllByLecturer_IdAndYearAndSemester(Integer id, int year, Semester semester);
}

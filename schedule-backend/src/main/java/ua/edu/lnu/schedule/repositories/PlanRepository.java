package ua.edu.lnu.schedule.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Plan;
import ua.edu.lnu.schedule.models.Semester;

public interface PlanRepository extends CrudRepository<Plan, Integer> {
	List<Plan> findAllByGroup_Id(Integer id);
	List<Plan> findAllByGroup_IdAndYearAndSemester(Integer id, int year, Semester semester);
	
	List<Plan> findAllBySubject_Id(Integer id);
	List<Plan> findAllBySubject_IdAndYearAndSemester(Integer id, int year, Semester semester);
}

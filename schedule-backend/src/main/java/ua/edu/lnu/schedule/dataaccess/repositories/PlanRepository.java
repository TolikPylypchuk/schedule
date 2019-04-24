package ua.edu.lnu.schedule.dataaccess.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Semester;
import ua.edu.lnu.schedule.dataaccess.models.Plan;

public interface PlanRepository extends CrudRepository<Plan, Integer> {
	List<Plan> findAllByDepartment_Id(Integer id);
	List<Plan> findAllByDepartment_IdAndCourseAndSemesterAndYear(Integer id, int course, Semester semester, int year);
	
	List<Plan> findAllBySubject_Id(Integer id);
	List<Plan> findAllBySubject_IdAndSemesterAndYear(Integer id, Semester semester, int year);
	List<Plan> findAllBySubject_IdAndCourseAndSemesterAndYear(Integer id, int course, Semester semester, int year);
}

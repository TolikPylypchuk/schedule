package ua.edu.lnu.schedule.repositories;

import java.time.DayOfWeek;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.*;
import ua.edu.lnu.schedule.models.Class;

public interface ClassRepository extends CrudRepository<Class, Integer> {
	List<Class> findAllByGroupsContaining(Group group);
	List<Class> findAllByGroupsContainingAndYearAndSemester(
		Group group, int year, Semester semester);
	
	List<Class> findAllByClassroomsContaining(Classroom classroom);
	List<Class> findAllByClassroomsContainingAndYearAndSemester(
		Classroom classroom, int year, Semester semester);
	
	List<Class> findAllByLecturersContaining(Lecturer lecturer);
	List<Class> findAllByLecturersContainingAndYearAndSemester(
		Lecturer lecturer, int year, Semester semester);
	
	List<Class> findAllByDayOfWeek(DayOfWeek day);
	List<Class> findAllByDayOfWeekAndYearAndSemester(
		DayOfWeek day, int year, Semester semester);
	
	List<Class> findAllByYearAndSemester(int year, Semester semester);
}
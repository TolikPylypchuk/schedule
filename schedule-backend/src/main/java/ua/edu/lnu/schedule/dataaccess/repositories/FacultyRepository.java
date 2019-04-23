package ua.edu.lnu.schedule.dataaccess.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Faculty;

public interface FacultyRepository extends CrudRepository<Faculty, Integer> {
}

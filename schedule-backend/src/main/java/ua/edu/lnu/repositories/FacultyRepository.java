package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Faculty;

public interface FacultyRepository extends CrudRepository<Faculty, Integer> {
}

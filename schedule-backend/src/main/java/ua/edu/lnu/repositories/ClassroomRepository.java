package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Classroom;

public interface ClassroomRepository extends CrudRepository<Classroom, Integer> {
}

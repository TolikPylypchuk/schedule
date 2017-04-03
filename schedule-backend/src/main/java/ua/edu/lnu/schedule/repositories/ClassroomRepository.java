package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Classroom;

public interface ClassroomRepository extends CrudRepository<Classroom, Integer> {
}

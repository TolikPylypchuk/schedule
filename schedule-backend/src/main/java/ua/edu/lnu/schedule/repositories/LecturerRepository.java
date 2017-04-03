package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Lecturer;

public interface LecturerRepository extends CrudRepository<Lecturer, Integer> {
}

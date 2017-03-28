package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Lecturer;

public interface LecturerRepository extends CrudRepository<Lecturer, Integer> {
}

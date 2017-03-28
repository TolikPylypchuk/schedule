package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
}

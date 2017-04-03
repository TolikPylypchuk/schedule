package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Subject;

public interface SubjectRepository extends CrudRepository<Subject, Integer> {
}

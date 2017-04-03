package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Class;

public interface ClassRepository extends CrudRepository<Class, Integer> {
}

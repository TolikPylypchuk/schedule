package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Group;

public interface GroupRepository extends CrudRepository<Group, Integer> {
}

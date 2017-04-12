package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Group;

public interface GroupRepository extends CrudRepository<Group, Integer> {
	Iterable<Group> findAllByFaculty_Id(Integer id);
}

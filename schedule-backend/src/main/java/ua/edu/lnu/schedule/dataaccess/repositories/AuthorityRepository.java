package ua.edu.lnu.schedule.dataaccess.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Authority;

public interface AuthorityRepository extends CrudRepository<Authority, Integer> {
	Authority findByName(Authority.Name name);
}

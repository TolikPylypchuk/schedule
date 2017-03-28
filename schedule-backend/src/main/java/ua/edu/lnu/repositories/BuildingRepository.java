package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Building;

public interface BuildingRepository extends CrudRepository<Building, Integer> {
}

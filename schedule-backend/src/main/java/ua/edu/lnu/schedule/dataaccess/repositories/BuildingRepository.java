package ua.edu.lnu.schedule.dataaccess.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.dataaccess.models.Building;

public interface BuildingRepository extends CrudRepository<Building, Integer> {
}

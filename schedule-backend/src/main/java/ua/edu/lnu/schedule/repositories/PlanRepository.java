package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Plan;

public interface PlanRepository extends CrudRepository<Plan, Integer> {
}

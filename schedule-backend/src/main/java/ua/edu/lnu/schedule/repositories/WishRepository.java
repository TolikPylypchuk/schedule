package ua.edu.lnu.schedule.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.schedule.models.Wish;

public interface WishRepository extends CrudRepository<Wish, Integer> {
}

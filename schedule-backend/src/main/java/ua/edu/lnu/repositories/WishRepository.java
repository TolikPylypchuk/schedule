package ua.edu.lnu.repositories;

import org.springframework.data.repository.CrudRepository;

import ua.edu.lnu.models.Wish;

public interface WishRepository extends CrudRepository<Wish, Integer> {
}

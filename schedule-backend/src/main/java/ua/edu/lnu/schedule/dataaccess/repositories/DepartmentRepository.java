package ua.edu.lnu.schedule.dataaccess.repositories;

import org.springframework.data.repository.CrudRepository;
import ua.edu.lnu.schedule.dataaccess.models.Faculty;

public interface DepartmentRepository extends CrudRepository<Faculty, Integer> {
}

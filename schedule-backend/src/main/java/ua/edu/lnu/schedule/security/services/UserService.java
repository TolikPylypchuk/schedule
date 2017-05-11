package ua.edu.lnu.schedule.security.services;

import ua.edu.lnu.schedule.models.User;

public interface UserService {
	void save(User user);
	boolean changePassword(User user, String oldPassword, String newPassword);
	void addUserToRole(User user, String roleName);
	void removeUserFromRole(User user, String roleName);
}

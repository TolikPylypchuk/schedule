package ua.edu.lnu.schedule.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ua.edu.lnu.schedule.dataaccess.models.User;
import ua.edu.lnu.schedule.dataaccess.repositories.UserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
	
	private UserRepository users;
	
	@Autowired
	public void setUsers(UserRepository users) {
		this.users = users;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username)
		throws UsernameNotFoundException {
		User user = this.users.findByUsername(username);
		
		if (user == null) {
			throw new UsernameNotFoundException(
				String.format("No user found with username '%s'.", username));
		} else {
			return JwtUserFactory.create(user);
		}
	}
}

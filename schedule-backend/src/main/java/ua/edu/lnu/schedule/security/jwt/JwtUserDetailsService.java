package ua.edu.lnu.schedule.security.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ua.edu.lnu.schedule.models.User;
import ua.edu.lnu.schedule.repositories.UserRepository;

@Service
public class JwtUserDetailsService implements UserDetailsService {
	
	private UserRepository userRepository;
	
	@Autowired
	public void setUserRepository(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username)
		throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		
		if (user == null) {
			throw new UsernameNotFoundException(
				String.format("No user found with username '%s'.", username));
		} else {
			return JwtUserFactory.create(user);
		}
	}
}

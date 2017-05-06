package ua.edu.lnu.schedule;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@SpringBootApplication
@EnableOAuth2Sso
public class ScheduleApplication extends WebSecurityConfigurerAdapter {
	
	public static void main(String[] args) {
		SpringApplication.run(ScheduleApplication.class, args);
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.antMatcher("/**")
			.authorizeRequests()
				.antMatchers("/", "/login**", "**.js", "**.css", "**.ico")
				.permitAll()
			.anyRequest()
				.authenticated();
	}
}

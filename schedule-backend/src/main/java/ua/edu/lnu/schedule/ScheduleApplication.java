package ua.edu.lnu.schedule;

import java.time.DayOfWeek;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import ua.edu.lnu.schedule.infrastructure.*;

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

	@Bean
	public Jackson2ObjectMapperBuilder jacksonBuilder() {
		return new Jackson2ObjectMapperBuilder()
			.serializerByType(DayOfWeek.class, new DayOfWeekSerializer())
			.deserializerByType(DayOfWeek.class, new DayOfWeekDeserializer());
	}
}

package ua.edu.lnu.schedule;

import java.time.DayOfWeek;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import ua.edu.lnu.schedule.infrastructure.*;

@SpringBootApplication
public class ScheduleApplication {

	public static void main(String[] args) {
		SpringApplication.run(ScheduleApplication.class, args);
	}
	
	@Bean
	public Jackson2ObjectMapperBuilder jacksonBuilder() {
		return new Jackson2ObjectMapperBuilder()
			.serializerByType(DayOfWeek.class, new DayOfWeekSerializer())
			.deserializerByType(DayOfWeek.class, new DayOfWeekDeserializer());
	}
}

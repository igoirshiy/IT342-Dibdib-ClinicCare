package edu.cit.dibdib.ClinicCare;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ClinicCareApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicCareApplication.class, args);
	}

	@Bean
	public CommandLineRunner setupDatabase(JdbcTemplate jdbcTemplate) {
		return args -> {
			System.out.println("Creating users table if it doesn't exist...");
			jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (" +
					"id BIGSERIAL PRIMARY KEY, " +
					"full_name VARCHAR(255) NOT NULL, " +
					"email VARCHAR(255) NOT NULL UNIQUE, " +
					"password VARCHAR(255) NOT NULL" +
					")");
			System.out.println("Database setup complete!");
		};
	}
}

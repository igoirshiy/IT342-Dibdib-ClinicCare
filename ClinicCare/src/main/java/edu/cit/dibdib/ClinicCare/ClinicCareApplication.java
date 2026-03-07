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
			System.out.println("Checking/Creating users table...");
			
			// Create table if not exists with essential columns
			jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS users (" +
					"id BIGSERIAL PRIMARY KEY, " +
					"full_name VARCHAR(255) NOT NULL, " +
					"email VARCHAR(255) NOT NULL UNIQUE, " +
					"password VARCHAR(255) NOT NULL" +
					")");

			// Add role column if it doesn't exist and update existing nulls
			try {
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(255)");
				jdbcTemplate.execute("UPDATE users SET role = 'PATIENT' WHERE role IS NULL");
				System.out.println("Role column check and update complete.");
			} catch (Exception e) {
				System.out.println("Info: Role column check/update skipped: " + e.getMessage());
			}

			System.out.println("Database setup complete!");
		};
	}
}

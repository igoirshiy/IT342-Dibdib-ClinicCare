package edu.cit.dibdib.ClinicCare;

import edu.cit.dibdib.ClinicCare.features.users.Staff;
import edu.cit.dibdib.ClinicCare.features.users.User;
import edu.cit.dibdib.ClinicCare.features.users.StaffRepository;
import edu.cit.dibdib.ClinicCare.features.users.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

			// Ensure all columns exist in users
			try {
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(255)");
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER");
				jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(255)");
				jdbcTemplate.execute("UPDATE users SET role = 'PATIENT' WHERE role IS NULL");
				System.out.println("Users table columns verified.");
			} catch (Exception e) {
				System.out.println("Info: Users column update skipped: " + e.getMessage());
			}

			// Create staff table if not exists
			try {
				System.out.println("Checking/Creating staff table...");
				jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS staff (" +
						"id BIGSERIAL PRIMARY KEY, " +
						"full_name VARCHAR(255) NOT NULL, " +
						"email VARCHAR(255) NOT NULL UNIQUE, " +
						"password VARCHAR(255) NOT NULL, " +
						"role VARCHAR(255) DEFAULT 'STAFF'" +
						")");
				
				// Ensure all columns exist in staff
				jdbcTemplate.execute("ALTER TABLE staff ADD COLUMN IF NOT EXISTS age INTEGER");
				jdbcTemplate.execute("ALTER TABLE staff ADD COLUMN IF NOT EXISTS gender VARCHAR(255)");
				System.out.println("Staff table ready.");
			} catch (Exception e) {
				System.out.println("Error creating/updating staff table: " + e.getMessage());
			}

			// Create appointments table if not exists
			try {
				System.out.println("Ensuring appointments table exists for schema sync...");
				// Removed DROP TABLE to ensure data persistence
				
				jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS appointments (" +
						"id BIGSERIAL PRIMARY KEY, " +
						"patient_email VARCHAR(255) NOT NULL, " +
						"patient_name VARCHAR(255) NOT NULL, " +
						"doctor_name VARCHAR(255) NOT NULL, " +
						"consultation_type VARCHAR(255) NOT NULL, " +
						"appointment_date DATE NOT NULL, " +
						"time_slot VARCHAR(255) NOT NULL, " +
						"reason TEXT, " +
						"status VARCHAR(255) NOT NULL DEFAULT 'Waiting', " +
						"queue_number VARCHAR(255)" +
						")");
				System.out.println("Appointments table recreated and ready.");
			} catch (Exception e) {
				System.out.println("Error syncing appointments table: " + e.getMessage());
			}

			// Create slots table if not exists
			try {
				System.out.println("Checking/Creating slots table...");
				jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS slots (" +
						"id BIGSERIAL PRIMARY KEY, " +
						"doctor VARCHAR(255) NOT NULL, " +
						"date VARCHAR(255) NOT NULL, " +
						"start_time VARCHAR(255) NOT NULL, " +
						"end_time VARCHAR(255) NOT NULL, " +
						"capacity INTEGER NOT NULL, " +
						"booked INTEGER DEFAULT 0, " +
						"disabled BOOLEAN DEFAULT FALSE" +
						")");
				System.out.println("Slots table ready.");
			} catch (Exception e) {
				System.out.println("Error creating slots table: " + e.getMessage());
			}

			// Create doctors table if not exists
			try {
				System.out.println("Checking/Creating doctors table...");
				jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS doctors (" +
						"id BIGSERIAL PRIMARY KEY, " +
						"doctor_name VARCHAR(255) NOT NULL UNIQUE, " +
						"queue_letter VARCHAR(2) NOT NULL" +
						")");
				System.out.println("Doctors table ready.");
			} catch (Exception e) {
				System.out.println("Error creating doctors table: " + e.getMessage());
			}

			System.out.println("Database setup complete!");

			// Seed default admin if no staff exists
			try {
				Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM staff", Long.class);
				if (count == 0) {
					System.out.println("Seeding default admin...");
					jdbcTemplate.execute("INSERT INTO staff (full_name, email, password, role) " +
							"VALUES ('Administrator', 'admin@cliniccare.com', 'admin123', 'STAFF')");
					System.out.println("Default admin created: admin@cliniccare.com / admin123");
				}
			} catch (Exception e) {
				System.out.println("Error seeding admin: " + e.getMessage());
			}
		};
	}
}

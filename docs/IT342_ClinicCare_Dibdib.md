# IT342 ClinicCare - Dibdib Project Documentation

## Project Overview
ClinicCare is a medical clinic management system designed to streamline patient registration, authentication, and clinic operations. The project follows a modern full-stack architecture with a React frontend, a Spring Boot backend, and a Supabase PostgreSQL database.

## System Architecture

### Frontend (Web)
- **Framework**: React.js
- **Styling**: Vanilla CSS (Glassmorphism design)
- **Features**:
  - User Registration with form validation.
  - User Login with state-based routing.
  - Responsive design for mobile and desktop.

### Backend (ClinicCare)
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database Interaction**: Spring Data JPA / Hibernate
- **Security**: CORS enabled for local frontend communication.

### Database (Supabase)
- **Database**: PostgreSQL
- **Connection**: Managed via JDBC with connection pooling (HikariCP).
- **Schema**:
  - `users` table: Stores `id`, `full_name`, `email` (unique), and `password`.

## Implementation Details

### Registration Flow
The frontend registration component (`Register.js`) collects user information, validates it, and sends a POST request to the backend's `/api/auth/register` endpoint. The backend then persists the user data into the Supabase database.

### Login Flow
The login component (`Login.js`) allows users to authenticate. The routing is currently handled via React state for seamless transitions between the login and registration views.

## Configuration
- **Backend Configuration**: `application.properties` contains the Supabase JDBC URL, credentials, and JPA settings.
- **Frontend Configuration**: The `App.js` file manages the core layout and component routing.

## Future Enhancements
- Implementation of JWT-based authentication.
- Patient and Doctor management systems.
- Appointment booking and history.
- Mobile application integration.

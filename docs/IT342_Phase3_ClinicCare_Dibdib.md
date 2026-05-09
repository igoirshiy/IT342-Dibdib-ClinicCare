# IT342 Phase 3: Web Main Feature & Refactoring
**Project Name:** ClinicCare  
**Student Name:** Wayne Kenji Dibdib  

---

## 3. Screenshots

### Screenshot 1: Main Feature Page (Appointment Booking)
![Main Feature Page - Appointment Booking](placeholder_main_feature.png)  
*Description: The main dashboard for patients showing the appointment booking interface where they can select doctors and slots.*

### Screenshot 2: Adding or Using the Main Feature
![Using the Main Feature - Form Submission](placeholder_form_submission.png)  
*Description: Filling out the appointment booking form with patient details (Name, Age, Gender, Address) and selecting a doctor.*

### Screenshot 3: Successful Output/Result
![Successful Booking Result](placeholder_success.png)  
*Description: The success message shown after booking, displaying the assigned Queue Number (e.g., A1) and the WebSocket real-time update.*

### Screenshot 4: Database Record
![Database Record - Appointments Table](placeholder_database.png)  
*Description: A view of the PostgreSQL (Supabase) 'appointments' table showing the newly created record with the correct patient and doctor association.*

---

## 4. Short Summary

### Description of the Main Feature
The **Appointment Booking and Intelligent Queue Management System** is the core feature of Phase 3. It allows patients to schedule medical consultations by selecting specific doctors and time slots. The system doesn't just store appointments; it dynamically generates **Queue Numbers** based on the doctor's specific prefix (e.g., Doctor A assigns numbers like A1, A2; Doctor B assigns B1, B2). It also handles real-time capacity management for each slot.

### Inputs and Validations Used
- **Inputs:**
  - **Patient Details:** Full Name, Age, Address, Gender.
  - **Appointment Details:** Selected Doctor ID, Appointment Date, Time Slot (Morning/Afternoon).
- **Validations:**
  - **Slot Capacity Check:** The system verifies if the selected slot has remaining capacity before confirming the booking.
  - **Authentication Validation:** Ensures only registered and logged-in patients can create bookings.
  - **Field Validation:** Ensures Age is a positive number and all required fields are populated.
  - **Concurrency Check:** Prevents overbooking during high-traffic periods.

### How the Feature Works
The feature is built using a **Modular Design Pattern Architecture**:
1.  **User Interface:** The patient interacts with a React-based "Slot Manager" component.
2.  **Request Handling:** The `AppointmentController` receives the request and delegates all business logic to the `BookingFacade`.
3.  **Core Logic (Facade Pattern):** The `BookingFacade` coordinates the process:
    - It checks the `Slot` availability.
    - It uses the `QueueStrategy` to determine the next number.
    - It saves the `Appointment` entity to the database.
    - It decrements the available `Slot` capacity.
4.  **Queue Generation (Strategy Pattern):** The `DoctorPrefixQueueStrategy` calculates the alphanumeric queue code.
5.  **Notification (Adapter Pattern):** Once successful, the `WebSocketNotificationAdapter` broadcasts a real-time update to all connected clients (staff and patients) to update the live queue dashboard.

### API Endpoints Used
- `POST /api/appointments/book`: Submits a new appointment request.
- `GET /api/appointments/slots`: Retrieves all available slots for a specific date and doctor.
- `GET /api/appointments/doctors`: Fetches the list of active doctors and their queue prefixes.
- `GET /api/appointments/all`: Allows staff to view all pending appointments.

### Database Tables Involved
- **`users`**: Stores patient profile information.
- **`doctors`**: Stores doctor details and their assigned queue letter prefixes.
- **`appointments`**: Stores the booking records, including the generated queue numbers.
- **`slots`**: Manages the capacity and timing for appointments (e.g., 20 patients per morning slot).

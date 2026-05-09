# Software Test Plan

## 1. Introduction
This Software Test Plan outlines the testing strategy, test cases, and coverage for the **ClinicCare** application following its refactoring into a Vertical Slice Architecture.

## 2. Functional Requirements Coverage
The test plan covers the following modules/features:
1. **Authentication (auth):** User and Staff Registration, Login.
2. **Dashboard (dashboard):** Patient and Staff Dashboard data rendering.
3. **Appointments (appointments):** Booking appointments, viewing appointment queues, status updates, capacity limits.

## 3. Test Cases & Test Scripts

### TC-01: User Registration
- **Precondition:** User is on the `/register` page.
- **Steps:**
  1. Enter valid Full Name, Email, Password, Age, Gender, and select 'Patient'.
  2. Click 'Register'.
- **Expected Result:** Registration succeeds, and user is redirected to Login.

### TC-02: User Login
- **Precondition:** User has a registered account.
- **Steps:**
  1. Enter valid Email and Password.
  2. Click 'Login'.
- **Expected Result:** Login succeeds, and user is redirected to the Dashboard.

### TC-03: Book Appointment
- **Precondition:** Patient is logged in and on the Dashboard.
- **Steps:**
  1. Open Booking Modal.
  2. Select Doctor, Date, and Time Slot.
  3. Click 'Book'.
- **Expected Result:** Appointment is added to the list, Queue Number is assigned, and slot capacity is decremented.

### TC-04: View Queue and Appointments
- **Precondition:** User is logged in.
- **Steps:**
  1. Navigate to 'My Appointments' or 'Queue View'.
- **Expected Result:** Correct list of appointments and respective statuses are shown.

### TC-05: Staff Update Appointment Status
- **Precondition:** Staff is logged in.
- **Steps:**
  1. Navigate to Staff Dashboard.
  2. Select an appointment and change status to 'Completed'.
- **Expected Result:** Status updates successfully and reflects on the Patient dashboard via WebSocket notifications.

## 4. Automated Test Strategy
- **Backend (Java/Spring Boot):** Unit testing via JUnit and Spring Boot Test for application context loading and basic repository checks (`mvnw test`).
- **Frontend (React):** Component rendering checks using Jest (`npm test`).

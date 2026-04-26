# Refactoring Report: ClinicCare System

## 1. Factory Pattern (Creational)
*   **Where it was applied:** `UserFactory.java` and `AuthController.java` (Registration)
*   **Before Implementation:**
    *   **Original Implementation:** `AuthController` manually retrieved the role from the request and used if/else logic to instantiate either a `User` or `Staff` object and save it to different repositories.
    *   **Problems:** This tightly coupled the Authentication logic with the creation logic of different User Entities. If we added an `Admin` or `Pharmacist` role, the controller logic would become even more bloated and complex.
*   **After Implementation:**
    *   **Applied Pattern:** We created a `BaseUser` interface and a `UserFactory`. 
    *   **Justification:** The `UserFactory` now encapsulates the decision of *which* object to create (Patient vs Staff) based on a simple string input.
    *   **Improvement:** The `AuthController` is now much cleaner and strictly focused on HTTP routing, completely decoupled from entity instantiation logic. `UserFactory` makes the project scalable for endless future roles.

## 2. Facade Pattern (Structural)
*   **Where it was applied:** `BookingFacade.java` and `AppointmentController.java`
*   **Before Implementation:**
    *   **Original Implementation:** The `/book` endpoint in `AppointmentController` contained over 100 lines of procedural code. It handled Doctor prefix assignment, queue calculations, appointment saving, slot capacity updates, and pushing WebSocket notifications.
    *   **Problems:** Horrible separation of concerns. The Controller was very hard to read, maintain, or test.
*   **After Implementation:**
    *   **Applied Pattern:** We extracted all business logic into a single service layer component called `BookingFacade`.
    *   **Justification:** A Facade provides a simplified interface to a complex body of code.
    *   **Improvement:** The `AppointmentController` now simply injects the Facade and calls `bookingFacade.book(appointment)` in just 3 lines of code.

## 3. Strategy Pattern (Behavioral)
*   **Where it was applied:** `QueueStrategy.java`, `DoctorPrefixQueueStrategy.java`, and `BookingFacade.java`
*   **Before Implementation:**
    *   **Original Implementation:** The queue logic (generating `A1`, `B2`, etc., based on a doctor's assigned letter) was hardcoded directly inside the booking method.
    *   **Problems:** If the clinic decided to change how queues work (e.g., using simple numbers `1, 2, 3` or by department instead of the doctor), we would have to modify and potentially break the main booking functionality.
*   **After Implementation:**
    *   **Applied Pattern:** We created a `QueueStrategy` interface and extracted the prefix logic into `DoctorPrefixQueueStrategy`.
    *   **Justification:** The Strategy pattern encapsulates specific algorithms and makes them interchangeable.
    *   **Improvement:** The `BookingFacade` no longer cares *how* the queue number is made, it just calls `queueStrategy.generateQueueNumber()`. We can easily add a `SequentialQueueStrategy` later without touching existing code.

## 4. Adapter Pattern (Structural)
*   **Where it was applied:** `NotificationAdapter.java` and `WebSocketNotificationAdapter.java`
*   **Before Implementation:**
    *   **Original Implementation:** The `BookingFacade` and `AppointmentController` were directly calling `SimpMessagingTemplate` to send WebSocket broadcasts.
    *   **Problems:** The system was tightly coupled to Spring's WebSocket implementation.
*   **After Implementation:**
    *   **Applied Pattern:** We created a standardized `NotificationAdapter` interface and an implementation specifically for WebSockets.
    *   **Justification:** It acts as a bridge between the application's notification requests and the actual delivery service.
    *   **Improvement:** If the clinic wants to send SMS or Email notifications instead (or alongside WebSockets), we just create an `SmsNotificationAdapter` or `EmailNotificationAdapter` that implements the same standard interface.

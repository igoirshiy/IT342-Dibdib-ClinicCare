export const initialAppointments = [
    { id: "1", patientName: "Sarah Johnson", consultationType: "General Checkup", dateTime: "2026-03-07 07:30", queueNumber: "Q1", status: "Waiting" },
    { id: "2", patientName: "Michael Chen", consultationType: "Follow-up", dateTime: "2026-03-07 08:00", queueNumber: "Q2", status: "Serving" },
    { id: "3", patientName: "Emily Davis", consultationType: "Dental Cleaning", dateTime: "2026-03-07 08:30", queueNumber: "Q3", status: "Waiting" },
    { id: "4", patientName: "James Wilson", consultationType: "Eye Exam", dateTime: "2026-03-07 09:00", queueNumber: "Q4", status: "Completed" },
    { id: "5", patientName: "Maria Garcia", consultationType: "General Checkup", dateTime: "2026-03-07 09:30", queueNumber: "Q5", status: "Cancelled" },
    { id: "6", patientName: "Robert Brown", consultationType: "Blood Test", dateTime: "2026-03-07 10:00", queueNumber: "Q6", status: "Waiting" },
];

export const initialDoctorSlots = [
    { id: "d1", doctorName: "Dr. Amara Patel", specialty: "General Medicine", startTime: "07:30", endTime: "10:30", totalSlots: 12, bookedSlots: 8, disabled: false },
    { id: "d2", doctorName: "Dr. James Lee", specialty: "Dentistry", startTime: "08:00", endTime: "12:00", totalSlots: 16, bookedSlots: 10, disabled: false },
    { id: "d3", doctorName: "Dr. Fatima Al-Rashid", specialty: "Ophthalmology", startTime: "09:00", endTime: "13:00", totalSlots: 8, bookedSlots: 5, disabled: false },
    { id: "d4", doctorName: "Dr. Carlos Rivera", specialty: "Pediatrics", startTime: "07:30", endTime: "11:30", totalSlots: 10, bookedSlots: 10, disabled: true },
];

export const initialNotifications = [
    { id: "n1", type: "cancellation", message: "Maria Garcia cancelled her General Checkup appointment.", time: "5 min ago" },
    { id: "n2", type: "overbooked", message: "Dr. Carlos Rivera's slots are fully booked for today.", time: "12 min ago" },
    { id: "n3", type: "schedule_update", message: "Dr. James Lee extended hours until 12:30 PM.", time: "30 min ago" },
    { id: "n4", type: "cancellation", message: "John Peters cancelled his Follow-up appointment.", time: "1 hr ago" },
];

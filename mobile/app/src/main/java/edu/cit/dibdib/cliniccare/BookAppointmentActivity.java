package edu.cit.dibdib.cliniccare;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import java.util.ArrayList;
import java.util.List;

import edu.cit.dibdib.cliniccare.models.Appointment;
import edu.cit.dibdib.cliniccare.models.Slot;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookAppointmentActivity extends AppCompatActivity {

    private Spinner spinnerSlots;
    private EditText etReason;
    private Button btnSubmitBooking;
    
    private List<Slot> availableSlots = new ArrayList<>();
    private String userEmail;
    private String userName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_appointment);

        // Setup Toolbar with Back Button
        Toolbar toolbar = findViewById(R.id.toolbarBook);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
        // Handle Back button click on Toolbar
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        spinnerSlots = findViewById(R.id.spinnerSlots);
        etReason = findViewById(R.id.etReason);
        btnSubmitBooking = findViewById(R.id.btnSubmitBooking);

        userEmail = getIntent().getStringExtra("USER_EMAIL");
        userName = getIntent().getStringExtra("USER_NAME");

        fetchAvailableSlots();

        btnSubmitBooking.setOnClickListener(v -> submitBooking());
    }

    private void fetchAvailableSlots() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.getSlots().enqueue(new Callback<List<Slot>>() {
            @Override
            public void onResponse(Call<List<Slot>> call, Response<List<Slot>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    availableSlots.clear();
                    // Filter out disabled or full slots
                    for (Slot s : response.body()) {
                        if (!s.isDisabled() && s.getBooked() < s.getCapacity()) {
                            availableSlots.add(s);
                        }
                    }
                    
                    ArrayAdapter<Slot> adapter = new ArrayAdapter<>(
                            BookAppointmentActivity.this,
                            android.R.layout.simple_spinner_dropdown_item,
                            availableSlots
                    );
                    spinnerSlots.setAdapter(adapter);
                } else {
                    Toast.makeText(BookAppointmentActivity.this, "Failed to load slots", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Slot>> call, Throwable t) {
                Toast.makeText(BookAppointmentActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void submitBooking() {
        if (spinnerSlots.getSelectedItem() == null) {
            Toast.makeText(this, "Please wait for slots to load.", Toast.LENGTH_SHORT).show();
            return;
        }

        Slot selectedSlot = (Slot) spinnerSlots.getSelectedItem();
        String reason = etReason.getText().toString().trim();

        if (reason.isEmpty()) {
            Toast.makeText(this, "Please enter a reason for your visit.", Toast.LENGTH_SHORT).show();
            return;
        }

        btnSubmitBooking.setEnabled(false);
        btnSubmitBooking.setText("Submitting...");

        Appointment newAppointment = new Appointment();
        newAppointment.setPatientEmail(userEmail);
        newAppointment.setPatientName(userName);
        newAppointment.setDoctorName(selectedSlot.getDoctor());
        newAppointment.setAppointmentDate(selectedSlot.getDate());
        newAppointment.setTimeSlot(selectedSlot.getStartTime() + " - " + selectedSlot.getEndTime());
        newAppointment.setConsultationType("General Checkup"); // Defaulting for now
        newAppointment.setReason(reason);
        newAppointment.setStatus("Waiting");

        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.bookAppointment(newAppointment).enqueue(new Callback<Appointment>() {
            @Override
            public void onResponse(Call<Appointment> call, Response<Appointment> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(BookAppointmentActivity.this, "Booking Successful!", Toast.LENGTH_LONG).show();
                    // Go back to dashboard to see the updated list
                    Intent intent = new Intent(BookAppointmentActivity.this, DashboardActivity.class);
                    intent.putExtra("USER_EMAIL", userEmail);
                    intent.putExtra("USER_NAME", userName);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                } else {
                    btnSubmitBooking.setEnabled(true);
                    btnSubmitBooking.setText("CONFIRM BOOKING");
                    Toast.makeText(BookAppointmentActivity.this, "Booking Failed.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Appointment> call, Throwable t) {
                btnSubmitBooking.setEnabled(true);
                btnSubmitBooking.setText("CONFIRM BOOKING");
                Toast.makeText(BookAppointmentActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}

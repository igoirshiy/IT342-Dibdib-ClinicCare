package edu.cit.dibdib.cliniccare;

import android.content.Intent;
import android.os.Bundle;
import android.os.Parcel;
import android.os.Parcelable;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TimeZone;

import com.google.android.material.datepicker.CalendarConstraints;
import com.google.android.material.datepicker.MaterialDatePicker;

import edu.cit.dibdib.cliniccare.models.Appointment;
import edu.cit.dibdib.cliniccare.models.Slot;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookAppointmentActivity extends AppCompatActivity {

    private Spinner spinnerType, spinnerDoctors;
    private TextView tvDateSelect, tvNoSlots;
    private RecyclerView rvTimeSlots;
    private EditText etReason;
    private Button btnSubmitBooking;

    private List<Slot> allSlots = new ArrayList<>();
    private List<Slot> currentAvailableSlots = new ArrayList<>();
    private TimeSlotAdapter timeSlotAdapter;
    private Slot selectedSlot = null;
    
    private String userEmail;
    private String userName;
    private String selectedDate = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_appointment);

        Toolbar toolbar = findViewById(R.id.toolbarBook);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
        toolbar.setNavigationOnClickListener(v -> onBackPressed());

        spinnerType = findViewById(R.id.spinnerType);
        spinnerDoctors = findViewById(R.id.spinnerDoctors);
        tvDateSelect = findViewById(R.id.tvDateSelect);
        tvNoSlots = findViewById(R.id.tvNoSlots);
        rvTimeSlots = findViewById(R.id.rvTimeSlots);
        etReason = findViewById(R.id.etReason);
        btnSubmitBooking = findViewById(R.id.btnSubmitBooking);

        userEmail = getIntent().getStringExtra("USER_EMAIL");
        userName = getIntent().getStringExtra("USER_NAME");

        setupTypeSpinner();
        setupRecyclerView();

        tvDateSelect.setOnClickListener(v -> showDatePicker());
        btnSubmitBooking.setOnClickListener(v -> submitBooking());

        spinnerDoctors.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                // Reset date and slots when doctor changes
                selectedDate = "";
                tvDateSelect.setText("Tap to Select Date");
                selectedSlot = null;
                updateTimeSlotsGrid();
            }
            @Override public void onNothingSelected(AdapterView<?> parent) {}
        });

        fetchAllSlots();
    }

    private void setupTypeSpinner() {
        String[] types = {"General Check-up", "Follow-up Consultation", "Medical Concern", "Prescription Refill"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, types);
        spinnerType.setAdapter(adapter);
    }

    private void setupRecyclerView() {
        rvTimeSlots.setLayoutManager(new GridLayoutManager(this, 2));
        timeSlotAdapter = new TimeSlotAdapter(new ArrayList<>(), slot -> {
            selectedSlot = slot;
        });
        rvTimeSlots.setAdapter(timeSlotAdapter);
    }

    private void fetchAllSlots() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.getSlots().enqueue(new Callback<List<Slot>>() {
            @Override
            public void onResponse(Call<List<Slot>> call, Response<List<Slot>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    allSlots = response.body();
                    populateDoctorSpinner();
                }
            }
            @Override public void onFailure(Call<List<Slot>> call, Throwable t) {
                Toast.makeText(BookAppointmentActivity.this, "Failed to load clinic data", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void populateDoctorSpinner() {
        Set<String> uniqueDoctors = new HashSet<>();
        for (Slot s : allSlots) {
            if (!s.isDisabled()) uniqueDoctors.add(s.getDoctor());
        }
        
        List<String> doctorsList = new ArrayList<>(uniqueDoctors);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, doctorsList);
        spinnerDoctors.setAdapter(adapter);
    }

    private Set<Long> getAvailableDateTimestamps(String doctor) {
        Set<Long> timestamps = new HashSet<>();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        sdf.setTimeZone(TimeZone.getTimeZone("UTC")); // MaterialDatePicker operates in UTC
        
        for (Slot s : allSlots) {
            if (!s.isDisabled() && s.getDoctor().equals(doctor)) {
                try {
                    long time = sdf.parse(s.getDate()).getTime();
                    timestamps.add(time);
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
        return timestamps;
    }

    private void showDatePicker() {
        if (spinnerDoctors.getSelectedItem() == null) {
            Toast.makeText(this, "Please select a doctor first", Toast.LENGTH_SHORT).show();
            return;
        }

        String doctor = spinnerDoctors.getSelectedItem().toString();
        Set<Long> availableDates = getAvailableDateTimestamps(doctor);

        if (availableDates.isEmpty()) {
            Toast.makeText(this, "This doctor has no available schedules.", Toast.LENGTH_SHORT).show();
            return;
        }

        CalendarConstraints.Builder constraintsBuilder = new CalendarConstraints.Builder();
        constraintsBuilder.setValidator(new AvailableDatesValidator(availableDates));

        MaterialDatePicker<Long> datePicker = MaterialDatePicker.Builder.datePicker()
                .setTitleText("Select Appointment Date")
                .setCalendarConstraints(constraintsBuilder.build())
                .build();

        datePicker.addOnPositiveButtonClickListener(selection -> {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            sdf.setTimeZone(TimeZone.getTimeZone("UTC"));
            selectedDate = sdf.format(new Date(selection));
            tvDateSelect.setText(selectedDate);
            updateTimeSlotsGrid();
        });

        datePicker.show(getSupportFragmentManager(), "DATE_PICKER");
    }

    private void updateTimeSlotsGrid() {
        if (selectedDate.isEmpty() || spinnerDoctors.getSelectedItem() == null) {
            rvTimeSlots.setVisibility(View.GONE);
            tvNoSlots.setVisibility(View.VISIBLE);
            return;
        }

        String doctor = spinnerDoctors.getSelectedItem().toString();
        currentAvailableSlots.clear();
        selectedSlot = null;

        for (Slot s : allSlots) {
            if (!s.isDisabled() && s.getDoctor().equals(doctor) && s.getDate().equals(selectedDate)) {
                currentAvailableSlots.add(s);
            }
        }

        if (currentAvailableSlots.isEmpty()) {
            rvTimeSlots.setVisibility(View.GONE);
            tvNoSlots.setText("No available slots for this date.");
            tvNoSlots.setVisibility(View.VISIBLE);
        } else {
            tvNoSlots.setVisibility(View.GONE);
            rvTimeSlots.setVisibility(View.VISIBLE);
            timeSlotAdapter.setSlots(currentAvailableSlots);
        }
    }

    private void submitBooking() {
        if (selectedSlot == null) {
            Toast.makeText(this, "Please select a Time Slot", Toast.LENGTH_SHORT).show();
            return;
        }

        String reason = etReason.getText().toString().trim();
        if (reason.isEmpty()) {
            Toast.makeText(this, "Please enter a reason for your visit.", Toast.LENGTH_SHORT).show();
            return;
        }

        btnSubmitBooking.setEnabled(false);
        btnSubmitBooking.setText("Submitting...");

        Appointment newAppt = new Appointment();
        newAppt.setPatientEmail(userEmail);
        newAppt.setPatientName(userName);
        newAppt.setDoctorName(selectedSlot.getDoctor());
        newAppt.setConsultationType(spinnerType.getSelectedItem().toString());
        newAppt.setAppointmentDate(selectedSlot.getDate());
        newAppt.setTimeSlot(selectedSlot.getStartTime() + " - " + selectedSlot.getEndTime());
        newAppt.setReason(reason);
        newAppt.setStatus("Waiting");
        newAppt.setSelectedSlotId(selectedSlot.getId());

        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.bookAppointment(newAppt).enqueue(new Callback<Appointment>() {
            @Override
            public void onResponse(Call<Appointment> call, Response<Appointment> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(BookAppointmentActivity.this, "Booking Successful!", Toast.LENGTH_LONG).show();
                    Intent intent = new Intent(BookAppointmentActivity.this, DashboardActivity.class);
                    intent.putExtra("USER_EMAIL", userEmail);
                    intent.putExtra("USER_NAME", userName);
                    intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    startActivity(intent);
                } else {
                    resetButton();
                    Toast.makeText(BookAppointmentActivity.this, "Booking Failed.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Appointment> call, Throwable t) {
                resetButton();
                Toast.makeText(BookAppointmentActivity.this, "Network error", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void resetButton() {
        btnSubmitBooking.setEnabled(true);
        btnSubmitBooking.setText("CONFIRM BOOKING");
    }

    public static class AvailableDatesValidator implements CalendarConstraints.DateValidator {
        private final HashSet<Long> availableDates;

        public AvailableDatesValidator(Set<Long> availableDates) {
            this.availableDates = new HashSet<>(availableDates);
        }

        protected AvailableDatesValidator(Parcel in) {
            int size = in.readInt();
            availableDates = new HashSet<>();
            for (int i = 0; i < size; i++) {
                availableDates.add(in.readLong());
            }
        }

        public static final Creator<AvailableDatesValidator> CREATOR = new Creator<AvailableDatesValidator>() {
            @Override
            public AvailableDatesValidator createFromParcel(Parcel in) {
                return new AvailableDatesValidator(in);
            }

            @Override
            public AvailableDatesValidator[] newArray(int size) {
                return new AvailableDatesValidator[size];
            }
        };

        @Override
        public boolean isValid(long date) {
            return availableDates.contains(date);
        }

        @Override
        public int describeContents() {
            return 0;
        }

        @Override
        public void writeToParcel(Parcel dest, int flags) {
            dest.writeInt(availableDates.size());
            for (Long d : availableDates) {
                dest.writeLong(d);
            }
        }
    }
}

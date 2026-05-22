package edu.cit.dibdib.cliniccare;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.material.button.MaterialButton;
import com.google.android.material.card.MaterialCardView;
import com.google.android.material.navigation.NavigationView;
import com.google.android.material.textfield.TextInputEditText;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import edu.cit.dibdib.cliniccare.models.Appointment;
import edu.cit.dibdib.cliniccare.models.Habit;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class DashboardActivity extends AppCompatActivity {

    private DrawerLayout drawerLayout;
    private String userEmail;
    private String userName;
    private Long userId;
    private Integer userAge;
    private String userGender;

    // Live Queue UI Elements
    private MaterialCardView cardLiveQueue;
    private MaterialCardView cardNoQueue;
    private Button btnBookPlaceholder;
    private TextView tvQueueNumberLive;
    private TextView tvStatusLive;
    private TextView tvDoctorLive;
    private TextView tvTimeSlotLive;
    private TextView tvMessageLive;

    // Daily Health Habits UI Elements
    private RecyclerView rvHabits;
    private HabitAdapter habitAdapter;
    private List<Habit> waynehabitList;
    private ProgressBar pbHealth;
    private TextView tvHealthProgress;
    private MaterialButton btnAddHabit;

    private static final String PREFS_NAME = "ClinicCareHealthPrefs";
    private static final String PREF_HABITS_JSON = "habits_json";
    private static final String PREF_LAST_HABIT_DATE = "last_habit_date";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        // Setup Toolbar & Drawer
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, 
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        TextView tvWelcome = findViewById(R.id.tvWelcome);

        // Bind Live Queue Card Elements
        cardLiveQueue = findViewById(R.id.cardLiveQueue);
        cardNoQueue = findViewById(R.id.cardNoQueue);
        tvQueueNumberLive = findViewById(R.id.tvQueueNumberLive);
        tvStatusLive = findViewById(R.id.tvStatusLive);
        tvDoctorLive = findViewById(R.id.tvDoctorLive);
        tvTimeSlotLive = findViewById(R.id.tvTimeSlotLive);
        tvMessageLive = findViewById(R.id.tvMessageLive);
        btnBookPlaceholder = findViewById(R.id.btnBookPlaceholder);

        // Bind Habit Tracker Elements
        rvHabits = findViewById(R.id.rvHabits);
        tvHealthProgress = findViewById(R.id.tvHealthProgress);
        pbHealth = findViewById(R.id.pbHealth);
        btnAddHabit = findViewById(R.id.btnAddHabit);

        rvHabits.setLayoutManager(new LinearLayoutManager(this));

        // Load Habits from SharedPreferences
        loadHabits();

        // Setup Adapter
        habitAdapter = new HabitAdapter(habitList, new HabitAdapter.OnHabitInteractionListener() {
            @Override
            public void onHabitChecked(Habit habit, boolean isChecked) {
                saveHabits();
                updateHealthProgress();
            }

            @Override
            public void onHabitEdit(Habit habit, int position) {
                showHabitDialog(habit, position);
            }
        });
        rvHabits.setAdapter(habitAdapter);
        updateHealthProgress();

        btnAddHabit.setOnClickListener(v -> showHabitDialog(null, -1));

        // Get the name and email passed from MainActivity
        userName = getIntent().getStringExtra("USER_NAME");
        userEmail = getIntent().getStringExtra("USER_EMAIL");
        userId = getIntent().getLongExtra("USER_ID", -1L);
        userAge = getIntent().getIntExtra("USER_AGE", -1);
        userGender = getIntent().getStringExtra("USER_GENDER");

        if (userName != null) {
            tvWelcome.setText("Welcome,\n" + userName + "!");
        }

        // Navigation Item Clicks
        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            
            if (id == R.id.nav_appointments) {
                Intent intent = new Intent(DashboardActivity.this, MyAppointmentsActivity.class);
                intent.putExtra("USER_EMAIL", userEmail);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
            } else if (id == R.id.nav_book) {
                openBookingActivity();
                drawerLayout.closeDrawer(GravityCompat.START);
            } else if (id == R.id.nav_profile) {
                Intent profileIntent = new Intent(DashboardActivity.this, ProfileActivity.class);
                profileIntent.putExtra("USER_ID", userId);
                profileIntent.putExtra("USER_EMAIL", userEmail);
                profileIntent.putExtra("USER_NAME", userName);
                profileIntent.putExtra("USER_AGE", userAge);
                profileIntent.putExtra("USER_GENDER", userGender);
                startActivity(profileIntent);
                drawerLayout.closeDrawer(GravityCompat.START);
            } else if (id == R.id.nav_logout) {
                // Handle Logout
                Intent intent = new Intent(DashboardActivity.this, MainActivity.class);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                startActivity(intent);
            }
            return true;
        });
    }

    private void openBookingActivity() {
        Intent intent = new Intent(DashboardActivity.this, BookAppointmentActivity.class);
        intent.putExtra("USER_EMAIL", userEmail);
        intent.putExtra("USER_NAME", userName);
        startActivity(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (userEmail != null) {
            fetchAppointments(userEmail);
        }
    }

    // Handle back button press when drawer is open
    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    private void loadHabits() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        
        // Reset logic
        String today = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(new Date());
        String lastDate = prefs.getString(PREF_LAST_HABIT_DATE, "");
        boolean isNewDay = !today.equals(lastDate);

        if (isNewDay) {
            prefs.edit().putString(PREF_LAST_HABIT_DATE, today).apply();
        }

        String json = prefs.getString(PREF_HABITS_JSON, null);
        Gson gson = new Gson();
        
        if (json != null && !json.isEmpty()) {
            Type type = new TypeToken<ArrayList<Habit>>(){}.getType();
            habitList = gson.fromJson(json, type);
            
            if (isNewDay && habitList != null) {
                for (Habit h : habitList) {
                    h.setChecked(false);
                }
                saveHabits(); // Resave with unchecked status
            }
        } else {
            // Seed defaults
            habitList = new ArrayList<>();
            habitList.add(new Habit("Drink Water", "Aim for 8 glasses (2L) today", false));
            habitList.add(new Habit("Daily Walk", "Try to take a 30-minute walk today", false));
            habitList.add(new Habit("Take Vitamins", "Keep your immune system strong", false));
            habitList.add(new Habit("Stretching Exercise", "Relax your muscles and improve flexibility", false));
            habitList.add(new Habit("Restful Sleep", "Get 7-8 hours of quality sleep", false));
            saveHabits();
        }
    }

    private void saveHabits() {
        SharedPreferences prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE);
        Gson gson = new Gson();
        String json = gson.toJson(habitList);
        prefs.edit().putString(PREF_HABITS_JSON, json).apply();
    }

    private void updateHealthProgress() {
        if (habitList == null || habitList.isEmpty()) {
            pbHealth.setMax(1);
            pbHealth.setProgress(0);
            tvHealthProgress.setText("Daily Progress: 0 of 0 completed");
            return;
        }

        int total = habitList.size();
        int completed = 0;
        for (Habit h : habitList) {
            if (h.isChecked()) completed++;
        }

        pbHealth.setMax(total);
        pbHealth.setProgress(completed);
        tvHealthProgress.setText("Daily Progress: " + completed + " of " + total + " completed");
    }

    private void showHabitDialog(Habit existingHabit, int position) {
        android.app.AlertDialog.Builder builder = new android.app.AlertDialog.Builder(this);
        View view = getLayoutInflater().inflate(R.layout.dialog_habit, null);
        builder.setView(view);

        android.app.AlertDialog dialog = builder.create();
        dialog.getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        TextView tvTitle = view.findViewById(R.id.tvDialogTitle);
        TextInputEditText etTitle = view.findViewById(R.id.etHabitTitle);
        TextInputEditText etDesc = view.findViewById(R.id.etHabitDesc);
        MaterialButton btnSave = view.findViewById(R.id.btnSaveHabit);
        MaterialButton btnCancel = view.findViewById(R.id.btnCancelHabit);
        MaterialButton btnDelete = view.findViewById(R.id.btnDeleteHabit);

        if (existingHabit != null) {
            tvTitle.setText("Edit Habit");
            etTitle.setText(existingHabit.getTitle());
            etDesc.setText(existingHabit.getDescription());
            btnDelete.setVisibility(View.VISIBLE);
        }

        btnCancel.setOnClickListener(v -> dialog.dismiss());

        btnDelete.setOnClickListener(v -> {
            new android.app.AlertDialog.Builder(this)
                .setTitle("Delete Habit")
                .setMessage("Are you sure you want to delete this habit?")
                .setPositiveButton("Delete", (d, w) -> {
                    habitList.remove(position);
                    saveHabits();
                    habitAdapter.notifyDataSetChanged();
                    updateHealthProgress();
                    dialog.dismiss();
                })
                .setNegativeButton("Cancel", null)
                .show();
        });

        btnSave.setOnClickListener(v -> {
            String title = etTitle.getText().toString().trim();
            String desc = etDesc.getText().toString().trim();

            if (title.isEmpty()) {
                etTitle.setError("Title is required");
                return;
            }

            if (existingHabit == null) {
                habitList.add(new Habit(title, desc, false));
            } else {
                existingHabit.setTitle(title);
                existingHabit.setDescription(desc);
            }

            saveHabits();
            habitAdapter.notifyDataSetChanged();
            updateHealthProgress();
            dialog.dismiss();
        });

        dialog.show();
    }

    private void fetchAppointments(String email) {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.getPatientAppointments(email).enqueue(new Callback<List<Appointment>>() {
            @Override
            public void onResponse(Call<List<Appointment>> call, Response<List<Appointment>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Appointment> list = response.body();

                    // Scan appointments to find the first active queue appointment (non-completed/cancelled/rejected)
                    Appointment activeQueue = null;
                    for (Appointment a : list) {
                        String status = a.getStatus();
                        if (status != null && 
                            !"Completed".equalsIgnoreCase(status) && 
                            !"Cancelled".equalsIgnoreCase(status) && 
                            !"Rejected".equalsIgnoreCase(status)) {
                            activeQueue = a;
                            break;
                        }
                    }

                    if (activeQueue != null && activeQueue.getQueueNumber() != null && !activeQueue.getQueueNumber().trim().isEmpty()) {
                        tvQueueNumberLive.setText(activeQueue.getQueueNumber().trim());
                        tvStatusLive.setText(activeQueue.getStatus());
                        tvDoctorLive.setText("Doc " + activeQueue.getDoctorName());
                        tvTimeSlotLive.setText(activeQueue.getTimeSlot());

                        String status = activeQueue.getStatus();
                        if ("Serving".equalsIgnoreCase(status)) {
                            // Style and customize for active/current consultation
                            cardLiveQueue.setCardBackgroundColor(android.graphics.Color.parseColor("#FFF3E0")); // Soft Orange
                            cardLiveQueue.setStrokeColor(android.graphics.Color.parseColor("#FFE0B2"));
                            tvQueueNumberLive.setTextColor(android.graphics.Color.parseColor("#E65100"));
                            tvStatusLive.setTextColor(android.graphics.Color.parseColor("#E65100"));
                            tvMessageLive.setText("It is your turn! Please proceed to the room.");
                            tvMessageLive.setTextColor(android.graphics.Color.parseColor("#E65100"));
                        } else {
                            // Style and customize for waiting/scheduled status
                            cardLiveQueue.setCardBackgroundColor(android.graphics.Color.parseColor("#FCE4EC")); // Soft Pink
                            cardLiveQueue.setStrokeColor(android.graphics.Color.parseColor("#F8BBD0"));
                            tvQueueNumberLive.setTextColor(android.graphics.Color.parseColor("#D81B60"));
                            tvStatusLive.setTextColor(android.graphics.Color.parseColor("#D81B60"));
                            tvMessageLive.setText("Queue updates in real-time. Please stay in the clinic.");
                            tvMessageLive.setTextColor(android.graphics.Color.parseColor("#757575"));
                        }

                        cardLiveQueue.setVisibility(View.VISIBLE);
                        cardNoQueue.setVisibility(View.GONE);
                    } else {
                        cardLiveQueue.setVisibility(View.GONE);
                        cardNoQueue.setVisibility(View.VISIBLE);
                    }
                } else {
                    Toast.makeText(DashboardActivity.this, "Failed to load appointments", Toast.LENGTH_SHORT).show();
                    cardLiveQueue.setVisibility(View.GONE);
                    cardNoQueue.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<List<Appointment>> call, Throwable t) {
                Toast.makeText(DashboardActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
                cardLiveQueue.setVisibility(View.GONE);
                cardNoQueue.setVisibility(View.VISIBLE);
            }
        });
    }
}

package edu.cit.dibdib.cliniccare;

import android.os.Bundle;
import android.view.MenuItem;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import edu.cit.dibdib.cliniccare.models.UserResponse;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileActivity extends AppCompatActivity {

    private Long userId;
    private String userEmail;
    private String userName;
    private Integer userAge;
    private String userGender;

    private EditText etFullName, etEmail, etAge, etPassword;
    private Spinner spinnerGender;
    private Button btnSaveProfile;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Setup Toolbar
        Toolbar toolbar = findViewById(R.id.toolbarProfile);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        // Bind Views
        etFullName = findViewById(R.id.etFullName);
        etEmail = findViewById(R.id.etEmail);
        etAge = findViewById(R.id.etAge);
        etPassword = findViewById(R.id.etPassword);
        spinnerGender = findViewById(R.id.spinnerGender);
        btnSaveProfile = findViewById(R.id.btnSaveProfile);

        // Setup Spinner
        String[] genders = {"Select", "Male", "Female", "Other"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, genders);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerGender.setAdapter(adapter);

        // Get Data from Intent
        userId = getIntent().getLongExtra("USER_ID", -1L);
        userEmail = getIntent().getStringExtra("USER_EMAIL");
        userName = getIntent().getStringExtra("USER_NAME");
        userAge = getIntent().getIntExtra("USER_AGE", -1);
        userGender = getIntent().getStringExtra("USER_GENDER");

        // Populate Fields
        if (userName != null) etFullName.setText(userName);
        if (userEmail != null) etEmail.setText(userEmail);
        if (userAge != null && userAge > 0) etAge.setText(String.valueOf(userAge));
        
        if (userGender != null) {
            for (int i = 0; i < genders.length; i++) {
                if (genders[i].equalsIgnoreCase(userGender)) {
                    spinnerGender.setSelection(i);
                    break;
                }
            }
        }

        btnSaveProfile.setOnClickListener(v -> saveProfile());
    }

    private void saveProfile() {
        if (userId == -1L) {
            Toast.makeText(this, "Error: User ID not found.", Toast.LENGTH_SHORT).show();
            return;
        }

        String fullName = etFullName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String ageStr = etAge.getText().toString().trim();
        String password = etPassword.getText().toString().trim();
        String gender = spinnerGender.getSelectedItem().toString();

        if (fullName.isEmpty() || email.isEmpty()) {
            Toast.makeText(this, "Name and Email are required.", Toast.LENGTH_SHORT).show();
            return;
        }

        UserResponse updateRequest = new UserResponse();
        updateRequest.setRole("PATIENT");
        updateRequest.setFullName(fullName);
        updateRequest.setEmail(email);
        
        if (!ageStr.isEmpty()) {
            updateRequest.setAge(Integer.parseInt(ageStr));
        }
        
        if (!gender.equals("Select")) {
            updateRequest.setGender(gender);
        }

        if (!password.isEmpty()) {
            updateRequest.setPassword(password);
        }

        btnSaveProfile.setText("SAVING...");
        btnSaveProfile.setEnabled(false);

        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.updateProfile(userId, updateRequest).enqueue(new Callback<UserResponse>() {
            @Override
            public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                btnSaveProfile.setText("SAVE PROFILE CHANGES");
                btnSaveProfile.setEnabled(true);
                
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(ProfileActivity.this, "Profile updated successfully!", Toast.LENGTH_SHORT).show();
                    // Clear password field after successful save
                    etPassword.setText("");
                } else {
                    Toast.makeText(ProfileActivity.this, "Failed to update profile.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<UserResponse> call, Throwable t) {
                btnSaveProfile.setText("SAVE PROFILE CHANGES");
                btnSaveProfile.setEnabled(true);
                Toast.makeText(ProfileActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}

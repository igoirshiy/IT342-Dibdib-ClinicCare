package edu.cit.dibdib.cliniccare.ui.auth;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import edu.cit.dibdib.cliniccare.R;
import edu.cit.dibdib.cliniccare.MainActivity;
import edu.cit.dibdib.cliniccare.models.RegisterRequest;
import edu.cit.dibdib.cliniccare.models.UserResponse;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private EditText etFullName;
    private EditText etEmail;
    private EditText etPassword;
    private EditText etConfirmPassword;
    private EditText etAge;
    private AutoCompleteTextView spinnerGender;
    private Button btnRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_register);
        
        // Handle window insets for edge-to-edge
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.register), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // 1. Bind the UI elements
        etFullName = findViewById(R.id.etFullName);
        etEmail = findViewById(R.id.etEmail);
        etPassword = findViewById(R.id.etPassword);
        etConfirmPassword = findViewById(R.id.etConfirmPassword);
        etAge = findViewById(R.id.etAge);
        spinnerGender = findViewById(R.id.spinnerGender);
        btnRegister = findViewById(R.id.btnRegister);

        // Setup gender dropdown
        ArrayAdapter<CharSequence> genderAdapter = ArrayAdapter.createFromResource(this,
                R.array.gender_options, android.R.layout.simple_list_item_1);
        spinnerGender.setAdapter(genderAdapter);

        // Setup switch back to Login
        TextView tvSwitchToLogin = findViewById(R.id.tvSwitchToLogin);
        tvSwitchToLogin.setOnClickListener(v -> finish());

        // 2. Add click listener to the register button
        btnRegister.setOnClickListener(v -> {
            String fullName = etFullName.getText().toString().trim();
            String email = etEmail.getText().toString().trim();
            String password = etPassword.getText().toString().trim();
            String confirmPassword = etConfirmPassword.getText().toString().trim();
            String age = etAge.getText().toString().trim();
            String gender = spinnerGender.getText().toString().trim();

            if (fullName.isEmpty() || email.isEmpty() || password.isEmpty() || 
                confirmPassword.isEmpty() || age.isEmpty() || gender.isEmpty()) {
                Toast.makeText(RegisterActivity.this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            } else if (!password.equals(confirmPassword)) {
                Toast.makeText(RegisterActivity.this, "Passwords do not match", Toast.LENGTH_SHORT).show();
            } else if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                Toast.makeText(RegisterActivity.this, "Please enter a valid email", Toast.LENGTH_SHORT).show();
            } else if (password.length() < 6) {
                Toast.makeText(RegisterActivity.this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show();
            } else {
                // Show loading message
                btnRegister.setText("Registering...");
                btnRegister.setEnabled(false);

                // Parse age to Integer
                Integer ageVal = null;
                try {
                    ageVal = Integer.parseInt(age);
                } catch (NumberFormatException e) {
                    // Should not happen as inputType is number
                }

                // Make the network request
                ApiService apiService = ApiClient.getClient().create(ApiService.class);
                
                RegisterRequest request = new RegisterRequest(fullName, email, password, 
                        "PATIENT", ageVal, gender);

                apiService.registerUser(request).enqueue(new Callback<UserResponse>() {
                    @Override
                    public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                        btnRegister.setText("REGISTER");
                        btnRegister.setEnabled(true);

                        if (response.isSuccessful() && response.body() != null) {
                            Toast.makeText(RegisterActivity.this, "Registration Successful!", Toast.LENGTH_SHORT).show();
                            
                            // Navigate to Login screen
                            Intent intent = new Intent(RegisterActivity.this, MainActivity.class);
                            startActivity(intent);
                            finish(); // Close the Register screen
                        } else {
                            String errMsg = "Unknown error";
                            try {
                                if (response.errorBody() != null) {
                                    errMsg = response.errorBody().string();
                                } else if (response.message() != null) {
                                    errMsg = response.message();
                                }
                            } catch (Exception e) {
                                errMsg = e.getMessage();
                            }
                            Toast.makeText(RegisterActivity.this, "Registration Failed: " + errMsg, Toast.LENGTH_LONG).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<UserResponse> call, Throwable t) {
                        btnRegister.setText("REGISTER");
                        btnRegister.setEnabled(true);
                        Toast.makeText(RegisterActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
            }
        });
    }
}

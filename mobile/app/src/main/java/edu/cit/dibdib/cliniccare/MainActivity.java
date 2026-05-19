package edu.cit.dibdib.cliniccare;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {

    private EditText etUsername;
    private EditText etPassword;
    private Button btnLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
        
        // Handle window insets for edge-to-edge
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // 1. Bind the UI elements
        etUsername = findViewById(R.id.etUsername);
        etPassword = findViewById(R.id.etPassword);
        btnLogin = findViewById(R.id.btnLogin);

        // 2. Add click listener to the login button
        btnLogin.setOnClickListener(v -> {
            String username = etUsername.getText().toString().trim();
            String password = etPassword.getText().toString().trim();

            if (username.isEmpty() || password.isEmpty()) {
                Toast.makeText(MainActivity.this, "Please enter both username and password", Toast.LENGTH_SHORT).show();
            } else {
                // Show loading message
                btnLogin.setText("Logging in...");
                btnLogin.setEnabled(false);

                // Make the network request
                edu.cit.dibdib.cliniccare.network.ApiService apiService = 
                        edu.cit.dibdib.cliniccare.network.ApiClient.getClient().create(edu.cit.dibdib.cliniccare.network.ApiService.class);
                
                edu.cit.dibdib.cliniccare.models.LoginRequest request = 
                        new edu.cit.dibdib.cliniccare.models.LoginRequest(username, password);

                apiService.loginUser(request).enqueue(new retrofit2.Callback<edu.cit.dibdib.cliniccare.models.UserResponse>() {
                    @Override
                    public void onResponse(retrofit2.Call<edu.cit.dibdib.cliniccare.models.UserResponse> call, 
                                           retrofit2.Response<edu.cit.dibdib.cliniccare.models.UserResponse> response) {
                        btnLogin.setText("LOGIN");
                        btnLogin.setEnabled(true);

                        if (response.isSuccessful() && response.body() != null) {
                            String role = response.body().getRole() != null ? response.body().getRole() : "User";
                            String fullName = response.body().getFullName();
                            String email = response.body().getEmail(); // <-- Also grab the email
                            
                            // Navigate to DashboardActivity!
                            android.content.Intent intent = new android.content.Intent(MainActivity.this, DashboardActivity.class);
                            intent.putExtra("USER_NAME", fullName);
                            intent.putExtra("USER_EMAIL", email); // <-- Pass the email
                            startActivity(intent);
                            finish(); // Close the Login screen so user can't press "Back" to return to it
                        } else {
                            Toast.makeText(MainActivity.this, "Login Failed: Invalid credentials", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(retrofit2.Call<edu.cit.dibdib.cliniccare.models.UserResponse> call, Throwable t) {
                        btnLogin.setText("LOGIN");
                        btnLogin.setEnabled(true);
                        Toast.makeText(MainActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
            }
        });
    }
}
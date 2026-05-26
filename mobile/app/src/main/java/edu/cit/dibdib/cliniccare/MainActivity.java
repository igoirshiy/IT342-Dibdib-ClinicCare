package edu.cit.dibdib.cliniccare;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import edu.cit.dibdib.cliniccare.models.LoginRequest;
import edu.cit.dibdib.cliniccare.models.UserResponse;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import edu.cit.dibdib.cliniccare.ui.auth.RegisterActivity;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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
        TextView tvSwitchToRegister = findViewById(R.id.tvSwitchToRegister);

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
                ApiService apiService = ApiClient.getClient().create(ApiService.class);

                LoginRequest request = new LoginRequest(username, password);

                apiService.loginUser(request).enqueue(new Callback<UserResponse>() {
                    @Override
                    public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                        btnLogin.setText("LOGIN");
                        btnLogin.setEnabled(true);

                        if (response.isSuccessful() && response.body() != null) {
                            String role = response.body().getRole() != null ? response.body().getRole() : "User";

                            if ("STAFF".equalsIgnoreCase(role)) {
                                Toast.makeText(MainActivity.this, "Access Denied: Mobile app is for patients only.", Toast.LENGTH_LONG).show();
                            } else {
                                String fullName = response.body().getFullName();
                                String email = response.body().getEmail(); // <-- Also grab the email
                                Long id = response.body().getId();
                                Integer age = response.body().getAge();
                                String gender = response.body().getGender();

                                // Navigate to DashboardActivity!
                                Intent intent = new Intent(MainActivity.this, DashboardActivity.class);
                                intent.putExtra("USER_NAME", fullName);
                                intent.putExtra("USER_EMAIL", email); // <-- Pass the email
                                intent.putExtra("USER_ID", id != null ? id : -1L);
                                intent.putExtra("USER_AGE", age != null ? age : -1);
                                intent.putExtra("USER_GENDER", gender != null ? gender : "");
                                startActivity(intent);
                                finish(); // Close the Login screen so user can't press "Back" to return to it
                            }
                        } else {
                            Toast.makeText(MainActivity.this, "Login Failed: Invalid credentials", Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<UserResponse> call, Throwable t) {
                        btnLogin.setText("LOGIN");
                        btnLogin.setEnabled(true);
                        Toast.makeText(MainActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
                    }
                });
            }
        });

        // 3. Add click listener to switch to register
        tvSwitchToRegister.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, RegisterActivity.class);
            startActivity(intent);
        });

        // 4. Google Sign-In Setup
        // Replace "YOUR_WEB_CLIENT_ID" with your actual Web Client ID from Google Cloud Console
        com.google.android.gms.auth.api.signin.GoogleSignInOptions gso = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken("106277203446-9792k4n8vl2qdkkjdoone90irhei09gq.apps.googleusercontent.com")
                .requestEmail()
                .build();

        mGoogleSignInClient = com.google.android.gms.auth.api.signin.GoogleSignIn.getClient(this, gso);

        Button btnGoogleLogin = findViewById(R.id.btnGoogleLogin);
        btnGoogleLogin.setOnClickListener(v -> {
            Intent signInIntent = mGoogleSignInClient.getSignInIntent();
            startActivityForResult(signInIntent, RC_SIGN_IN);
        });
    }

    private com.google.android.gms.auth.api.signin.GoogleSignInClient mGoogleSignInClient;
    private static final int RC_SIGN_IN = 9001;

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        // Result returned from launching the Intent from GoogleSignInClient.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            com.google.android.gms.tasks.Task<com.google.android.gms.auth.api.signin.GoogleSignInAccount> task = com.google.android.gms.auth.api.signin.GoogleSignIn.getSignedInAccountFromIntent(data);
            handleSignInResult(task);
        }
    }

    private void handleSignInResult(com.google.android.gms.tasks.Task<com.google.android.gms.auth.api.signin.GoogleSignInAccount> completedTask) {
        try {
            com.google.android.gms.auth.api.signin.GoogleSignInAccount account = completedTask.getResult(com.google.android.gms.common.api.ApiException.class);

            // Signed in successfully, show authenticated UI.
            String idToken = account.getIdToken();
            sendGoogleTokenToBackend(idToken);
        } catch (com.google.android.gms.common.api.ApiException e) {
            // The ApiException status code indicates the detailed failure reason.
            Toast.makeText(this, "Google Sign In Failed", Toast.LENGTH_SHORT).show();
        }
    }

    private void sendGoogleTokenToBackend(String idToken) {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        edu.cit.dibdib.cliniccare.models.GoogleLoginRequest request = new edu.cit.dibdib.cliniccare.models.GoogleLoginRequest(idToken);

        apiService.googleLogin(request).enqueue(new Callback<UserResponse>() {
            @Override
            public void onResponse(Call<UserResponse> call, Response<UserResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    String role = response.body().getRole() != null ? response.body().getRole() : "User";

                    if ("STAFF".equalsIgnoreCase(role)) {
                        Toast.makeText(MainActivity.this, "Access Denied: Mobile app is for patients only.", Toast.LENGTH_LONG).show();
                    } else {
                        String fullName = response.body().getFullName();
                        String email = response.body().getEmail();
                        Long id = response.body().getId();
                        Integer age = response.body().getAge();
                        String gender = response.body().getGender();

                        Intent intent = new Intent(MainActivity.this, DashboardActivity.class);
                        intent.putExtra("USER_NAME", fullName);
                        intent.putExtra("USER_EMAIL", email);
                        intent.putExtra("USER_ID", id != null ? id : -1L);
                        intent.putExtra("USER_AGE", age != null ? age : -1);
                        intent.putExtra("USER_GENDER", gender != null ? gender : "");
                        startActivity(intent);
                        finish();
                    }
                } else {
                    Toast.makeText(MainActivity.this, "Google Login Failed on Server", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<UserResponse> call, Throwable t) {
                Toast.makeText(MainActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
            }
        });
    }
}
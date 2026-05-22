package edu.cit.dibdib.cliniccare;

import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import edu.cit.dibdib.cliniccare.models.Appointment;
import edu.cit.dibdib.cliniccare.network.ApiClient;
import edu.cit.dibdib.cliniccare.network.ApiService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyAppointmentsActivity extends AppCompatActivity {

    private String userEmail;
    private RecyclerView rvAppointments;
    private TextView tvNoAppointments;
    private AppointmentAdapter adapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_appointments);

        // Setup Toolbar
        Toolbar toolbar = findViewById(R.id.toolbarAppointments);
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }

        userEmail = getIntent().getStringExtra("USER_EMAIL");

        rvAppointments = findViewById(R.id.rvAppointments);
        tvNoAppointments = findViewById(R.id.tvNoAppointments);

        rvAppointments.setLayoutManager(new LinearLayoutManager(this));

        if (userEmail != null && !userEmail.isEmpty()) {
            fetchAppointments();
        } else {
            tvNoAppointments.setVisibility(View.VISIBLE);
        }
    }

    private void fetchAppointments() {
        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.getPatientAppointments(userEmail).enqueue(new Callback<List<Appointment>>() {
            @Override
            public void onResponse(Call<List<Appointment>> call, Response<List<Appointment>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Appointment> list = response.body();
                    if (list.isEmpty()) {
                        tvNoAppointments.setVisibility(View.VISIBLE);
                        rvAppointments.setVisibility(View.GONE);
                    } else {
                        tvNoAppointments.setVisibility(View.GONE);
                        rvAppointments.setVisibility(View.VISIBLE);
                        
                        if (adapter == null) {
                            adapter = new AppointmentAdapter(list);
                            rvAppointments.setAdapter(adapter);
                        } else {
                            adapter.setAppointments(list);
                        }
                    }
                } else {
                    Toast.makeText(MyAppointmentsActivity.this, "Failed to load appointments", Toast.LENGTH_SHORT).show();
                    tvNoAppointments.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onFailure(Call<List<Appointment>> call, Throwable t) {
                Toast.makeText(MyAppointmentsActivity.this, "Network Error: " + t.getMessage(), Toast.LENGTH_LONG).show();
                tvNoAppointments.setVisibility(View.VISIBLE);
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

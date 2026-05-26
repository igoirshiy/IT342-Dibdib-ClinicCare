package edu.cit.dibdib.cliniccare.network;

import edu.cit.dibdib.cliniccare.models.LoginRequest;
import edu.cit.dibdib.cliniccare.models.UserResponse;
import edu.cit.dibdib.cliniccare.models.RegisterRequest;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {

    @POST("/api/auth/login")
    Call<UserResponse> loginUser(@Body LoginRequest request);

    @POST("/api/auth/register")
    Call<UserResponse> registerUser(@Body RegisterRequest request);

    @POST("/api/auth/google-login")
    Call<UserResponse> googleLogin(@Body edu.cit.dibdib.cliniccare.models.GoogleLoginRequest request);

    @retrofit2.http.GET("/api/appointments/patient/{email}")
    Call<java.util.List<edu.cit.dibdib.cliniccare.models.Appointment>> getPatientAppointments(@retrofit2.http.Path("email") String email);

    @retrofit2.http.GET("/api/slots")
    Call<java.util.List<edu.cit.dibdib.cliniccare.models.Slot>> getSlots();

    @POST("/api/appointments/book")
    Call<edu.cit.dibdib.cliniccare.models.Appointment> bookAppointment(@Body edu.cit.dibdib.cliniccare.models.Appointment appointment);

    @retrofit2.http.PUT("/api/users/profile/{id}")
    Call<UserResponse> updateProfile(@retrofit2.http.Path("id") Long id, @Body UserResponse updateRequest);
}

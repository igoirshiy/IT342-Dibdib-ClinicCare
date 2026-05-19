package edu.cit.dibdib.cliniccare;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;
import edu.cit.dibdib.cliniccare.models.Appointment;

public class AppointmentAdapter extends RecyclerView.Adapter<AppointmentAdapter.AppointmentViewHolder> {

    private List<Appointment> appointments;

    public AppointmentAdapter(List<Appointment> appointments) {
        this.appointments = appointments;
    }

    public void setAppointments(List<Appointment> appointments) {
        this.appointments = appointments;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public AppointmentViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_appointment, parent, false);
        return new AppointmentViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull AppointmentViewHolder holder, int position) {
        Appointment appointment = appointments.get(position);
        
        holder.tvDoctorName.setText(appointment.getDoctorName());
        holder.tvConsultationType.setText(appointment.getConsultationType());
        holder.tvDateTime.setText(appointment.getAppointmentDate() + " • " + appointment.getTimeSlot());
        holder.tvStatus.setText(appointment.getStatus());

        // Simple color coding for status
        if ("Completed".equalsIgnoreCase(appointment.getStatus())) {
            holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#4CAF50")); // Green
        } else if ("Cancelled".equalsIgnoreCase(appointment.getStatus())) {
            holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#F44336")); // Red
        } else {
            holder.tvStatus.setTextColor(android.graphics.Color.parseColor("#2A5C82")); // Blue
        }
    }

    @Override
    public int getItemCount() {
        return appointments == null ? 0 : appointments.size();
    }

    static class AppointmentViewHolder extends RecyclerView.ViewHolder {
        TextView tvDoctorName;
        TextView tvConsultationType;
        TextView tvDateTime;
        TextView tvStatus;

        public AppointmentViewHolder(@NonNull View itemView) {
            super(itemView);
            tvDoctorName = itemView.findViewById(R.id.tvDoctorName);
            tvConsultationType = itemView.findViewById(R.id.tvConsultationType);
            tvDateTime = itemView.findViewById(R.id.tvDateTime);
            tvStatus = itemView.findViewById(R.id.tvStatus);
        }
    }
}

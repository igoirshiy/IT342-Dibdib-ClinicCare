package edu.cit.dibdib.cliniccare;

import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.google.android.material.card.MaterialCardView;
import java.util.List;
import edu.cit.dibdib.cliniccare.models.Slot;

public class TimeSlotAdapter extends RecyclerView.Adapter<TimeSlotAdapter.ViewHolder> {

    private List<Slot> slots;
    private int selectedPosition = -1;
    private OnSlotSelectedListener listener;

    public interface OnSlotSelectedListener {
        void onSlotSelected(Slot slot);
    }

    public TimeSlotAdapter(List<Slot> slots, OnSlotSelectedListener listener) {
        this.slots = slots;
        this.listener = listener;
    }

    public void setSlots(List<Slot> slots) {
        this.slots = slots;
        this.selectedPosition = -1;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_time_slot, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Slot slot = slots.get(position);
        
        String timeRange = formatTime(slot.getStartTime()) + " - " + formatTime(slot.getEndTime());
        holder.tvSlotTime.setText(timeRange);
        
        boolean isFull = slot.getBooked() >= slot.getCapacity();
        int available = slot.getCapacity() - slot.getBooked();
        
        if (isFull) {
            holder.tvSlotCapacity.setText("FULL");
            holder.cardView.setCardBackgroundColor(Color.parseColor("#F5F5F5"));
            holder.tvSlotTime.setTextColor(Color.parseColor("#999999"));
            holder.tvSlotCapacity.setTextColor(Color.parseColor("#D32F2F"));
            holder.cardView.setStrokeColor(Color.parseColor("#E0E0E0"));
            holder.cardView.setClickable(false);
        } else {
            holder.tvSlotCapacity.setText("Available: " + available + "/" + slot.getCapacity());
            holder.cardView.setClickable(true);
            
            if (selectedPosition == position) {
                // Selected state
                holder.cardView.setCardBackgroundColor(Color.parseColor("#E3F2FD"));
                holder.cardView.setStrokeColor(Color.parseColor("#1976D2"));
                holder.tvSlotTime.setTextColor(Color.parseColor("#1565C0"));
                holder.tvSlotCapacity.setTextColor(Color.parseColor("#1976D2"));
            } else {
                // Default state
                holder.cardView.setCardBackgroundColor(Color.WHITE);
                holder.cardView.setStrokeColor(Color.parseColor("#E0E0E0"));
                holder.tvSlotTime.setTextColor(Color.parseColor("#333333"));
                holder.tvSlotCapacity.setTextColor(Color.parseColor("#666666"));
            }
        }

        holder.cardView.setOnClickListener(v -> {
            if (!isFull) {
                int previous = selectedPosition;
                selectedPosition = holder.getAdapterPosition();
                notifyItemChanged(previous);
                notifyItemChanged(selectedPosition);
                listener.onSlotSelected(slot);
            }
        });
    }

    @Override
    public int getItemCount() {
        return slots == null ? 0 : slots.size();
    }

    private String formatTime(String t) {
        if (t == null || !t.contains(":")) return t;
        try {
            String[] parts = t.split(":");
            int h = Integer.parseInt(parts[0]);
            int m = Integer.parseInt(parts[1]);
            String ampm = h >= 12 ? "PM" : "AM";
            int hr = h % 12;
            if (hr == 0) hr = 12;
            return hr + ":" + String.format("%02d", m) + " " + ampm;
        } catch (Exception e) {
            return t;
        }
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardView;
        TextView tvSlotTime;
        TextView tvSlotCapacity;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardTimeSlot);
            tvSlotTime = itemView.findViewById(R.id.tvSlotTime);
            tvSlotCapacity = itemView.findViewById(R.id.tvSlotCapacity);
        }
    }
}

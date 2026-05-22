package edu.cit.dibdib.cliniccare;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

import edu.cit.dibdib.cliniccare.models.Habit;

public class HabitAdapter extends RecyclerView.Adapter<HabitAdapter.HabitViewHolder> {

    private List<Habit> habitList;
    private OnHabitInteractionListener listener;

    public interface OnHabitInteractionListener {
        void onHabitChecked(Habit habit, boolean isChecked);
        void onHabitEdit(Habit habit, int position);
    }

    public HabitAdapter(List<Habit> habitList, OnHabitInteractionListener listener) {
        this.habitList = habitList;
        this.listener = listener;
    }

    public void setHabitList(List<Habit> habitList) {
        this.habitList = habitList;
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public HabitViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_habit, parent, false);
        return new HabitViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull HabitViewHolder holder, int position) {
        Habit habit = habitList.get(position);

        holder.tvHabitTitle.setText(habit.getTitle());
        holder.tvHabitDesc.setText(habit.getDescription());
        
        // Remove listener to prevent false triggers during scroll recycling
        holder.cbHabit.setOnCheckedChangeListener(null);
        holder.cbHabit.setChecked(habit.isChecked());

        holder.cbHabit.setOnCheckedChangeListener((buttonView, isChecked) -> {
            habit.setChecked(isChecked);
            if (listener != null) {
                listener.onHabitChecked(habit, isChecked);
            }
        });

        holder.btnEditHabit.setOnClickListener(v -> {
            if (listener != null) {
                listener.onHabitEdit(habit, position);
            }
        });
    }

    @Override
    public int getItemCount() {
        return habitList == null ? 0 : habitList.size();
    }

    static class HabitViewHolder extends RecyclerView.ViewHolder {
        TextView tvHabitTitle;
        TextView tvHabitDesc;
        CheckBox cbHabit;
        ImageView btnEditHabit;

        public HabitViewHolder(@NonNull View itemView) {
            super(itemView);
            tvHabitTitle = itemView.findViewById(R.id.tvHabitTitle);
            tvHabitDesc = itemView.findViewById(R.id.tvHabitDesc);
            cbHabit = itemView.findViewById(R.id.cbHabit);
            btnEditHabit = itemView.findViewById(R.id.btnEditHabit);
        }
    }
}

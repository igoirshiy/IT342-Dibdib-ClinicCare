import os
import shutil

base_dir = r"C:\Users\Wayne Kenji\Music\IT342-Dibdib-ClinicCare\ClinicCare\src\main\java\edu\cit\dibdib\ClinicCare"

file_mappings = {
    # auth
    "AuthController.java": "features.auth",
    
    # users
    "DoctorController.java": "features.users",
    "User.java": "features.users",
    "Staff.java": "features.users",
    "Doctor.java": "features.users",
    "BaseUser.java": "features.users",
    "UserFactory.java": "features.users",
    "UserRepository.java": "features.users",
    "StaffRepository.java": "features.users",
    "DoctorRepository.java": "features.users",
    
    # appointments
    "AppointmentController.java": "features.appointments",
    "SlotController.java": "features.appointments",
    "Appointment.java": "features.appointments",
    "Slot.java": "features.appointments",
    "AppointmentRepository.java": "features.appointments",
    "SlotRepository.java": "features.appointments",
    "BookingFacade.java": "features.appointments",
    "QueueStrategy.java": "features.appointments",
    "DoctorPrefixQueueStrategy.java": "features.appointments",
    
    # notifications
    "NotificationAdapter.java": "features.notifications",
    "WebSocketNotificationAdapter.java": "features.notifications"
}

# Create feature directories
for feature in set(file_mappings.values()):
    os.makedirs(os.path.join(base_dir, *feature.split('.')), exist_ok=True)

moved_files_paths = {}

# Move files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file in file_mappings:
            old_path = os.path.join(root, file)
            new_package = file_mappings[file]
            new_dir = os.path.join(base_dir, *new_package.split('.'))
            new_path = os.path.join(new_dir, file)
            
            # Avoid moving if it's already there
            if old_path != new_path:
                shutil.move(old_path, new_path)
            
            moved_files_paths[file] = {
                'old_package': "edu.cit.dibdib.ClinicCare." + os.path.basename(root) if os.path.basename(root) != "ClinicCare" else "edu.cit.dibdib.ClinicCare",
                'new_package': "edu.cit.dibdib.ClinicCare." + new_package,
                'path': new_path
            }

# Add WebConfig and WebSocketConfig to the mappings for imports replacements? They didn't move, so no.

# Update imports and packages in all java files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".java"):
            file_path = os.path.join(root, file)
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            new_content = content
            
            # Update package declaration if the file was moved
            if file in moved_files_paths:
                old_pkg = moved_files_paths[file]['old_package']
                new_pkg = moved_files_paths[file]['new_package']
                new_content = new_content.replace(f"package {old_pkg};", f"package {new_pkg};")
            
            # Update imports everywhere
            for moved_file, info in moved_files_paths.items():
                old_import = f"import {info['old_package']}.{moved_file[:-5]};"
                new_import = f"import {info['new_package']}.{moved_file[:-5]};"
                new_content = new_content.replace(old_import, new_import)
                
            # Handle wildcard imports (e.g., import edu.cit.dibdib.ClinicCare.model.*;)
            # This is tricky because we scattered models. 
            # It's better to replace wildcard imports with explicit ones if they exist, but normally IDEs generate explicit.
            # Let's hope there are no wildcard imports, or if there are, we'll fix them manually.
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)

print("Backend refactoring script completed.")

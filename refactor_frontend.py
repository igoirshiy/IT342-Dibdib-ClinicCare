import os
import shutil
import re

base_dir = r"C:\Users\Wayne Kenji\Music\IT342-Dibdib-ClinicCare\web\cliniccare\src"

features = {
    "auth": ["Login.js", "Login.css", "Register.js", "Register.css"],
    "dashboard": [
        "Dashboard.js", "Dashboard.css", 
        "DashboardCards.js", "DashboardCards.css", 
        "Header.js", "Header.css", 
        "Sidebar.js", "Sidebar.css", 
        "StaffDashboard.js", "StaffDashboard.css", 
        "StaffHeader.js", 
        "NotificationCenter.js", "NotificationCenter.css", 
        "NotificationItem.js"
    ],
    "appointments": [
        "AppointmentItem.js", "AppointmentList.js", "AppointmentList.css", 
        "BookingModal.js", "BookingModal.css", 
        "BookingView.js", "QueueView.js", 
        "CustomCalendar.js", "CustomCalendar.css", 
        "SlotManager.js", "SlotManager.css", 
        "StaffAppointmentItem.js", "StaffAppointmentList.js", "StaffAppointments.css"
    ],
    "users": [
        "staffData.js"
    ]
}

# Create feature dirs
for feature in features:
    os.makedirs(os.path.join(base_dir, "features", feature), exist_ok=True)

# Find all files and move them
components_dir = os.path.join(base_dir, "components")

file_destinations = {}

for root, dirs, files in os.walk(components_dir):
    for file in files:
        target_feature = None
        for feature, feature_files in features.items():
            if file in feature_files:
                target_feature = feature
                break
        
        if target_feature:
            old_path = os.path.join(root, file)
            new_dir = os.path.join(base_dir, "features", target_feature)
            new_path = os.path.join(new_dir, file)
            shutil.move(old_path, new_path)
            file_destinations[file] = target_feature

# Also delete empty component folders
def remove_empty_dirs(path):
    if not os.path.isdir(path):
        return
    for f in os.listdir(path):
        remove_empty_dirs(os.path.join(path, f))
    if not os.listdir(path):
        os.rmdir(path)

remove_empty_dirs(components_dir)

# Update App.js imports
app_js_path = os.path.join(base_dir, "App.js")
if os.path.exists(app_js_path):
    with open(app_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # We replace components/... with features/...
    # But since components had nested paths like components/Dashboard/patient/Dashboard
    # we can just use regex to replace all imports of our known files
    for file, feature in file_destinations.items():
        if file.endswith(".js"):
            comp_name = file[:-3]
            # regex to find import ... from '.../comp_name'
            # and replace with import ... from './features/feature/comp_name'
            content = re.sub(
                r"from\s+['\"].*?/" + comp_name + r"['\"]",
                f"from './features/{feature}/{comp_name}'",
                content
            )
            
    with open(app_js_path, "w", encoding="utf-8") as f:
        f.write(content)

# We might also need to update imports within the moved files.
# e.g., Dashboard.js importing Sidebar.js
# Currently, it might be import Sidebar from '../common/Sidebar'
# We will just rewrite them to relative imports between features
for root, dirs, files in os.walk(os.path.join(base_dir, "features")):
    for file in files:
        if file.endswith((".js", ".css")):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            # For each known file, if it is imported, rewrite the import
            current_feature = os.path.basename(root)
            for target_file, target_feature in file_destinations.items():
                if target_file.endswith(".js"):
                    comp_name = target_file[:-3]
                else:
                    comp_name = target_file
                    
                # Calculate relative path
                if current_feature == target_feature:
                    rel_path = f"./{comp_name}"
                else:
                    rel_path = f"../{target_feature}/{comp_name}"
                
                # regex to replace: import X from '.../comp_name'
                # but careful not to replace CSS imports incorrectly or generic ones
                if target_file.endswith(".css"):
                    content = re.sub(
                        r"import\s+['\"].*?/" + re.escape(comp_name) + r"['\"]",
                        f"import '{rel_path}'",
                        content
                    )
                    content = re.sub(
                        r"import\s+['\"]" + re.escape(comp_name) + r"['\"]",
                        f"import '{rel_path}'",
                        content
                    )
                else:
                    content = re.sub(
                        r"from\s+['\"].*?/" + comp_name + r"['\"]",
                        f"from '{rel_path}'",
                        content
                    )
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)

print("Frontend refactoring script completed.")

import os

base_dir = r"C:\Users\Wayne Kenji\Music\IT342-Dibdib-ClinicCare\ClinicCare\src\main\java\edu\cit\dibdib\ClinicCare\features"

for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".java"):
            file_path = os.path.join(root, file)
            # The feature name is the folder name inside features/
            rel_path = os.path.relpath(root, base_dir)
            feature_name = rel_path.replace(os.sep, '.')
            new_package = f"edu.cit.dibdib.ClinicCare.features.{feature_name}"
            
            with open(file_path, 'r', encoding='utf-8') as f:
                lines = f.readlines()
                
            changed = False
            for i, line in enumerate(lines):
                if line.startswith("package "):
                    if line.strip() != f"package {new_package};":
                        lines[i] = f"package {new_package};\n"
                        changed = True
                    break
                    
            if changed:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.writelines(lines)

print("Package declarations fixed.")

# IT342-Dibdib-ClinicCare

Project documentation is located in [docs/IT342_ClinicCare_Dibdib.md](./docs/IT342_ClinicCare_Dibdib.md).

## Setup & Running Instructions

Follow these steps in order to get the system running:

### Step 1: Install System Requirements
Before running the project, make sure you have the following installed:
- **Java JDK** (Java Development Kit) - Required for the backend
- **Node.js and npm** - Required for the frontend
- **Git** - For version control

### Step 2: Clone/Pull the Project
```bash
git clone <repository-url>
cd IT342-Dibdib-ClinicCare
```

### Step 3: Backend Setup
```bash
cd ClinicCare
mvn clean install
```
Or simply run the batch file:
```bash
run-backend.bat
```

### Step 4: Frontend Setup
Open a new terminal/command prompt:
```bash
cd web/cliniccare
npm install
```

### Step 5: Configure Application (if needed)
- Check `ClinicCare/src/main/resources/application.properties` for any configuration changes
- Set up database connection if required
- Update any environment-specific settings

### Step 6: Run the System

**Terminal 1 - Backend:**
```bash
cd ClinicCare
run-backend.bat
```

**Terminal 2 - Frontend:**
```bash
cd web/cliniccare
npm start
```

The frontend should automatically open in your browser at `http://localhost:3000`

---

**Note:** All three terminals should remain open while the system is running.



ENSURE THE PC THAT IT HAVE Java JDK, Node.js, npm, and Git installed--


TO CHECK THE TOOLS IN WINDOW:
java -version
node --version
npm --version
git --version
(If a tool is installed, you'll see the version number. If not, you'll get a "not found" error)


if not in pc:
Java JDK=
Download from: https://www.oracle.com/java/technologies/downloads/
Choose Windows x64 Installer
Run the installer and follow the prompts
Verify: java -version

Node.js (includes npm)=
Download from: https://nodejs.org/
Choose the LTS (Long Term Support) version
Run the installer
Verify: node --version and npm --version

Git=
Download from: https://git-scm.com/download/win
Run the installer with default settings
Verify: git --version

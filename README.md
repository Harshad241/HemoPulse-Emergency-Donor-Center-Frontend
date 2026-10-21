# WMD Lab: Unified HemoPulse Emergency Donor Center & Registry

**Course:** Web & Mobile Development (WMD) Lab  
**Experiments Combined:** Experiment 03 & Experiment 04 + Enhanced Clinical Features  
**Technology Stack:** React 18, JavaScript (ES6+), JSX, Vite, React Context API, CSS3  
**Location:** `C:\Users\ADMIN\Desktop\WMD ALL EXPS\Experiment 9\hemopulse-frontend`

---

## 1. Project Overview

The **Unified HemoPulse Emergency Donor Center & Registry** is an advanced, production-grade single-page React application that brings together all the features and architectures of **WMD Lab Experiment 03** (React Components, State, List Rendering, Search & Filtering) and **WMD Lab Experiment 04** (React Context API, Controlled Forms, Form Validation, Official ID Card Generation, and Tabular Member Views).

In addition, it introduces **new clinical-grade features**:
- **Interactive Blood Compatibility & Transfusion Matrix**: A medical rules engine covering all 8 human blood groups (O-, O+, A-, A+, B-, B+, AB-, AB+), displaying universal donor/recipient statuses, clinical guidance, and real-time counts of matching available donors in the registry with a 1-click filter button.
- **Tabbed Multi-View Dashboard**: Switch seamlessly between Directory, Registration & ID Card, Registry Table, Compatibility Matrix, or an All-in-One view.
- **Interactive ID Badge Printing & Copying**: Print or PDF-export formatted official digital donor badges, complete with security barcode simulator and verified crest.
- **Full CRUD & Status Management**: Real-time status toggling (Available ↔ Unavailable) and record deletion in both cards and tables.
- **Dynamic Hospital Emergency Need Dispatcher**: Post new emergency hospital blood requirements directly into the live broadcast feed.
- **CSV Data Export**: 1-click export of registered blood donors for hospital management systems.
- **LocalStorage Data Persistence**: Persistent state across page reloads with a one-click demo data reset.

---

## 2. Key Concepts Demonstrated

| Feature / Concept | Origin | Implementation in Unified HemoPulse |
| :--- | :--- | :--- |
| **Component Hierarchy & SoC** | Exp 03 & 04 | Modular functional components: `Header`, `FilterBar`, `EmergencyRequests`, `DonorGrid`, `DonorCard`, `DonorRegistrationForm`, `DonorIdCard`, `DonorList`, `BloodCompatibilityMatrix`, `AddEmergencyModal`. |
| **Global State Hub (`DonorContext`)** | Exp 04 | Implemented in `src/context/DonorContext.jsx` using `createContext()`. Stores `donors`, `activeDonor`, `emergencyRequests`, `contactedDonors`, and notifications. |
| **Custom Context Hook (`useDonorContext`)** | Exp 04 | Clean abstraction eliminating prop-drilling across deep component trees. |
| **Controlled Form & Real-time Validation** | Exp 04 | Controlled inputs with generic `handleChange`, computed property names, regex email, 10-digit mobile number, and 18–65 age constraints. |
| **Official ID Card Generation** | Exp 04 | Real-time credential generator displaying active donor details, prominent blood type badge, and print/export tools. |
| **Dynamic Table Rendering** | Exp 04 | Tabular view with dynamic row mapping, inline status toggles, deletion, and CSV export. |
| **Multi-Criteria Search & Filtering** | Exp 03 | Real-time keyword search (name, city, blood group, contact), blood group dropdown, and availability toggle. |
| **Emergency Hospital Requests** | Exp 03 | Urgency cards (CRITICAL, URGENT, HIGH PRIORITY) with 1-click donor filter callbacks. |
| **Donor Card Grid & List Rendering** | Exp 03 | Responsive CSS grid rendering cards with unique `key={donor.id}` and empty state handling. |
| **Blood Compatibility Matrix** | **NEW** | Biological rules engine calculating real-time eligible donors for trauma transfusions. |
| **Hospital Emergency Modal** | **NEW** | Dynamic form modal to broadcast emergency blood needs to the network. |
| **Print Badge & CSV Export** | **NEW** | Native browser print CSS styling and CSV data export functionality. |
| **Data Persistence & Reset** | **NEW** | Synchronized with browser `localStorage`, with one-click restore to default mock data. |

---

## 3. Directory Structure

```text
hemopulse-frontend/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── context/
    │   └── DonorContext.jsx             # Unified React Context and custom hook
    ├── data/
    │   ├── mockData.js                  # Initial donors and hospital emergency needs
    │   └── bloodCompatibilityData.js    # Transfusion rules for all 8 blood groups
    ├── components/
    │   ├── Header.jsx                   # Coordinator profile, stats, and tab navigation
    │   ├── FilterBar.jsx                # Multi-criteria search, blood filters, and sorting
    │   ├── EmergencyRequests.jsx        # Hospital emergency needs broadcast grid
    │   ├── AddEmergencyModal.jsx        # Modal to broadcast new emergency blood needs
    │   ├── DonorGrid.jsx                # Responsive grid container with empty state
    │   ├── DonorCard.jsx                # Individual donor card with emergency dispatch
    │   ├── DonorRegistrationForm.jsx    # Controlled registration form with validation
    │   ├── DonorIdCard.jsx              # Official digital ID card with print & copy
    │   ├── DonorList.jsx                # Dynamic registry table with CSV export
    │   └── BloodCompatibilityMatrix.jsx # Interactive transfusion matrix & calculator
    ├── App.jsx                          # Root orchestrator component
    ├── App.css                          # Component styling & print stylesheet
    ├── index.css                        # CSS reset & design tokens
    └── main.jsx                         # React 18 DOM mount point
```

---

## 4. How to Run the Application

### Step 1: Navigate to Project Directory
```powershell
cd "C:\Users\ADMIN\Desktop\WMD ALL EXPS\Experiment 9\hemopulse-frontend"
```

### Step 2: Start Development Server
```powershell
npm.cmd run dev
```

### Step 3: Access in Browser
Open your browser and navigate to:
```text
http://localhost:5173/
```

### Step 4: Build for Production
```powershell
npm.cmd run build
```

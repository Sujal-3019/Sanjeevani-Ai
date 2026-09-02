// ==========================================
// 1. INDIVIDUAL PORTAL PROFILES
// ==========================================
export const patientProfileInfo = {
  name: "S. Shukla",
  email: "shrijal.shukla@example.com",
  phone: "+91 9876543210",
  role: "Patient"
};

export const hospitalProfileInfo = {
  name: "Dr. K. Singh",
  email: "dr.k.singh@citycentralhospital.com",
  phone: "+91 8000011111",
  role: "Medical Staff"
};

export const adminProfileInfo = {
  name: "Admin P. Sharma",
  email: "admin.p.sharma@sanjeevani.ai",
  phone: "+91 9999900001",
  role: "System Admin"
};

// ==========================================
// 2. ADMIN DASHBOARD DATA
// ==========================================
export const dummyAdminDashboardData = {
  systemMode: "Active",
  totalHospitals: 42,
  activeEmergencies: 12,
  totalPatients: 14502
};

export const categorizedUsersData = {
  patients: [
    { id: 'p1', name: 'Sujal Shukla', email: 'sujal.shukla@example.com', phone: '+91 9876543210', date: '3/10/2026', status: 'ACTIVE' },
    { id: 'p2', name: 'Praveen Kumar', email: 'praveen.k@example.com', phone: '+91 9876543211', date: '3/12/2026', status: 'ACTIVE' },
    { id: 'p3', name: 'Piyush Prajapati', email: 'piyush.p@example.com', phone: '+91 9876543212', date: '4/1/2026', status: 'ACTIVE' },
    { id: 'p4', name: 'Atul Dubey', email: 'atul.d@example.com', phone: '+91 9876543213', date: '4/15/2026', status: 'ACTIVE' }
  ],
  hospitals: [
    { id: 'h1', name: 'City Central Hospital', email: 'admin@citycentral.com', phone: '+91 8000011111', date: '1/15/2026', status: 'ACTIVE' },
    { id: 'h2', name: 'Apollo Spectra', email: 'contact@apollospectra.com', phone: '+91 8000022222', date: '2/20/2026', status: 'ACTIVE' },
    { id: 'h3', name: 'Max Super Speciality', email: 'info@maxhospital.com', phone: '+91 8000033333', date: '5/10/2026', status: 'ACTIVE' }
  ],
  admins: [
    { id: 'a1', name: 'P. Sharma', email: 'admin.p.sharma@sanjeevani.ai', phone: '+91 9999900001', date: '1/01/2026', status: 'ACTIVE' },
    { id: 'a2', name: 'Vikash Singh Chauhan', email: 'vikash.c@sanjeevani.ai', phone: '+91 9999900002', date: '1/05/2026', status: 'ACTIVE' },
    { id: 'a3', name: 'System Root', email: 'root@sanjeevani.ai', phone: '+91 9999900000', date: '1/01/2026', status: 'ACTIVE' }
  ]
};

// ==========================================
// 3. HOSPITAL DASHBOARD DATA
// ==========================================
export const dummyHospitalDashboardData = {
  availableBeds: 42,
  activeDispatches: 1,
  totalAmbulances: 5
};

export const dummyEmergencyRequests = [
  {
    _id: "req1",
    severity: "CRITICAL",
    description: "Multi-vehicle accident",
    timestamp: new Date().toISOString(),
    status: "PENDING",
    etaToPatient: "8 mins",
    distanceRemaining: "3.2 km",
    incidentLocation: { address: "NH-19 Highway, Milestone 42" },
    patientDetails: { firstName: "Unknown", lastName: "Male", age: 34, bloodGroup: "O+", allergies: ["None Known"] },
    ambulanceDetails: { callSign: "Ambulance A-01" }
  },
  {
    _id: "req2",
    severity: "CRITICAL",
    description: "Multi-vehicle accident",
    timestamp: new Date().toISOString(),
    status: "PENDING",
    etaToPatient: "8 mins",
    distanceRemaining: "3.2 km",
    incidentLocation: { address: "NH-19 Highway, Milestone 42" },
    patientDetails: { firstName: "Unknown", lastName: "Male", age: 34, bloodGroup: "O+", allergies: ["None Known"] },
    ambulanceDetails: { callSign: "Ambulance A-01" }
  }
];

export const dummyAmbulanceData = [
  { _id: "amb1", callSign: "Ambulance A-01", status: "EN_ROUTE", driverName: "Ramesh Kumar", driverPhone: "+91 9876543222" },
  { _id: "amb2", callSign: "Ambulance A-02", status: "AVAILABLE", driverName: "Suresh Singh", driverPhone: "+91 9876543223" },
  { _id: "amb3", callSign: "Ambulance A-03", status: "MAINTENANCE", driverName: "Amit Patel", driverPhone: "+91 9876543224" }
];

export const formatEmergencyTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
export const getSeverityDisplay = (severity) => {
  if (severity === 'CRITICAL') return { label: 'Red - Critical', classes: 'text-red-700 bg-red-50 border-red-100', dot: 'bg-red-500 animate-pulse' };
  return { label: 'Yellow - Medium', classes: 'text-yellow-700 bg-yellow-50 border-yellow-100', dot: 'bg-yellow-500' };
};

// ==========================================
// 4. PATIENT DASHBOARD DATA
// ==========================================
export const dummyPatientData = [
  {
    firstName: "Shrijal",
    lastName: "Shukla",
    bloodGroup: "O+",
    height: "178 cm",
    weight: "74 kg",
    allergies: ["Dust", "Pollen"],
    chronicConditions: ["None"],
    currentMedications: ["None"]
  }
];

export const dummyMedicineVerifications = [
  { _id: "v1", medicineName: "Paracetamol 500mg", searchMethod: "OCR", verificationStatus: "VERIFIED" },
  { _id: "v2", medicineName: "Lisinopril 10mg", searchMethod: "MANUAL", verificationStatus: "VERIFIED" }
];
// Static User / Coordinator Profile
export const user = {
  id: "coord-01",
  name: "Dr. Harshad Potdar",
  role: "Emergency Coordinator",
  center: "Central Blood Bank & Trauma Center",
  status: "Active Duty"
};

// Initial Blood Donors Directory (Combined & Enriched from Experiment 3 & 4)
export const initialDonors = [
  {
    id: "DONOR-001",
    fullName: "Rahul Sharma",
    name: "Rahul Sharma",
    bloodGroup: "O+",
    age: 21,
    city: "Mumbai",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    availability: true,
    lastDonationDate: "15 Aug 2026",
    lastDonation: "15 Aug 2026",
    donations: 4,
    rating: 4.8
  },
  {
    id: "DONOR-002",
    fullName: "Priya Patel",
    name: "Priya Patel",
    bloodGroup: "A+",
    age: 24,
    city: "Pune",
    phone: "9823456781",
    email: "priya.patel@example.com",
    availability: true,
    lastDonationDate: "02 Jul 2026",
    lastDonation: "02 Jul 2026",
    donations: 6,
    rating: 4.9
  },
  {
    id: "DONOR-003",
    fullName: "Amit Deshmukh",
    name: "Amit Deshmukh",
    bloodGroup: "B+",
    age: 28,
    city: "Thane",
    phone: "9819012345",
    email: "amit.deshmukh@example.com",
    availability: false,
    lastDonationDate: "20 Sep 2026",
    lastDonation: "20 Sep 2026",
    donations: 3,
    rating: 4.5
  },
  {
    id: "DONOR-004",
    fullName: "Sneha Kulkarni",
    name: "Sneha Kulkarni",
    bloodGroup: "O-",
    age: 26,
    city: "Mumbai",
    phone: "9765432109",
    email: "sneha.kulkarni@example.com",
    availability: true,
    lastDonationDate: "10 Jun 2026",
    lastDonation: "10 Jun 2026",
    donations: 8,
    rating: 5.0
  },
  {
    id: "DONOR-005",
    fullName: "Vikram Rathore",
    name: "Vikram Rathore",
    bloodGroup: "AB+",
    age: 30,
    city: "Navi Mumbai",
    phone: "9890123456",
    email: "vikram.r@example.com",
    availability: true,
    lastDonationDate: "25 May 2026",
    lastDonation: "25 May 2026",
    donations: 5,
    rating: 4.7
  },
  {
    id: "DONOR-006",
    fullName: "Ananya Iyer",
    name: "Ananya Iyer",
    bloodGroup: "A-",
    age: 22,
    city: "Pune",
    phone: "9834567890",
    email: "ananya.iyer@example.com",
    availability: false,
    lastDonationDate: "18 Sep 2026",
    lastDonation: "18 Sep 2026",
    donations: 2,
    rating: 4.6
  },
  {
    id: "DONOR-007",
    fullName: "Rohan Varma",
    name: "Rohan Varma",
    bloodGroup: "B-",
    age: 25,
    city: "Thane",
    phone: "9821987654",
    email: "rohan.varma@example.com",
    availability: true,
    lastDonationDate: "04 Apr 2026",
    lastDonation: "04 Apr 2026",
    donations: 7,
    rating: 4.9
  },
  {
    id: "DONOR-008",
    fullName: "Meera Nair",
    name: "Meera Nair",
    bloodGroup: "AB-",
    age: 27,
    city: "Mumbai",
    phone: "9811223344",
    email: "meera.nair@example.com",
    availability: true,
    lastDonationDate: "12 Mar 2026",
    lastDonation: "12 Mar 2026",
    donations: 3,
    rating: 4.7
  },
  {
    id: "DONOR-009",
    fullName: "Karan Mehta",
    name: "Karan Mehta",
    bloodGroup: "O+",
    age: 29,
    city: "Pune",
    phone: "9845012345",
    email: "karan.mehta@example.com",
    availability: false,
    lastDonationDate: "11 Sep 2026",
    lastDonation: "11 Sep 2026",
    donations: 5,
    rating: 4.6
  },
  {
    id: "DONOR-010",
    fullName: "Pooja Joshi",
    name: "Pooja Joshi",
    bloodGroup: "A+",
    age: 23,
    city: "Navi Mumbai",
    phone: "9730123456",
    email: "pooja.j@example.com",
    availability: true,
    lastDonationDate: "29 Jun 2026",
    lastDonation: "29 Jun 2026",
    donations: 4,
    rating: 4.8
  },
  {
    id: "DONOR-011",
    fullName: "Devendra Patil",
    name: "Devendra Patil",
    bloodGroup: "B+",
    age: 32,
    city: "Mumbai",
    phone: "9898765432",
    email: "devendra.p@example.com",
    availability: true,
    lastDonationDate: "01 May 2026",
    lastDonation: "01 May 2026",
    donations: 11,
    rating: 4.9
  },
  {
    id: "DONOR-012",
    fullName: "Tanvi Sawant",
    name: "Tanvi Sawant",
    bloodGroup: "O-",
    age: 22,
    city: "Navi Mumbai",
    phone: "9819922334",
    email: "tanvi.s@example.com",
    availability: false,
    lastDonationDate: "14 Sep 2026",
    lastDonation: "14 Sep 2026",
    donations: 2,
    rating: 4.4
  }
];

// Initial Emergency Hospital Blood Requirements
export const initialEmergencyRequirements = [
  {
    id: "EMERG-001",
    bloodGroup: "O-",
    hospital: "City Hospital",
    urgency: "CRITICAL",
    unitsNeeded: "3 Units",
    department: "Trauma Care",
    timeAgo: "10 mins ago"
  },
  {
    id: "EMERG-002",
    bloodGroup: "B-",
    hospital: "Sunrise Hospital",
    urgency: "URGENT",
    unitsNeeded: "2 Units",
    department: "Emergency ICU",
    timeAgo: "25 mins ago"
  },
  {
    id: "EMERG-003",
    bloodGroup: "AB+",
    hospital: "Apex Medical Center",
    urgency: "HIGH PRIORITY",
    unitsNeeded: "4 Units",
    department: "Surgical Ward",
    timeAgo: "40 mins ago"
  },
  {
    id: "EMERG-004",
    bloodGroup: "A-",
    hospital: "Metro Health Care",
    urgency: "URGENT",
    unitsNeeded: "2 Units",
    department: "Pediatric Emergency",
    timeAgo: "1 hour ago"
  }
];

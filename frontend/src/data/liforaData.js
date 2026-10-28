// LIFORA Healthcare Mobility Data — Eluru & Andhra Pradesh Region

export const HOSPITALS = [
  {
    id: "hosp-asram",
    name: "Asram Medical College & Hospital",
    shortName: "ASRAM Hospital",
    address: "NH-16, Malkapuram, Eluru, Andhra Pradesh 534005",
    lat: 16.7450,
    lng: 81.1480,
    emergencyAvailable: true,
    contactNumber: "08812-288288",
    specialities: ["General Medicine", "Cardiology", "Trauma Care", "Orthopedics", "Pediatrics"],
    type: "Super-Speciality & Teaching Hospital"
  },
  {
    id: "hosp-ggh",
    name: "District Government General Hospital (GGH)",
    shortName: "Eluru Govt Hospital",
    address: "Sanivarapupeta Road, Ashok Nagar, Eluru, Andhra Pradesh 534002",
    lat: 16.7080,
    lng: 81.1020,
    emergencyAvailable: true,
    contactNumber: "108 / 08812-230000",
    specialities: ["24/7 Casualty", "Maternity & NICU", "OPD Consultations", "Dialysis"],
    type: "District Headquarters Public Hospital"
  },
  {
    id: "hosp-apollo",
    name: "Apollo Reach Hospital",
    shortName: "Apollo Reach",
    address: "Sanivarapupeta, Near Railway Station, Eluru, Andhra Pradesh 534004",
    lat: 16.7125,
    lng: 81.0965,
    emergencyAvailable: true,
    contactNumber: "08812-245455",
    specialities: ["Cardiology", "Neurology", "Emergency & Critical Care"],
    type: "Multi-Speciality Hospital"
  },
  {
    id: "hosp-stjoseph",
    name: "St. Joseph's Hospital",
    shortName: "St. Joseph's",
    address: "Duggirala, Eluru Rural, Andhra Pradesh 534003",
    lat: 16.6950,
    lng: 81.0820,
    emergencyAvailable: false,
    contactNumber: "08812-223400",
    specialities: ["Dental & Oral Surgery", "General Health", "Dialysis"],
    type: "Charitable Community Hospital"
  },
  {
    id: "hosp-andhra",
    name: "Andhra Hospitals (Referral Hub)",
    shortName: "Andhra Hospitals",
    address: "Suryaraopet, Vijayawada (Direct Highway Connect via NH-16)",
    lat: 16.5062,
    lng: 80.6480,
    emergencyAvailable: true,
    contactNumber: "0866-2438888",
    specialities: ["Advanced Cardiac Care", "Pediatric Cardiac Surgery", "Organ Transplant"],
    type: "Regional Tertiary Referral Hospital"
  }
];

export const VILLAGES = [
  {
    id: "vil-denduluru",
    name: "Denduluru Village",
    nameTe: "దెందులూరు గ్రామం",
    district: "Eluru District",
    lat: 16.7580,
    lng: 81.1640,
    distanceToEluruKm: 12.0,
    roadType: "Rural Paved Road",
    primaryHealthCenter: "Denduluru PHC"
  },
  {
    id: "vil-pedavegi",
    name: "Pedavegi Village",
    nameTe: "పెదవేగి గ్రామం",
    district: "Eluru District",
    lat: 16.8120,
    lng: 81.1030,
    distanceToEluruKm: 14.5,
    roadType: "State Highway Feeder",
    primaryHealthCenter: "Pedavegi CHC"
  },
  {
    id: "vil-bhimadole",
    name: "Bhimadole Town",
    nameTe: "భీమడోలు",
    district: "Eluru District",
    lat: 16.8200,
    lng: 81.2700,
    distanceToEluruKm: 28.0,
    roadType: "NH-16 Corridor",
    primaryHealthCenter: "Bhimadole Rural Hospital"
  },
  {
    id: "vil-chintalapudi",
    name: "Chintalapudi",
    nameTe: "చింతలపూడి",
    district: "Eluru District",
    lat: 17.0600,
    lng: 80.9850,
    distanceToEluruKm: 48.0,
    roadType: "Inter-District Highway",
    primaryHealthCenter: "Chintalapudi Area Hospital"
  },
  {
    id: "vil-kovvali",
    name: "Kovvali Village",
    nameTe: "కొవ్వలి గ్రామం",
    district: "Eluru District",
    lat: 16.7610,
    lng: 81.0420,
    distanceToEluruKm: 10.5,
    roadType: "Gram Panchayat Road",
    primaryHealthCenter: "Kovvali Sub-Center"
  },
  {
    id: "vil-jangareddygudem",
    name: "Jangareddygudem",
    nameTe: "జంగారెడ్డిగూడెం",
    district: "Eluru District",
    lat: 17.1230,
    lng: 81.2940,
    distanceToEluruKm: 52.0,
    roadType: "Agency Feeder Highway",
    primaryHealthCenter: "Jangareddygudem Community Hospital"
  }
];

export const VEHICLE_CATEGORIES = [
  {
    id: "AUTO",
    name: "Healthcare Auto",
    nameTe: "ఆటో రిక్షా",
    subtitle: "Affordable & Quick for OPD visits",
    baseFare: 40,
    perKmRate: 10,
    capacity: "1-2 Patients",
    features: ["Low Fare", "Village Lane Friendly", "Quick Boarding"],
    suitableFor: "Routine checkups, blood tests, single passenger OPD visits"
  },
  {
    id: "CAR",
    name: "Economy Car (AC)",
    nameTe: "ఎకానమీ కారు",
    subtitle: "Comfortable transit for elderly patients",
    baseFare: 70,
    perKmRate: 13,
    capacity: "1-4 Passengers",
    features: ["Air Conditioned", "Cushioned Seating", "Elderly Comfort"],
    suitableFor: "Post-surgery recovery, senior citizens, family accompanied visits"
  },
  {
    id: "MEDICAL_VAN",
    name: "Medical Utility Van",
    nameTe: "మెడికల్ యుటిలిటీ వ్యాన్",
    subtitle: "Wheelchair accessible & foldable ramp",
    baseFare: 100,
    perKmRate: 16,
    capacity: "Up to 5 + Wheelchair",
    features: ["Wheelchair Ramp", "Wide Entry", "Luggage & Oxygen Space"],
    suitableFor: "Patients with limited mobility, orthopedic visits, wheelchair users"
  },
  {
    id: "AMBULANCE",
    name: "Emergency 108 Ambulance",
    nameTe: "108 అంబులెన్స్",
    subtitle: "Life-support assisted emergency transit",
    baseFare: 0,
    perKmRate: 0,
    capacity: "Paramedic + Patient + Attendant",
    features: ["Oxygen Cylinder", "Stretcher", "Paramedic on Board", "Siren Priority"],
    suitableFor: "Trauma, cardiac emergencies, respiratory distress, labor"
  }
];

export const DEMO_DRIVERS = [
  {
    id: "drv-prasad",
    name: "Prasad Rao",
    phone: "+91 98480 23114",
    vehicleType: "MEDICAL_VAN",
    vehicleName: "Tata Magic Eco-Van",
    vehicleNumber: "AP 37 BX 4821",
    serviceArea: "Eluru Rural & Denduluru",
    rating: 4.9,
    isOnline: true,
    isAvailable: true,
    currentLat: 16.7490,
    currentLng: 81.1520,
    totalTrips: 142,
    totalEarnings: 38400,
    badge: "Top Rated Medical Transit Partner"
  },
  {
    id: "drv-suresh",
    name: "Suresh Kumar",
    phone: "+91 94401 87652",
    vehicleType: "CAR",
    vehicleName: "Maruti Tour S (AC)",
    vehicleNumber: "AP 37 TY 1904",
    serviceArea: "Denduluru - Bhimadole Corridor",
    rating: 4.8,
    isOnline: true,
    isAvailable: true,
    currentLat: 16.7580,
    currentLng: 81.1640,
    totalTrips: 98,
    totalEarnings: 29500,
    badge: "Senior Citizen Friendly"
  },
  {
    id: "drv-venkat",
    name: "Venkat Ramana",
    phone: "+91 98665 44321",
    vehicleType: "AUTO",
    vehicleName: "Bajaj RE Passenger Auto",
    vehicleNumber: "AP 37 W 5520",
    serviceArea: "Pedavegi & Eluru Town",
    rating: 4.7,
    isOnline: true,
    isAvailable: true,
    currentLat: 16.8120,
    currentLng: 81.1030,
    totalTrips: 210,
    totalEarnings: 31800,
    badge: "Prompt Village Pickup"
  },
  {
    id: "drv-srinivas",
    name: "K. Srinivas",
    phone: "+91 99890 11234",
    vehicleType: "MEDICAL_VAN",
    vehicleName: "Force Traveller Patient Transit",
    vehicleNumber: "AP 37 Z 8831",
    serviceArea: "Chintalapudi Highway",
    rating: 4.9,
    isOnline: true,
    isAvailable: true,
    currentLat: 17.0600,
    currentLng: 80.9850,
    totalTrips: 85,
    totalEarnings: 42100,
    badge: "Long Distance Patient Transport"
  },
  {
    id: "drv-ambulance-108",
    name: "Mohan Das (Paramedic Driver)",
    phone: "+91 94901 08108",
    vehicleType: "AMBULANCE",
    vehicleName: "108 Basic Life Support Unit",
    vehicleNumber: "AP 37 G 0108",
    serviceArea: "Eluru District GGH Base",
    rating: 5.0,
    isOnline: true,
    isAvailable: true,
    currentLat: 16.7080,
    currentLng: 81.1020,
    totalTrips: 320,
    totalEarnings: 0,
    badge: "Govt 108 Emergency Protocol"
  }
];

export const DEMO_CUSTOMERS = [
  {
    id: "cust-ramesh",
    name: "Ramesh Naidu",
    phone: "+91 98492 88123",
    village: "Denduluru Village",
    villageId: "vil-denduluru",
    patientName: "Ramesh Naidu & Parvathi (Elderly Mother)",
    reason: "Orthopedic consultation & arthritis checkup",
    preferredHospitalId: "hosp-asram"
  },
  {
    id: "cust-lakshmi",
    name: "Lakshmi Devi",
    phone: "+91 98485 12001",
    village: "Pedavegi Village",
    villageId: "vil-pedavegi",
    patientName: "Lakshmi Devi (Age 62)",
    reason: "Monthly diabetic OPD review",
    preferredHospitalId: "hosp-ggh"
  },
  {
    id: "cust-satish",
    name: "Satish Varma",
    phone: "+91 94412 33455",
    village: "Bhimadole Town",
    villageId: "vil-bhimadole",
    patientName: "K. Appa Rao (Father)",
    reason: "Post-cardiac stent follow-up",
    preferredHospitalId: "hosp-apollo"
  }
];

// Helper to compute haversine distance
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

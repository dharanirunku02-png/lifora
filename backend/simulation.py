import math
import uuid
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any

from models import (
    Hospital, Village, Driver, Booking, BookingRequest, 
    AmbulanceRequest, Receipt, SimulationEvent, SimulationState
)

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two GPS coordinates in kilometers."""
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 1)

class LiforaSimulationEngine:
    def __init__(self):
        self.is_running = True
        self.sim_speed = 1.0
        self.sim_time = datetime(2026, 10, 27, 8, 30, 0)
        
        self.hospitals: Dict[str, Dict[str, Any]] = {
            "hosp-asram": {
                "id": "hosp-asram",
                "name": "Asram Medical College & Hospital",
                "short_name": "ASRAM Hospital",
                "address": "NH-16, Malkapuram, Eluru, Andhra Pradesh 534005",
                "lat": 16.7450,
                "lng": 81.1480,
                "emergency_available": True,
                "contact_number": "08812-288288",
                "specialities": ["General Medicine", "Cardiology", "Trauma Care", "Orthopedics", "Pediatrics"]
            },
            "hosp-ggh": {
                "id": "hosp-ggh",
                "name": "District Government General Hospital (GGH)",
                "short_name": "Eluru Govt Hospital",
                "address": "Sanivarapupeta Road, Ashok Nagar, Eluru, Andhra Pradesh 534002",
                "lat": 16.7080,
                "lng": 81.1020,
                "emergency_available": True,
                "contact_number": "108 / 08812-230000",
                "specialities": ["24/7 Casualty", "Maternity & NICU", "OPD", "Emergency Medicine"]
            },
            "hosp-apollo": {
                "id": "hosp-apollo",
                "name": "Apollo Reach Hospital",
                "short_name": "Apollo Reach",
                "address": "Sanivarapupeta, Near Railway Station, Eluru, Andhra Pradesh 534004",
                "lat": 16.7125,
                "lng": 81.0965,
                "emergency_available": True,
                "contact_number": "08812-245455",
                "specialities": ["Cardiology", "Neurology", "Emergency Care"]
            },
            "hosp-stjoseph": {
                "id": "hosp-stjoseph",
                "name": "St. Joseph's Hospital",
                "short_name": "St. Joseph's",
                "address": "Duggirala, Eluru Rural, Andhra Pradesh 534003",
                "lat": 16.6950,
                "lng": 81.0820,
                "emergency_available": False,
                "contact_number": "08812-223400",
                "specialities": ["Dental & Oral Surgery", "General Health", "Dialysis"]
            },
            "hosp-andhra": {
                "id": "hosp-andhra",
                "name": "Andhra Hospitals (Referral Hub)",
                "short_name": "Andhra Hospitals",
                "address": "Suryaraopet, Vijayawada (Connected via NH-16)",
                "lat": 16.5062,
                "lng": 80.6480,
                "emergency_available": True,
                "contact_number": "0866-2438888",
                "specialities": ["Advanced Cardiac Care", "Pediatric Surgery", "Organ Transplant"]
            }
        }

        self.villages: Dict[str, Dict[str, Any]] = {
            "vil-denduluru": {
                "id": "vil-denduluru",
                "name": "Denduluru Village",
                "name_te": "దెందులూరు గ్రామం",
                "district": "Eluru District",
                "lat": 16.7580,
                "lng": 81.1640,
                "distance_to_eluru_km": 12.0
            },
            "vil-pedavegi": {
                "id": "vil-pedavegi",
                "name": "Pedavegi Village",
                "name_te": "పెదవేగి గ్రామం",
                "district": "Eluru District",
                "lat": 16.8120,
                "lng": 81.1030,
                "distance_to_eluru_km": 14.5
            },
            "vil-bhimadole": {
                "id": "vil-bhimadole",
                "name": "Bhimadole Town",
                "name_te": "భీమడోలు",
                "district": "Eluru District",
                "lat": 16.8200,
                "lng": 81.2700,
                "distance_to_eluru_km": 28.0
            },
            "vil-chintalapudi": {
                "id": "vil-chintalapudi",
                "name": "Chintalapudi",
                "name_te": "చింతలపూడి",
                "district": "Eluru District",
                "lat": 17.0600,
                "lng": 80.9850,
                "distance_to_eluru_km": 48.0
            },
            "vil-kovvali": {
                "id": "vil-kovvali",
                "name": "Kovvali Village",
                "name_te": "కొవ్వలి గ్రామం",
                "district": "Eluru District",
                "lat": 16.7610,
                "lng": 81.0420,
                "distance_to_eluru_km": 10.5
            },
            "vil-jangareddygudem": {
                "id": "vil-jangareddygudem",
                "name": "Jangareddygudem",
                "name_te": "జంగారెడ్డిగూడెం",
                "district": "Eluru District",
                "lat": 17.1230,
                "lng": 81.2940,
                "distance_to_eluru_km": 52.0
            }
        }

        self.drivers: Dict[str, Driver] = {}
        self.bookings: Dict[str, Booking] = {}
        self.ambulance_requests: Dict[str, AmbulanceRequest] = {}
        self.receipts: Dict[str, Receipt] = {}
        self.events: List[SimulationEvent] = []

        self._seed_drivers()
        self._seed_initial_bookings()

    def _seed_drivers(self):
        drivers_data = [
            Driver(
                id="drv-prasad",
                name="Prasad Rao",
                phone="+91 98480 23114",
                vehicle_type="MEDICAL_VAN",
                vehicle_name="Tata Magic Eco-Van",
                vehicle_number="AP 37 BX 4821",
                service_area="Eluru Rural & Denduluru",
                rating=4.9,
                is_online=True,
                is_available=True,
                current_lat=16.7490,
                current_lng=81.1520,
                total_trips=142,
                total_earnings=38400.0
            ),
            Driver(
                id="drv-suresh",
                name="Suresh Kumar",
                phone="+91 94401 87652",
                vehicle_type="CAR",
                vehicle_name="Maruti Tour S (AC)",
                vehicle_number="AP 37 TY 1904",
                service_area="Denduluru - Bhimadole Corridor",
                rating=4.8,
                is_online=True,
                is_available=True,
                current_lat=16.7580,
                current_lng=81.1640,
                total_trips=98,
                total_earnings=29500.0
            ),
            Driver(
                id="drv-venkat",
                name="Venkat Ramana",
                phone="+91 98665 44321",
                vehicle_type="AUTO",
                vehicle_name="Bajaj RE Passenger Auto",
                vehicle_number="AP 37 W 5520",
                service_area="Pedavegi & Eluru Town",
                rating=4.7,
                is_online=True,
                is_available=True,
                current_lat=16.8120,
                current_lng=81.1030,
                total_trips=210,
                total_earnings=31800.0
            ),
            Driver(
                id="drv-srinivas",
                name="K. Srinivas",
                phone="+91 99890 11234",
                vehicle_type="MEDICAL_VAN",
                vehicle_name="Force Traveller Patient Transit",
                vehicle_number="AP 37 Z 8831",
                service_area="Chintalapudi Highway",
                rating=4.9,
                is_online=True,
                is_available=True,
                current_lat=17.0600,
                current_lng=80.9850,
                total_trips=85,
                total_earnings=42100.0
            ),
            Driver(
                id="drv-ambulance-108",
                name="Mohan Das (Paramedic Driver)",
                phone="+91 94901 08108",
                vehicle_type="AMBULANCE",
                vehicle_name="108 Basic Life Support Ambulance",
                vehicle_number="AP 37 G 0108",
                service_area="Eluru District GGH Base",
                rating=5.0,
                is_online=True,
                is_available=True,
                current_lat=16.7080,
                current_lng=81.1020,
                total_trips=320,
                total_earnings=0.0
            )
        ]
        for d in drivers_data:
            self.drivers[d.id] = d

    def _seed_initial_bookings(self):
        # 1 completed previous booking for history demonstration
        b1 = Booking(
            id="LFR-BK-1040",
            customer_name="Lakshmi Devi",
            patient_name="Lakshmi Devi (Age 62, Diabetic Checkup)",
            phone="+91 98485 12001",
            pickup_location="Pedavegi Village",
            pickup_lat=16.8120,
            pickup_lng=81.1030,
            destination_hospital_id="hosp-ggh",
            destination_hospital_name="District Government General Hospital (GGH)",
            destination_lat=16.7080,
            destination_lng=81.1020,
            preferred_time="07:00 AM",
            journey_type="one_way",
            vehicle_category="AUTO",
            passenger_count=2,
            needs_wheelchair=False,
            status="COMPLETED",
            driver_id="drv-venkat",
            driver_name="Venkat Ramana",
            driver_phone="+91 98665 44321",
            vehicle_name="Bajaj RE Passenger Auto",
            vehicle_number="AP 37 W 5520",
            distance_km=14.5,
            estimated_transit_min=26.0,
            fare_base=40.0,
            fare_distance=145.0,
            fare_assistance=0.0,
            fare_return=0.0,
            fare_total=185.0,
            payment_status="PAID_DEMO",
            created_at="07:00 AM",
            completed_at="07:35 AM",
            receipt_id="LFR-REC-1040",
            reminder_set=False,
            simulated_progress_pct=100.0
        )
        self.bookings[b1.id] = b1
        self._generate_receipt(b1)

        self.add_event(
            "INFO",
            "LIFORA Healthcare Transit System initialized in Eluru - West Godavari region.",
            severity="info"
        )
        self.add_event(
            "TRIP_COMPLETED",
            "Booking LFR-BK-1040 completed: Lakshmi Devi reached Eluru Govt Hospital safely.",
            booking_id="LFR-BK-1040",
            severity="success"
        )

    def calculate_fare(self, distance_km: float, vehicle_category: str, needs_wheelchair: bool, is_return: bool) -> Dict[str, float]:
        """Transparent, rule-based healthcare mobility fare calculator."""
        rates = {
            "AUTO": {"base": 40.0, "per_km": 10.0},
            "CAR": {"base": 70.0, "per_km": 13.0},
            "MEDICAL_VAN": {"base": 100.0, "per_km": 16.0},
            "AMBULANCE": {"base": 0.0, "per_km": 0.0}  # Free/Simulated emergency
        }
        cfg = rates.get(vehicle_category, rates["AUTO"])
        base = cfg["base"]
        distance_fare = round(distance_km * cfg["per_km"], 2)
        assistance_fee = 30.0 if needs_wheelchair else 0.0
        
        one_way_total = base + distance_fare + assistance_fee
        
        # Round trip receives 15% discount on return leg
        if is_return:
            return_fare = round(one_way_total * 0.85, 2)
            total = round(one_way_total + return_fare, 2)
        else:
            return_fare = 0.0
            total = round(one_way_total, 2)

        return {
            "base": base,
            "distance": distance_fare,
            "assistance": assistance_fee,
            "return_leg": return_fare,
            "total": total
        }

    def create_booking(self, req: BookingRequest) -> Booking:
        # Distance calculation
        dist = haversine_distance_km(req.pickup_lat, req.pickup_lng, req.destination_lat, req.destination_lng)
        if dist < 1.0:
            dist = 5.0
            
        fare = self.calculate_fare(
            dist, 
            req.vehicle_category, 
            req.needs_wheelchair, 
            req.journey_type == "return"
        )
        
        # Average rural transit speed: 32 km/h
        transit_min = round((dist / 32.0) * 60.0 + 5.0, 1)

        booking_id = f"LFR-BK-{1041 + len(self.bookings)}"
        
        booking = Booking(
            id=booking_id,
            customer_name=req.customer_name,
            patient_name=req.patient_name,
            phone=req.phone,
            pickup_location=req.pickup_location,
            pickup_lat=req.pickup_lat,
            pickup_lng=req.pickup_lng,
            destination_hospital_id=req.destination_hospital_id,
            destination_hospital_name=req.destination_hospital_name,
            destination_lat=req.destination_lat,
            destination_lng=req.destination_lng,
            preferred_time=req.preferred_time,
            journey_type=req.journey_type,
            return_time=req.return_time,
            vehicle_category=req.vehicle_category,
            passenger_count=req.passenger_count,
            needs_wheelchair=req.needs_wheelchair,
            status="REQUESTED",
            distance_km=dist,
            estimated_transit_min=transit_min,
            fare_base=fare["base"],
            fare_distance=fare["distance"],
            fare_assistance=fare["assistance"],
            fare_return=fare["return_leg"],
            fare_total=fare["total"],
            payment_status="PENDING_DEMO",
            created_at=self.get_time_string(),
            reminder_set=(req.journey_type == "return")
        )

        self.bookings[booking.id] = booking
        
        self.add_event(
            "RIDE_REQUEST",
            f"New {req.journey_type.replace('_', '-')} ride requested by {req.customer_name} from {req.pickup_location} to {req.destination_hospital_name} (₹{fare['total']}).",
            booking_id=booking.id,
            severity="info"
        )
        
        # Attempt auto-match
        self.match_driver_for_booking(booking.id)

        return booking

    def match_driver_for_booking(self, booking_id: str) -> Optional[Driver]:
        booking = self.bookings.get(booking_id)
        if not booking or booking.driver_id:
            return None

        # Find available drivers that match vehicle category or are versatile
        eligible_drivers = [
            d for d in self.drivers.values()
            if d.is_online and d.is_available and d.vehicle_type != "AMBULANCE"
        ]

        if not eligible_drivers:
            self.add_event(
                "INFO",
                f"No drivers currently available for {booking.id}. Placed in waiting queue.",
                booking_id=booking.id,
                severity="warning"
            )
            return None

        # Sort by distance to pickup
        eligible_drivers.sort(
            key=lambda d: haversine_distance_km(d.current_lat, d.current_lng, booking.pickup_lat, booking.pickup_lng)
        )

        best_driver = eligible_drivers[0]
        
        booking.driver_id = best_driver.id
        booking.driver_name = best_driver.name
        booking.driver_phone = best_driver.phone
        booking.vehicle_name = best_driver.vehicle_name
        booking.vehicle_number = best_driver.vehicle_number
        booking.status = "DRIVER_ASSIGNED"
        
        best_driver.is_available = False

        self.add_event(
            "DRIVER_ASSIGNED",
            f"Driver {best_driver.name} ({best_driver.vehicle_name}, {best_driver.vehicle_number}) assigned to booking {booking.id}.",
            booking_id=booking.id,
            severity="success"
        )

        return best_driver

    def accept_booking(self, booking_id: str, driver_id: Optional[str] = None) -> Booking:
        booking = self.bookings.get(booking_id)
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")

        if driver_id and driver_id in self.drivers:
            driver = self.drivers[driver_id]
            booking.driver_id = driver.id
            booking.driver_name = driver.name
            booking.driver_phone = driver.phone
            booking.vehicle_name = driver.vehicle_name
            booking.vehicle_number = driver.vehicle_number
            driver.is_available = False

        booking.status = "DRIVER_EN_ROUTE"
        booking.simulated_progress_pct = 25.0

        self.add_event(
            "DRIVER_ASSIGNED",
            f"Driver {booking.driver_name} accepted booking {booking.id} and is en route to {booking.pickup_location}.",
            booking_id=booking.id,
            severity="info"
        )
        return booking

    def advance_booking_status(self, booking_id: str, new_status: str) -> Booking:
        booking = self.bookings.get(booking_id)
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")

        valid_transitions = {
            "REQUESTED": ["DRIVER_ASSIGNED", "CANCELLED"],
            "DRIVER_ASSIGNED": ["DRIVER_EN_ROUTE", "CANCELLED"],
            "DRIVER_EN_ROUTE": ["ARRIVED_AT_PICKUP", "CANCELLED"],
            "ARRIVED_AT_PICKUP": ["PATIENT_PICKED_UP", "CANCELLED"],
            "PATIENT_PICKED_UP": ["REACHED_HOSPITAL"],
            "REACHED_HOSPITAL": ["COMPLETED"],
            "COMPLETED": []
        }

        booking.status = new_status
        
        if new_status == "ARRIVED_AT_PICKUP":
            booking.simulated_progress_pct = 40.0
            self.add_event(
                "DRIVER_ARRIVED",
                f"Driver {booking.driver_name} arrived at {booking.pickup_location} for patient {booking.patient_name}.",
                booking_id=booking.id,
                severity="info"
            )
        elif new_status == "PATIENT_PICKED_UP":
            booking.simulated_progress_pct = 60.0
            self.add_event(
                "PATIENT_PICKED_UP",
                f"Patient safely boarded {booking.vehicle_name}. In transit to {booking.destination_hospital_name}.",
                booking_id=booking.id,
                severity="info"
            )
        elif new_status == "REACHED_HOSPITAL":
            booking.simulated_progress_pct = 90.0
            self.add_event(
                "HOSPITAL_ARRIVAL",
                f"Vehicle arrived at {booking.destination_hospital_name} OPD entrance. Patient assisted.",
                booking_id=booking.id,
                severity="success"
            )
        elif new_status == "COMPLETED":
            self.complete_booking(booking_id)

        return booking

    def complete_booking(self, booking_id: str) -> Booking:
        booking = self.bookings.get(booking_id)
        if not booking:
            raise ValueError(f"Booking {booking_id} not found")

        booking.status = "COMPLETED"
        booking.payment_status = "PAID_DEMO"
        booking.completed_at = self.get_time_string()
        booking.simulated_progress_pct = 100.0

        # Free up driver and credit earnings
        if booking.driver_id and booking.driver_id in self.drivers:
            driver = self.drivers[booking.driver_id]
            driver.is_available = True
            driver.total_trips += 1
            driver.total_earnings += round(booking.fare_total * 0.82, 2)  # Driver receives 82%

        # Generate receipt
        receipt = self._generate_receipt(booking)
        booking.receipt_id = receipt.receipt_number

        self.add_event(
            "TRIP_COMPLETED",
            f"Trip {booking.id} completed. Receipt {receipt.receipt_number} generated (₹{booking.fare_total}).",
            booking_id=booking.id,
            severity="success"
        )

        return booking

    def _generate_receipt(self, booking: Booking) -> Receipt:
        receipt_no = f"LFR-REC-{booking.id.split('-')[-1]}"
        receipt = Receipt(
            receipt_number=receipt_no,
            booking_id=booking.id,
            customer_name=booking.customer_name,
            patient_name=booking.patient_name,
            driver_name=booking.driver_name or "Assigned Partner",
            vehicle_details=f"{booking.vehicle_name or 'Healthcare Vehicle'} ({booking.vehicle_number or 'AP 37 DEMO'})",
            pickup_location=booking.pickup_location,
            destination_hospital=booking.destination_hospital_name,
            trip_date=self.get_time_string(),
            distance_km=booking.distance_km,
            fare_breakdown={
                "base_fare": booking.fare_base,
                "distance_charge": booking.fare_distance,
                "assistance_fee": booking.fare_assistance,
                "return_journey_charge": booking.fare_return,
                "platform_tax_demo": 0.0
            },
            total_amount=booking.fare_total,
            payment_status=booking.payment_status,
            journey_type=booking.journey_type
        )
        self.receipts[receipt_no] = receipt
        self.receipts[booking.id] = receipt
        return receipt

    def create_ambulance_request(self, caller_name: str, phone: str, emergency_type: str, 
                                 pickup_location: str, pickup_lat: float, pickup_lng: float, 
                                 hospital_name: str) -> AmbulanceRequest:
        req_id = f"LFR-AMB-{101 + len(self.ambulance_requests)}"
        
        # Select 108 ambulance driver
        unit = "AP-108-ELURU-BASE-1"
        
        req = AmbulanceRequest(
            id=req_id,
            caller_name=caller_name,
            caller_phone=phone,
            emergency_type=emergency_type,
            pickup_location=pickup_location,
            pickup_lat=pickup_lat,
            pickup_lng=pickup_lng,
            destination_hospital=hospital_name,
            triage_priority="CRITICAL" if emergency_type in ["CARDIAC", "TRAUMA_ACCIDENT"] else "HIGH",
            assigned_unit=unit,
            status="TRIAGED",
            created_at=self.get_time_string(),
            simulated_progress_pct=20.0
        )
        self.ambulance_requests[req_id] = req

        self.add_event(
            "AMBULANCE_ALERT",
            f"EMERGENCY ASSISTANCE: {emergency_type} reported at {pickup_location}. Unit {unit} alert dispatched.",
            booking_id=req_id,
            severity="critical"
        )
        return req

    def advance_ambulance_status(self, request_id: str, new_status: str) -> AmbulanceRequest:
        req = self.ambulance_requests.get(request_id)
        if not req:
            raise ValueError(f"Ambulance request {request_id} not found")

        req.status = new_status
        progress_map = {
            "RECEIVED": 10.0,
            "TRIAGED": 25.0,
            "UNIT_ALERTED": 40.0,
            "AMBULANCE_EN_ROUTE": 60.0,
            "ON_SCENE": 80.0,
            "HOSPITAL_HANDOVER": 95.0,
            "RESOLVED": 100.0
        }
        req.simulated_progress_pct = progress_map.get(new_status, req.simulated_progress_pct)

        self.add_event(
            "AMBULANCE_ALERT",
            f"Ambulance {req.id} status updated to {new_status} for {req.pickup_location}.",
            booking_id=req.id,
            severity="warning" if new_status != "RESOLVED" else "success"
        )
        return req

    def add_event(self, event_type: str, message: str, booking_id: Optional[str] = None, severity: str = "info"):
        event = SimulationEvent(
            id=str(uuid.uuid4())[:8],
            timestamp=self.get_time_string(),
            type=event_type,
            message=message,
            booking_id=booking_id,
            severity=severity
        )
        self.events.insert(0, event)
        if len(self.events) > 50:
            self.events.pop()

    def tick(self, seconds_advanced: int = 15):
        if not self.is_running:
            return
            
        real_seconds = int(seconds_advanced * self.sim_speed)
        self.sim_time += timedelta(seconds=real_seconds)

        # Progress any en-route bookings
        for b in self.bookings.values():
            if b.status == "DRIVER_EN_ROUTE":
                b.simulated_progress_pct = min(40.0, b.simulated_progress_pct + 2.5 * self.sim_speed)
                if b.simulated_progress_pct >= 40.0:
                    self.advance_booking_status(b.id, "ARRIVED_AT_PICKUP")
            elif b.status == "PATIENT_PICKED_UP":
                b.simulated_progress_pct = min(90.0, b.simulated_progress_pct + 3.0 * self.sim_speed)
                if b.simulated_progress_pct >= 90.0:
                    self.advance_booking_status(b.id, "REACHED_HOSPITAL")

        # Progress active ambulance requests
        for a in self.ambulance_requests.values():
            if a.status in ["UNIT_ALERTED", "AMBULANCE_EN_ROUTE"]:
                a.simulated_progress_pct = min(80.0, a.simulated_progress_pct + 4.0 * self.sim_speed)
                if a.simulated_progress_pct >= 80.0 and a.status == "UNIT_ALERTED":
                    self.advance_ambulance_status(a.id, "AMBULANCE_EN_ROUTE")

    def execute_demo_step(self, step: int) -> Dict[str, Any]:
        """Deterministic 12-step Hackathon Demo Runner for presentation."""
        if step == 1:
            # Step 1: Initial state
            self.reset()
            return {"step": 1, "status": "Home baseline ready"}
            
        elif step == 2:
            # Step 2: Ramesh from Denduluru requests hospital ride
            req = BookingRequest(
                customer_name="Ramesh Naidu",
                patient_name="Ramesh Naidu & Parvathi (Elderly Mother)",
                phone="+91 98492 88123",
                pickup_location="Denduluru Village",
                pickup_lat=16.7580,
                pickup_lng=81.1640,
                destination_hospital_id="hosp-asram",
                destination_hospital_name="Asram Medical College & Hospital",
                destination_lat=16.7450,
                destination_lng=81.1480,
                preferred_time="09:00 AM",
                journey_type="one_way",
                vehicle_category="MEDICAL_VAN",
                passenger_count=2,
                needs_wheelchair=True
            )
            booking = self.create_booking(req)
            return {"step": 2, "booking_id": booking.id, "status": "Ride requested"}

        elif step == 3:
            # Step 3: Fare & AI estimate shown (already attached to latest booking)
            latest = list(self.bookings.values())[-1]
            return {"step": 3, "fare": latest.fare_total, "distance_km": latest.distance_km}

        elif step == 4:
            # Step 4: Driver match
            latest = list(self.bookings.values())[-1]
            driver = self.match_driver_for_booking(latest.id)
            return {"step": 4, "matched_driver": latest.driver_name}

        elif step == 5:
            # Step 5: Driver accepts
            latest = list(self.bookings.values())[-1]
            self.accept_booking(latest.id)
            return {"step": 5, "driver_status": "DRIVER_EN_ROUTE"}

        elif step == 6:
            # Step 6: Tracking & Arrival at pickup
            latest = list(self.bookings.values())[-1]
            self.advance_booking_status(latest.id, "ARRIVED_AT_PICKUP")
            return {"step": 6, "status": "Driver arrived at village"}

        elif step == 7:
            # Step 7: Patient picked up & Reached hospital
            latest = list(self.bookings.values())[-1]
            self.advance_booking_status(latest.id, "PATIENT_PICKED_UP")
            self.advance_booking_status(latest.id, "REACHED_HOSPITAL")
            self.complete_booking(latest.id)
            return {"step": 7, "status": "Hospital reached and trip completed"}

        elif step == 8:
            # Step 8: Receipt generated
            latest = list(self.bookings.values())[-1]
            rec = self.receipts.get(latest.id)
            return {"step": 8, "receipt_number": rec.receipt_number if rec else "LFR-REC-1041"}

        elif step == 9:
            # Step 9: Return journey booking demonstrated
            ret_req = BookingRequest(
                customer_name="Ramesh Naidu",
                patient_name="Ramesh Naidu (Return post-consultation)",
                phone="+91 98492 88123",
                pickup_location="Asram Medical College & Hospital",
                pickup_lat=16.7450,
                pickup_lng=81.1480,
                destination_hospital_id="vil-denduluru",
                destination_hospital_name="Denduluru Village (Return Home)",
                destination_lat=16.7580,
                destination_lng=81.1640,
                preferred_time="03:30 PM",
                journey_type="return",
                return_time="03:30 PM",
                vehicle_category="CAR",
                passenger_count=2,
                needs_wheelchair=False
            )
            ret_booking = self.create_booking(ret_req)
            return {"step": 9, "return_booking_id": ret_booking.id}

        elif step == 10:
            # Step 10: Ambulance emergency request demonstrated
            amb = self.create_ambulance_request(
                caller_name="Village Sarpanch Rao",
                phone="+91 98481 12345",
                emergency_type="CARDIAC",
                pickup_location="Chintalapudi Rural Primary Health Post",
                pickup_lat=17.0600,
                pickup_lng=80.9850,
                hospital_name="District Government General Hospital (GGH)"
            )
            return {"step": 10, "ambulance_id": amb.id}

        elif step == 11:
            # Step 11: Analytics summary
            return {"step": 11, "analytics": self.get_analytics()}

        elif step == 12:
            # Step 12: Startup pitch & mission recap
            return {
                "step": 12, 
                "mission": "LIFORA: Connecting Every Life to Care — 24/7 Affordable Healthcare Mobility for rural communities."
            }

        return {"step": step, "status": "ok"}

    def reset(self):
        self.bookings.clear()
        self.ambulance_requests.clear()
        self.receipts.clear()
        self.events.clear()
        self.sim_time = datetime(2026, 10, 27, 8, 30, 0)
        self._seed_drivers()
        self._seed_initial_bookings()

    def get_time_string(self) -> str:
        return self.sim_time.strftime("%I:%M %p")

    def get_analytics(self) -> Dict[str, Any]:
        total_fare = sum(b.fare_total for b in self.bookings.values() if b.status == "COMPLETED")
        return_count = sum(1 for b in self.bookings.values() if b.journey_type == "return")
        one_way_count = len(self.bookings) - return_count
        
        return {
            "total_bookings": len(self.bookings),
            "completed_trips": sum(1 for b in self.bookings.values() if b.status == "COMPLETED"),
            "active_rides": sum(1 for b in self.bookings.values() if b.status in ["DRIVER_EN_ROUTE", "ARRIVED_AT_PICKUP", "PATIENT_PICKED_UP"]),
            "pending_requests": sum(1 for b in self.bookings.values() if b.status == "REQUESTED"),
            "return_journeys": return_count,
            "one_way_journeys": one_way_count,
            "ambulance_requests": len(self.ambulance_requests),
            "total_fare_volume_inr": total_fare,
            "hourly_demand": [
                {"hour": "06:00", "rides": 3, "label": "Early Dialysis"},
                {"hour": "08:00", "rides": 14, "label": "OPD Rush"},
                {"hour": "10:00", "rides": 18, "label": "Specialist Consultations"},
                {"hour": "12:00", "rides": 8, "label": "Midday Appointments"},
                {"hour": "14:00", "rides": 16, "label": "Discharge & Return Rush"},
                {"hour": "16:00", "rides": 11, "label": "Evening Followups"},
                {"hour": "18:00", "rides": 6, "label": "Night Return Trips"}
            ],
            "vehicle_demand": [
                {"category": "Auto-Rickshaw", "count": 28, "pct": 42},
                {"category": "Economy Car", "count": 22, "pct": 33},
                {"category": "Medical Van", "count": 17, "pct": 25}
            ]
        }

    def get_state(self) -> Dict[str, Any]:
        analytics = self.get_analytics()
        available_drivers = sum(1 for d in self.drivers.values() if d.is_online and d.is_available and d.vehicle_type != "AMBULANCE")

        return {
            "sim_time": self.get_time_string(),
            "is_running": self.is_running,
            "sim_speed": self.sim_speed,
            "total_bookings": len(self.bookings),
            "active_rides": analytics["active_rides"],
            "available_drivers": available_drivers,
            "completed_trips": analytics["completed_trips"],
            "pending_requests": analytics["pending_requests"],
            "return_bookings_count": analytics["return_journeys"],
            "ambulance_requests_count": len(self.ambulance_requests),
            "avg_waiting_time_min": 6.8,
            "total_fare_volume_inr": analytics["total_fare_volume_inr"],
            "bookings": [b.model_dump() for b in self.bookings.values()],
            "drivers": [d.model_dump() for d in self.drivers.values()],
            "ambulance_requests": [a.model_dump() for a in self.ambulance_requests.values()],
            "events": [e.model_dump() for e in self.events[:25]],
            "hospitals": list(self.hospitals.values()),
            "villages": list(self.villages.values()),
            "analytics": analytics
        }

engine = LiforaSimulationEngine()

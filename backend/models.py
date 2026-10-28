from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Hospital(BaseModel):
    id: str
    name: str
    short_name: str
    address: str
    lat: float
    lng: float
    emergency_available: bool = True
    contact_number: str = "108 / 08812-230000"
    specialities: List[str] = Field(default_factory=list)

class Village(BaseModel):
    id: str
    name: str
    name_te: str
    district: str = "Eluru / West Godavari"
    lat: float
    lng: float
    distance_to_eluru_km: float

class Driver(BaseModel):
    id: str
    name: str
    phone: str
    vehicle_type: str  # "AUTO", "CAR", "MEDICAL_VAN", "AMBULANCE"
    vehicle_name: str
    vehicle_number: str
    service_area: str
    rating: float = 4.8
    is_online: bool = True
    is_available: bool = True
    current_lat: float
    current_lng: float
    total_trips: int = 0
    total_earnings: float = 0.0

class BookingRequest(BaseModel):
    customer_name: str
    patient_name: str
    phone: str
    pickup_location: str
    pickup_lat: float
    pickup_lng: float
    destination_hospital_id: str
    destination_hospital_name: str
    destination_lat: float
    destination_lng: float
    preferred_time: str = "Now"
    journey_type: str = "one_way"  # "one_way" or "return"
    return_time: Optional[str] = None
    vehicle_category: str = "AUTO"  # "AUTO", "CAR", "MEDICAL_VAN"
    passenger_count: int = 1
    needs_wheelchair: bool = False
    notes: Optional[str] = None

class Booking(BaseModel):
    id: str
    customer_name: str
    patient_name: str
    phone: str
    pickup_location: str
    pickup_lat: float
    pickup_lng: float
    destination_hospital_id: str
    destination_hospital_name: str
    destination_lat: float
    destination_lng: float
    preferred_time: str
    journey_type: str  # "one_way" or "return"
    return_time: Optional[str] = None
    vehicle_category: str
    passenger_count: int
    needs_wheelchair: bool
    status: str = "REQUESTED"  
    # "REQUESTED", "DRIVER_ASSIGNED", "DRIVER_EN_ROUTE", "ARRIVED_AT_PICKUP", "PATIENT_PICKED_UP", "REACHED_HOSPITAL", "COMPLETED", "CANCELLED"
    driver_id: Optional[str] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    vehicle_name: Optional[str] = None
    vehicle_number: Optional[str] = None
    distance_km: float
    estimated_transit_min: float
    fare_base: float
    fare_distance: float
    fare_assistance: float = 0.0
    fare_return: float = 0.0
    fare_total: float
    payment_status: str = "PENDING_DEMO"  # "ESTIMATED", "PENDING_DEMO", "PAID_DEMO", "CANCELLED"
    created_at: str
    completed_at: Optional[str] = None
    receipt_id: Optional[str] = None
    reminder_set: bool = False
    simulated_progress_pct: float = 0.0

class AmbulanceRequest(BaseModel):
    id: str
    caller_name: str
    caller_phone: str
    emergency_type: str  # "CARDIAC", "TRAUMA_ACCIDENT", "MATERNAL_LABOR", "RESPIRATORY", "GENERAL_CRITICAL"
    pickup_location: str
    pickup_lat: float
    pickup_lng: float
    destination_hospital: str
    triage_priority: str = "CRITICAL"  # "CRITICAL", "HIGH", "MODERATE"
    assigned_unit: Optional[str] = None
    status: str = "RECEIVED"  # "RECEIVED", "TRIAGED", "UNIT_ALERTED", "AMBULANCE_EN_ROUTE", "ON_SCENE", "HOSPITAL_HANDOVER", "RESOLVED"
    created_at: str
    simulated_progress_pct: float = 0.0

class Receipt(BaseModel):
    receipt_number: str
    booking_id: str
    customer_name: str
    patient_name: str
    driver_name: str
    vehicle_details: str
    pickup_location: str
    destination_hospital: str
    trip_date: str
    distance_km: float
    fare_breakdown: Dict[str, float]
    total_amount: float
    payment_status: str
    journey_type: str

class SimulationEvent(BaseModel):
    id: str
    timestamp: str
    type: str  # "RIDE_REQUEST", "DRIVER_ASSIGNED", "DRIVER_ARRIVED", "PATIENT_PICKED_UP", "HOSPITAL_ARRIVAL", "TRIP_COMPLETED", "RETURN_SCHEDULED", "AMBULANCE_ALERT", "INFO"
    message: str
    booking_id: Optional[str] = None
    severity: str = "info"  # "info", "warning", "critical", "success"

class SimulationState(BaseModel):
    sim_time: str
    is_running: bool
    sim_speed: float
    total_bookings: int
    active_rides: int
    available_drivers: int
    completed_trips: int
    pending_requests: int
    return_bookings_count: int
    ambulance_requests_count: int
    avg_waiting_time_min: float
    total_fare_volume_inr: float
    bookings: List[Booking]
    drivers: List[Driver]
    ambulance_requests: List[AmbulanceRequest]
    events: List[SimulationEvent]

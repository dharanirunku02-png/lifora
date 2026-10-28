import asyncio
from contextlib import asynccontextmanager
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from simulation import engine
from models import BookingRequest

# Background simulation runner
async def simulation_loop():
    while True:
        try:
            if engine.is_running:
                engine.tick(seconds_advanced=10)
            await asyncio.sleep(2.0)
        except Exception as e:
            print(f"Simulation loop tick error: {e}")
            await asyncio.sleep(2.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulation_loop())
    yield
    task.cancel()

app = FastAPI(
    title="LIFORA Healthcare Mobility API",
    description="24/7 Affordable Healthcare Transportation & Ambulance Booking System for Rural & Semi-Urban India",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class SpeedRequest(BaseModel):
    speed: float

class StatusUpdateRequest(BaseModel):
    status: str

class DriverAcceptRequest(BaseModel):
    driver_id: Optional[str] = None

class DriverAvailabilityRequest(BaseModel):
    is_online: bool
    is_available: bool

class DriverRegisterRequest(BaseModel):
    name: str
    phone: str
    vehicle_type: str
    vehicle_name: str
    vehicle_number: str
    service_area: str

class AmbulanceCreateRequest(BaseModel):
    caller_name: str
    caller_phone: str
    emergency_type: str
    pickup_location: str
    pickup_lat: float
    pickup_lng: float
    hospital_name: str

class DemoStepRequest(BaseModel):
    step: int

@app.get("/")
def read_root():
    return {
        "project": "LIFORA",
        "tagline": "Connecting Every Life to Care",
        "title": "24/7 Affordable Healthcare Transportation and Ambulance Booking System",
        "category": "Healthcare Mobility & Transportation Technology",
        "notice": "LIVE SIMULATION — SYNTHETIC DEMO DATA",
        "status": "online",
        "sim_time": engine.get_time_string()
    }

@app.get("/api/health")
def health():
    return {
        "status": "ok", 
        "service": "LIFORA Healthcare Transportation API",
        "sim_time": engine.get_time_string()
    }

@app.get("/api/simulation/state")
def get_simulation_state():
    return engine.get_state()

@app.post("/api/simulation/start")
def start_simulation():
    engine.is_running = True
    engine.add_event("INFO", "LIFORA Healthcare Transit simulation resumed.", severity="info")
    return {"status": "started", "is_running": True}

@app.post("/api/simulation/pause")
def pause_simulation():
    engine.is_running = False
    engine.add_event("INFO", "LIFORA simulation paused by dispatcher.", severity="info")
    return {"status": "paused", "is_running": False}

@app.post("/api/simulation/reset")
def reset_simulation():
    engine.reset()
    return {"status": "reset", "sim_time": engine.get_time_string()}

@app.post("/api/simulation/speed")
def set_simulation_speed(req: SpeedRequest):
    if req.speed not in [1.0, 2.0, 5.0]:
        raise HTTPException(status_code=400, detail="Speed must be 1.0, 2.0, or 5.0")
    engine.sim_speed = req.speed
    return {"status": "ok", "speed": engine.sim_speed}

@app.post("/api/simulation/demo-step")
def trigger_demo_step(req: DemoStepRequest):
    if not (1 <= req.step <= 12):
        raise HTTPException(status_code=400, detail="Demo step must be between 1 and 12")
    res = engine.execute_demo_step(req.step)
    return res

# Hospital & Village endpoints
@app.get("/api/hospitals")
def get_hospitals():
    return list(engine.hospitals.values())

@app.get("/api/villages")
def get_villages():
    return list(engine.villages.values())

# Booking Endpoints
@app.get("/api/bookings")
def get_bookings():
    return list(engine.bookings.values())

@app.post("/api/bookings")
def create_booking(req: BookingRequest):
    booking = engine.create_booking(req)
    return booking

@app.get("/api/bookings/{booking_id}")
def get_booking(booking_id: str):
    b = engine.bookings.get(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    return b

@app.post("/api/bookings/{booking_id}/accept")
def accept_booking(booking_id: str, req: Optional[DriverAcceptRequest] = None):
    try:
        driver_id = req.driver_id if req else None
        b = engine.accept_booking(booking_id, driver_id)
        return b
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/bookings/{booking_id}/status")
def update_booking_status(booking_id: str, req: StatusUpdateRequest):
    try:
        b = engine.advance_booking_status(booking_id, req.status)
        return b
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/bookings/{booking_id}/complete")
def complete_booking(booking_id: str):
    try:
        b = engine.complete_booking(booking_id)
        return b
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.post("/api/bookings/{booking_id}/cancel")
def cancel_booking(booking_id: str):
    b = engine.bookings.get(booking_id)
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found")
    b.status = "CANCELLED"
    b.payment_status = "CANCELLED"
    if b.driver_id and b.driver_id in engine.drivers:
        engine.drivers[b.driver_id].is_available = True
    engine.add_event("INFO", f"Booking {booking_id} cancelled by user.", booking_id=booking_id, severity="warning")
    return b

# Driver Endpoints
@app.get("/api/drivers")
def get_drivers():
    return list(engine.drivers.values())

@app.post("/api/drivers/register")
def register_driver(req: DriverRegisterRequest):
    from models import Driver
    new_id = f"drv-{len(engine.drivers) + 1}"
    driver = Driver(
        id=new_id,
        name=req.name,
        phone=req.phone,
        vehicle_type=req.vehicle_type,
        vehicle_name=req.vehicle_name,
        vehicle_number=req.vehicle_number,
        service_area=req.service_area,
        rating=5.0,
        is_online=True,
        is_available=True,
        current_lat=16.7107,
        current_lng=81.0952,
        total_trips=0,
        total_earnings=0.0
    )
    engine.drivers[new_id] = driver
    engine.add_event("INFO", f"New driver partner {driver.name} ({driver.vehicle_name}) registered in demo.", severity="info")
    return driver

@app.post("/api/drivers/{driver_id}/availability")
def set_driver_availability(driver_id: str, req: DriverAvailabilityRequest):
    driver = engine.drivers.get(driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    driver.is_online = req.is_online
    driver.is_available = req.is_available
    return driver

# Ambulance Request Endpoints
@app.post("/api/ambulance-requests")
def request_ambulance(req: AmbulanceCreateRequest):
    amb = engine.create_ambulance_request(
        req.caller_name,
        req.caller_phone,
        req.emergency_type,
        req.pickup_location,
        req.pickup_lat,
        req.pickup_lng,
        req.hospital_name
    )
    return amb

@app.post("/api/ambulance-requests/{request_id}/status")
def update_ambulance_status(request_id: str, req: StatusUpdateRequest):
    try:
        amb = engine.advance_ambulance_status(request_id, req.status)
        return amb
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# Receipt & Analytics
@app.get("/api/receipts/{booking_or_rec_id}")
def get_receipt(booking_or_rec_id: str):
    rec = engine.receipts.get(booking_or_rec_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Receipt not found")
    return rec

@app.get("/api/analytics")
def get_analytics():
    return engine.get_analytics()

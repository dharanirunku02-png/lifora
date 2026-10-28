// LIFORA In-Browser Client Simulation Engine
// Authoritative fallback and real-time simulator

import { HOSPITALS, VILLAGES, VEHICLE_CATEGORIES, DEMO_DRIVERS, calculateHaversineDistanceKm } from '../data/liforaData';

export class ClientSimulationEngine {
  constructor() {
    this.isRunning = true;
    this.simSpeed = 1.0;
    this.simTime = new Date(2026, 9, 27, 8, 30, 0); // 8:30 AM
    
    this.hospitals = [...HOSPITALS];
    this.villages = [...VILLAGES];
    this.drivers = JSON.parse(JSON.stringify(DEMO_DRIVERS));
    this.bookings = [];
    this.ambulanceRequests = [];
    this.receipts = {};
    this.events = [];

    this._seedInitialData();
  }

  _seedInitialData() {
    // 1 completed past trip for history
    const b1 = {
      id: "LFR-BK-1040",
      customerName: "Lakshmi Devi",
      patientName: "Lakshmi Devi (Age 62, Diabetic OPD Review)",
      phone: "+91 98485 12001",
      pickupLocation: "Pedavegi Village",
      pickupLat: 16.8120,
      pickupLng: 81.1030,
      destinationHospitalId: "hosp-ggh",
      destinationHospitalName: "District Government General Hospital (GGH)",
      destinationLat: 16.7080,
      destinationLng: 81.1020,
      preferredTime: "07:00 AM",
      journeyType: "one_way",
      vehicleCategory: "AUTO",
      passengerCount: 2,
      needsWheelchair: false,
      status: "COMPLETED",
      driverId: "drv-venkat",
      driverName: "Venkat Ramana",
      driverPhone: "+91 98665 44321",
      vehicleName: "Bajaj RE Passenger Auto",
      vehicleNumber: "AP 37 W 5520",
      distanceKm: 14.5,
      estimatedTransitMin: 26.0,
      fareBase: 40.0,
      fareDistance: 145.0,
      fareAssistance: 0.0,
      fareReturn: 0.0,
      fareTotal: 185.0,
      paymentStatus: "PAID_DEMO",
      createdAt: "07:00 AM",
      completedAt: "07:35 AM",
      receiptId: "LFR-REC-1040",
      reminderSet: false,
      simulatedProgressPct: 100.0
    };

    this.bookings.push(b1);
    this._generateReceipt(b1);

    this.addEvent("INFO", "LIFORA Healthcare Transit Network initialized in Eluru Rural region.", "info");
    this.addEvent("TRIP_COMPLETED", "Booking LFR-BK-1040 completed: Lakshmi Devi reached Eluru Govt Hospital safely.", "success", b1.id);
  }

  calculateFare(distanceKm, vehicleCategory, needsWheelchair = false, isReturn = false) {
    const rates = {
      AUTO: { base: 40, perKm: 10 },
      CAR: { base: 70, perKm: 13 },
      MEDICAL_VAN: { base: 100, perKm: 16 },
      AMBULANCE: { base: 0, perKm: 0 }
    };
    const cfg = rates[vehicleCategory] || rates.AUTO;
    const base = cfg.base;
    const distanceFare = Math.round(distanceKm * cfg.perKm * 10) / 10;
    const assistanceFee = needsWheelchair ? 30 : 0;
    const oneWayTotal = base + distanceFare + assistanceFee;

    let returnFare = 0;
    let total = oneWayTotal;
    if (isReturn) {
      returnFare = Math.round(oneWayTotal * 0.85); // 15% round trip discount
      total = oneWayTotal + returnFare;
    }

    return {
      base,
      distance: distanceFare,
      assistance: assistanceFee,
      returnLeg: returnFare,
      total: Math.round(total)
    };
  }

  createBooking(req) {
    let dist = calculateHaversineDistanceKm(
      req.pickupLat || 16.7580,
      req.pickupLng || 81.1640,
      req.destinationLat || 16.7450,
      req.destinationLng || 81.1480
    );
    if (!dist || dist < 1) dist = 6.5;

    const isReturn = req.journeyType === "return";
    const fare = this.calculateFare(dist, req.vehicleCategory || "AUTO", req.needsWheelchair, isReturn);
    const transitMin = Math.round((dist / 32) * 60 + 5);

    const bookingId = `LFR-BK-${1041 + this.bookings.length}`;

    const newBooking = {
      id: bookingId,
      customerName: req.customerName || "Patient Family",
      patientName: req.patientName || "Patient",
      phone: req.phone || "+91 98480 00000",
      pickupLocation: req.pickupLocation || "Denduluru Village",
      pickupLat: req.pickupLat || 16.7580,
      pickupLng: req.pickupLng || 81.1640,
      destinationHospitalId: req.destinationHospitalId || "hosp-asram",
      destinationHospitalName: req.destinationHospitalName || "Asram Medical College Hospital",
      destinationLat: req.destinationLat || 16.7450,
      destinationLng: req.destinationLng || 81.1480,
      preferredTime: req.preferredTime || "Immediate",
      journeyType: req.journeyType || "one_way",
      returnTime: req.returnTime || null,
      vehicleCategory: req.vehicleCategory || "AUTO",
      passengerCount: req.passengerCount || 1,
      needsWheelchair: !!req.needsWheelchair,
      status: "REQUESTED",
      driverId: null,
      driverName: null,
      driverPhone: null,
      vehicleName: null,
      vehicleNumber: null,
      distanceKm: dist,
      estimatedTransitMin: transitMin,
      fareBase: fare.base,
      fareDistance: fare.distance,
      fareAssistance: fare.assistance,
      fareReturn: fare.returnLeg,
      fareTotal: fare.total,
      paymentStatus: "PENDING_DEMO",
      createdAt: this.getTimeString(),
      completedAt: null,
      receiptId: null,
      reminderSet: isReturn,
      simulatedProgressPct: 0.0
    };

    this.bookings.push(newBooking);

    this.addEvent(
      "RIDE_REQUEST",
      `New ${newBooking.journeyType.replace('_', '-')} ride requested by ${newBooking.customerName} to ${newBooking.destinationHospitalName} (₹${fare.total}).`,
      "info",
      bookingId
    );

    // Auto match closest driver
    this.matchDriver(bookingId);

    return newBooking;
  }

  matchDriver(bookingId) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking || booking.driverId) return null;

    const available = this.drivers.filter(d => d.isOnline && d.isAvailable && d.vehicleType !== "AMBULANCE");
    if (available.length === 0) {
      this.addEvent("INFO", `No drivers available in corridor for booking ${bookingId}. Placed in queue.`, "warning", bookingId);
      return null;
    }

    // Sort by proximity
    available.sort((a, b) => {
      const d1 = calculateHaversineDistanceKm(a.currentLat, a.currentLng, booking.pickupLat, booking.pickupLng);
      const d2 = calculateHaversineDistanceKm(b.currentLat, b.currentLng, booking.pickupLat, booking.pickupLng);
      return d1 - d2;
    });

    const chosen = available[0];
    booking.driverId = chosen.id;
    booking.driverName = chosen.name;
    booking.driverPhone = chosen.phone;
    booking.vehicleName = chosen.vehicleName;
    booking.vehicleNumber = chosen.vehicleNumber;
    booking.status = "DRIVER_ASSIGNED";
    booking.simulatedProgressPct = 15.0;

    chosen.isAvailable = false;

    this.addEvent(
      "DRIVER_ASSIGNED",
      `Driver ${chosen.name} (${chosen.vehicleName}, ${chosen.vehicleNumber}) assigned to booking ${booking.id}.`,
      "success",
      booking.id
    );

    return chosen;
  }

  acceptBooking(bookingId, driverId = null) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    if (driverId) {
      const driver = this.drivers.find(d => d.id === driverId);
      if (driver) {
        booking.driverId = driver.id;
        booking.driverName = driver.name;
        booking.driverPhone = driver.phone;
        booking.vehicleName = driver.vehicleName;
        booking.vehicleNumber = driver.vehicleNumber;
        driver.isAvailable = false;
      }
    }

    booking.status = "DRIVER_EN_ROUTE";
    booking.simulatedProgressPct = 30.0;

    this.addEvent(
      "DRIVER_ASSIGNED",
      `Driver ${booking.driverName} accepted booking ${booking.id} and is en route to ${booking.pickupLocation}.`,
      "info",
      booking.id
    );

    return booking;
  }

  advanceBookingStatus(bookingId, newStatus) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = newStatus;

    if (newStatus === "ARRIVED_AT_PICKUP") {
      booking.simulatedProgressPct = 50.0;
      this.addEvent("DRIVER_ARRIVED", `Driver ${booking.driverName} arrived at ${booking.pickupLocation}.`, "info", booking.id);
    } else if (newStatus === "PATIENT_PICKED_UP") {
      booking.simulatedProgressPct = 70.0;
      this.addEvent("PATIENT_PICKED_UP", `Patient boarded ${booking.vehicleName}. In transit to ${booking.destinationHospitalName}.`, "info", booking.id);
    } else if (newStatus === "REACHED_HOSPITAL") {
      booking.simulatedProgressPct = 90.0;
      this.addEvent("HOSPITAL_ARRIVAL", `Vehicle arrived at ${booking.destinationHospitalName} OPD. Patient assisted.`, "success", booking.id);
    } else if (newStatus === "COMPLETED") {
      this.completeBooking(bookingId);
    }

    return booking;
  }

  completeBooking(bookingId) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = "COMPLETED";
    booking.paymentStatus = "PAID_DEMO";
    booking.completedAt = this.getTimeString();
    booking.simulatedProgressPct = 100.0;

    if (booking.driverId) {
      const d = this.drivers.find(drv => drv.id === booking.driverId);
      if (d) {
        d.isAvailable = true;
        d.totalTrips += 1;
        d.totalEarnings += Math.round(booking.fareTotal * 0.82);
      }
    }

    const receipt = this._generateReceipt(booking);
    booking.receiptId = receipt.receiptNumber;

    this.addEvent(
      "TRIP_COMPLETED",
      `Trip ${booking.id} completed. Official receipt ${receipt.receiptNumber} issued (₹${booking.fareTotal}).`,
      "success",
      booking.id
    );

    return booking;
  }

  cancelBooking(bookingId) {
    const booking = this.bookings.find(b => b.id === bookingId);
    if (!booking) return null;

    booking.status = "CANCELLED";
    booking.paymentStatus = "CANCELLED";

    if (booking.driverId) {
      const d = this.drivers.find(drv => drv.id === booking.driverId);
      if (d) d.isAvailable = true;
    }

    this.addEvent("INFO", `Booking ${bookingId} cancelled by customer.`, "warning", bookingId);
    return booking;
  }

  _generateReceipt(booking) {
    const receiptNo = `LFR-REC-${booking.id.split('-')[2] || Math.floor(Math.random() * 9000 + 1000)}`;
    const receipt = {
      receiptNumber: receiptNo,
      bookingId: booking.id,
      customerName: booking.customerName,
      patientName: booking.patientName,
      driverName: booking.driverName || "LIFORA Partner",
      vehicleDetails: `${booking.vehicleName || 'Healthcare Transit'} (${booking.vehicleNumber || 'AP 37 DEMO'})`,
      pickupLocation: booking.pickupLocation,
      destinationHospital: booking.destinationHospitalName,
      tripDate: this.getTimeString(),
      distanceKm: booking.distanceKm,
      fareBreakdown: {
        baseFare: booking.fareBase,
        distanceCharge: booking.fareDistance,
        assistanceFee: booking.fareAssistance,
        returnJourneyCharge: booking.fareReturn,
        platformFeeDemo: 0.0
      },
      totalAmount: booking.fareTotal,
      paymentStatus: booking.paymentStatus,
      journeyType: booking.journeyType
    };

    this.receipts[receiptNo] = receipt;
    this.receipts[booking.id] = receipt;
    return receipt;
  }

  createAmbulanceRequest(req) {
    const ambId = `LFR-AMB-${101 + this.ambulanceRequests.length}`;
    const amb = {
      id: ambId,
      callerName: req.callerName || "Village Resident",
      callerPhone: req.callerPhone || "+91 94901 08108",
      emergencyType: req.emergencyType || "CARDIAC",
      pickupLocation: req.pickupLocation || "Rural Health Post",
      pickupLat: req.pickupLat || 16.7580,
      pickupLng: req.pickupLng || 81.1640,
      destinationHospital: req.hospitalName || "District Government General Hospital (GGH)",
      triagePriority: ["CARDIAC", "TRAUMA_ACCIDENT"].includes(req.emergencyType) ? "CRITICAL" : "HIGH",
      assignedUnit: "AP-108-ELURU-BASE-1",
      status: "TRIAGED",
      createdAt: this.getTimeString(),
      simulatedProgressPct: 25.0
    };

    this.ambulanceRequests.push(amb);

    this.addEvent(
      "AMBULANCE_ALERT",
      `EMERGENCY ALERT: ${amb.emergencyType} at ${amb.pickupLocation}. AP 108 Unit dispatched.`,
      "critical",
      ambId
    );

    return amb;
  }

  advanceAmbulanceStatus(requestId, newStatus) {
    const req = this.ambulanceRequests.find(a => a.id === requestId);
    if (!req) return null;

    req.status = newStatus;
    const progressMap = {
      RECEIVED: 10,
      TRIAGED: 25,
      UNIT_ALERTED: 45,
      AMBULANCE_EN_ROUTE: 65,
      ON_SCENE: 85,
      HOSPITAL_HANDOVER: 95,
      RESOLVED: 100
    };
    req.simulatedProgressPct = progressMap[newStatus] || req.simulatedProgressPct;

    this.addEvent(
      "AMBULANCE_ALERT",
      `Ambulance ${req.id} status: ${newStatus} for ${req.pickupLocation}.`,
      newStatus === "RESOLVED" ? "success" : "warning",
      req.id
    );

    return req;
  }

  addEvent(type, message, severity = "info", bookingId = null) {
    const event = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: this.getTimeString(),
      type,
      message,
      bookingId,
      severity
    };
    this.events.unshift(event);
    if (this.events.length > 50) this.events.pop();
  }

  tick(seconds = 15) {
    if (!this.isRunning) return;

    const advancedMs = seconds * this.simSpeed * 1000;
    this.simTime = new Date(this.simTime.getTime() + advancedMs);

    // Progress en-route rides
    this.bookings.forEach(b => {
      if (b.status === "DRIVER_EN_ROUTE") {
        b.simulatedProgressPct = Math.min(50, b.simulatedProgressPct + 3 * this.simSpeed);
        if (b.simulatedProgressPct >= 50) {
          this.advanceBookingStatus(b.id, "ARRIVED_AT_PICKUP");
        }
      } else if (b.status === "PATIENT_PICKED_UP") {
        b.simulatedProgressPct = Math.min(90, b.simulatedProgressPct + 4 * this.simSpeed);
        if (b.simulatedProgressPct >= 90) {
          this.advanceBookingStatus(b.id, "REACHED_HOSPITAL");
        }
      }
    });

    // Progress active ambulance requests
    this.ambulanceRequests.forEach(a => {
      if (a.status === "UNIT_ALERTED" || a.status === "AMBULANCE_EN_ROUTE") {
        a.simulatedProgressPct = Math.min(85, a.simulatedProgressPct + 5 * this.simSpeed);
        if (a.simulatedProgressPct >= 65 && a.status === "UNIT_ALERTED") {
          this.advanceAmbulanceStatus(a.id, "AMBULANCE_EN_ROUTE");
        }
      }
    });
  }

  executeDemoStep(step) {
    if (step === 1) {
      this.reset();
      return { step: 1, status: "Baseline Initialized" };
    } else if (step === 2) {
      // Village customer requests ride
      const b = this.createBooking({
        customerName: "Ramesh Naidu",
        patientName: "Ramesh Naidu & Parvathi (Elderly Mother)",
        phone: "+91 98492 88123",
        pickupLocation: "Denduluru Village",
        pickupLat: 16.7580,
        pickupLng: 81.1640,
        destinationHospitalId: "hosp-asram",
        destinationHospitalName: "Asram Medical College & Hospital",
        destinationLat: 16.7450,
        destinationLng: 81.1480,
        preferredTime: "09:00 AM",
        journeyType: "one_way",
        vehicleCategory: "MEDICAL_VAN",
        passengerCount: 2,
        needsWheelchair: true
      });
      return { step: 2, bookingId: b.id };
    } else if (step === 3) {
      const latest = this.bookings[this.bookings.length - 1];
      return { step: 3, fare: latest?.fareTotal, distanceKm: latest?.distanceKm };
    } else if (step === 4) {
      const latest = this.bookings[this.bookings.length - 1];
      if (latest) this.matchDriver(latest.id);
      return { step: 4, driver: latest?.driverName };
    } else if (step === 5) {
      const latest = this.bookings[this.bookings.length - 1];
      if (latest) this.acceptBooking(latest.id);
      return { step: 5, status: "Driver En Route" };
    } else if (step === 6) {
      const latest = this.bookings[this.bookings.length - 1];
      if (latest) this.advanceBookingStatus(latest.id, "ARRIVED_AT_PICKUP");
      return { step: 6, status: "Driver Arrived at Village" };
    } else if (step === 7) {
      const latest = this.bookings[this.bookings.length - 1];
      if (latest) {
        this.advanceBookingStatus(latest.id, "PATIENT_PICKED_UP");
        this.advanceBookingStatus(latest.id, "REACHED_HOSPITAL");
        this.completeBooking(latest.id);
      }
      return { step: 7, status: "Hospital Reached & Completed" };
    } else if (step === 8) {
      const latest = this.bookings[this.bookings.length - 1];
      const rec = this.receipts[latest?.id];
      return { step: 8, receiptNumber: rec?.receiptNumber };
    } else if (step === 9) {
      // Book return ride
      const retBooking = this.createBooking({
        customerName: "Ramesh Naidu",
        patientName: "Ramesh Naidu (Return post-consultation)",
        phone: "+91 98492 88123",
        pickupLocation: "Asram Medical College & Hospital (OPD Gate)",
        pickupLat: 16.7450,
        pickupLng: 81.1480,
        destinationHospitalId: "vil-denduluru",
        destinationHospitalName: "Denduluru Village (Home)",
        destinationLat: 16.7580,
        destinationLng: 81.1640,
        preferredTime: "03:30 PM",
        journeyType: "return",
        returnTime: "03:30 PM",
        vehicleCategory: "CAR",
        passengerCount: 2,
        needsWheelchair: false
      });
      return { step: 9, returnBookingId: retBooking.id };
    } else if (step === 10) {
      const amb = this.createAmbulanceRequest({
        callerName: "Village Health Worker",
        callerPhone: "+91 98481 12345",
        emergencyType: "CARDIAC",
        pickupLocation: "Chintalapudi Primary Health Post",
        pickupLat: 17.0600,
        pickupLng: 80.9850,
        hospitalName: "District Government General Hospital (GGH)"
      });
      return { step: 10, ambulanceId: amb.id };
    } else if (step === 11) {
      return { step: 11, analytics: this.getAnalytics() };
    } else if (step === 12) {
      return {
        step: 12,
        mission: "LIFORA: Connecting Every Life to Care — 24/7 Affordable Healthcare Mobility for rural communities."
      };
    }
    return { step, status: "ok" };
  }

  reset() {
    this.bookings = [];
    this.ambulanceRequests = [];
    this.receipts = {};
    this.events = [];
    this.drivers = JSON.parse(JSON.stringify(DEMO_DRIVERS));
    this.simTime = new Date(2026, 9, 27, 8, 30, 0);
    this._seedInitialData();
  }

  getTimeString() {
    return this.simTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  getAnalytics() {
    const totalFare = this.bookings
      .filter(b => b.status === "COMPLETED")
      .reduce((sum, b) => sum + (b.fareTotal || 0), 0);

    const returnCount = this.bookings.filter(b => b.journeyType === "return").length;
    const completedCount = this.bookings.filter(b => b.status === "COMPLETED").length;
    const activeCount = this.bookings.filter(b =>
      ["DRIVER_EN_ROUTE", "ARRIVED_AT_PICKUP", "PATIENT_PICKED_UP"].includes(b.status)
    ).length;
    const pendingCount = this.bookings.filter(b => b.status === "REQUESTED").length;

    return {
      totalBookings: this.bookings.length,
      completedTrips: completedCount,
      activeRides: activeCount,
      pendingRequests: pendingCount,
      returnJourneys: returnCount,
      oneWayJourneys: this.bookings.length - returnCount,
      ambulanceRequests: this.ambulanceRequests.length,
      totalFareVolumeInr: totalFare,
      hourlyDemand: [
        { hour: "06:00", rides: 3, label: "Dialysis Transit" },
        { hour: "08:00", rides: 14, label: "OPD Morning Rush" },
        { hour: "10:00", rides: 18, label: "Specialist OPD" },
        { hour: "12:00", rides: 8, label: "Midday Consultations" },
        { hour: "14:00", rides: 16, label: "Discharge & Return Rush" },
        { hour: "16:00", rides: 11, label: "Evening Return" },
        { hour: "18:00", rides: 6, label: "Night Return Trips" }
      ],
      vehicleDemand: [
        { category: "Auto-Rickshaw", count: 28, pct: 42 },
        { category: "Economy Car", count: 22, pct: 33 },
        { category: "Medical Van", count: 17, pct: 25 }
      ]
    };
  }

  getState() {
    const analytics = this.getAnalytics();
    const availableDrivers = this.drivers.filter(d => d.isOnline && d.isAvailable && d.vehicleType !== "AMBULANCE").length;

    return {
      sim_time: this.getTimeString(),
      is_running: this.isRunning,
      sim_speed: this.simSpeed,
      total_bookings: this.bookings.length,
      active_rides: analytics.activeRides,
      available_drivers: availableDrivers,
      completed_trips: analytics.completedTrips,
      pending_requests: analytics.pendingRequests,
      return_bookings_count: analytics.returnJourneys,
      ambulance_requests_count: this.ambulanceRequests.length,
      avg_waiting_time_min: 6.8,
      total_fare_volume_inr: analytics.totalFareVolumeInr,
      bookings: [...this.bookings],
      drivers: [...this.drivers],
      ambulance_requests: [...this.ambulanceRequests],
      events: this.events.slice(0, 25),
      hospitals: this.hospitals,
      villages: this.villages,
      analytics
    };
  }
}

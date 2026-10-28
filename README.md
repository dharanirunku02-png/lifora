# LIFORA 🩺🚑
> **24/7 Affordable Healthcare Transportation and Ambulance Booking System**  
> *Connecting Every Life to Care — Bridging Rural & Small-Town Patients to City Hospitals*

[![Hackathon](https://img.shields.io/badge/Hackathon-HealthTech%20Startup%202026-teal.svg)](#)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.14-009688.svg)](https://fastapi.tiangolo.com/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%20%7C%20Tailwind-61DAFB.svg)](https://react.dev/)
[![Mapping](https://img.shields.io/badge/Mapping-Leaflet%20%7C%20OpenStreetMap-199900.svg)](https://leafletjs.com/)
[![Bilingual](https://img.shields.io/badge/Bilingual-English%20%26%20Telugu%20%28%E0%B0%A4%E0%B1%86%E0%B0%B2%E0%B1%81%E0%B0%97%E0%B1%81%29-indigo.svg)](#)

---

> [!IMPORTANT]
> **Startup Status & Simulation Notice**: **LIFORA** is presented as a student-led startup concept and interactive functional prototype. All ride requests, driver assignments, GPS locations, and payments are strictly simulated for demonstration purposes (`LIVE SIMULATION — SYNTHETIC DEMO DATA`). Real verified emergency helplines (**108**, **102**, **112** for Andhra Pradesh / India) are integrated with direct dial instructions for actual medical emergencies.

---

## 1. Startup Identity

- **Startup Name**: LIFORA
- **Tagline**: *"Connecting Every Life to Care"* (తెలుగు: *"ప్రతి ప్రాణాన్ని వైద్యానికి చేరుస్తోంది"*)
- **Project Title**: 24/7 Affordable Healthcare Transportation and Ambulance Booking System
- **Category**: Healthcare Mobility and Transportation Technology
- **Demonstration Region**: Eluru and West Godavari / Krishna district corridor, Andhra Pradesh, India.
- **Target Beneficiaries**:
  - Patients and middle-class families in rural villages and small towns.
  - Elderly individuals requiring slow boarding and wheelchair support.
  - Patients traveling for routine OPD consultations, dialysis, or diagnostic checkups.
  - Driver partners (Auto-rickshaws, Ambulatory cabs, Medical Utility Vans).
  - Hospitals and regional healthcare networks.

---

## 2. The Problem LIFORA Solves

Families in villages and small towns often need to travel 15–50 km to reach multi-speciality hospitals in nearby cities. They face persistent barriers:

1. **Inconvenient Public Transit**: Crowded buses are painful and exhausting for elderly, postoperative, or weak patients.
2. **Exorbitant Private Taxis**: Private cab operators charge inflated arbitrary rates to rural families with zero transparency.
3. **The "Stranded Return" Crisis**: Patients struggle to arrange transportation back home in late afternoons or evenings after long doctor consultations.
4. **Emergency Ambulance Delays**: Fragmented emergency contacts cause panic during sudden cardiac or trauma situations.
5. **Digital Literacy & Language Barriers**: Rural users struggle with complex English-only taxi apps that require excessive typing.

---

## 3. Core Solution & 3 Service Categories

LIFORA provides a unified healthcare transportation platform:

### A. Hospital Transportation (Outward Journey)
- Village/town pickup selection (Denduluru, Pedavegi, Bhimadole, Chintalapudi, Kovvali, Jangareddygudem).
- City destination hospital selection (Asram Medical College Hospital, Eluru District Govt Hospital, Apollo Reach, St. Joseph's).
- Vehicle categories: Healthcare Auto, Economy AC Car, Medical Utility Van (foldable wheelchair ramp).
- Transparent rule-based fare calculation (Base + Distance Rate + Wheelchair Assistance).
- Live 8-step journey tracking and family updates.

### B. Return Journey Booking (Guaranteed Transport Home)
- Dedicated return booking workflow to schedule transport home after consultation or discharge.
- Automatic origin/destination reversal with one click.
- **15% round-trip discount** applied to the return leg.
- Automated reminder within the prototype to keep patients relaxed.

### C. 24/7 Emergency Ambulance Assistance
- High-priority emergency assistance interface.
- Verified government helpline direct actions:
  - **108**: Free 24/7 Emergency Medical Response & Ambulance (Andhra Pradesh / EMRI).
  - **102**: Janani Shishu Suraksha Karyakram (Mother & Child transit).
  - **112**: National Unified Emergency Helpline.
- Emergency triage classification (Cardiac, Trauma, Maternal, Respiratory, Acute).
- Simulated ambulance dispatch state tracking (Received ➔ Triaged ➔ Unit Alerted ➔ En Route ➔ On Scene ➔ Hospital Handover).

---

## 4. User Roles & Dedicated Portals

LIFORA provides three distinct role interfaces switchable from the top navigation bar:

1. **Patient & Family Portal**:
   - Hospital ride booking wizard with speech recognition voice input.
   - Return journey scheduler with round-trip savings.
   - Active journey visual progress stepper.
   - "Share Journey with Family" modal generating simulated WhatsApp / SMS tracking links.
   - Official itemized bill receipt with print-to-PDF and copy details.

2. **Driver Partner Portal**:
   - Demo driver profile switcher (Prasad Rao, Suresh Kumar, Venkat Ramana).
   - Online / Offline availability toggle.
   - Incoming patient request queue with distance, payout, and patient assistance notes.
   - Ride lifecycle progression buttons (`Arrived at Pickup` ➔ `Patient Picked Up` ➔ `Reached Hospital` ➔ `Complete Ride & Issue Receipt`).
   - Earnings tracker (82% driver revenue share, eliminating middlemen commissions).

3. **Operations & Admin Dashboard**:
   - Comprehensive fleet monitoring across regional corridors.
   - Filterable bookings audit table (search by patient, village, or booking ID).
   - Scheduled return trips queue.
   - 108 emergency escalation logs.
   - OPD demand forecasting insights for corridor resource balancing.

---

## 5. Live Simulation Engine & Hackathon Demo

### Controls Bar
- **Simulation Clock**: Advances simulated OPD hours (e.g., 08:30 AM).
- **Playback Controls**: Resume, Pause, Reset, Speed multipliers (1x, 2x, 5x).
- **Quick Action Triggers**:
  - `+ Sample Village Ride`: Injects a realistic rural ride request.
  - `+ Emergency 108`: Simulates high-priority ambulance call.
  - `Advance Active Ride`: Steps current ride forward through pickup to completion.

### "RUN LIFORA HACKATHON DEMO" (12-Step Automated Sequence)
Click the prominent top-right button to run the full narrative presentation for judges:
- **Step 1**: Startup mission & regional healthcare baseline.
- **Step 2**: Ramesh Naidu from Denduluru village requests an assisted Medical Van to Asram Hospital.
- **Step 3**: Transparent fare calculation (Base ₹100 + ₹192 distance + ₹30 wheelchair assistance = ₹322).
- **Step 4**: System matches nearby partner driver Prasad Rao (Tata Magic, AP 37 BX 4821).
- **Step 5**: Driver accepts the request in Driver Portal.
- **Step 6**: Live visual progress tracking and family WhatsApp status sharing.
- **Step 7**: Safe hospital arrival at OPD Gate 1 and patient assistance.
- **Step 8**: Official itemized medical transit receipt generated with print/export option.
- **Step 9**: Return ride scheduled for 3:30 PM post-consultation with 15% discount.
- **Step 10**: Dedicated 24/7 Emergency 108 ambulance triage and dispatch flow.
- **Step 11**: Real-time mobility operations dashboard and Recharts analytics.
- **Step 12**: Startup pitch conclusion and social impact summary.

---

## 6. Architecture & Dual-Engine Design

```
┌─────────────────────────────────────────────────────────────┐
│             React 18 + Vite Frontend Application            │
│   (Tailwind CSS, Leaflet Maps, Recharts Analytics, i18n)    │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
     (REST Polling Sync)             (Offline Fallback)
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      FastAPI Backend         │ │  Client Simulation Engine  │
│      (Python 3.14)           │ │  (In-Browser Standalone)   │
│  - /api/bookings             │ │  - 100% Offline Capable    │
│  - /api/drivers              │ │  - Instant Zero-Setup Demo │
│  - /api/ambulance-requests   │ │  - State & Event Bus       │
│  - /api/simulation           │ └────────────────────────────┘
└──────────────────────────────┘
```

The application runs seamlessly **both with and without the backend**. If the Python FastAPI backend is started, state synchronizes authoritatively via REST APIs. If running in a browser-only static environment, the in-browser `ClientSimulationEngine` provides 100% full interactivity with zero degradation.

---

## 7. Quickstart Guide

### Option A: Run Full-Stack (Frontend + Backend)

#### 1. Start Python FastAPI Backend:
```powershell
cd swapsmart-japan\backend
python -m uvicorn main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

#### 2. Start Vite Frontend:
```powershell
cd swapsmart-japan\frontend
npm.cmd run dev
```
Open `http://localhost:5173` in your browser.

### Option B: Run Automated Backend Unit Tests:
```powershell
cd swapsmart-japan\backend
python -m unittest test_simulation.py
```

### Option C: Build Production Bundle:
```powershell
cd swapsmart-japan\frontend
npm.cmd run build
```

---

## 8. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Leaflet, OpenStreetMap.
- **Backend**: Python 3.14, FastAPI, Pydantic, Uvicorn, Asyncio.
- **Bilingual Engine**: Custom lightweight i18n dictionary (English + Telugu).
- **Accessibility**: Web Speech API (`SpeechRecognition`) for voice input with simulated fallback.

---

*LIFORA — Connecting Every Life to Care.*

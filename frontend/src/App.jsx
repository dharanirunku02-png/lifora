import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ControlsBar from './components/ControlsBar';
import HackathonDemoBar, { LIFORA_DEMO_STEPS } from './components/HackathonDemoBar';
import KpiCards from './components/KpiCards';
import LiforaMap from './components/LiforaMap';
import CustomerPortal from './components/CustomerPortal';
import DriverPortal from './components/DriverPortal';
import AdminPortal from './components/AdminPortal';
import AnalyticsSection from './components/AnalyticsSection';
import LiveEventsFeed from './components/LiveEventsFeed';
import AmbulanceModal from './components/AmbulanceModal';
import BillReceiptModal from './components/BillReceiptModal';
import FamilyShareModal from './components/FamilyShareModal';

import {
  fetchSimulationState,
  postStartSimulation,
  postPauseSimulation,
  postResetSimulation,
  postSetSpeed,
  postCreateBooking,
  postAcceptBooking,
  postUpdateBookingStatus,
  postCompleteBooking,
  postCancelBooking,
  postCreateAmbulance,
  postAdvanceAmbulance,
  postDemoStep,
  fallbackEngine
} from './api/client';

export default function App() {
  const [state, setState] = useState(fallbackEngine.getState());
  const [dataSource, setDataSource] = useState('checking...');
  const [currentRole, setCurrentRole] = useState('customer'); // 'customer', 'driver', 'admin'
  const [lang, setLang] = useState('en'); // 'en' or 'te'
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-asram');

  // Modals State
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceiptBooking, setSelectedReceiptBooking] = useState(null);
  const [isFamilyShareOpen, setIsFamilyShareOpen] = useState(false);
  const [selectedShareBooking, setSelectedShareBooking] = useState(null);

  // 12-Step Demo Runner
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoStep, setDemoStep] = useState(1);
  const demoTimerRef = useRef(null);

  // Polling loop for state sync (every 1.5s)
  useEffect(() => {
    let mounted = true;

    const interval = setInterval(async () => {
      // Local client tick if standalone
      if (dataSource === 'client' && state?.is_running) {
        fallbackEngine.tick(3);
      }

      try {
        const { data, source } = await fetchSimulationState();
        if (mounted) {
          setState(data);
          setDataSource(source);
        }
      } catch (err) {
        if (mounted) {
          fallbackEngine.tick(3);
          setState(fallbackEngine.getState());
          setDataSource('client');
        }
      }
    }, 1500);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [dataSource, state?.is_running]);

  // Handle Play/Pause
  const handleTogglePlay = async () => {
    if (state.is_running) {
      await postPauseSimulation();
    } else {
      await postStartSimulation();
    }
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Handle Reset
  const handleReset = async () => {
    if (demoTimerRef.current) clearInterval(demoTimerRef.current);
    setIsDemoMode(false);
    setDemoStep(1);
    await postResetSimulation();
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Handle Speed Change
  const handleSetSpeed = async (speed) => {
    await postSetSpeed(speed);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Create Booking
  const handleCreateBooking = async (req) => {
    await postCreateBooking(req);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Accept Booking
  const handleAcceptBooking = async (bookingId, driverId) => {
    await postAcceptBooking(bookingId, driverId);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Update Status
  const handleUpdateStatus = async (bookingId, status) => {
    await postUpdateBookingStatus(bookingId, status);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Complete Booking
  const handleCompleteBooking = async (bookingId) => {
    await postCompleteBooking(bookingId);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    await postCancelBooking(bookingId);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Create Ambulance Request
  const handleCreateAmbulance = async (req) => {
    await postCreateAmbulance(req);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Advance Ambulance Status
  const handleAdvanceAmbulanceStatus = async (requestId, status) => {
    await postAdvanceAmbulance(requestId, status);
    const { data } = await fetchSimulationState();
    setState(data);
  };

  // Quick Action Triggers
  const handleTriggerBooking = async () => {
    await postCreateBooking({
      customerName: "Srinivasa Rao",
      patientName: "Srinivasa Rao (Fever & Joint Swelling)",
      phone: "+91 98482 99881",
      pickupLocation: "Bhimadole Town",
      pickupLat: 16.8200,
      pickupLng: 81.2700,
      destinationHospitalId: "hosp-apollo",
      destinationHospitalName: "Apollo Reach Hospital",
      destinationLat: 16.7125,
      destinationLng: 81.0965,
      preferredTime: "Immediate",
      journeyType: "one_way",
      vehicleCategory: "CAR",
      passengerCount: 2,
      needsWheelchair: false
    });
    const { data } = await fetchSimulationState();
    setState(data);
  };

  const handleTriggerAmbulance = async () => {
    await postCreateAmbulance({
      callerName: "PHC Nurse Mary",
      callerPhone: "+91 94901 08108",
      emergencyType: "MATERNAL_LABOR",
      pickupLocation: "Pedavegi Village Health Center",
      pickupLat: 16.8120,
      pickupLng: 81.1030,
      hospitalName: "District Government General Hospital (GGH)"
    });
    const { data } = await fetchSimulationState();
    setState(data);
    setIsAmbulanceModalOpen(true);
  };

  const handleAdvanceActiveRide = async () => {
    const active = (state.bookings || []).find(b => 
      !['COMPLETED', 'CANCELLED'].includes(b.status)
    );
    if (!active) return;

    const transitions = {
      'REQUESTED': 'DRIVER_ASSIGNED',
      'DRIVER_ASSIGNED': 'DRIVER_EN_ROUTE',
      'DRIVER_EN_ROUTE': 'ARRIVED_AT_PICKUP',
      'ARRIVED_AT_PICKUP': 'PATIENT_PICKED_UP',
      'PATIENT_PICKED_UP': 'REACHED_HOSPITAL',
      'REACHED_HOSPITAL': 'COMPLETED'
    };

    const next = transitions[active.status];
    if (next === 'COMPLETED') {
      await handleCompleteBooking(active.id);
    } else if (next) {
      await handleUpdateStatus(active.id, next);
    }
  };

  // 12-Step Hackathon Demo Runner
  const handleRunDemo = () => {
    setIsDemoMode(true);
    setDemoStep(1);
    executeDemoStep(1);
  };

  const executeDemoStep = async (step) => {
    setDemoStep(step);
    await postDemoStep(step);
    
    // Automatically switch role views to illustrate story
    if (step === 1 || step === 2 || step === 3 || step === 6 || step === 9) {
      setCurrentRole('customer');
    } else if (step === 4 || step === 5 || step === 7) {
      setCurrentRole('driver');
    } else if (step === 10) {
      setIsAmbulanceModalOpen(true);
    } else if (step === 11) {
      setCurrentRole('admin');
      setIsAmbulanceModalOpen(false);
    }

    if (step === 8) {
      // Show receipt
      const latest = (state.bookings || [])[state.bookings.length - 1];
      if (latest) {
        setSelectedReceiptBooking(latest);
        setIsReceiptModalOpen(true);
      }
    } else {
      setIsReceiptModalOpen(false);
    }

    const { data } = await fetchSimulationState();
    setState(data);
  };

  const handleNextDemoStep = () => {
    if (demoStep < 12) {
      executeDemoStep(demoStep + 1);
    } else {
      executeDemoStep(1);
    }
  };

  const handleStopDemo = () => {
    setIsDemoMode(false);
    setDemoStep(1);
  };

  // Modals helpers
  const handleViewReceipt = (booking) => {
    setSelectedReceiptBooking(booking);
    setIsReceiptModalOpen(true);
  };

  const handleShareFamily = (booking) => {
    setSelectedShareBooking(booking);
    setIsFamilyShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-teal-500/30 selection:text-teal-200">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenAmbulanceModal={() => setIsAmbulanceModalOpen(true)}
        onRunDemo={handleRunDemo}
        lang={lang}
        onToggleLang={() => setLang(lang === 'en' ? 'te' : 'en')}
        isDemoActive={isDemoMode}
        dataSource={dataSource}
      />

      {/* 12-Step Guided Demo Bar (Sticky under header when demo is active) */}
      {isDemoMode && (
        <HackathonDemoBar
          currentStep={demoStep}
          totalSteps={12}
          onNext={handleNextDemoStep}
          onStop={handleStopDemo}
          onSelectStep={executeDemoStep}
        />
      )}

      {/* Simulation Controls Bar */}
      <ControlsBar
        state={state}
        dataSource={dataSource}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        onSetSpeed={handleSetSpeed}
        onTriggerBooking={handleTriggerBooking}
        onTriggerAmbulance={handleTriggerAmbulance}
        onAdvanceRide={handleAdvanceActiveRide}
        lang={lang}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top KPI Metrics Row */}
        <KpiCards state={state} lang={lang} />

        {/* Live Leaflet Map Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Healthcare Mobility Network & Hospital Route Tracker</span>
            </h4>
            <span className="text-[10px] font-mono text-teal-400">
              Eluru & Andhra Pradesh • OpenStreetMap Live
            </span>
          </div>

          <LiforaMap
            activeBookings={state.bookings || []}
            drivers={state.drivers || []}
            onSelectHospital={setSelectedHospitalId}
            selectedHospitalId={selectedHospitalId}
          />
        </div>

        {/* Dynamic Role Portal View */}
        <section className="pt-2">
          {currentRole === 'customer' && (
            <CustomerPortal
              bookings={state.bookings || []}
              drivers={state.drivers || []}
              onCreateBooking={handleCreateBooking}
              onCancelBooking={handleCancelBooking}
              onViewReceipt={handleViewReceipt}
              onShareFamily={handleShareFamily}
              lang={lang}
            />
          )}

          {currentRole === 'driver' && (
            <DriverPortal
              drivers={state.drivers || []}
              bookings={state.bookings || []}
              onAcceptBooking={handleAcceptBooking}
              onUpdateStatus={handleUpdateStatus}
              onCompleteBooking={handleCompleteBooking}
              onViewReceipt={handleViewReceipt}
              lang={lang}
            />
          )}

          {currentRole === 'admin' && (
            <AdminPortal
              bookings={state.bookings || []}
              drivers={state.drivers || []}
              ambulanceRequests={state.ambulance_requests || []}
              onViewReceipt={handleViewReceipt}
              lang={lang}
            />
          )}
        </section>

        {/* Operations Analytics & System Activity Feed */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
          <div className="lg:col-span-2">
            <AnalyticsSection analytics={state.analytics} />
          </div>

          <div>
            <LiveEventsFeed events={state.events || []} />
          </div>
        </section>

      </main>

      {/* Startup Footer & Pitch Summary */}
      <footer className="bg-slate-950 border-t border-slate-800 py-6 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-500 text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400 font-bold">
          <span>LIFORA: Connecting Every Life to Care</span>
          <span>•</span>
          <span>24/7 Affordable Healthcare Mobility Prototype</span>
          <span>•</span>
          <span>Eluru & Rural Andhra Pradesh</span>
        </div>
        <p className="text-[11px] max-w-2xl mx-auto text-slate-500">
          * This application is a student-led startup prototype and interactive simulation created for hackathon demonstration. It does not claim to operate an active commercial ambulance fleet or collect real hospital tariffs. In real medical emergencies, always dial 108 or 112 directly.
        </p>
      </footer>

      {/* Modals */}
      <AmbulanceModal
        isOpen={isAmbulanceModalOpen}
        onClose={() => setIsAmbulanceModalOpen(false)}
        ambulanceRequests={state.ambulance_requests || []}
        onRequestAmbulance={handleCreateAmbulance}
        onAdvanceAmbulanceStatus={handleAdvanceAmbulanceStatus}
        lang={lang}
      />

      <BillReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        booking={selectedReceiptBooking}
        receipt={state.receipts ? state.receipts[selectedReceiptBooking?.id] : null}
        lang={lang}
      />

      <FamilyShareModal
        isOpen={isFamilyShareOpen}
        onClose={() => setIsFamilyShareOpen(false)}
        booking={selectedShareBooking}
        lang={lang}
      />

    </div>
  );
}

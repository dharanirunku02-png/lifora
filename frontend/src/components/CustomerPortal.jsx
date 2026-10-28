import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Building2, 
  Clock, 
  Calendar, 
  Users, 
  HeartHandshake, 
  RotateCcw, 
  Mic, 
  MicOff, 
  CheckCircle2, 
  ChevronRight, 
  AlertCircle, 
  Receipt, 
  Share2, 
  ShieldCheck, 
  Phone, 
  Info,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';
import { HOSPITALS, VILLAGES, VEHICLE_CATEGORIES, DEMO_CUSTOMERS, calculateHaversineDistanceKm } from '../data/liforaData';
import { translations } from '../i18n/translations';

export default function CustomerPortal({
  bookings = [],
  drivers = [],
  onCreateBooking,
  onCancelBooking,
  onViewReceipt,
  onShareFamily,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;

  const [activeTab, setActiveTab] = useState('book'); // 'book', 'return', 'history'
  
  // Booking Form State
  const [selectedVillageId, setSelectedVillageId] = useState('vil-denduluru');
  const [customPickup, setCustomPickup] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('hosp-asram');
  const [departureTimeType, setDepartureTimeType] = useState('immediate');
  const [scheduledTime, setScheduledTime] = useState('09:30 AM');
  const [journeyType, setJourneyType] = useState('one_way'); // 'one_way' or 'return'
  const [returnTime, setReturnTime] = useState('03:30 PM');
  const [vehicleCategory, setVehicleCategory] = useState('MEDICAL_VAN');
  const [passengerCount, setPassengerCount] = useState(2);
  const [needsWheelchair, setNeedsWheelchair] = useState(true);
  const [customerName, setCustomerName] = useState('Ramesh Naidu');
  const [patientName, setPatientName] = useState('Ramesh Naidu & Parvathi (Elderly Mother)');
  const [phone, setPhone] = useState('+91 98492 88123');

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);

  // Active Booking
  const activeBooking = bookings.find(b => 
    !['COMPLETED', 'CANCELLED'].includes(b.status)
  ) || bookings[bookings.length - 1];

  // Selected points coordinates
  const currentVillage = VILLAGES.find(v => v.id === selectedVillageId) || VILLAGES[0];
  const currentHospital = HOSPITALS.find(h => h.id === selectedHospitalId) || HOSPITALS[0];

  const pickupLat = currentVillage.lat;
  const pickupLng = currentVillage.lng;
  const pickupLabel = customPickup.trim() || currentVillage.name;

  const destinationLat = currentHospital.lat;
  const destinationLng = currentHospital.lng;
  const destinationLabel = currentHospital.name;

  const estimatedDistance = calculateHaversineDistanceKm(pickupLat, pickupLng, destinationLat, destinationLng) || 12.0;

  // Real-time Fare Calculation
  const vehicleConfig = VEHICLE_CATEGORIES.find(v => v.id === vehicleCategory) || VEHICLE_CATEGORIES[0];
  const baseFare = vehicleConfig.baseFare;
  const distanceFare = Math.round(estimatedDistance * vehicleConfig.perKmRate);
  const assistanceFee = needsWheelchair ? 30 : 0;
  const oneWayTotal = baseFare + distanceFare + assistanceFee;
  const returnLegFare = (journeyType === 'return' || activeTab === 'return') ? Math.round(oneWayTotal * 0.85) : 0;
  const totalFare = oneWayTotal + returnLegFare;

  // Quick preset patient filler
  const handleSelectDemoPatient = (patient) => {
    setCustomerName(patient.name);
    setPatientName(patient.patientName);
    setPhone(patient.phone);
    setSelectedVillageId(patient.villageId);
    setSelectedHospitalId(patient.preferredHospitalId);
    setCustomPickup('');
  };

  // Swap pickup & destination for return trip
  const handleSwapLocations = () => {
    setActiveTab('return');
    setJourneyType('return');
  };

  // Web Speech API Integration
  const handleToggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(t.voiceNotSupported);
      // Simulate speech input for demo resilience
      setTimeout(() => {
        setCustomPickup('Denduluru Village Main Road');
        setSpeechError(null);
      }, 1200);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'te' ? 'te-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setCustomPickup(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setSpeechError("Could not capture audio. Using village preset.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setCustomPickup('Denduluru Village Primary Health Center');
    }
  };

  const handleSubmitBooking = (e) => {
    e.preventDefault();
    const finalJourneyType = activeTab === 'return' ? 'return' : journeyType;
    
    onCreateBooking({
      customerName,
      patientName,
      phone,
      pickupLocation: activeTab === 'return' ? `${currentHospital.shortName} (OPD Gate)` : pickupLabel,
      pickupLat: activeTab === 'return' ? destinationLat : pickupLat,
      pickupLng: activeTab === 'return' ? destinationLng : pickupLng,
      destinationHospitalId: activeTab === 'return' ? currentVillage.id : currentHospital.id,
      destinationHospitalName: activeTab === 'return' ? `${currentVillage.name} (Return Home)` : destinationLabel,
      destinationLat: activeTab === 'return' ? pickupLat : destinationLat,
      destinationLng: activeTab === 'return' ? pickupLng : destinationLng,
      preferredTime: departureTimeType === 'immediate' ? 'Immediate' : scheduledTime,
      journeyType: finalJourneyType,
      returnTime: finalJourneyType === 'return' ? returnTime : null,
      vehicleCategory,
      passengerCount: Number(passengerCount),
      needsWheelchair
    });

    setActiveTab('history');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Portal Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('book'); setJourneyType('one_way'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'book'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>{t.bookHospitalRide}</span>
          </button>

          <button
            onClick={() => { setActiveTab('return'); setJourneyType('return'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'return'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.returnJourneyTab}</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full ml-1">
              15% OFF
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{t.myBookings}</span>
            <span className="font-mono text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-teal-300 ml-1">
              {bookings.length}
            </span>
          </button>
        </div>

        {/* Demo Patient Fast Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
            Demo Profiles:
          </span>
          {DEMO_CUSTOMERS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectDemoPatient(c)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-medium border border-slate-700 transition-all truncate max-w-[140px]"
              title={`Switch to ${c.name} (${c.village})`}
            >
              {c.name.split(' ')[0]} ({c.village.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'history' ? (
        /* History & Active Tracker View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Active Live Ride Tracker */}
          <div className="lg:col-span-2 space-y-6">
            {activeBooking ? (
              <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 px-4 py-1.5 bg-teal-500/20 border-b border-l border-teal-500/30 rounded-bl-xl text-teal-300 text-xs font-mono font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                  <span>{activeBooking.status.replace(/_/g, ' ')}</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">
                      {t.journeyTracker}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Booking #{activeBooking.id} • {activeBooking.journeyType === 'return' ? 'Round-Trip / Return' : 'One-Way Transit'}
                    </p>
                  </div>
                </div>

                {/* 8-Step Visual Stepper */}
                <div className="py-4">
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-center text-[10px]">
                    {[
                      { key: 'REQUESTED', label: t.stepRequested },
                      { key: 'DRIVER_ASSIGNED', label: t.stepAssigned },
                      { key: 'DRIVER_EN_ROUTE', label: t.stepEnRoute },
                      { key: 'ARRIVED_AT_PICKUP', label: t.stepArrived },
                      { key: 'PATIENT_PICKED_UP', label: t.stepPickedUp },
                      { key: 'REACHED_HOSPITAL', label: t.stepReachedHospital },
                      { key: 'COMPLETED', label: t.stepCompleted }
                    ].map((st, i) => {
                      const statuses = [
                        'REQUESTED', 'DRIVER_ASSIGNED', 'DRIVER_EN_ROUTE', 
                        'ARRIVED_AT_PICKUP', 'PATIENT_PICKED_UP', 'REACHED_HOSPITAL', 'COMPLETED'
                      ];
                      const currIdx = statuses.indexOf(activeBooking.status);
                      const isPast = currIdx >= i;
                      const isCurrent = currIdx === i;

                      return (
                        <div key={st.key} className="flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs transition-all ${
                              isCurrent
                                ? 'bg-teal-400 text-slate-950 ring-4 ring-teal-400/20 shadow-lg shadow-teal-400/30'
                                : isPast
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            {isPast && !isCurrent ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                          </div>
                          <span className={`mt-1.5 font-medium leading-tight ${isCurrent ? 'text-teal-300 font-bold' : isPast ? 'text-slate-300' : 'text-slate-600'}`}>
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Trip Route Details */}
                <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Pickup Origin
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>{activeBooking.pickupLocation}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Destination Hospital
                    </span>
                    <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{activeBooking.destinationHospitalName}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Patient Details
                    </span>
                    <p className="text-xs text-slate-200 mt-0.5 font-medium">
                      {activeBooking.patientName} • {activeBooking.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Assigned Driver & Vehicle
                    </span>
                    <p className="text-xs text-teal-300 mt-0.5 font-bold">
                      {activeBooking.driverName || 'Matching nearby partner...'} 
                      {activeBooking.vehicleNumber && ` (${activeBooking.vehicleNumber})`}
                    </p>
                  </div>
                </div>

                {/* Actions: Family Share & View Receipt */}
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onShareFamily(activeBooking)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold transition-all"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t.shareWithFamily}</span>
                    </button>

                    <button
                      onClick={() => onViewReceipt(activeBooking)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                    >
                      <Receipt className="w-3.5 h-3.5 text-teal-400" />
                      <span>{t.viewBillReceipt}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-white">
                      ₹{activeBooking.fareTotal}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {activeBooking.paymentStatus}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
                <Car className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No Active Rides Right Now</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Book a hospital ride from your village or schedule a return journey home.
                </p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="mt-4 px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20"
                >
                  Book New Ride
                </button>
              </div>
            )}
          </div>

          {/* Right Col: Booking History List */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-teal-400" />
              <span>Past & Scheduled Bookings ({bookings.length})</span>
            </h4>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onViewReceipt(b)}
                  className="bg-slate-900/80 border border-slate-800 hover:border-teal-500/40 rounded-xl p-3.5 cursor-pointer transition-all hover:bg-slate-850 group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-mono font-bold text-teal-400">
                      {b.id}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      b.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : b.status === 'CANCELLED'
                        ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}>
                      {b.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-white truncate">
                    {b.pickupLocation} ➔ {b.destinationHospitalName}
                  </p>
                  
                  <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                    <span>{b.createdAt}</span>
                    <span className="font-mono font-bold text-slate-200">₹{b.fareTotal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Booking / Return Ride Form View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Interactive Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitBooking} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
              
              {/* Header inside Form */}
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  {activeTab === 'return' ? (
                    <>
                      <RotateCcw className="w-5 h-5 text-teal-400" />
                      <span>{t.returnSectionTitle}</span>
                    </>
                  ) : (
                    <>
                      <Car className="w-5 h-5 text-teal-400" />
                      <span>{t.bookHospitalRide}</span>
                    </>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeTab === 'return' ? t.returnSectionDesc : t.bookSubtitle}
                </p>
              </div>

              {/* Location Input Section */}
              <div className="space-y-4">
                
                {/* Pickup Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" />
                      <span>{activeTab === 'return' ? t.returnPickup : t.pickupLocation}</span>
                    </label>

                    {/* Voice Assistant Button */}
                    <button
                      type="button"
                      onClick={handleToggleVoiceInput}
                      className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border transition-all ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30'
                      }`}
                      title="Speak pickup location in English or Telugu"
                    >
                      {isListening ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-teal-400" />}
                      <span>{isListening ? 'Listening...' : t.voiceSearch}</span>
                    </button>
                  </div>

                  {activeTab === 'return' ? (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-teal-300 font-bold flex items-center justify-between">
                      <span>{currentHospital.name} (Hospital OPD / Discharge Gate)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Original Hospital</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={selectedVillageId}
                        onChange={(e) => {
                          setSelectedVillageId(e.target.value);
                          setCustomPickup('');
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors font-medium"
                      >
                        {VILLAGES.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.nameTe}) — ~{v.distanceToEluruKm} km from Eluru
                          </option>
                        ))}
                      </select>

                      <div className="relative">
                        <input
                          type="text"
                          value={customPickup}
                          onChange={(e) => setCustomPickup(e.target.value)}
                          placeholder={t.pickupPlaceholder}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  {speechError && (
                    <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{speechError}</span>
                    </p>
                  )}
                </div>

                {/* Swap / Route Icon */}
                <div className="flex justify-center -my-1">
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-teal-400 border border-slate-700 shadow-md transition-all hover:rotate-180"
                    title="Swap for return journey"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Destination Hospital Field */}
                <div>
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeTab === 'return' ? t.returnDestination : t.destinationHospital}</span>
                  </label>

                  {activeTab === 'return' ? (
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-teal-300 font-bold flex items-center justify-between">
                      <span>{currentVillage.name} ({currentVillage.nameTe})</span>
                      <span className="text-[10px] text-slate-500 font-normal">Village Home</span>
                    </div>
                  ) : (
                    <select
                      value={selectedHospitalId}
                      onChange={(e) => setSelectedHospitalId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors font-medium"
                    >
                      {HOSPITALS.map((h) => (
                        <option key={h.id} value={h.id}>
                          {h.name} — {h.address.split(',')[0]}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

              </div>

              {/* Timing & Journey Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {t.preferredTime}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDepartureTimeType('immediate')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        departureTimeType === 'immediate'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t.nowImmediate}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepartureTimeType('scheduled')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        departureTimeType === 'scheduled'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      Schedule Later
                    </button>
                  </div>
                  {departureTimeType === 'scheduled' && (
                    <input
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-2 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    {t.journeyType}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setJourneyType('one_way')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        journeyType === 'one_way' && activeTab !== 'return'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      One-Way
                    </button>
                    <button
                      type="button"
                      onClick={() => setJourneyType('return')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        journeyType === 'return' || activeTab === 'return'
                          ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      Round-Trip (-15%)
                    </button>
                  </div>
                  {(journeyType === 'return' || activeTab === 'return') && (
                    <div className="mt-2">
                      <span className="text-[10px] text-teal-400 font-semibold block mb-0.5">
                        Expected Return Departure Time
                      </span>
                      <input
                        type="time"
                        value={returnTime}
                        onChange={(e) => setReturnTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Patient Details & Accessibility */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Passengers
                    </label>
                    <select
                      value={passengerCount}
                      onChange={(e) => setPassengerCount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                    >
                      <option value="1">1 (Patient alone)</option>
                      <option value="2">2 (Patient + 1 Attendant)</option>
                      <option value="3">3 (Patient + 2 Family members)</option>
                      <option value="4">4+ (Family accompanied)</option>
                    </select>
                  </div>
                </div>

                {/* Assisted Boarding Checkbox */}
                <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer hover:border-teal-500/30 transition-all">
                  <input
                    type="checkbox"
                    checked={needsWheelchair}
                    onChange={(e) => setNeedsWheelchair(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-500 focus:ring-0 focus:outline-none"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">
                      {t.elderlyWheelchairAssistance}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Driver will assist with folding wheelchair, slow boarding, and hospital OPD trolley entry.
                    </span>
                  </div>
                </label>
              </div>

              {/* Vehicle Category Selector */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 block">
                  {t.vehicleType}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {VEHICLE_CATEGORIES.filter(v => v.id !== 'AMBULANCE').map((vc) => (
                    <button
                      key={vc.id}
                      type="button"
                      onClick={() => setVehicleCategory(vc.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        vehicleCategory === vc.id
                          ? 'bg-teal-500/15 border-teal-400 text-white shadow-md shadow-teal-500/10'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-white">{vc.name}</span>
                        <span className="text-[10px] font-mono text-teal-300 font-bold">₹{vc.baseFare} base</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{vc.subtitle}</p>
                      <div className="mt-2 text-[10px] text-slate-500 font-medium">
                        ₹{vc.perKmRate}/km • {vc.capacity}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-teal-500/20 transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {activeTab === 'return' ? t.confirmReturnBooking : t.confirmBooking} — ₹{totalFare}
                </span>
              </button>

            </form>
          </div>

          {/* Right Col: Transparent Fare Breakdown Card */}
          <div className="space-y-4">
            
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-slate-800 pb-3">
                <Receipt className="w-4 h-4 text-teal-400" />
                <span>{t.fareBreakdown}</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Estimated Distance</span>
                  <span className="font-mono text-white font-bold">{estimatedDistance} km</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Base Rate ({vehicleConfig.name})</span>
                  <span className="font-mono text-white">₹{baseFare}</span>
                </div>

                <div className="flex justify-between text-slate-400">
                  <span>Distance Charge ({estimatedDistance} km × ₹{vehicleConfig.perKmRate})</span>
                  <span className="font-mono text-white">₹{distanceFare}</span>
                </div>

                {needsWheelchair && (
                  <div className="flex justify-between text-teal-300">
                    <span>Patient Mobility Assistance Fee</span>
                    <span className="font-mono">₹{assistanceFee}</span>
                  </div>
                )}

                {(journeyType === 'return' || activeTab === 'return') && (
                  <div className="flex justify-between text-amber-300">
                    <span>Return Leg (15% Round-Trip Discount)</span>
                    <span className="font-mono">₹{returnLegFare}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">{t.totalEstimatedFare}</span>
                    <span className="text-[10px] text-slate-500">All inclusive • Demo simulated</span>
                  </div>
                  <span className="text-2xl font-black font-mono text-teal-400">
                    ₹{totalFare}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-teal-300 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Fair Pricing Guarantee</span>
                </div>
                <p>
                  No surge pricing, no hidden driver tips demanded in villages. Clear, fixed rule-based tariffs.
                </p>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 shadow-lg text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 font-extrabold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Mobility Route Insight</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Estimated transit duration: <strong className="text-white">~{Math.round((estimatedDistance/32)*60 + 5)} mins</strong>.
                Morning OPD peak at {currentHospital.shortName} begins at 9:00 AM. 
                {needsWheelchair ? " Wheelchair assistance is flagged for driver ramp prep." : ""}
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

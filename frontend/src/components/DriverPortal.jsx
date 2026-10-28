import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  ShieldCheck, 
  DollarSign, 
  AlertCircle, 
  ChevronRight, 
  Award, 
  Navigation,
  ArrowRight,
  User
} from 'lucide-react';
import { DEMO_DRIVERS } from '../data/liforaData';
import { translations } from '../i18n/translations';

export default function DriverPortal({
  drivers = [],
  bookings = [],
  onAcceptBooking,
  onUpdateStatus,
  onCompleteBooking,
  onViewReceipt,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  
  // Selected driver
  const [selectedDriverId, setSelectedDriverId] = useState('drv-prasad');
  const [isOnline, setIsOnline] = useState(true);

  const activeDriver = drivers.find(d => d.id === selectedDriverId) || DEMO_DRIVERS[0];

  // Incoming pending requests (REQUESTED or DRIVER_ASSIGNED for this driver)
  const incomingRequests = bookings.filter(b => 
    b.status === 'REQUESTED' || (b.status === 'DRIVER_ASSIGNED' && b.driverId === activeDriver.id)
  );

  // Active in-progress trip for this driver
  const activeTrip = bookings.find(b => 
    b.driverId === activeDriver.id && 
    ['DRIVER_EN_ROUTE', 'ARRIVED_AT_PICKUP', 'PATIENT_PICKED_UP', 'REACHED_HOSPITAL'].includes(b.status)
  );

  // Completed trips for this driver
  const completedTrips = bookings.filter(b => 
    b.driverId === activeDriver.id && b.status === 'COMPLETED'
  );

  return (
    <div className="space-y-6">
      
      {/* Driver Header & Demo Profile Switcher */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Active Driver Profile Card */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Car className="w-6 h-6 text-teal-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">
                {activeDriver.name}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
                ★ {activeDriver.rating || 4.9} Rating
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {activeDriver.vehicleName} • <span className="font-mono text-slate-300">{activeDriver.vehicleNumber}</span> • {activeDriver.serviceArea}
            </p>
          </div>
        </div>

        {/* Right: Driver Switcher & Online Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          
          {/* Driver Switcher */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Partner:</span>
            {DEMO_DRIVERS.filter(d => d.vehicleType !== 'AMBULANCE').map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDriverId(d.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                  d.id === activeDriver.id
                    ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                {d.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Online / Offline Toggle Button */}
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all border shadow-sm ${
              isOnline
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{isOnline ? t.driverStatusOnline : t.driverStatusOffline}</span>
          </button>

        </div>

      </div>

      {/* Driver Grid: Active Trip & Incoming Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Active Trip Management */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTrip ? (
            /* Active Trip Controls Card */
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
                    <Navigation className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-teal-400 uppercase tracking-wider block">
                      Active Healthcare Ride Navigation
                    </span>
                    <h4 className="text-sm font-extrabold text-white">
                      Trip #{activeTrip.id} — Status: {activeTrip.status.replace(/_/g, ' ')}
                    </h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-teal-300">
                    Payout: ₹{Math.round(activeTrip.fareTotal * 0.82)}
                  </span>
                  <span className="block text-[10px] text-slate-500">82% Partner Share</span>
                </div>
              </div>

              {/* Patient Info */}
              <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Pickup Location (Village)
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    <span>{activeTrip.pickupLocation}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Destination Hospital
                  </span>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{activeTrip.destinationHospitalName}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Patient Name & Contacts
                  </span>
                  <p className="text-xs text-slate-200 mt-0.5 font-medium flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{activeTrip.patientName}</span>
                  </p>
                  <p className="text-xs text-teal-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    <span>{activeTrip.phone}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Assistance Flag
                  </span>
                  <p className="text-xs mt-0.5 font-bold text-amber-300">
                    {activeTrip.needsWheelchair ? '⚠️ Assisted Boarding / Wheelchair Needed' : 'Standard Patient Transit'}
                  </p>
                </div>
              </div>

              {/* Multi-step Driver Progression Buttons */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {t.activeRideManagement}
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => onUpdateStatus(activeTrip.id, 'ARRIVED_AT_PICKUP')}
                    disabled={activeTrip.status !== 'DRIVER_EN_ROUTE'}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center text-center ${
                      activeTrip.status === 'DRIVER_EN_ROUTE'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 border-teal-400 hover:scale-[1.02]'
                        : ['ARRIVED_AT_PICKUP', 'PATIENT_PICKED_UP', 'REACHED_HOSPITAL'].includes(activeTrip.status)
                        ? 'bg-slate-950 text-slate-500 border-slate-800'
                        : 'opacity-40 bg-slate-950 border-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 mb-1" />
                    <span>{t.markArrived}</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(activeTrip.id, 'PATIENT_PICKED_UP')}
                    disabled={activeTrip.status !== 'ARRIVED_AT_PICKUP'}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center text-center ${
                      activeTrip.status === 'ARRIVED_AT_PICKUP'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 border-teal-400 hover:scale-[1.02]'
                        : ['PATIENT_PICKED_UP', 'REACHED_HOSPITAL'].includes(activeTrip.status)
                        ? 'bg-slate-950 text-slate-500 border-slate-800'
                        : 'opacity-40 bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Car className="w-4 h-4 mb-1" />
                    <span>{t.markPickedUp}</span>
                  </button>

                  <button
                    onClick={() => onUpdateStatus(activeTrip.id, 'REACHED_HOSPITAL')}
                    disabled={activeTrip.status !== 'PATIENT_PICKED_UP'}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center text-center ${
                      activeTrip.status === 'PATIENT_PICKED_UP'
                        ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20 border-teal-400 hover:scale-[1.02]'
                        : activeTrip.status === 'REACHED_HOSPITAL'
                        ? 'bg-slate-950 text-slate-500 border-slate-800'
                        : 'opacity-40 bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 mb-1" />
                    <span>{t.markReached}</span>
                  </button>

                  <button
                    onClick={() => onCompleteBooking(activeTrip.id)}
                    disabled={activeTrip.status !== 'REACHED_HOSPITAL'}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center text-center ${
                      activeTrip.status === 'REACHED_HOSPITAL'
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30 border-emerald-400 hover:scale-[1.02] animate-bounce'
                        : 'opacity-40 bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Award className="w-4 h-4 mb-1" />
                    <span>{t.markComplete}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Idle Driver State */
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">No Active Trip in Progress</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isOnline 
                  ? "You are online in the Eluru rural corridor. Check incoming requests below to accept patient transit."
                  : "You are currently offline. Switch your status to Online to receive patient ride requests."}
              </p>
            </div>
          )}

          {/* Incoming Requests Queue */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                <span>{t.incomingRequests} ({incomingRequests.length})</span>
              </h4>
              <span className="text-[11px] text-teal-300 font-mono font-bold">
                Corridor: {activeDriver.serviceArea}
              </span>
            </div>

            {incomingRequests.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {t.noIncomingRequests}
              </p>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-slate-950 border border-slate-800 hover:border-teal-500/40 rounded-xl p-4 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-teal-400">{req.id}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/20 text-teal-300">
                        ~{req.distanceKm} km
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-white flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>Pickup: {req.pickupLocation}</span>
                      </p>
                      <p className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Destination: {req.destinationHospitalName}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Patient: {req.patientName} • Preferred: {req.preferredTime}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Estimated Payout</span>
                        <span className="font-mono text-sm font-extrabold text-teal-400">
                          ₹{Math.round(req.fareTotal * 0.82)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onAcceptBooking(req.id, activeDriver.id)}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{t.acceptRide}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Driver Stats & Earnings History */}
        <div className="space-y-4">
          
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span>{t.driverEarnings}</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">{t.totalEarningsLabel}</span>
                <span className="font-mono text-lg font-black text-teal-400">
                  ₹{Math.round(activeDriver.totalEarnings || 38400)}
                </span>
                <span className="text-[10px] text-slate-500 block">Weekly Payout Ready</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">{t.totalTripsLabel}</span>
                <span className="font-mono text-lg font-black text-white">
                  {activeDriver.totalTrips || 142}
                </span>
                <span className="text-[10px] text-slate-500 block">Safe Patient Transits</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-teal-300 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fair Driver Compensation</span>
              </div>
              <p>
                LIFORA pays partners 82% of transit fares with transparent direct bank transfers, eliminating middlemen broker commissions.
              </p>
            </div>
          </div>

          {/* Completed Trips by this Driver */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
              Recently Completed Trips ({completedTrips.length})
            </h4>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {completedTrips.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onViewReceipt(b)}
                  className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 hover:border-teal-500/30 cursor-pointer text-xs space-y-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-teal-400 text-[11px]">{b.id}</span>
                    <span className="font-mono text-emerald-300 font-bold text-[11px]">
                      +₹{Math.round(b.fareTotal * 0.82)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-200 font-semibold truncate">
                    {b.pickupLocation} ➔ {b.destinationHospitalName}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Patient: {b.patientName} • {b.completedAt || b.createdAt}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

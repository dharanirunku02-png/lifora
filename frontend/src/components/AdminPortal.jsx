import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Users, 
  RotateCcw, 
  Ambulance, 
  Receipt, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function AdminPortal({
  bookings = [],
  drivers = [],
  ambulanceRequests = [],
  onViewReceipt,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'drivers', 'returns', 'ambulance'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const matchesQuery = 
      (b.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.patientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.pickupLocation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.id || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const returnBookings = bookings.filter(b => b.journeyType === 'return');

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-white">
              {t.operationsTitle}
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
              DISPATCH CONSOLE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Centralized coordination for rural patient pickups, return rides, and hospital transit.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'bookings' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Bookings ({bookings.length})
          </button>

          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'drivers' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Fleet ({drivers.length})
          </button>

          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'returns' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Return Trips ({returnBookings.length})
          </button>

          <button
            onClick={() => setActiveTab('ambulance')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'ambulance' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            108 Emergency ({ambulanceRequests.length})
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'bookings' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, village or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-slate-400 text-[11px]">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="REQUESTED">Requested</option>
                <option value="DRIVER_ASSIGNED">Driver Assigned</option>
                <option value="DRIVER_EN_ROUTE">En Route</option>
                <option value="ARRIVED_AT_PICKUP">Arrived at Pickup</option>
                <option value="PATIENT_PICKED_UP">Patient Picked Up</option>
                <option value="REACHED_HOSPITAL">Reached Hospital</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Booking ID</th>
                  <th className="p-3">Patient & Contact</th>
                  <th className="p-3">Route (Pickup ➔ Hospital)</th>
                  <th className="p-3">Assigned Partner</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Fare</th>
                  <th className="p-3 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-teal-400">{b.id}</td>
                    <td className="p-3">
                      <p className="font-bold text-white">{b.patientName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{b.phone}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-slate-200">{b.pickupLocation}</p>
                      <p className="text-[10px] text-teal-300 font-medium">➔ {b.destinationHospitalName}</p>
                    </td>
                    <td className="p-3">
                      <p className="font-semibold text-white">{b.driverName || 'Matching...'}</p>
                      <p className="text-[10px] text-slate-500">{b.vehicleName}</p>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        b.status === 'COMPLETED'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : b.status === 'CANCELLED'
                          ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                          : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                      }`}>
                        {b.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      ₹{b.fareTotal}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onViewReceipt(b)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-400 text-[11px] font-bold border border-slate-700 transition-all"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Drivers Tab */}
      {activeTab === 'drivers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((d) => (
            <div
              key={d.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-300">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white">{d.name}</h5>
                    <p className="text-[10px] text-slate-400 font-mono">{d.phone}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  d.isAvailable && d.isOnline
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {d.isAvailable && d.isOnline ? 'Available' : 'On Trip / Off'}
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850 text-xs space-y-1">
                <p className="text-white font-bold">{d.vehicleName}</p>
                <p className="text-[10px] text-slate-400 font-mono">Reg: {d.vehicleNumber} • Rating: ★ {d.rating}</p>
                <p className="text-[10px] text-teal-300">Corridor: {d.serviceArea}</p>
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-slate-400">Total Trips: <strong className="text-white">{d.totalTrips}</strong></span>
                <span className="font-mono font-bold text-teal-400">₹{Math.round(d.totalEarnings || 0)} earned</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Trips Tab */}
      {activeTab === 'returns' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Scheduled Return Journeys Home</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Patients who booked return rides to prevent evening transit shortages.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">
              {returnBookings.length} Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {returnBookings.map((b) => (
              <div
                key={b.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-teal-400">{b.id}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Return at {b.returnTime || 'Afternoon'}
                  </span>
                </div>
                <p className="font-bold text-white">{b.patientName}</p>
                <p className="text-slate-300">
                  Pickup: {b.pickupLocation} ➔ Return to: {b.destinationHospitalName}
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-850 text-[11px]">
                  <span className="text-slate-500">Reminder SMS Simulated</span>
                  <span className="font-mono font-bold text-white">₹{b.fareTotal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ambulance Requests Tab */}
      {activeTab === 'ambulance' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-rose-300 flex items-center gap-1.5">
              <Ambulance className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Simulated 108 Emergency Ambulance Escalation Logs</span>
            </h4>
            <span className="text-[10px] text-slate-400">Verified AP 108 Protocol</span>
          </div>

          <div className="space-y-3">
            {ambulanceRequests.map((a) => (
              <div
                key={a.id}
                className="bg-slate-950 p-4 rounded-xl border border-rose-500/30 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-400">{a.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {a.status}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <p>Caller: <strong className="text-white">{a.callerName}</strong> ({a.callerPhone})</p>
                  <p>Condition: <strong className="text-rose-400">{a.emergencyType}</strong></p>
                  <p>Location: <strong className="text-white">{a.pickupLocation}</strong></p>
                  <p>Unit: <strong className="text-teal-400">{a.assignedUnit}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demand Forecasting Note */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-400">
        <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
        <p>
          <strong className="text-white">Predictive Corridor Allocation:</strong> LIFORA forecasts heavy return travel from Asram Hospital and Eluru Govt Hospital between 2:00 PM and 4:30 PM as OPD consultations conclude. 4 partner vehicles are automatically repositioned to hospital waiting bays to reduce rural return wait times by 68%.
        </p>
      </div>

    </div>
  );
}

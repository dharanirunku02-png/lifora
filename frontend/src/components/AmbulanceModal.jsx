import React, { useState } from 'react';
import { 
  Ambulance, 
  PhoneCall, 
  ShieldAlert, 
  X, 
  MapPin, 
  HeartHandshake, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2,
  PhoneForwarded,
  Activity
} from 'lucide-react';
import { HOSPITALS, VILLAGES } from '../data/liforaData';
import { translations } from '../i18n/translations';

export default function AmbulanceModal({
  isOpen,
  onClose,
  ambulanceRequests = [],
  onRequestAmbulance,
  onAdvanceAmbulanceStatus,
  lang = 'en'
}) {
  if (!isOpen) return null;

  const t = translations[lang] || translations.en;

  const [callerName, setCallerName] = useState('Village Health Worker / Caregiver');
  const [callerPhone, setCallerPhone] = useState('+91 94901 08108');
  const [emergencyType, setEmergencyType] = useState('CARDIAC');
  const [pickupLocation, setPickupLocation] = useState('Chintalapudi Primary Health Post');
  const [hospitalName, setHospitalName] = useState('District Government General Hospital (GGH)');

  const latestAmbulance = ambulanceRequests[ambulanceRequests.length - 1];

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestAmbulance({
      callerName,
      callerPhone,
      emergencyType,
      pickupLocation,
      pickupLat: 17.0600,
      pickupLng: 80.9850,
      hospitalName
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-rose-950/50 p-6 space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/20">
            <Ambulance className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">
                {t.ambulanceTitle}
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                AP 108 PROTOCOL
              </span>
            </div>
            <p className="text-xs text-rose-300/80 font-medium mt-0.5">
              Verified Emergency Medical Response Services
            </p>
          </div>
        </div>

        {/* CRITICAL VERIFIED HELPLINE CALLOUT */}
        <div className="bg-gradient-to-r from-rose-950/80 to-slate-950 border border-rose-500/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>CRITICAL: Call Official Helplines Directly in Life-Threatening Situations</span>
          </div>
          
          <p className="text-xs text-slate-200">
            {t.emergencyDisclaimer}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <a
              href="tel:108"
              className="flex items-center justify-between p-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02]"
            >
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Call 108 Free</span>
              </div>
              <span className="text-[10px] bg-rose-950/40 px-1.5 py-0.5 rounded">24/7 BLS</span>
            </a>

            <a
              href="tel:102"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
                <span>Call 102</span>
              </div>
              <span className="text-[10px] text-slate-400">Mother/Child</span>
            </a>

            <a
              href="tel:112"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
            >
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>Call 112</span>
              </div>
              <span className="text-[10px] text-slate-400">National</span>
            </a>
          </div>
        </div>

        {/* Simulated Dispatch Tracker if an ambulance request is active */}
        {latestAmbulance && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{t.ambulanceStatusTracker}: {latestAmbulance.id}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {latestAmbulance.status}
              </span>
            </div>

            <div className="text-xs text-slate-300 grid grid-cols-2 gap-2">
              <p>Type: <strong className="text-white">{latestAmbulance.emergencyType}</strong></p>
              <p>Unit: <strong className="text-teal-400">{latestAmbulance.assignedUnit}</strong></p>
              <p className="col-span-2">Location: <strong className="text-white">{latestAmbulance.pickupLocation}</strong></p>
            </div>

            {/* Advance Status Demo Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-850">
              {['TRIAGED', 'UNIT_ALERTED', 'AMBULANCE_EN_ROUTE', 'ON_SCENE', 'HOSPITAL_HANDOVER', 'RESOLVED'].map((st) => (
                <button
                  key={st}
                  onClick={() => onAdvanceAmbulanceStatus(latestAmbulance.id, st)}
                  className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${
                    latestAmbulance.status === st
                      ? 'bg-rose-500 text-white border-rose-400'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Request Ambulance Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Submit Simulated Emergency Ambulance Request
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                {t.callerName}
              </label>
              <input
                type="text"
                required
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Caller Phone Number
              </label>
              <input
                type="tel"
                required
                value={callerPhone}
                onChange={(e) => setCallerPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">
              {t.emergencyType}
            </label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="CARDIAC">{t.cardiacEmergency}</option>
              <option value="TRAUMA_ACCIDENT">{t.traumaEmergency}</option>
              <option value="MATERNAL_LABOR">{t.laborEmergency}</option>
              <option value="RESPIRATORY">{t.respiratoryEmergency}</option>
              <option value="GENERAL_CRITICAL">{t.generalEmergency}</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Emergency Location / Village
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Destination Hospital (if known)
              </label>
              <select
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
              >
                {HOSPITALS.map((h) => (
                  <option key={h.id} value={h.name}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs hover:opacity-95 shadow-xl shadow-rose-500/20 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
          >
            <Ambulance className="w-4 h-4" />
            <span>{t.requestSimulatedAmbulance}</span>
          </button>
        </form>

      </div>
    </div>
  );
}

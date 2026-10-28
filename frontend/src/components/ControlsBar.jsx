import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Gauge, 
  Clock, 
  Ambulance, 
  Car, 
  FastForward, 
  AlertCircle,
  Database,
  CheckCircle2
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function ControlsBar({
  state,
  dataSource,
  onTogglePlay,
  onReset,
  onSetSpeed,
  onTriggerBooking,
  onTriggerAmbulance,
  onAdvanceRide,
  lang = 'en'
}) {
  const t = translations[lang] || translations.en;
  const isRunning = state?.is_running ?? true;
  const simSpeed = state?.sim_speed || 1.0;
  const simTime = state?.sim_time || "08:30 AM";

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Engine Controls & Clock */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.pauseSim}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.startSim}</span>
              </>
            )}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="Reset simulation to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetSim}</span>
          </button>

          {/* Speed Buttons */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
            {[1.0, 2.0, 5.0].map((s) => (
              <button
                key={s}
                onClick={() => onSetSpeed(s)}
                className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                  simSpeed === s
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Simulation Clock */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-lg border border-slate-800/80 text-teal-300 font-mono font-bold">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{simTime}</span>
            <span className="text-[10px] text-slate-500 font-normal">OPD Transit Hours</span>
          </div>

          {/* Data Source Badge */}
          <div className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-slate-800/60 text-slate-400 border border-slate-800">
            <Database className="w-3 h-3 text-cyan-400" />
            <span>{dataSource === 'backend' ? 'FastAPI REST' : 'In-Browser Client Engine'}</span>
          </div>
        </div>

        {/* Center: Live Simulation Synthetic Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-semibold">
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.liveSimulationBanner}</span>
        </div>

        {/* Right: Quick Simulation Action Triggers */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onTriggerBooking}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-semibold transition-all"
            title="Inject a realistic rural hospital transport request"
          >
            <Car className="w-3 h-3 text-teal-400" />
            <span>+ Sample Village Ride</span>
          </button>

          <button
            onClick={onTriggerAmbulance}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition-all"
            title="Simulate high priority emergency 108 ambulance dispatch"
          >
            <Ambulance className="w-3 h-3 text-rose-400" />
            <span>+ Emergency 108</span>
          </button>

          <button
            onClick={onAdvanceRide}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold transition-all"
            title="Step through current ride to hospital arrival"
          >
            <FastForward className="w-3 h-3 text-indigo-400" />
            <span>Advance Active Ride</span>
          </button>
        </div>

      </div>
    </div>
  );
}

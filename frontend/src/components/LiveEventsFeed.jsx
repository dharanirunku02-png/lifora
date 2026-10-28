import React from 'react';
import { 
  Radio, 
  Car, 
  CheckCircle2, 
  AlertTriangle, 
  Receipt, 
  RotateCcw, 
  Ambulance, 
  Clock, 
  Info 
} from 'lucide-react';

export default function LiveEventsFeed({ events = [] }) {
  const getEventIcon = (type) => {
    switch (type) {
      case 'RIDE_REQUEST':
        return <Car className="w-3.5 h-3.5 text-teal-400" />;
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVED':
      case 'PATIENT_PICKED_UP':
        return <Clock className="w-3.5 h-3.5 text-cyan-400" />;
      case 'HOSPITAL_ARRIVAL':
      case 'TRIP_COMPLETED':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'RETURN_SCHEDULED':
        return <RotateCcw className="w-3.5 h-3.5 text-amber-400" />;
      case 'AMBULANCE_ALERT':
        return <Ambulance className="w-3.5 h-3.5 text-rose-400 animate-pulse" />;
      default:
        return <Info className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
      case 'critical':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/40 font-bold';
      case 'warning':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-white">
            Live System Activity Feed
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-500">
          Showing latest events
        </span>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {events.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No events logged yet.</p>
        ) : (
          events.map((e) => (
            <div
              key={e.id}
              className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-850 hover:border-slate-800 transition-all text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {getEventIcon(e.type)}
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${getSeverityBadge(e.severity)}`}>
                    {e.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">{e.timestamp}</span>
              </div>
              <p className="text-[11px] text-slate-200 font-medium pl-5">
                {e.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

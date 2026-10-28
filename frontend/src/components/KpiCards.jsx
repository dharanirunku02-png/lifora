import React from 'react';
import { 
  Car, 
  CheckCircle2, 
  Users, 
  Clock, 
  RotateCcw, 
  Ambulance, 
  IndianRupee, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function KpiCards({ state, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  const totalBookings = state?.total_bookings || 0;
  const activeRides = state?.active_rides || 0;
  const availableDrivers = state?.available_drivers || 0;
  const completedTrips = state?.completed_trips || 0;
  const returnJourneys = state?.return_bookings_count || 0;
  const ambulanceCount = state?.ambulance_requests_count || 0;
  const avgWait = state?.avg_waiting_time_min || 6.8;
  const totalValue = state?.total_fare_volume_inr || 0;

  const cards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      subtitle: `${returnJourneys} Return trips scheduled`,
      icon: Car,
      color: "teal",
      badge: "+18% today"
    },
    {
      title: "Active Patient Rides",
      value: activeRides,
      subtitle: "In transit to city hospitals",
      icon: Activity,
      color: "cyan",
      badge: "Live"
    },
    {
      title: "Available Drivers",
      value: availableDrivers,
      subtitle: "In Eluru & rural corridors",
      icon: Users,
      color: "emerald",
      badge: "88% Online"
    },
    {
      title: "Completed Trips",
      value: completedTrips,
      subtitle: "Safely reached OPDs",
      icon: CheckCircle2,
      color: "indigo",
      badge: "Zero cancellations"
    },
    {
      title: "Emergency 108 Calls",
      value: ambulanceCount,
      subtitle: "Critical requests assisted",
      icon: Ambulance,
      color: "rose",
      badge: "Priority Triaged"
    },
    {
      title: "Avg Patient Pickup Time",
      value: `${avgWait}m`,
      subtitle: "Village doorstep ETA",
      icon: Clock,
      color: "amber",
      badge: "4.2m vs 35m taxi"
    },
    {
      title: "Mobility Fare Volume",
      value: `₹${totalValue}`,
      subtitle: "Affordable community transit",
      icon: IndianRupee,
      color: "teal",
      badge: "Fair Tariffs"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg backdrop-blur-md space-y-1.5 hover:border-teal-500/30 transition-all group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                {c.title}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-950 text-teal-400 group-hover:scale-110 transition-transform">
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black font-mono text-white tracking-tight">
                {c.value}
              </span>
              <span className="text-[9px] font-mono text-teal-300 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                {c.badge}
              </span>
            </div>

            <p className="text-[10px] text-slate-500 truncate">
              {c.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}

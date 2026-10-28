import React from 'react';
import { 
  BarChart, 
  Bar, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  BarChart3, 
  Clock, 
  RotateCcw, 
  Car, 
  TrendingUp, 
  ShieldCheck 
} from 'lucide-react';

const COLORS = ['#14b8a6', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsSection({ analytics }) {
  const hourlyData = analytics?.hourlyDemand || [
    { hour: "06:00", rides: 3, label: "Dialysis" },
    { hour: "08:00", rides: 14, label: "OPD Rush" },
    { hour: "10:00", rides: 18, label: "Specialists" },
    { hour: "12:00", rides: 8, label: "Midday" },
    { hour: "14:00", rides: 16, label: "Discharge & Return" },
    { hour: "16:00", rides: 11, label: "Evening" },
    { hour: "18:00", rides: 6, label: "Night" }
  ];

  const vehicleData = analytics?.vehicleDemand || [
    { category: "Auto-Rickshaw", count: 28 },
    { category: "Economy Car", count: 22 },
    { category: "Medical Van", count: 17 }
  ];

  const journeyTypeData = [
    { name: "Hospital Outward Rides", count: analytics?.oneWayJourneys || 18, color: "#14b8a6" },
    { name: "Guaranteed Return Journeys", count: analytics?.returnJourneys || 12, color: "#f59e0b" }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-teal-400" />
          <span>Regional Healthcare Mobility Analytics</span>
        </h4>
        <span className="text-[10px] font-mono text-slate-500">
          Derived from synthetic simulation state
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Chart 1: Hourly Hospital Demand */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-extrabold text-white">Hospital OPD Transit Curve</h5>
              <p className="text-[10px] text-slate-400">Peak morning rush vs afternoon return discharge</p>
            </div>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>

          <div className="h-44 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                <defs>
                  <linearGradient id="opdGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="rides" stroke="#14b8a6" strokeWidth={2} fillOpacity={1} fill="url(#opdGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: One-Way vs Return Bookings */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-extrabold text-white">Journey Type Ratio</h5>
              <p className="text-[10px] text-slate-400">Hospital visits vs return rides</p>
            </div>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>

          <div className="h-44 w-full flex items-center justify-center text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={journeyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {journeyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ fontSize: '10px', color: '#94a3b8' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Vehicle Category Demand */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-xs font-extrabold text-white">Vehicle Category Demand</h5>
              <p className="text-[10px] text-slate-400">Auto, AC Car & Medical Van preference</p>
            </div>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="h-44 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vehicleData}>
                <XAxis dataKey="category" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

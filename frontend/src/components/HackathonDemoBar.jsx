import React from 'react';
import { 
  Sparkles, 
  Play, 
  Pause, 
  SkipForward, 
  X, 
  CheckCircle2, 
  ChevronRight,
  Stethoscope,
  Heart,
  Clock,
  Car,
  Receipt,
  RotateCcw,
  Ambulance,
  BarChart2
} from 'lucide-react';

export const LIFORA_DEMO_STEPS = [
  {
    step: 1,
    title: "1. LIFORA Startup Mission & Baseline",
    badge: "STARTUP CONCEPT",
    icon: Stethoscope,
    description: "Welcome to LIFORA — Connecting Every Life to Care. Millions of patients in villages face lack of transport, high private taxi charges, and stranded return trips to city hospitals. Here is our initial mobility baseline in Eluru district."
  },
  {
    step: 2,
    title: "2. Rural Village Patient Requests Transport",
    badge: "RIDE REQUEST",
    icon: Car,
    description: "Ramesh Naidu from Denduluru village needs to take his 68-year-old mother with severe knee arthritis to ASRAM Medical College Hospital. He books an assisted Medical Utility Van."
  },
  {
    step: 3,
    title: "3. Transparent Rule-Based Fare Calculation",
    badge: "TRANSPARENT FARE",
    icon: Receipt,
    description: "LIFORA calculates transparent fare: Base (₹100) + 12 km @ ₹16/km (₹192) + Wheelchair assistance (₹30) = ₹322. No surge pricing, no hidden taxi markups."
  },
  {
    step: 4,
    title: "4. Automated Driver Partner Matching",
    badge: "DRIVER MATCH",
    icon: Car,
    description: "The system matches nearby driver Prasad Rao (Tata Magic Eco-Van, AP 37 BX 4821) stationed just 1.5 km away along the Denduluru-Eluru feeder road."
  },
  {
    step: 5,
    title: "5. Driver Accepts in Driver Portal",
    badge: "DISPATCH ACCEPTED",
    icon: CheckCircle2,
    description: "Driver Prasad receives the booking alert with pickup landmark and patient details, and confirms the ride. His status updates to 'En Route'."
  },
  {
    step: 6,
    title: "6. Live Visual Journey Tracker & Family Share",
    badge: "LIVE TRACKING",
    icon: Clock,
    description: "Ramesh watches the multi-step visual progress tracker. With one tap, he shares a real-time WhatsApp journey link with his sister so the family knows mother is safe."
  },
  {
    step: 7,
    title: "7. Hospital Arrival & Safe Patient Handover",
    badge: "DESTINATION REACHED",
    icon: Heart,
    description: "Driver Prasad arrives at ASRAM Hospital OPD Gate 1, assists the elderly patient with the wheelchair ramp, and marks the trip completed."
  },
  {
    step: 8,
    title: "8. Itemized Bill Receipt Generated",
    badge: "BILL RECEIPT",
    icon: Receipt,
    description: "LIFORA issues an official itemized medical transit receipt (LFR-REC-1041) with print-to-PDF and copy options for healthcare reimbursement."
  },
  {
    step: 9,
    title: "9. Return Journey Booking (Core Feature)",
    badge: "RETURN RIDE",
    icon: RotateCcw,
    description: "Ramesh schedules a guaranteed return ride home for 3:30 PM after doctor consultation, unlocking a 15% round-trip discount so they are never stranded."
  },
  {
    step: 10,
    title: "10. Dedicated 24/7 Emergency 108 Ambulance Flow",
    badge: "EMERGENCY TRIAGE",
    icon: Ambulance,
    description: "A village health post reports a critical cardiac emergency. LIFORA's triage interface connects with verified Andhra Pradesh 108 protocol and tracks emergency dispatch."
  },
  {
    step: 11,
    title: "11. Regional Operations Dashboard & Analytics",
    badge: "MOBILITY ANALYTICS",
    icon: BarChart2,
    description: "Explore the live operations view: hourly hospital OPD rush curves, one-way vs return trip ratios, fleet utilization, and demand forecasting."
  },
  {
    step: 12,
    title: "12. Startup Value Proposition & Next Steps",
    badge: "PITCH SUMMARY",
    icon: Sparkles,
    description: "LIFORA bridges the rural healthcare mobility gap: reliable hospital access, guaranteed return trips, emergency triage, and bilingual accessibility. Thank you, Judges!"
  }
];

export default function HackathonDemoBar({
  currentStep = 1,
  totalSteps = 12,
  isPlaying = false,
  onNext,
  onStop,
  onSelectStep
}) {
  const stepInfo = LIFORA_DEMO_STEPS[currentStep - 1] || LIFORA_DEMO_STEPS[0];
  const IconComponent = stepInfo.icon || Sparkles;
  const progressPct = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border-b border-teal-500/30 px-4 sm:px-6 lg:px-8 py-3 sticky top-16 z-30 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: Step Counter & Narration */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 font-mono font-black text-sm shrink-0 shadow-lg shadow-teal-500/10">
            {currentStep}/{totalSteps}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                {stepInfo.badge}
              </span>
              <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5 truncate">
                <IconComponent className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{stepInfo.title}</span>
              </h4>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5 line-clamp-2 max-w-3xl">
              {stepInfo.description}
            </p>
          </div>
        </div>

        {/* Right: Controls & Step Progress */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          
          {/* Step dots for quick jumping */}
          <div className="hidden xl:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
            {LIFORA_DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => onSelectStep && onSelectStep(s.step)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  s.step === currentStep
                    ? 'bg-teal-400 w-5'
                    : s.step < currentStep
                    ? 'bg-teal-700 hover:bg-teal-600'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Jump to step ${s.step}: ${s.title}`}
              />
            ))}
          </div>

          {/* Next Step Button */}
          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-black text-xs hover:opacity-95 shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
          >
            <span>{currentStep === totalSteps ? 'Restart Demo' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Close / Exit Demo */}
          <button
            onClick={onStop}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all border border-slate-700"
            title="Exit Demo Mode"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/80 h-1 mt-2.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

import React from 'react';
import { 
  HeartHandshake, 
  Sparkles, 
  Ambulance, 
  UserCheck, 
  Car, 
  BarChart3, 
  Globe2, 
  Radio, 
  ShieldAlert,
  Languages
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  onOpenAmbulanceModal, 
  onRunDemo, 
  lang = 'en', 
  onToggleLang, 
  isDemoActive = false,
  dataSource = 'client'
}) {
  const t = translations[lang] || translations.en;

  return (
    <header className="bg-slate-900/90 border-b border-teal-500/20 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Startup Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-teal-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
                  LIFORA
                  <span className="text-teal-400 font-mono text-xs ml-1.5 px-1.5 py-0.5 rounded bg-teal-500/10 border border-teal-500/20">
                    24/7 CARE
                  </span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-teal-500/20">
                  {t.badgeStudent}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Role Navigation Switcher */}
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onRoleChange('customer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'customer'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{t.navCustomer}</span>
            </button>

            <button
              onClick={() => onRoleChange('driver')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'driver'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>{t.navDriver}</span>
            </button>

            <button
              onClick={() => onRoleChange('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t.navAdmin}</span>
            </button>
          </div>

          {/* Quick Actions: Ambulance, Language, Demo */}
          <div className="flex items-center gap-2">
            
            {/* Emergency Ambulance Button */}
            <button
              onClick={onOpenAmbulanceModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all shadow-sm hover:shadow-rose-500/10 group"
              title="24/7 Emergency Ambulance Assistance"
            >
              <Ambulance className="w-3.5 h-3.5 text-rose-400 group-hover:animate-bounce" />
              <span className="hidden lg:inline">{t.navEmergency}</span>
              <span className="font-mono text-[10px] bg-rose-500/30 px-1.5 py-0.2 rounded text-rose-200 ml-0.5">
                108
              </span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-all"
              title="Switch language between English & Telugu"
            >
              <Languages className="w-3.5 h-3.5 text-teal-400" />
              <span className="font-mono">{lang === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            {/* RUN LIFORA HACKATHON DEMO */}
            <button
              onClick={onRunDemo}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isDemoActive
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-400 animate-pulse'
                  : 'bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 text-slate-950 shadow-cyan-500/25 hover:opacity-95 hover:scale-[1.02]'
              }`}
            >
              <Sparkles className="w-4 h-4 fill-current text-slate-950" />
              <span className="hidden sm:inline font-extrabold uppercase tracking-wide">
                {isDemoActive ? 'Demo In Progress' : 'Run Lifora Demo'}
              </span>
              <span className="sm:hidden font-extrabold">Demo</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}

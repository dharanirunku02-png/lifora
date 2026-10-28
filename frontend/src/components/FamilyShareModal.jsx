import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  X, 
  MessageSquare, 
  ShieldCheck, 
  Heart, 
  PhoneCall, 
  Car, 
  Building2 
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function FamilyShareModal({
  isOpen,
  onClose,
  booking,
  lang = 'en'
}) {
  if (!isOpen || !booking) return null;

  const t = translations[lang] || translations.en;
  const [copied, setCopied] = useState(false);

  const trackingLink = `https://lifora.demo/track/${booking.id}`;
  const shareMessage = `
🚑 *LIFORA Healthcare Transit Update*
👤 *Patient:* ${booking.patientName || 'Family Member'}
🏥 *Heading to:* ${booking.destinationHospitalName}
🚗 *Driver:* ${booking.driverName || 'Assigned Partner'} (${booking.vehicleName || 'Transit'}, ${booking.vehicleNumber || 'AP 37 DEMO'})
📍 *Status:* ${booking.status.replace(/_/g, ' ')}
⏱️ *Est. Transit Time:* ~${booking.estimatedTransitMin || 25} mins
🔗 *Track Live:* ${trackingLink}
_Connecting Every Life to Care_
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl max-w-lg w-full shadow-2xl shadow-teal-950/40 p-6 space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-md">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">
              {t.shareWithFamily}
            </h3>
            <p className="text-xs text-slate-400">
              Keep relatives and caregivers at home peaceful and informed in real-time.
            </p>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-teal-400 text-[11px] font-bold border-b border-slate-850 pb-2">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>Simulated WhatsApp / SMS Message Preview</span>
            </span>
            <span className="text-slate-500 text-[10px]">Ready to send</span>
          </div>

          <pre className="whitespace-pre-wrap text-slate-300 text-[11px] font-mono leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-850">
            {shareMessage}
          </pre>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <span>Patient location and medical details are encrypted and shared only via this single-use demo token.</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Message!' : 'Copy to Clipboard'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Open in WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}

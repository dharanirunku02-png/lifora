import React, { useState } from 'react';
import { 
  Receipt, 
  Printer, 
  Copy, 
  Check, 
  X, 
  Download, 
  HeartHandshake, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  User, 
  Car,
  AlertCircle
} from 'lucide-react';
import { translations } from '../i18n/translations';

export default function BillReceiptModal({
  isOpen,
  onClose,
  booking,
  receipt,
  lang = 'en'
}) {
  if (!isOpen) return null;

  const t = translations[lang] || translations.en;
  const [copied, setCopied] = useState(false);

  const b = booking || {};
  const recNo = receipt?.receiptNumber || b.receiptId || `LFR-REC-${b.id ? b.id.split('-')[2] : '1041'}`;
  const totalAmount = receipt?.totalAmount || b.fareTotal || 185;
  const paymentStatus = receipt?.paymentStatus || b.paymentStatus || 'PAID_DEMO';

  const handleCopyDetails = () => {
    const text = `
LIFORA HEALTHCARE TRANSPORTATION RECEIPT
Receipt Number: ${recNo}
Booking ID: ${b.id || 'LFR-BK-1041'}
Patient Name: ${b.patientName || 'Patient'}
Driver: ${b.driverName || 'LIFORA Partner'} (${b.vehicleName || 'Transit Van'}, ${b.vehicleNumber || 'AP 37 DEMO'})
Route: ${b.pickupLocation || 'Village'} -> ${b.destinationHospitalName || 'Hospital'}
Distance: ${b.distanceKm || 12} km
Total Amount: Rs. ${totalAmount}
Payment Status: ${paymentStatus} (Simulated Demo)
Connecting Every Life to Care
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl shadow-teal-950/40 p-6 space-y-6 relative print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Container */}
        <div id="printable-receipt" className="space-y-6">
          
          {/* Header */}
          <div className="border-b border-slate-800 pb-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white print:text-slate-900">
                LIFORA
              </h3>
            </div>
            <p className="text-xs text-teal-400 font-bold uppercase tracking-widest">
              Connecting Every Life to Care
            </p>
            <p className="text-[10px] text-slate-400">
              24/7 Affordable Healthcare Mobility • Eluru & West Godavari Corridor
            </p>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-teal-300 font-mono font-semibold print:border print:border-slate-300">
              TAX INVOICE / TRIP RECEIPT (PROTOTYPE DEMO)
            </div>
          </div>

          {/* Receipt Identifiers */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Receipt Number</span>
              <span className="font-mono font-extrabold text-teal-400 print:text-teal-700 text-sm">{recNo}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Booking Reference</span>
              <span className="font-mono font-bold text-white print:text-black">{b.id || 'LFR-BK-1041'}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Date & Time</span>
              <span className="text-slate-200 font-medium print:text-black">{b.createdAt || 'Today'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Journey Type</span>
              <span className="font-semibold text-teal-300 print:text-black capitalize">
                {b.journeyType ? b.journeyType.replace('_', ' ') : 'One Way'}
              </span>
            </div>
          </div>

          {/* Route & Passenger Details */}
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Patient Name</span>
                <p className="font-bold text-white print:text-black mt-0.5">{b.patientName || b.customerName || 'Patient'}</p>
                <p className="text-[11px] text-slate-400 print:text-slate-600">{b.phone}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Assigned Driver & Vehicle</span>
                <p className="font-bold text-white print:text-black mt-0.5">{b.driverName || 'LIFORA Certified Partner'}</p>
                <p className="text-[11px] text-teal-300 print:text-teal-700 font-mono">
                  {b.vehicleName} ({b.vehicleNumber || 'AP 37 DEMO'})
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-300 space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Pickup Location (Village)</span>
                  <span className="font-bold text-white print:text-black">{b.pickupLocation || 'Denduluru Village'}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-slate-400 block">Destination Hospital</span>
                  <span className="font-bold text-white print:text-black">{b.destinationHospitalName || 'ASRAM Hospital'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Fare Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden print:border-slate-300 text-xs">
            <div className="bg-slate-950 p-2.5 font-bold text-slate-300 border-b border-slate-800 grid grid-cols-3 print:bg-slate-100 print:text-black">
              <span className="col-span-2">Tariff Component</span>
              <span className="text-right">Amount (INR)</span>
            </div>

            <div className="p-3 space-y-2 bg-slate-900/60 print:bg-white">
              <div className="flex justify-between text-slate-300 print:text-black">
                <span>Base Healthcare Fare ({b.vehicleCategory || 'Van'})</span>
                <span className="font-mono">₹{b.fareBase || 40}</span>
              </div>

              <div className="flex justify-between text-slate-300 print:text-black">
                <span>Distance Transit Charge ({b.distanceKm || 12} km)</span>
                <span className="font-mono">₹{b.fareDistance || 145}</span>
              </div>

              {b.fareAssistance > 0 && (
                <div className="flex justify-between text-teal-300 print:text-teal-700">
                  <span>Patient Mobility / Wheelchair Assistance Fee</span>
                  <span className="font-mono">₹{b.fareAssistance}</span>
                </div>
              )}

              {b.fareReturn > 0 && (
                <div className="flex justify-between text-amber-300 print:text-amber-800">
                  <span>Return Journey (15% Round-Trip Discount Applied)</span>
                  <span className="font-mono">₹{b.fareReturn}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between font-black text-sm text-white print:text-black">
                <span>Total Amount</span>
                <span className="font-mono text-teal-400 print:text-teal-700 text-base">₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Status & Disclaimers */}
          <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Payment Status</span>
              <span className="font-mono font-bold text-emerald-400 print:text-emerald-700">
                {paymentStatus.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Mode</span>
              <span className="font-medium text-slate-300 print:text-black">Direct Partner Demo Payment</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-500 text-center italic">
            * This receipt is generated by the LIFORA prototype for hackathon demonstration. No real financial transaction was executed.
          </p>

        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 print:hidden">
          <button
            onClick={handleCopyDetails}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : t.copyReceipt}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>{t.printReceipt}</span>
            </button>

            <button
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-all"
            >
              {t.closeReceipt}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

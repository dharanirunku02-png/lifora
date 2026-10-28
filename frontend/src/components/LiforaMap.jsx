import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Building2, 
  MapPin, 
  Car, 
  Ambulance, 
  AlertCircle, 
  Navigation,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { HOSPITALS, VILLAGES } from '../data/liforaData';

export default function LiforaMap({
  activeBookings = [],
  drivers = [],
  onSelectHospital,
  selectedHospitalId
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [mapError, setMapError] = useState(false);

  // Initialize Map Centered on Eluru & West Godavari Corridor
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    try {
      const map = L.map(mapContainerRef.current, {
        center: [16.735, 81.125],
        zoom: 11,
        minZoom: 9,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap standard tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);

      mapInstanceRef.current = map;
    } catch (e) {
      console.warn("Leaflet map initialization fallback:", e);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers and Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !routeLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    routeLayerRef.current.clearLayers();

    // 1. Hospital Markers
    HOSPITALS.forEach((h) => {
      const isSelected = selectedHospitalId === h.id;
      const html = `
        <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
          <div class="flex items-center justify-center w-8 h-8 rounded-xl shadow-lg border-2 transition-transform duration-200 group-hover:scale-110 ${
            isSelected
              ? 'bg-cyan-500 border-white text-slate-950 scale-110 ring-4 ring-cyan-500/30'
              : 'bg-slate-900 border-cyan-400 text-cyan-400'
          }">
            <span class="text-xs font-black">✚</span>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-[10px] font-bold text-white px-1.5 py-0.5 rounded border border-slate-800 shadow">
            ${h.shortName}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: 'custom-hospital-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([h.lat, h.lng], { icon }).addTo(markersLayerRef.current);
      marker.bindPopup(`
        <div class="p-1 space-y-1">
          <h4 class="font-extrabold text-xs text-cyan-400">${h.name}</h4>
          <p class="text-[11px] text-slate-300">${h.address}</p>
          <p class="text-[10px] text-teal-300 font-mono">Specialities: ${h.specialities.slice(0, 3).join(', ')}</p>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectHospital) onSelectHospital(h.id);
      });
    });

    // 2. Village Markers
    VILLAGES.forEach((v) => {
      const html = `
        <div class="relative cursor-pointer group" style="transform: translate(-50%, -50%);">
          <div class="flex items-center justify-center w-7 h-7 rounded-lg shadow-md border bg-slate-900 border-teal-500 text-teal-300 transition-transform duration-200 group-hover:scale-110">
            <span class="text-[11px]">📍</span>
          </div>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950/90 text-[9px] font-semibold text-slate-200 px-1 py-0.2 rounded border border-slate-800">
            ${v.name.split(' ')[0]} (~${v.distanceToEluruKm}km)
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html,
        className: 'custom-village-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      L.marker([v.lat, v.lng], { icon }).addTo(markersLayerRef.current);
    });

    // 3. Active En-Route Booking Polylines & Moving Vehicle Markers
    activeBookings.forEach((b) => {
      if (b.status === 'CANCELLED') return;

      const pLat = b.pickupLat || 16.7580;
      const pLng = b.pickupLng || 81.1640;
      const dLat = b.destinationLat || 16.7450;
      const dLng = b.destinationLng || 81.1480;

      // Draw dashed transit corridor route
      const polyline = L.polyline([[pLat, pLng], [dLat, dLng]], {
        color: b.journeyType === 'return' ? '#f59e0b' : '#14b8a6',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8'
      }).addTo(routeLayerRef.current);

      // Compute moving vehicle position based on simulatedProgressPct
      const pct = (b.simulatedProgressPct || 20) / 100;
      const curLat = pLat + (dLat - pLat) * pct;
      const curLng = pLng + (dLng - pLng) * pct;

      const vehicleHtml = `
        <div class="relative cursor-pointer" style="transform: translate(-50%, -50%);">
          <div class="w-8 h-8 rounded-full bg-slate-950 border-2 border-teal-400 flex items-center justify-center text-teal-300 shadow-xl ring-4 ring-teal-400/20 animate-pulse">
            <span class="text-xs">🚗</span>
          </div>
          <div class="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-teal-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded shadow">
            ${b.driverName ? b.driverName.split(' ')[0] : 'En Route'} (${Math.round(b.simulatedProgressPct || 20)}%)
          </div>
        </div>
      `;

      const vehicleIcon = L.divIcon({
        html: vehicleHtml,
        className: 'custom-vehicle-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      L.marker([curLat, curLng], { icon: vehicleIcon }).addTo(markersLayerRef.current);
    });

  }, [activeBookings, selectedHospitalId]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Fallback Graphic if Leaflet is not available */}
      {mapError ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-900">
          <Car className="w-12 h-12 text-teal-400 animate-pulse" />
          <h4 className="text-sm font-bold text-white">Live Healthcare Transit Route Display</h4>
          <p className="text-xs text-slate-400 max-w-md">
            Connecting rural villages (Denduluru, Pedavegi, Bhimadole) to Eluru Super-Speciality Hospitals (ASRAM, District Govt Hospital).
          </p>
          <div className="flex items-center gap-3 text-xs font-mono text-teal-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span>Denduluru Village [16.75° N]</span>
            <span>➔</span>
            <span>ASRAM Medical College Hospital [16.74° N]</span>
          </div>
        </div>
      ) : (
        <div ref={mapContainerRef} className="w-full h-full" />
      )}

      {/* Floating Map Legend & Watermark */}
      <div className="absolute bottom-3 left-3 z-20 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[10px] space-y-1.5 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-cyan-400 flex items-center justify-center text-[8px] font-black text-slate-950">✚</span>
          <span className="text-slate-300 font-semibold">City Super-Speciality Hospitals</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]">📍</span>
          <span className="text-slate-300 font-semibold">Rural Pickup Villages & Towns</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
          <span className="text-slate-300 font-semibold">Live Patient Transit Vehicle</span>
        </div>
        <div className="pt-1 border-t border-slate-800 text-[9px] text-slate-500 font-mono">
          Eluru & Krishna District • Demo Coordinates
        </div>
      </div>

    </div>
  );
}

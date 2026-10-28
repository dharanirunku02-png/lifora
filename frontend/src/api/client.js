import { ClientSimulationEngine } from '../engine/clientSimulation';

const fallbackEngine = new ClientSimulationEngine();
let isBackendAvailable = null;

export async function checkBackendHealth() {
  try {
    const res = await fetch('/api/health', { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      isBackendAvailable = true;
      return true;
    }
  } catch (err) {
    // backend unreachable
  }
  isBackendAvailable = false;
  return false;
}

export async function fetchSimulationState() {
  if (isBackendAvailable !== false) {
    try {
      const res = await fetch('/api/simulation/state', { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        isBackendAvailable = true;
        const data = await res.json();
        return { data, source: 'backend' };
      }
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  
  // Standalone client fallback
  return { data: fallbackEngine.getState(), source: 'client' };
}

export async function postStartSimulation() {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/simulation/start', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  fallbackEngine.isRunning = true;
  fallbackEngine.addEvent("INFO", "LIFORA Healthcare Transit simulation resumed.", "info");
  return { status: "started" };
}

export async function postPauseSimulation() {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/simulation/pause', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  fallbackEngine.isRunning = false;
  fallbackEngine.addEvent("INFO", "Simulation paused.", "info");
  return { status: "paused" };
}

export async function postResetSimulation() {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/simulation/reset', { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  fallbackEngine.reset();
  return { status: "reset" };
}

export async function postSetSpeed(speed) {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/simulation/speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speed })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  fallbackEngine.simSpeed = speed;
  return { status: "ok", speed };
}

export async function postCreateBooking(req) {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.createBooking(req);
}

export async function postAcceptBooking(bookingId, driverId = null) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: driverId })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.acceptBooking(bookingId, driverId);
}

export async function postUpdateBookingStatus(bookingId, status) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.advanceBookingStatus(bookingId, status);
}

export async function postCompleteBooking(bookingId) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/complete`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.completeBooking(bookingId);
}

export async function postCancelBooking(bookingId) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.cancelBooking(bookingId);
}

export async function postCreateAmbulance(req) {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/ambulance-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.createAmbulanceRequest(req);
}

export async function postAdvanceAmbulance(requestId, status) {
  if (isBackendAvailable) {
    try {
      const res = await fetch(`/api/ambulance-requests/${requestId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.advanceAmbulanceStatus(requestId, status);
}

export async function postDemoStep(step) {
  if (isBackendAvailable) {
    try {
      const res = await fetch('/api/simulation/demo-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      isBackendAvailable = false;
    }
  }
  return fallbackEngine.executeDemoStep(step);
}

export { fallbackEngine };

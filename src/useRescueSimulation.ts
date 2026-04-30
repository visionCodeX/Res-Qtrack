import { useState, useEffect, useRef } from 'react';
import { Responder, SignalHit, MeshNode } from './types.ts';

const SLIDES_MOCK_COORDS = { lat: 26.2006, lng: 92.9376 }; // Northeast India region (Assam/Meghalaya landslide prone)

export function useRescueSimulation() {
  const [responders, setResponders] = useState<Responder[]>([
    { id: 'R1', name: 'Alpha-1', type: 'rescuer', position: { ...SLIDES_MOCK_COORDS }, status: 'active', lastUpdate: Date.now() },
    { id: 'R2', name: 'Alpha-2', type: 'rescuer', position: { lat: SLIDES_MOCK_COORDS.lat + 0.001, lng: SLIDES_MOCK_COORDS.lng + 0.001 }, status: 'active', lastUpdate: Date.now() },
    { id: 'D1', name: 'Drone-Alpha', type: 'drone', position: { lat: SLIDES_MOCK_COORDS.lat - 0.002, lng: SLIDES_MOCK_COORDS.lng - 0.002 }, status: 'scanning', battery: 88, lastUpdate: Date.now() },
    { id: 'PM1', name: 'Paramedic-Red', type: 'paramedic', position: { lat: SLIDES_MOCK_COORDS.lat - 0.015, lng: SLIDES_MOCK_COORDS.lng - 0.01 }, status: 'idle', lastUpdate: Date.now(), eta: 'N/A' },
  ]);

  const [signals, setSignals] = useState<SignalHit[]>([]);
  const [activeDisaster, setActiveDisaster] = useState<string | null>(null);

  const [meshNodes, setMeshNodes] = useState<MeshNode[]>([
    { id: 'Node-01', status: 'online', signalStrength: 92 },
    { id: 'Node-02', status: 'online', signalStrength: 85 },
    { id: 'Node-03', status: 'warning', signalStrength: 45 },
    { id: 'Node-04', status: 'online', signalStrength: 78 },
  ]);

  const [logs, setLogs] = useState<{ id: string, text: string, type: 'info' | 'warn' | 'alert', time: string }[]>([]);

  const addLog = (text: string, type: 'info' | 'warn' | 'alert' = 'info') => {
    setLogs(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      text,
      type,
      time: new Date().toLocaleTimeString('en-GB', { hour12: false })
    }, ...prev].slice(0, 50));
  };

  const dispatchSOS = (type: string, location: Coordinate) => {
    setActiveDisaster(type);
    addLog(`EMERGENCY: ${type.toUpperCase()} reported! Dispatching paramedics.`, 'alert');
    
    setResponders(prev => prev.map(r => {
      if (r.type === 'paramedic') {
        return { 
          ...r, 
          status: 'enroute', 
          eta: '4 mins',
          targetPos: location // We'll handle movement in interval
        };
      }
      return r;
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setResponders(prev => prev.map(r => {
        const isEnroute = r.status === 'enroute';
        let newPos = { ...r.position };
        
        if (isEnroute) {
          // Slowly move towards disaster area (hardcoded for simulation feel)
          newPos.lat += (SLIDES_MOCK_COORDS.lat - newPos.lat) * 0.1;
          newPos.lng += (SLIDES_MOCK_COORDS.lng - newPos.lng) * 0.1;
        } else {
          newPos.lat += (Math.random() - 0.5) * 0.0002;
          newPos.lng += (Math.random() - 0.5) * 0.0002;
        }

        return {
          ...r,
          position: newPos,
          battery: r.battery !== undefined ? Math.max(0, r.battery - 0.01) : undefined,
          lastUpdate: Date.now()
        };
      }));

      // Occasional signal detection
      if (Math.random() > 0.95) {
        const newSig: SignalHit = {
          id: `SIG-${Math.random().toString(36).substr(2, 4)}`.toUpperCase(),
          position: {
            lat: SLIDES_MOCK_COORDS.lat + (Math.random() - 0.5) * 0.005,
            lng: SLIDES_MOCK_COORDS.lng + (Math.random() - 0.5) * 0.005
          },
          type: Math.random() > 0.6 ? 'thermal' : 'acoustic',
          probability: Math.floor(Math.random() * 40) + 60,
          timestamp: Date.now(),
          isConfirmed: false
        };
        setSignals(prev => [...prev, newSig].slice(-10));
        addLog(`Signal detected: ${newSig.type.toUpperCase()} at [${newSig.position.lat.toFixed(4)}, ${newSig.position.lng.toFixed(4)}]`, 'alert');
      }

      // Random mesh node flicker
      if (Math.random() > 0.98) {
        setMeshNodes(prev => prev.map(n => 
          n.id === 'Node-03' ? { ...n, status: Math.random() > 0.5 ? 'online' : 'offline' } : n
        ));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { responders, signals, meshNodes, logs, addLog, dispatchSOS, activeDisaster };
}

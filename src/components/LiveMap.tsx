import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Responder, SignalHit } from '../types.ts';
import { useEffect } from 'react';

// Using a div icon to avoid asset loading issues in the sandbox
const createRescuerIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 10px ${color}"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const rescuerIcon = createRescuerIcon('#22c55e');
const droneIcon = createRescuerIcon('#3b82f6');
const paramedicIcon = createRescuerIcon('#ef4444');

interface MapProps {
  responders: Responder[];
  signals: SignalHit[];
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export default function LiveMap({ responders, signals }: MapProps) {
  const center: [number, number] = [26.2006, 92.9376];
  const enrouteParamedics = responders.filter(r => r.type === 'paramedic' && r.status === 'enroute');

  return (
    <div className="w-full h-full relative" id="map-container">
      <MapContainer 
        center={center} 
        zoom={15} 
        scrollWheelZoom={true} 
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />
        
        {enrouteParamedics.map(p => (
          <Polyline 
            key={`path-${p.id}`}
            positions={[
              [p.position.lat, p.position.lng],
              [center[0], center[1]]
            ]}
            pathOptions={{ color: '#ef4444', weight: 2, dashArray: '5, 10', opacity: 0.6 }}
          />
        ))}

        {responders.map(r => (
          <Marker 
            key={r.id} 
            position={[r.position.lat, r.position.lng]}
            icon={r.type === 'drone' ? droneIcon : r.type === 'paramedic' ? paramedicIcon : rescuerIcon}
          >
            <Popup>
              <div className="text-black font-mono text-xs">
                <strong>{r.name}</strong><br/>
                Status: {r.status}<br/>
                {r.battery && `BAT: ${r.battery.toFixed(1)}%`}
              </div>
            </Popup>
            <Circle 
              center={[r.position.lat, r.position.lng]} 
              radius={30} 
              pathOptions={{
                color: r.type === 'drone' ? '#3b82f6' : '#22c55e',
                fillColor: r.type === 'drone' ? '#3b82f6' : '#22c55e',
                fillOpacity: 0.2
              }}
            />
          </Marker>
        ))}

        {signals.map(s => (
          <Circle
            key={s.id}
            center={[s.position.lat, s.position.lng]}
            radius={80}
            pathOptions={{
              color: '#ef4444',
              fillColor: '#ef4444',
              fillOpacity: 0.3,
              dashArray: '5, 10'
            }}
          >
            <Popup>
              <div className="text-black font-mono text-xs">
                <strong>{s.id}</strong><br/>
                Target: {s.type.toUpperCase()}<br/>
                PROB: {s.probability}%
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>

      {/* Map Overlay HUD */}
      <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-black/80 border border-white/10 p-3 rounded-sm backdrop-blur-md">
          <div className="text-[10px] uppercase text-green-500 font-mono flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            System Active
          </div>
          <div className="text-[18px] font-mono font-bold">26.2006°N 92.9376°E</div>
          <div className="text-[10px] text-white/50 font-mono">NE-INDIA SECTOR 4A</div>
        </div>
      </div>
    </div>
  );
}

export type DisasterType = 
  | 'landslide' | 'flood' | 'earthquake' | 'wildfire' 
  | 'cyclone' | 'industrial' | 'medical' | 'fire';

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Responder {
  id: string;
  name: string;
  type: 'rescuer' | 'drone' | 'vehicle' | 'paramedic';
  position: Coordinate;
  status: 'active' | 'scanning' | 'returning' | 'idle' | 'enroute';
  battery?: number;
  lastUpdate: number;
  eta?: string; // For paramedics
}

export interface SignalHit {
  id: string;
  position: Coordinate;
  type: 'thermal' | 'acoustic' | 'rf';
  probability: number;
  timestamp: number;
  isConfirmed: boolean;
}

export interface MeshNode {
  id: string;
  status: 'online' | 'offline' | 'warning';
  signalStrength: number; // 0-100
}

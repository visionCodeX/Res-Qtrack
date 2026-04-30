import { Responder, MeshNode, SignalHit } from '../types.ts';
import { Activity, Battery, Radio, Shield, Users, Drone, AlertCircle, Heart } from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  responders: Responder[];
  meshNodes: MeshNode[];
  signals: SignalHit[];
}

export default function Sidebar({ responders, meshNodes, signals }: SidebarProps) {
  return (
    <div className="flex flex-col h-full bg-[#080808]">
      <div className="p-4 border-b border-[#222] bg-[#0c0c0c]">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Active Units</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {responders.map(r => (
          <motion.div 
            key={r.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 bg-[#111] border border-[#222] rounded flex flex-col gap-1 ${r.status === 'idle' ? 'opacity-60' : ''}`}
          >
            <div className="flex justify-between items-center">
              <span className={`text-xs font-bold flex items-center gap-2 ${
                r.type === 'drone' ? 'text-blue-400' : 
                r.type === 'paramedic' ? 'text-red-400' : 'text-slate-200'
              }`}>
                {r.type === 'paramedic' && <Heart size={12} className="animate-pulse" />}
                {r.name.toUpperCase()}
              </span>
              <span className={`text-[10px] px-1 ${
                r.status === 'enroute' ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30' : 
                'bg-emerald-900/30 text-emerald-500 border border-emerald-500/30'
              }`}>
                {r.status.toUpperCase()}
              </span>
            </div>
            {r.eta && r.status === 'enroute' && (
              <div className="text-[10px] font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded-sm mt-1">
                ETA: {r.eta}
              </div>
            )}
            <div className="text-[10px] font-mono text-slate-500 uppercase">
              {r.position.lat.toFixed(4)}°N / {r.position.lng.toFixed(4)}°E
            </div>
            {r.battery !== undefined && (
              <div className="w-full h-1 bg-slate-800 mt-1">
                <div 
                  className={`h-full transition-all duration-500 ${r.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${r.battery}%` }}
                ></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="p-4 border-t border-[#222] bg-[#0c0c0c]">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Mesh Network Nodes</h2>
        <div className="grid grid-cols-2 gap-2">
          {meshNodes.map(node => (
            <div key={node.id} className="p-2 bg-[#111] border border-[#222] rounded">
              <div className="text-[9px] font-mono text-slate-500 mb-1">{node.id}</div>
              <div className="flex items-center justify-between">
                <div className={`w-1.5 h-1.5 rounded-full ${
                  node.status === 'online' ? 'bg-emerald-500' : node.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-[9px] font-mono text-slate-300">{node.signalStrength}dBm</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

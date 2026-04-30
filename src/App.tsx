import { useEffect, useState } from 'react';
import { useRescueSimulation } from './useRescueSimulation.ts';
import LiveMap from './components/LiveMap.tsx';
import Sidebar from './components/Sidebar.tsx';
import { FooterFeed, AnalyticsPanel } from './components/Panels.tsx';
import { Shield, Clock, Wifi, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { responders, signals, meshNodes, logs, dispatchSOS, activeDisaster } = useRescueSimulation();
  const [systime, setSystime] = useState(new Date().toLocaleTimeString());
  const [showSosModal, setShowSosModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setSystime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSosTrigger = (type: string) => {
    dispatchSOS(type, { lat: 26.2006, lng: 92.9376 });
    setShowSosModal(false);
  };

  const disasterTypes = [
    { id: 'flood', label: 'Flood / Tsunami', color: 'bg-blue-600' },
    { id: 'fire', label: 'Wildfire / Building Fire', color: 'bg-orange-600' },
    { id: 'earthquake', label: 'Earthquake / Seismics', color: 'bg-yellow-600' },
    { id: 'landslide', label: 'Landslide / Avalanche', color: 'bg-emerald-600' },
    { id: 'cyclone', label: 'Cyclone / Hurricane', color: 'bg-sky-600' },
    { id: 'medical', label: 'Medical Emergency', color: 'bg-red-600' },
    { id: 'industrial', label: 'Chemical / Nuclear Leak', color: 'bg-purple-600' },
    { id: 'terror', label: 'Active Threat / Civil Unrest', color: 'bg-gray-800' },
  ];

  return (
    <div className="mission-control-grid relative">
      {/* SOS MODAL */}
      <AnimatePresence>
        {showSosModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1001] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#111] border border-[#333] w-full max-w-2xl p-8 rounded-lg shadow-2xl"
            >
              <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest text-center">Select Emergency Type</h2>
              <div className="grid grid-cols-2 gap-4">
                {disasterTypes.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleSosTrigger(d.id)}
                    className={`${d.color} p-6 rounded hover:scale-[1.02] active:scale-95 transition-all text-white font-bold text-center tracking-widest uppercase text-sm flex flex-col items-center gap-2`}
                  >
                    <span>{d.label}</span>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowSosModal(false)}
                className="w-full mt-6 text-slate-500 font-mono text-xs uppercase hover:text-white transition-colors"
              >
                Cancel Trigger
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP COMMAND BAR */}
      <header className="col-span-3 bg-[#0a0a0a] border-b border-[#222] px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded font-bold text-white shadow-lg">RT</div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white uppercase leading-none">
              RESQ-TRACK <span className="text-red-500 font-mono text-xs ml-2">LIVE_OPS</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">
              Command Dashboard / {activeDisaster ? activeDisaster.toUpperCase() : 'Operational Ready'}
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Network Status</span>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <span className="animate-pulse">●</span> LORA MESH: ACTIVE ({meshNodes.length} NODES)
            </div>
          </div>
          <div className="flex flex-col items-end border-l border-[#222] pl-8">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Positioning</span>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-mono">
              RTK-NAVIC: LOCKED (0.02m ACC)
            </div>
          </div>
          <button 
            onClick={() => setShowSosModal(true)}
            className="button-sos"
          >
            S.O.S. RECALL
          </button>
        </div>

        <button className="p-2 hover:bg-white/5 rounded-full transition-colors lg:hidden">
          <Menu size={20} />
        </button>
      </header>

      {/* LEFT PANEL */}
      <aside className="panel border-r border-[#222]">
        <Sidebar responders={responders} meshNodes={meshNodes} signals={signals} />
      </aside>

      {/* MAIN CENTER PANEL (MAP) */}
      <main className="relative bg-[#050505]">
        {/* Terrain/Grid overlay mock for aesthetic depth */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <LiveMap responders={responders} signals={signals} />
      </main>

      {/* RIGHT PANEL */}
      <aside className="panel border-l border-[#222]">
        <AnalyticsPanel />
      </aside>

      {/* BOTTOM ANALYTICS BAR */}
      <footer className="col-span-3 h-12 border-t border-[#222] bg-[#0a0a0a] flex items-center px-6 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">DRONE ALPHA: SCANNING</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">BEACON LINK: {meshNodes.length}/{meshNodes.length} ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${signals.length > 0 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">LIVE INCIDENTS: {signals.length.toString().padStart(2, '0')} DETECTED</span>
          </div>
        </div>
        <div className="ml-auto text-[10px] font-mono text-slate-600 tracking-tighter">
          SYS_ID: RX_77-8821 | COORD_REF: WGS84_NAVIC | <span className="text-slate-400">STAMP: {new Date().toISOString().replace('T', ' ').split('.')[0]}Z</span>
        </div>
      </footer>

      {/* FLOATING LOG OVERLAY (REPLACING THE GIANT BOX) */}
      <div className="absolute bottom-16 left-6 w-96 max-h-40 overflow-hidden z-40 pointer-events-none">
        <FooterFeed logs={logs.slice(0, 5)} />
      </div>
    </div>
  );
}

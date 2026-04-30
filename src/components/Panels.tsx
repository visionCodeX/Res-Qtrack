import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Shield, Cpu, Wind, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { analyzeSignal } from '../services/aiService.ts';

interface FeedProps {
  logs: { id: string, text: string, type: 'info' | 'warn' | 'alert', time: string }[];
}

export function FooterFeed({ logs }: FeedProps) {
  return (
    <div className="bg-black/90 p-3 border border-[#333] backdrop-blur-md rounded">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
        <Terminal size={10} /> Operation Log / Realtime
      </div>
      <div className="space-y-1">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`font-mono text-[9px] leading-tight flex gap-2 ${
                log.type === 'alert' ? 'text-red-500' : 
                log.type === 'warn' ? 'text-orange-500' : 'text-slate-400'
              }`}
            >
              <span className="opacity-40">[{log.time}]</span>
              <span>{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function AnalyticsPanel() {
  const [aiReport, setAiReport] = useState("AI_SCAN_INITIALIZING...");
  
  useEffect(() => {
    const runAnalysis = async () => {
      const report = await analyzeSignal({ sector: 'NE-INDIA-4A', activity: 'high' });
      setAiReport(report || "No critical threats detected.");
    };
    runAnalysis();
    const interval = setInterval(runAnalysis, 30000);
    return () => clearInterval(interval);
  }, []);

  const metrics = [
    { label: 'RTK_PRECISION', value: '±0.02m', color: 'text-emerald-500' },
    { label: 'BATTERY_AVG', value: '64%', color: 'text-blue-500' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#080808]">
      <div className="p-4 border-b border-[#222] bg-[#0c0c0c]">
        <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Detection Intelligence</h2>
      </div>
      
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Real-time stats */}
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(m => (
            <div key={m.label} className="bg-[#111] p-3 border border-[#222] rounded">
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">{m.label}</div>
              <div className={`text-lg font-mono font-black ${m.color}`}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* AI situation report */}
        <div className="p-4 bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-[10px] mb-2 font-bold uppercase tracking-widest">
            <BrainCircuit size={14} className="animate-pulse" />
            AI Path Assessment
          </div>
          <div className="text-[11px] text-slate-300 leading-relaxed font-mono italic">
            "{aiReport}"
          </div>
          <button className="w-full mt-3 py-1.5 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 text-[9px] font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
            PUSH TO FIELD HUD
          </button>
        </div>

        {/* Acoustic Visualizer Mock */}
        <div>
          <div className="flex justify-between items-center mb-2">
             <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Acoustic Sensors</span>
             <span className="text-[9px] text-orange-400 font-mono">GAIN: 42dB</span>
          </div>
          <div className="h-12 bg-black border border-[#222] flex items-end gap-[2px] px-2 pb-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ height: [4, Math.random() * 24 + 4, 8] }}
                transition={{ repeat: Infinity, duration: 1 + Math.random() }}
                className="flex-1 bg-orange-500/60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

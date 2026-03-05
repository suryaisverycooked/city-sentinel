import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, MapPin, Clock } from "lucide-react";
import type { InfrastructureReport } from "@/data/mockData";
import { getIriColor, getIriColorHsl, estimateTCR } from "@/data/mockData";

interface CityMapProps {
  reports: InfrastructureReport[];
  timelineProgress: number;
  highlightedId?: string | null;
  onClearHighlight?: () => void;
}

export default function CityMap({ reports, timelineProgress, highlightedId, onClearHighlight }: CityMapProps) {
  const [selected, setSelected] = useState<InfrastructureReport | null>(null);

  const getInterpolatedScore = (r: InfrastructureReport) =>
    Math.round(r.iriScore + (r.futureIriScore - r.iriScore) * timelineProgress);

  return (
    <div className="glass-card relative w-full h-full min-h-[500px] overflow-hidden bg-[#0f172a]">
      {/* Background Image - Bangalore Map Style */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1590059530432-849c7a527027?auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'luminosity'
        }}
      />
      
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Title */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
        <p className="text-[10px] text-[#38bdf8] font-mono uppercase tracking-[0.2em]">Live Monitoring</p>
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Bangalore Infrastructure Map</h2>
      </div>

      {/* Markers */}
      {reports.map((r) => {
        const score = getInterpolatedScore(r);
        const color = getIriColor(score);
        const isCritical = score > 75;
        const isHighlighted = highlightedId === r.id;

        return (
          <motion.button
            key={r.id}
            className="absolute z-20 group"
            style={{ left: `${r.coordinates.x}%`, top: `${r.coordinates.y}%` }}
            whileHover={{ scale: 1.5 }}
            onClick={() => { setSelected(r); onClearHighlight?.(); }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: isHighlighted ? 1.6 : 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Outer glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                inset: "-16px",
              }}
              animate={{
                scale: isCritical ? [1, 1.4, 1] : [1, 1.1, 1],
                opacity: isCritical ? [0.6, 0.2, 0.6] : 0.3,
              }}
              transition={{ duration: isCritical ? 1.5 : 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Core dot */}
            <div
              className="w-4 h-4 rounded-full border-2 border-[#0f172a] relative z-10"
              style={{ 
                backgroundColor: color, 
                boxShadow: `0 0 12px ${color}` 
              }}
            />

            {/* Hover tooltip */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
              <div className="bg-[#1e293b]/95 border border-white/10 backdrop-blur-md rounded-xl px-4 py-3 shadow-2xl space-y-1 text-left">
                <p className="text-xs font-bold text-white">{r.location}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-tight">{r.type}</p>
                <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-white/5">
                  <span className="text-xs font-mono font-bold" style={{ color: color }}>IRI: {score}</span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock size={10} />
                    <span>TCR: {estimateTCR(score)}</span>
                  </div>
                </div>
              </div>
              <div className="w-2 h-2 bg-[#1e293b] border-r border-b border-white/10 rotate-45 mx-auto -mt-1" />
            </div>
          </motion.button>
        );
      })}

      {/* Detail card */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute bottom-4 left-4 right-4 z-30 glass-card-strong p-5"
          >
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
            <div className="flex items-start gap-4">
              {selected.imageUrl ? (
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                  <img src={selected.imageUrl} alt={selected.type} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-secondary shrink-0">
                  <MapPin size={20} className="text-system" />
                </div>
              )}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{selected.type}</h3>
                  <span
                    className="text-xs font-mono px-2 py-0.5 rounded-full"
                    style={{
                      background: getIriColorHsl(getInterpolatedScore(selected)),
                      color: "white",
                    }}
                  >
                    IRI: {getInterpolatedScore(selected)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{selected.location}</p>
                <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                  <span>Severity: {selected.severity}</span>
                  <span>TCR: {estimateTCR(getInterpolatedScore(selected))}</span>
                  <span>ID: {selected.id}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

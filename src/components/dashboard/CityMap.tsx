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
    <div className="glass-card relative w-full h-full min-h-[500px] overflow-hidden">
      {/* Grid overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Simulated road network */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M10,50 Q30,20 50,50 T90,50" stroke="hsl(var(--primary))" fill="none" strokeWidth="0.3" />
        <path d="M50,10 Q20,30 50,50 T50,90" stroke="hsl(var(--primary))" fill="none" strokeWidth="0.3" />
        <path d="M15,20 L85,80" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.2" />
        <path d="M85,20 L15,80" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.2" />
        <path d="M5,35 L95,35" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.15" />
        <path d="M5,65 L95,65" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.15" />
        <path d="M30,5 L30,95" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.15" />
        <path d="M70,5 L70,95" stroke="hsl(var(--muted-foreground))" fill="none" strokeWidth="0.15" />
      </svg>

      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">City Infrastructure Map</p>
      </div>

      {/* Markers */}
      {reports.map((r) => {
        const score = getInterpolatedScore(r);
        const colorHsl = getIriColorHsl(score);
        const isCritical = score > 60;
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
                background: `radial-gradient(circle, ${colorHsl.replace(")", " / 0.3)")} 0%, transparent 70%)`,
                inset: "-12px",
              }}
              animate={isCritical ? {
                scale: [1, 1.4, 1],
                opacity: [0.4, 0.15, 0.4],
              } : {
                opacity: 0.25,
              }}
              transition={isCritical ? { duration: 2.5, repeat: Infinity, ease: "easeInOut" } : {}}
            />

            {/* Middle glow ring */}
            <motion.div
              className="absolute rounded-full"
              style={{
                border: `1px solid ${colorHsl.replace(")", " / 0.3)")}`,
                inset: "-6px",
              }}
              animate={isCritical ? {
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.2, 0.5],
              } : {}}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            />

            {/* Highlight ring */}
            {isHighlighted && (
              <motion.div
                className="absolute rounded-full border-2"
                style={{ borderColor: "hsl(var(--primary))", inset: "-10px" }}
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Core dot */}
            <div
              className="w-4 h-4 rounded-full border-2 border-background relative"
              style={{ background: colorHsl, boxShadow: `0 0 8px ${colorHsl.replace(")", " / 0.5)")}` }}
            />

            {/* Hover tooltip */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
              <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl space-y-0.5 text-left">
                <p className="text-xs font-semibold">{r.type}</p>
                <p className="text-xs font-mono" style={{ color: colorHsl }}>IRI: {score}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock size={10} />
                  <span>TCR: {estimateTCR(score)}</span>
                </div>
              </div>
              <div className="w-2 h-2 bg-card border-r border-b border-border rotate-45 mx-auto -mt-1" />
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

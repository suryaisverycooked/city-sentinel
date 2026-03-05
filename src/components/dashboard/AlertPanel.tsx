import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { InfrastructureReport } from "@/data/mockData";
import { getIriColorHsl } from "@/data/mockData";

interface AlertPanelProps {
  reports: InfrastructureReport[];
  onSelectAlert?: (id: string) => void;
}

export default function AlertPanel({ reports, onSelectAlert }: AlertPanelProps) {
  const criticalReports = [...reports]
    .filter((r) => r.iriScore > 50)
    .sort((a, b) => b.iriScore - a.iriScore);

  return (
    <div className="glass-card h-full flex flex-col bg-white/5 border-white/10">
      <div className="p-4 border-b border-white/10 flex items-center gap-2">
        <AlertTriangle size={16} className="text-[#ef4444]" />
        <h2 className="text-sm font-bold uppercase tracking-[0.15em]">High Risk Zones</h2>
        <span className="ml-auto text-xs font-mono text-slate-500">{criticalReports.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {criticalReports.map((r, i) => {
          const score = r.iriScore;
          const color = getIriColor(score);
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, x: -2 }}
              onClick={() => onSelectAlert?.(r.id)}
              className="p-4 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:border-white/20 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-1 h-full" style={{ backgroundColor: color }} />
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{r.type}</span>
                </div>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                  }}
                >
                  {score}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                 <MapPin size={12} className="text-slate-500" />
                 <p className="text-xs text-slate-400 font-medium">{r.location}</p>
              </div>
            </motion.div>
          );
        })}
        {criticalReports.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">No critical alerts</p>
        )}
      </div>
    </div>
  );
}

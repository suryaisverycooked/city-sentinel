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
    <div className="glass-card h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <AlertTriangle size={16} className="text-critical" />
        <h2 className="text-sm font-semibold uppercase tracking-wider">Critical Alerts</h2>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{criticalReports.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {criticalReports.map((r, i) => {
          const isHighCritical = r.iriScore > 80;
          const isCritical = r.iriScore > 60;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, x: -2 }}
              onClick={() => onSelectAlert?.(r.id)}
              className={`p-3 rounded-lg bg-secondary/50 border border-border cursor-pointer transition-all duration-300 ${
                isHighCritical ? "glow-critical" : isCritical ? "hover:border-critical/30" : "hover:border-warning/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {r.imageUrl && (
                    <div className="w-8 h-8 rounded overflow-hidden border border-border shrink-0">
                      <img src={r.imageUrl} alt={r.type} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <span className="text-sm font-medium">{r.type}</span>
                </div>
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: getIriColorHsl(r.iriScore),
                    color: "white",
                  }}
                >
                  {r.iriScore}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{r.location}</p>
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

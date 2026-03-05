import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { InfrastructureReport } from "@/data/mockData";
import { getIriColor } from "@/data/mockData";

interface AlertPanelProps {
  reports: InfrastructureReport[];
}

export default function AlertPanel({ reports }: AlertPanelProps) {
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
          const isCritical = r.iriScore > 60;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`p-3 rounded-lg bg-secondary/50 border border-border hover:border-primary/30 transition-all duration-300 ${isCritical ? "glow-critical" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{r.type}</span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-${getIriColor(r.iriScore)} text-${getIriColor(r.iriScore)}-foreground`}
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

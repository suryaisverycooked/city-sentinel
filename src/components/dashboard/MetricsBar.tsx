import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Activity, AlertTriangle, TrendingUp } from "lucide-react";
import type { InfrastructureReport } from "@/data/mockData";

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(motionVal, value, { duration: 1.2, ease: "easeOut" });
    return controls.stop;
  }, [value, motionVal]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = String(v);
    });
    return unsubscribe;
  }, [rounded]);

  return <span ref={ref}>0</span>;
}

interface MetricsBarProps {
  reports: InfrastructureReport[];
}

export default function MetricsBar({ reports }: MetricsBarProps) {
  const total = reports.length;
  const critical = reports.filter((r) => r.iriScore > 60).length;
  const predicted = reports.filter((r) => r.futureIriScore > 60).length;

  const metrics = [
    {
      label: "Total Reports",
      value: total,
      icon: Activity,
      color: "text-system",
    },
    {
      label: "Critical Locations",
      value: critical,
      icon: AlertTriangle,
      color: "text-critical",
    },
    {
      label: "Predicted Failures (12mo)",
      value: predicted,
      icon: TrendingUp,
      color: "text-warning",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass-card p-5 flex items-center gap-4 hover:border-primary/40 transition-colors duration-300"
        >
          <div className={`p-3 rounded-lg bg-secondary ${m.color}`}>
            <m.icon size={22} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{m.label}</p>
            <p className="text-3xl font-bold font-mono tracking-tight">
              <AnimatedNumber value={m.value} />
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

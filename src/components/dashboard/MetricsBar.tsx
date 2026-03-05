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
  const critical = reports.filter((r) => r.iriScore > 75).length;
  const predicted = reports.filter((r) => r.futureIriScore > 75).length;

  const metrics = [
    {
      label: "Monitoring Points",
      value: total,
      icon: Activity,
      color: "text-[#38bdf8]",
      bgColor: "bg-[#38bdf8]/10"
    },
    {
      label: "Critical Risks",
      value: critical,
      icon: AlertTriangle,
      color: "text-[#ef4444]",
      bgColor: "bg-[#ef4444]/10"
    },
    {
      label: "Failure Predictions",
      value: predicted,
      icon: TrendingUp,
      color: "text-[#f59e0b]",
      bgColor: "bg-[#f59e0b]/10"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          className="glass-card p-6 flex items-center gap-5 hover:border-[#38bdf8]/40 transition-all duration-500 group"
        >
          <div className={`p-4 rounded-xl ${m.bgColor} ${m.color} transition-transform group-hover:scale-110`}>
            <m.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500 mb-1">{m.label}</p>
            <p className="text-3xl font-bold font-mono tracking-tighter text-white">
              <AnimatedNumber value={m.value} />
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

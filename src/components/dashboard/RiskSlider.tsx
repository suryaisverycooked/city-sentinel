import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

interface RiskSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function RiskSlider({ value, onChange }: RiskSliderProps) {
  const monthLabel = value === 0 ? "Real-time Status" : `+${Math.round(value * 12)} Months Prediction`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col md:flex-row items-center gap-6 bg-white/5 border-white/10 shadow-2xl"
    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="p-2 rounded-lg bg-[#38bdf8]/10 text-[#38bdf8]">
          <Clock size={18} />
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
          Infrastructure Risk Forecast
        </span>
      </div>
      
      <div className="flex-1 w-full flex flex-col gap-2">
        <div className="flex-1 relative flex items-center gap-4">
          <span className="text-[10px] font-bold font-mono text-[#10b981] uppercase tracking-tighter">Current</span>
          <div className="flex-1 relative pt-6">
            <input
              type="range"
              min={0}
              max={100}
              value={value * 100}
              onChange={(e) => onChange(Number(e.target.value) / 100)}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/10
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#38bdf8] [&::-webkit-slider-thumb]:shadow-[0_0_15px_rgba(56,189,248,0.5)]
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0f172a]
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-[#38bdf8] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0f172a]"
            />
            <motion.div
              className="absolute -top-1 text-[10px] font-bold font-mono px-3 py-1 rounded-full bg-[#38bdf8] text-[#0f172a] shadow-lg whitespace-nowrap"
              style={{ left: `${value * 100}%`, transform: "translateX(-50%)" }}
              animate={{ opacity: value > 0 ? 1 : 0 }}
            >
              {monthLabel}
            </motion.div>
          </div>
          <span className="text-[10px] font-bold font-mono text-[#ef4444] uppercase tracking-tighter">+12 Mo</span>
        </div>
      </div>
    </motion.div>
  );
}

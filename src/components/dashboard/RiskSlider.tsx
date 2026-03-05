import { motion } from "framer-motion";
import { Clock, TrendingUp } from "lucide-react";

interface RiskSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export default function RiskSlider({ value, onChange }: RiskSliderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4 flex items-center gap-4"
    >
      <Clock size={16} className="text-system shrink-0" />
      <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider whitespace-nowrap">
        Risk Timeline
      </span>
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs font-mono text-safe">Today</span>
        <div className="flex-1 relative">
          <input
            type="range"
            min={0}
            max={100}
            value={value * 100}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-secondary
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-system [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:shadow-system/30 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-background
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-system [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-background"
          />
        </div>
        <span className="text-xs font-mono text-critical">+12 Months</span>
      </div>
      <TrendingUp size={16} className="text-warning shrink-0" />
    </motion.div>
  );
}

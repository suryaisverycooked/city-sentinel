import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Shield } from "lucide-react";
import { initialReports, type InfrastructureReport } from "@/data/mockData";
import MetricsBar from "@/components/dashboard/MetricsBar";
import CityMap from "@/components/dashboard/CityMap";
import AlertPanel from "@/components/dashboard/AlertPanel";
import RiskSlider from "@/components/dashboard/RiskSlider";
import DamageReportModal from "@/components/dashboard/DamageReportModal";

const Index = () => {
  const [reports, setReports] = useState<InfrastructureReport[]>(initialReports);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const addReport = (report: InfrastructureReport) => {
    setReports((prev) => [...prev, report]);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col gap-4">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 glow-system">
            <Shield size={24} className="text-system" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Invisible Infrastructure</h1>
            <p className="text-xs text-muted-foreground font-mono">Smart City Monitoring System</p>
          </div>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity glow-system"
        >
          <Plus size={16} />
          Report Damage
        </button>
      </motion.header>

      {/* Metrics */}
      <MetricsBar reports={reports} />

      {/* Risk Timeline Slider */}
      <RiskSlider value={timelineProgress} onChange={setTimelineProgress} />

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
        <CityMap reports={reports} timelineProgress={timelineProgress} />
        <AlertPanel reports={reports} />
      </div>

      {/* Modal */}
      <DamageReportModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addReport} />
    </div>
  );
};

export default Index;

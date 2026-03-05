import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Shield } from "lucide-react";
import { initialReports, futureRiskMarkers, type InfrastructureReport } from "@/data/mockData";
import MetricsBar from "@/components/dashboard/MetricsBar";
import CityMap from "@/components/dashboard/CityMap";
import AlertPanel from "@/components/dashboard/AlertPanel";
import RiskSlider from "@/components/dashboard/RiskSlider";
import DamageReportModal from "@/components/dashboard/DamageReportModal";

const Index = () => {
  const [reports, setReports] = useState<InfrastructureReport[]>(initialReports);
  const [timelineProgress, setTimelineProgress] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [highlightedAlertId, setHighlightedAlertId] = useState<string | null>(null);

  const addReport = (report: InfrastructureReport) => {
    setReports((prev) => [...prev, report]);
  };

  // Merge future risk markers when timeline progresses past threshold
  const visibleReports = useMemo(() => {
    const emerging = futureRiskMarkers
      .filter((_, i) => timelineProgress > (i + 1) * 0.25)
      .map((r, i) => ({
        ...r,
        id: `FUT-${i + 1}`,
        timestamp: new Date().toISOString(),
      }));
    return [...reports, ...emerging];
  }, [reports, timelineProgress]);

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
      <MetricsBar reports={visibleReports} />

      {/* Risk Timeline Slider */}
      <RiskSlider value={timelineProgress} onChange={setTimelineProgress} />

      {/* Main content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 min-h-0">
        <CityMap
          reports={visibleReports}
          timelineProgress={timelineProgress}
          highlightedId={highlightedAlertId}
          onClearHighlight={() => setHighlightedAlertId(null)}
        />
        <AlertPanel reports={visibleReports} onSelectAlert={setHighlightedAlertId} />
      </div>

      {/* Modal */}
      <DamageReportModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={addReport} />
    </div>
  );
};

export default Index;

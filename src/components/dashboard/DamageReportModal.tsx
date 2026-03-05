import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle, MapPin } from "lucide-react";
import { generateRandomReport, type InfrastructureReport } from "@/data/mockData";

type Stage = "upload" | "analyzing" | "result";

interface DamageReportModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (report: InfrastructureReport) => void;
}

export default function DamageReportModal({ open, onClose, onAdd }: DamageReportModalProps) {
  const [stage, setStage] = useState<Stage>("upload");
  const [result, setResult] = useState<ReturnType<typeof generateRandomReport> | null>(null);

  const handleUpload = () => {
    setStage("analyzing");
    setTimeout(() => {
      const r = generateRandomReport();
      setResult(r);
      setStage("result");
    }, 2500);
  };

  const handleAddToMap = () => {
    if (!result) return;
    const report: InfrastructureReport = {
      ...result,
      id: `INF-${String(Date.now()).slice(-4)}`,
      timestamp: new Date().toISOString(),
    };
    onAdd(report);
    handleClose();
  };

  const handleClose = () => {
    setStage("upload");
    setResult(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card-strong w-full max-w-md p-6 mx-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Report Infrastructure Damage</h2>
              <button onClick={handleClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            {stage === "upload" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div
                  onClick={handleUpload}
                  className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload size={32} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                  <p className="text-xs text-muted-foreground">Simulated upload — no file required</p>
                </div>
              </motion.div>
            )}

            {stage === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 py-10"
              >
                <Loader2 size={40} className="text-system animate-spin" />
                <p className="text-sm font-mono text-system">Analyzing Infrastructure Damage…</p>
                <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-system rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.3, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}

            {stage === "result" && result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center gap-2 text-safe">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Damage Type</span>
                    <span className="font-semibold">{result.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Severity</span>
                    <span className={`font-semibold ${result.severity === "High" ? "text-critical" : result.severity === "Medium" ? "text-warning" : "text-safe"}`}>
                      {result.severity}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IRI Score</span>
                    <span className="font-bold text-lg">{result.iriScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location</span>
                    <span>{result.location}</span>
                  </div>
                </div>
                <button
                  onClick={handleAddToMap}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MapPin size={16} />
                  Add to City Map
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

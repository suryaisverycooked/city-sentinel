import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle, MapPin, ImageIcon } from "lucide-react";
import { generateRandomReport, getIriColorHsl, type InfrastructureReport } from "@/data/mockData";
import { toast } from "sonner";

type Stage = "upload" | "analyzing" | "result";

interface DamageReportModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (report: InfrastructureReport) => void;
}

export default function DamageReportModal({ open, onClose, onAdd }: DamageReportModalProps) {
  const [stage, setStage] = useState<Stage>("upload");
  const [result, setResult] = useState<ReturnType<typeof generateRandomReport> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setImagePreview(url);
      setStage("analyzing");
      setTimeout(() => {
        const r = generateRandomReport(url);
        setResult(r);
        setStage("result");
      }, 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }, []);

  const handleSimulatedUpload = () => {
    // Create a simulated image for demo purposes
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    // Dark asphalt background
    ctx.fillStyle = "#2a2a2a";
    ctx.fillRect(0, 0, 400, 300);
    // Simulated damage texture
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.ellipse(200, 150, 80, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 130);
    ctx.bezierCurveTo(160, 100, 240, 180, 280, 160);
    ctx.stroke();
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.ellipse(190, 145, 40, 25, -0.3, 0, Math.PI * 2);
    ctx.fill();

    const url = canvas.toDataURL("image/png");
    setImagePreview(url);
    setFileName("infrastructure_scan_001.png");
    setStage("analyzing");
    setTimeout(() => {
      const r = generateRandomReport(url);
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
    toast.success("Report Added to Dashboard", {
      description: `${report.type} at ${report.location} — IRI: ${report.iriScore}`,
    });
    handleClose();
  };

  const handleClose = () => {
    setStage("upload");
    setResult(null);
    setImagePreview(null);
    setFileName("");
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
            className={`glass-card-strong mx-4 p-6 ${stage === "result" ? "w-full max-w-2xl" : "w-full max-w-md"}`}
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
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <Upload size={32} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag & drop an image here</p>
                  <label className="cursor-pointer px-4 py-2 rounded-lg bg-secondary text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </label>
                </div>
                <button
                  onClick={handleSimulatedUpload}
                  className="w-full py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  Use Simulated Scan (Demo)
                </button>
              </motion.div>
            )}

            {stage === "analyzing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {imagePreview && (
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img src={imagePreview} alt="Uploaded" className="w-full h-48 object-cover" />
                    <div className="p-2 bg-secondary/50 text-xs text-muted-foreground font-mono truncate">
                      {fileName}
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 size={36} className="text-system animate-spin" />
                  <p className="text-sm font-mono text-system">Analyzing Infrastructure Condition…</p>
                  <div className="w-48 h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-system rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "result" && result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="flex items-center gap-2 text-safe">
                  <CheckCircle size={18} />
                  <span className="text-sm font-medium">Analysis Complete</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Image preview */}
                  <div className="rounded-lg overflow-hidden border border-border">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Damage" className="w-full h-full min-h-[200px] object-cover" />
                    ) : (
                      <div className="w-full h-full min-h-[200px] bg-secondary flex items-center justify-center">
                        <ImageIcon size={40} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Right: Results */}
                  <div className="space-y-3">
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
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">IRI Score</span>
                        <span className="font-bold text-2xl" style={{ color: getIriColorHsl(result.iriScore) }}>
                          {result.iriScore}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location</span>
                        <span className="text-right">{result.location}</span>
                      </div>
                    </div>

                    {/* IRI visual bar */}
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground font-mono">Infrastructure Risk Index</div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: getIriColorHsl(result.iriScore) }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${result.iriScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToMap}
                  className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MapPin size={16} />
                  Submit Report
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

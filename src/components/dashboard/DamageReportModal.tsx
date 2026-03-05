import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader2, CheckCircle, MapPin, ImageIcon, AlertTriangle } from "lucide-react";
import { getIriColorHsl, getIriColor, type InfrastructureReport } from "@/data/mockData";
import { analyzeInfrastructure } from "@/utils/analyzeInfrastructure";
import { toast } from "sonner";

type Stage = "upload" | "analyzing" | "result";

interface DamageReportModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (report: InfrastructureReport) => void;
}

export default function DamageReportModal({ open, onClose, onAdd, isStandalone = false }: DamageReportModalProps & { isStandalone?: boolean }) {
  const [stage, setStage] = useState<Stage>("upload");
  const [result, setResult] = useState<Partial<InfrastructureReport> | null>(null);
  const [description, setDescription] = useState("");
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
        const r = analyzeInfrastructure(description || file.name, url);
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
  }, [description]);

  const handleSimulatedUpload = (type: string) => {
    setDescription(type);
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(0, 0, 400, 300);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(350, 250);
    ctx.stroke();
    
    const url = canvas.toDataURL("image/png");
    setImagePreview(url);
    setFileName("infrastructure_scan.png");
    setStage("analyzing");
    setTimeout(() => {
      const r = analyzeInfrastructure(type, url);
      setResult(r);
      setStage("result");
    }, 2500);
  };

  const handleAddToMap = () => {
    if (!result) return;
    const locations = ["Whitefield", "Indiranagar", "Electronic City", "Koramangala", "MG Road", "Hebbal"];
    const report: InfrastructureReport = {
      ...result as InfrastructureReport,
      id: `BLR-${String(Date.now()).slice(-4)}`,
      timestamp: new Date().toISOString(),
      location: locations[Math.floor(Math.random() * locations.length)],
      coordinates: {
        x: Math.floor(Math.random() * 60) + 20,
        y: Math.floor(Math.random() * 60) + 20,
      }
    };
    onAdd(report);
    toast.success("AI Analysis Verified", {
      description: `${report.type} detected at ${report.location}.`,
    });
    
    if (isStandalone) {
      setStage("upload");
      setResult(null);
      setImagePreview(null);
      setFileName("");
      setDescription("");
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setStage("upload");
    setResult(null);
    setImagePreview(null);
    setFileName("");
    setDescription("");
    if (onClose) onClose();
  };

  const content = (
    <div className={`space-y-6 ${isStandalone ? "" : "glass-card-strong p-8"}`}>
       {!isStandalone && (
         <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-bold text-xl text-white tracking-tight">AI Infrastructure Audit</h2>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">Bangalore Sentinel v2.4</p>
            </div>
            <button onClick={handleClose} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
       )}

       {stage === "upload" && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
           <div className="space-y-2">
             <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Damage Description</label>
             <input 
               type="text" 
               placeholder="e.g. Large pothole on main road" 
               className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#38bdf8]/50"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
           </div>
           <div
             onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
             onDragLeave={() => setIsDragging(false)}
             onDrop={handleDrop}
             className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-colors ${
               isDragging ? "border-[#38bdf8] bg-[#38bdf8]/5" : "border-white/10 hover:border-[#38bdf8]/50"
             }`}
           >
             <Upload size={32} className="text-slate-500" />
             <p className="text-sm text-slate-400">Drag & drop infrastructure image</p>
             <label className="cursor-pointer px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
               Choose File
               <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
             </label>
           </div>
           <div className="grid grid-cols-2 gap-2">
             <button
               onClick={() => handleSimulatedUpload("Large structural destruction")}
               className="py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white transition-colors"
             >
               Structural Failure
             </button>
             <button
               onClick={() => handleSimulatedUpload("Large road cavity")}
               className="py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white transition-colors"
             >
               Large Pothole
             </button>
           </div>
         </motion.div>
       )}

       {stage === "analyzing" && (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
           {imagePreview && (
             <div className="rounded-xl overflow-hidden border border-white/10">
               <img src={imagePreview} alt="Uploaded" className="w-full h-48 object-cover" />
               <div className="p-2 bg-black/40 text-[10px] text-slate-500 font-mono truncate">
                 Scanning: {fileName}
               </div>
             </div>
           )}
           <div className="flex flex-col items-center gap-4 py-4">
             <Loader2 size={36} className="text-[#38bdf8] animate-spin" />
             <p className="text-sm font-mono text-[#38bdf8] animate-pulse uppercase tracking-widest">Running AI Diagnostics…</p>
             <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div
                 className="h-full bg-[#38bdf8] rounded-full"
                 initial={{ width: "0%" }}
                 animate={{ width: "100%" }}
                 transition={{ duration: 2.3, ease: "easeInOut" }}
               />
             </div>
           </div>
         </motion.div>
       )}

       {stage === "result" && result && (
         <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
           <div className="flex items-center gap-2 text-[#10b981]">
             <CheckCircle size={18} />
             <span className="text-sm font-bold uppercase tracking-wider">AI Classification Successful</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Left: Image preview */}
             <div className="rounded-xl overflow-hidden border border-white/10 relative group">
               {imagePreview ? (
                 <img src={imagePreview} alt="Damage" className="w-full h-full min-h-[200px] object-cover" />
               ) : (
                 <div className="w-full h-full min-h-[200px] bg-white/5 flex items-center justify-center">
                   <ImageIcon size={40} className="text-slate-600" />
                 </div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             </div>

             {/* Right: Results */}
             <div className="space-y-4">
               <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">Detected Type</span>
                   <span className="font-bold text-white">{result.type}</span>
                 </div>
                 
                 <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                     <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">Risk Score</span>
                     <span className="text-3xl font-bold font-mono" style={{ color: getIriColor(result.iriScore || 0) }}>
                       {result.iriScore}
                     </span>
                   </div>
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border`} 
                        style={{ borderColor: `${getIriColor(result.iriScore || 0)}40`, color: getIriColor(result.iriScore || 0), backgroundColor: `${getIriColor(result.iriScore || 0)}10` }}>
                     {result.severity}
                   </div>
                 </div>
               </div>

               {/* IRI visual bar */}
               <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-mono uppercase tracking-tight text-slate-500">
                   <span>Infrastructure Risk Index</span>
                   <span>{result.iriScore}/100</span>
                 </div>
                 <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                   <motion.div
                     className="h-full rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                     style={{ background: getIriColor(result.iriScore || 0) }}
                     initial={{ width: "0%" }}
                     animate={{ width: `${result.iriScore}%` }}
                     transition={{ duration: 1, ease: "easeOut" }}
                   />
                 </div>
               </div>
             </div>
           </div>

           <button
             onClick={handleAddToMap}
             className="w-full py-4 rounded-xl bg-[#38bdf8] text-[#0f172a] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#38bdf8]/20"
           >
             <MapPin size={18} />
             Validate & Deploy to Dashboard
           </button>
         </motion.div>
       )}
    </div>
  );

  if (isStandalone) {
    return content;
  }

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className={`glass-card-strong mx-4 p-0 ${stage === "result" ? "w-full max-w-3xl" : "w-full max-w-lg"}`}
          >
            {content}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

            {stage === "upload" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Damage Description</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Large pothole on main road" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#38bdf8]/50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 transition-colors ${
                    isDragging ? "border-[#38bdf8] bg-[#38bdf8]/5" : "border-white/10 hover:border-[#38bdf8]/50"
                  }`}
                >
                  <Upload size={32} className="text-slate-500" />
                  <p className="text-sm text-slate-400">Drag & drop infrastructure image</p>
                  <label className="cursor-pointer px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors">
                    Choose File
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleSimulatedUpload("Large structural destruction")}
                    className="py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    Structural Failure
                  </button>
                  <button
                    onClick={() => handleSimulatedUpload("Large road cavity")}
                    className="py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] text-slate-400 hover:text-white transition-colors"
                  >
                    Large Pothole
                  </button>
                </div>
              </motion.div>
            )}

            {stage === "analyzing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {imagePreview && (
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={imagePreview} alt="Uploaded" className="w-full h-48 object-cover" />
                    <div className="p-2 bg-black/40 text-[10px] text-slate-500 font-mono truncate">
                      Scanning: {fileName}
                    </div>
                  </div>
                )}
                <div className="flex flex-col items-center gap-4 py-4">
                  <Loader2 size={36} className="text-[#38bdf8] animate-spin" />
                  <p className="text-sm font-mono text-[#38bdf8] animate-pulse uppercase tracking-widest">Running AI Diagnostics…</p>
                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#38bdf8] rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.3, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {stage === "result" && result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="flex items-center gap-2 text-[#10b981]">
                  <CheckCircle size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">AI Classification Successful</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left: Image preview */}
                  <div className="rounded-xl overflow-hidden border border-white/10 relative group">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Damage" className="w-full h-full min-h-[200px] object-cover" />
                    ) : (
                      <div className="w-full h-full min-h-[200px] bg-white/5 flex items-center justify-center">
                        <ImageIcon size={40} className="text-slate-600" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>

                  {/* Right: Results */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-xl p-5 space-y-4 border border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">Detected Type</span>
                        <span className="font-bold text-white">{result.type}</span>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">Risk Score</span>
                          <span className="text-3xl font-bold font-mono" style={{ color: getIriColor(result.iriScore || 0) }}>
                            {result.iriScore}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border`} 
                             style={{ borderColor: `${getIriColor(result.iriScore || 0)}40`, color: getIriColor(result.iriScore || 0), backgroundColor: `${getIriColor(result.iriScore || 0)}10` }}>
                          {result.severity}
                        </div>
                      </div>
                    </div>

                    {/* IRI visual bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-mono uppercase tracking-tight text-slate-500">
                        <span>Infrastructure Risk Index</span>
                        <span>{result.iriScore}/100</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          className="h-full rounded-full shadow-[0_0_10px_rgba(56,189,248,0.3)]"
                          style={{ background: getIriColor(result.iriScore || 0) }}
                          initial={{ width: "0%" }}
                          animate={{ width: `${result.iriScore}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddToMap}
                  className="w-full py-4 rounded-xl bg-[#38bdf8] text-[#0f172a] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#38bdf8]/20"
                >
                  <MapPin size={18} />
                  Validate & Deploy to Dashboard
                </button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

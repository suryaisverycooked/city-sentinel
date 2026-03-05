import { useState } from "react";
import { motion } from "framer-motion";
import DamageReportModal from "@/components/dashboard/DamageReportModal";
import { Shield } from "lucide-react";

const ReportPage = () => {
  const [reports, setReports] = useState([]);
  
  const addReport = (report: any) => {
    setReports((prev) => [...prev, report]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 md:p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20">
            <Shield size={24} className="text-[#38bdf8]" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Infrastructure Audit</h1>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Submit New Damage Report</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl glass-card-strong p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-bold text-xl text-white tracking-tight">AI Infrastructure Audit</h2>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">Bangalore Sentinel v2.4</p>
              </div>
            </div>
            <DamageReportModal open={true} onClose={undefined as any} onAdd={addReport} isStandalone />
        </div>
      </main>
    </div>
  );
};

export default ReportPage;

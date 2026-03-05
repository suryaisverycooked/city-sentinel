import { motion } from "framer-motion";
import { Shield, ArrowRight, AlertTriangle, Activity, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-[#38bdf8]/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/50 to-[#0f172a]" />
          <img 
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80" 
            alt="City Skyline" 
            className="w-full h-full object-cover opacity-40 scale-105 animate-slow-zoom"
          />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#38bdf8]/10 border border-[#38bdf8]/20 text-[#38bdf8] text-sm font-medium mb-8"
          >
            <Zap size={14} />
            <span>AI-Powered Infrastructure Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Predict Infrastructure Failure <br />
            <span className="text-[#38bdf8]">Before It Happens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            AI-powered monitoring platform that detects infrastructure damage,
            calculates risk, and predicts failures across Bangalore.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group relative px-8 py-4 bg-[#38bdf8] text-[#0f172a] font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Launch Bangalore Dashboard
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <button
              className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white font-bold rounded-xl transition-all hover:bg-white/10 flex items-center gap-2"
            >
              Report Infrastructure Damage
            </button>
          </motion.div>
        </div>
        
        {/* Floating cards for glassmorphism preview */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-6 opacity-0 md:opacity-100 scale-90 lg:scale-100">
           {[
             { label: "Infrastructure Risk Index", value: "84.2", color: "#ef4444", icon: AlertTriangle },
             { label: "AI Detection Accuracy", value: "99.8%", color: "#10b981", icon: Shield },
             { label: "Active Monitors", value: "1,240", color: "#38bdf8", icon: Activity }
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 1 + i * 0.2 }}
               className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl min-w-[240px]"
             >
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                   <stat.icon size={20} />
                 </div>
                 <span className="text-sm font-medium text-slate-400">{stat.label}</span>
               </div>
               <div className="text-3xl font-bold">{stat.value}</div>
             </motion.div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default Home;

import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, FileText, Home } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Report Damage", path: "/report", icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#0f172a]/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#38bdf8]/10 border border-[#38bdf8]/20">
            <Shield size={18} className="text-[#38bdf8]" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white hidden sm:block">Sentinel AI</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive ? "text-[#38bdf8]" : "text-slate-400 hover:text-white"
                }`}
              >
                <item.icon size={14} />
                <span className="hidden xs:block">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#38bdf8]"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

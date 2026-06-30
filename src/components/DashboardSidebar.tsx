import React from "react";
import { 
  Activity, 
  Sun, 
  TrendingUp, 
  Satellite as SatIcon, 
  ShieldAlert, 
  Database, 
  AlertTriangle, 
  FileText, 
  Settings,
  Brain,
  Layers
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: "NOMINAL" | "WARNING" | "CRITICAL";
  onOpenControlDeck: () => void;
}

export default function DashboardSidebar({ 
  activeTab, 
  setActiveTab, 
  systemStatus,
  onOpenControlDeck
}: SidebarProps) {
  
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: Activity },
    { id: "live-weather", label: "Live Space Weather", icon: Sun },
    { id: "forecast", label: "Radiation Forecast", icon: TrendingUp },
    { id: "satellite", label: "Satellite Monitor", icon: SatIcon },
    { id: "explainability", label: "AI Explainability", icon: Brain },
    { id: "history", label: "Historical Analysis", icon: Database },
    { id: "solar", label: "Solar Events", icon: Layers },
    { id: "alerts", label: "Alert Center", icon: AlertTriangle },
    { id: "reports", label: "Reports & Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 glass-panel flex flex-col h-full border-r border-cyber-blue/10 min-h-[calc(100vh-64px)] shrink-0 z-20">
      {/* ISRO Insignia and branding header */}
      <div className="p-5 border-b border-cyber-blue/15 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-md shadow-orange-500/20 relative overflow-hidden">
          <span className="relative z-10 font-display font-black">A</span>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.8),transparent)]"></div>
          {/* Custom orbit indicator */}
          <div className="absolute w-8 h-8 rounded-full border border-white/30 -top-1 -left-1 animate-radar"></div>
        </div>
        <div>
          <h2 className="text-sm font-display font-bold tracking-widest text-white leading-none">ANOVA AI</h2>
          <p className="text-[9px] font-mono text-cyan-400 mt-1 uppercase tracking-wider">ISRO Space Ops Centre</p>
        </div>
      </div>

      {/* Main navigation list */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono text-gray-500 font-semibold px-3 mb-2 uppercase tracking-widest">
          Mission Control Systems
        </div>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all duration-200 text-left ${
                isActive 
                  ? "bg-gradient-to-r from-cyber-blue/20 to-cyber-teal/5 text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-[inset_1px_0_10px_rgba(6,182,212,0.1)]"
                  : "text-gray-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <IconComponent className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-cyan-400" : "text-gray-500"}`} />
              <span className="flex-1 tracking-wide font-display">{item.label}</span>
              {item.id === "alerts" && systemStatus !== "NOMINAL" && (
                <span className={`w-2 h-2 rounded-full ${systemStatus === "CRITICAL" ? "bg-red-500 animate-ping" : "bg-orange-500 animate-ping"}`}></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom control panel status quick link */}
      <div className="p-4 border-t border-cyber-blue/15 bg-slate-900/40 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-gray-400 uppercase tracking-widest">MISSION DIRECTIVE</span>
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
            systemStatus === "NOMINAL" 
              ? "bg-green-500/10 text-green-400 border border-green-500/30"
              : systemStatus === "WARNING"
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30 animate-pulse"
          }`}>
            {systemStatus}
          </span>
        </div>

        <button 
          onClick={onOpenControlDeck}
          className="w-full bg-gradient-to-r from-cyan-600 to-cyber-teal py-2 rounded font-display text-xs font-bold text-white hover:from-cyan-500 hover:to-teal-500 transition-all shadow-md shadow-cyan-600/20 hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
        >
          <ShieldAlert className="w-4 h-4 animate-bounce" />
          <span>SIMULATOR CONTROL</span>
        </button>

        <div className="text-[9px] font-mono text-center text-gray-500 uppercase tracking-widest leading-relaxed">
          SECURE SECTOR // IN.ISRO.ANOVA.05
        </div>
      </div>
    </aside>
  );
}

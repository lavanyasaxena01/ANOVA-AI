import React, { useState } from "react";
import { Alert } from "../types";
import { 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  Clock, 
  Send, 
  CheckCircle,
  Filter
} from "lucide-react";

interface AlertCenterProps {
  alerts: Alert[];
  onMitigateAlert: (alertId: string) => void;
  systemStatus: "NOMINAL" | "WARNING" | "CRITICAL";
}

export default function AlertCenter({ alerts, onMitigateAlert, systemStatus }: AlertCenterProps) {
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");
  const [mitigatedIds, setMitigatedIds] = useState<string[]>([]);

  const handleMitigate = (id: string) => {
    setMitigatedIds((prev) => [...prev, id]);
    onMitigateAlert(id);
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "all") return true;
    return alert.severity === filter;
  });

  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-blue/15 flex flex-col h-full shadow-lg">
      
      {/* Header and filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyber-blue/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
            <h3 className="font-display font-bold text-sm text-white tracking-widest uppercase">
              SPACE INCIDENT & WARNING LOGGER
            </h3>
          </div>
          <p className="text-[10px] font-mono text-cyan-500 mt-1 uppercase tracking-wider">
            Critical radiation alerts, SEUs, and active mitigations
          </p>
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-cyber-blue/15">
          <Filter className="w-3 h-3 text-gray-500 mx-1.5" />
          {(["all", "critical", "warning"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2.5 py-1 rounded text-[9px] font-mono font-bold transition-all uppercase ${
                filter === type
                  ? type === "critical"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : type === "warning"
                      ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                      : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Alert items list */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 border border-dashed border-cyber-blue/10 rounded-lg">
            <CheckCircle className="w-10 h-10 text-green-500/40 mb-2" />
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-green-400">
              Zero Incidents Logged
            </span>
            <span className="text-[9px] text-gray-500 mt-1">All geostationary payloads reporting nominal shielding status</span>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isMitigated = mitigatedIds.includes(alert.id);
            
            // Setup styles
            let iconColor = "text-cyan-400";
            let borderColor = "border-cyan-500/10";
            let bgColor = "bg-cyan-950/5";
            let icon = Info;

            if (alert.severity === "critical") {
              iconColor = "text-red-400";
              borderColor = "border-red-500/25";
              bgColor = "bg-red-950/10";
              icon = ShieldAlert;
            } else if (alert.severity === "warning") {
              iconColor = "text-orange-400";
              borderColor = "border-orange-500/20";
              bgColor = "bg-orange-950/10";
              icon = AlertTriangle;
            }

            const AlertIcon = icon;

            return (
              <div 
                key={alert.id} 
                className={`p-3.5 rounded-lg border ${borderColor} ${bgColor} transition-all duration-300 hover:scale-[1.005] flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative overflow-hidden`}
              >
                {/* Flashing scanner band for critical alerts */}
                {alert.severity === "critical" && !isMitigated && (
                  <div className="absolute top-0 bottom-0 left-0 w-1 bg-red-500 animate-pulse" />
                )}

                <div className="flex gap-3 items-start flex-1">
                  <div className={`p-1.5 rounded-md bg-slate-950 ${iconColor} shrink-0 mt-0.5`}>
                    <AlertIcon className="w-4 h-4" />
                  </div>
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                      <span className="font-display font-bold text-white text-[11.5px] uppercase tracking-wide">
                        {alert.title}
                      </span>
                      <span className="font-mono text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-gray-400 uppercase">
                        {alert.satellite}
                      </span>
                      <span className="font-mono text-[8px] text-gray-500 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {alert.timestamp}
                      </span>
                    </div>

                    <p className="text-[10.5px] text-gray-300 leading-normal">
                      {alert.message}
                    </p>

                    {/* Mitigation instructions */}
                    <div className="bg-slate-950/80 p-2 rounded border border-cyber-blue/5 text-[9.5px] font-mono">
                      <strong className="text-cyan-400 block uppercase mb-0.5">Automated Support Action:</strong>
                      <span className="text-gray-400">{alert.mitigation}</span>
                    </div>
                  </div>
                </div>

                {/* Mitigation execute buttons */}
                <div className="shrink-0 pt-2 md:pt-0 self-end md:self-center">
                  {isMitigated ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded font-mono text-[10px] font-bold border border-green-500/30">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>UPLINKED // NOMINAL</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleMitigate(alert.id)}
                      className={`px-3 py-1.5 rounded font-display text-[10px] font-bold text-white transition-all flex items-center gap-1.5 ${
                        alert.severity === "critical"
                          ? "bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/10 hover:shadow-red-500/25"
                          : "bg-cyan-600 hover:bg-cyan-500"
                      }`}
                    >
                      <Send className="w-3 h-3 animate-pulse" />
                      <span>UPLINK DECISION</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer statistics summaries */}
      <div className="mt-4 pt-3.5 border-t border-cyber-blue/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
        <span>Active Incidents: <strong>{filteredAlerts.length}</strong></span>
        <span>Secured Node: <strong>ISRO_ANOVA_SATNET</strong></span>
      </div>
    </div>
  );
}

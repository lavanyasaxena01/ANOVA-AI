import React, { useRef, useEffect, useState } from "react";
import { Satellite } from "../types";
import { Info, Shield, Radio, Zap } from "lucide-react";

interface SpaceVisualizerProps {
  satellites: Satellite[];
  selectedSatelliteId: string;
  setSelectedSatelliteId: (id: string) => void;
  isStormActive: boolean;
  solarWindSpeed: number;
}

export default function SpaceVisualizer({
  satellites,
  selectedSatelliteId,
  setSelectedSatelliteId,
  isStormActive,
  solarWindSpeed,
}: SpaceVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
  const [hoveredSatId, setHoveredSatId] = useState<string | null>(null);

  // Resize handler using ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Keep canvas at least some reasonable min dimensions
        setDimensions({
          width: Math.max(width, 400),
          height: Math.max(height, 350),
        });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Canvas render animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high pixel ratio
    const dpr = window.devicePixelRatio || 1;
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId: number;
    let time = 0;

    // Solar wind particles state
    const particlesCount = isStormActive ? 120 : 40;
    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number; color: string }> = [];

    const initializeParticles = () => {
      for (let i = 0; i < particlesCount; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          speed: (0.8 + Math.random() * 2) * (solarWindSpeed / 400),
          size: Math.random() * (isStormActive ? 3 : 1.5) + 0.5,
          alpha: 0.15 + Math.random() * 0.6,
          color: isStormActive 
            ? Math.random() > 0.4 ? "#f97316" : "#ef4444" 
            : Math.random() > 0.5 ? "#22d3ee" : "#3b82f6"
        });
      }
    };

    initializeParticles();

    // Earth parameters
    const earthRadius = 55;
    const earthX = dimensions.width - 150;
    const earthY = dimensions.height / 2;

    // Sun parameters
    const sunRadius = 90;
    const sunX = -40;
    const sunY = dimensions.height / 2;

    // GEO orbit radius (around Earth)
    const geoRadius = 140;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // 1. Draw Space background stars (static looking but slightly twinkling)
      ctx.fillStyle = "#030712";
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      // Star field grid
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      for (let x = 30; x < dimensions.width; x += 110) {
        for (let y = 30; y < dimensions.height; y += 90) {
          const tw = Math.sin((time * 0.02) + (x * y)) * 0.5 + 0.5;
          ctx.beginPath();
          ctx.arc(x + Math.sin(time * 0.005) * 5, y, 0.8 * tw + 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw horizontal reference lines (grid coordinate look)
      ctx.strokeStyle = "rgba(14, 165, 233, 0.03)";
      ctx.lineWidth = 1;
      for (let y = 50; y < dimensions.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }

      // 2. Draw the SUN (left side)
      const sunGradient = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.2, sunX, sunY, sunRadius);
      sunGradient.addColorStop(0, "#ffffff");
      sunGradient.addColorStop(0.2, "#fef08a"); // yellow-200
      sunGradient.addColorStop(0.5, "#f97316"); // orange-500
      if (isStormActive) {
        sunGradient.addColorStop(0.8, "rgba(239, 68, 68, 0.15)"); // red-500
        sunGradient.addColorStop(1, "rgba(239, 68, 68, 0)");
      } else {
        sunGradient.addColorStop(0.8, "rgba(249, 115, 22, 0.08)");
        sunGradient.addColorStop(1, "rgba(249, 115, 22, 0)");
      }

      ctx.beginPath();
      ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
      ctx.fillStyle = sunGradient;
      ctx.fill();

      // Pulsing Sun Core Corona
      const pulseSize = sunRadius * 0.45 + Math.sin(time * 0.04) * 8;
      ctx.beginPath();
      ctx.arc(sunX, sunY, pulseSize, 0, Math.PI * 2);
      ctx.fillStyle = isStormActive ? "rgba(239, 68, 68, 0.4)" : "rgba(249, 115, 22, 0.3)";
      ctx.fill();

      // Solar flare projections during active storm
      if (isStormActive && time % 60 < 30) {
        ctx.strokeStyle = "rgba(249, 115, 22, 0.6)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunRadius * 0.65, -0.4, 0.4);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sunX + sunRadius * 0.6, sunY - 10);
        ctx.quadraticCurveTo(sunX + sunRadius * 1.3, sunY - 40, sunX + sunRadius * 0.8, sunY - 50);
        ctx.stroke();
      }

      // 3. Draw Solar Wind Particles
      particles.forEach((p) => {
        p.x += p.speed;
        
        // Return to left when reaching Earth
        if (p.x > dimensions.width) {
          p.x = sunX + Math.random() * 50;
          p.y = Math.random() * dimensions.height;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        // Storm particles look like small arrows/streaks
        if (isStormActive) {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0; // reset
      });

      // 4. Draw Geostationary Orbit Ring
      ctx.strokeStyle = "rgba(14, 165, 233, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(earthX, earthY, geoRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      // Orbit label
      ctx.fillStyle = "rgba(14, 165, 233, 0.4)";
      ctx.font = "9px monospace";
      ctx.fillText("GEOSTATIONARY ORBIT (35,786 km)", earthX - 85, earthY - geoRadius - 8);

      // 5. Draw Magnetosphere (Magnetic field lines warping around Earth)
      const windForce = isStormActive ? 42 : 15;
      ctx.lineWidth = 1;

      // Draw loops
      const loops = [40, 70, 100, 130];
      loops.forEach((loopRadius, idx) => {
        // Left loop (facing solar wind - compressed!)
        ctx.strokeStyle = isStormActive 
          ? `rgba(249, 115, 22, ${0.4 / (idx + 1)})` 
          : `rgba(6, 182, 212, ${0.5 / (idx + 1)})`;
        
        ctx.beginPath();
        // Left lobe compressed towards Earth
        ctx.moveTo(earthX, earthY - earthRadius * 0.5);
        ctx.bezierCurveTo(
          earthX - loopRadius * 0.6 - windForce, earthY - loopRadius * 1.1,
          earthX - loopRadius * 0.6 - windForce, earthY + loopRadius * 1.1,
          earthX, earthY + earthRadius * 0.5
        );
        ctx.stroke();

        // Right loop (extended tail - Magnetotail!)
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.3 / (idx + 1)})`;
        ctx.beginPath();
        ctx.moveTo(earthX, earthY - earthRadius * 0.5);
        ctx.bezierCurveTo(
          earthX + loopRadius * 1.2 + windForce * 1.5, earthY - loopRadius * 0.9,
          earthX + loopRadius * 1.2 + windForce * 1.5, earthY + loopRadius * 0.9,
          earthX, earthY + earthRadius * 0.5
        );
        ctx.stroke();
      });

      // Magnetopause boundary highlight
      ctx.strokeStyle = isStormActive ? "rgba(239, 68, 68, 0.25)" : "rgba(34, 211, 238, 0.12)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(earthX - windForce - 10, earthY, earthRadius * 1.8, -Math.PI / 2, Math.PI / 2, true);
      ctx.stroke();

      // 6. Draw EARTH
      // Outer glow
      const earthAtmosphere = ctx.createRadialGradient(earthX, earthY, earthRadius * 0.8, earthX, earthY, earthRadius * 1.2);
      earthAtmosphere.addColorStop(0, "rgba(10, 30, 80, 0)");
      earthAtmosphere.addColorStop(0.6, "rgba(14, 165, 233, 0.15)");
      earthAtmosphere.addColorStop(0.9, "rgba(34, 211, 238, 0.35)");
      earthAtmosphere.addColorStop(1, "rgba(34, 211, 238, 0)");

      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = earthAtmosphere;
      ctx.fill();

      // Earth core
      ctx.beginPath();
      ctx.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      const earthGrad = ctx.createRadialGradient(earthX - 20, earthY - 20, 10, earthX, earthY, earthRadius);
      earthGrad.addColorStop(0, "#1d4ed8"); // blue-700
      earthGrad.addColorStop(0.7, "#0f172a"); // slate-900
      earthGrad.addColorStop(1, "#020617");
      ctx.fillStyle = earthGrad;
      ctx.fill();

      // Draw stylized continents / grids inside Earth
      ctx.strokeStyle = "rgba(34, 211, 238, 0.18)";
      ctx.lineWidth = 1;
      
      // Horizontal latitude bands rotating
      const rotationOffset = (time * 0.15) % 180;
      for (let lat = -earthRadius + 10; lat < earthRadius; lat += 15) {
        const radiusAtLat = Math.sqrt(earthRadius * earthRadius - lat * lat);
        ctx.beginPath();
        ctx.ellipse(earthX, earthY + lat, radiusAtLat, radiusAtLat * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Vertical longitude lines rotating
      for (let i = 0; i < 4; i++) {
        const angle = (time * 0.003 + (i * Math.PI) / 4) % Math.PI;
        ctx.strokeStyle = "rgba(34, 211, 238, 0.12)";
        ctx.beginPath();
        ctx.ellipse(earthX, earthY, earthRadius * Math.sin(angle), earthRadius, 0, -Math.PI / 2, Math.PI / 2);
        ctx.stroke();
      }

      // Draw a subtle green land-mass outline for realism
      ctx.fillStyle = "rgba(34, 197, 94, 0.25)";
      ctx.beginPath();
      // Draw mock India continent in center
      ctx.moveTo(earthX - 25, earthY - 5);
      ctx.bezierCurveTo(earthX - 10, earthY - 15, earthX + 5, earthY - 25, earthX + 15, earthY - 5);
      ctx.bezierCurveTo(earthX + 2, earthY + 15, earthX - 15, earthY + 30, earthX - 20, earthY + 15);
      ctx.closePath();
      ctx.fill();

      // 7. Draw SATELLITES on the GEO Orbit ring
      satellites.forEach((sat, index) => {
        // Distribute satellites based on longitude or index
        // Since satellites are GEO, their orbital speed is matched to Earth (static relative position)
        // Let's place them along an arc on the orbit ring
        // e.g. 75.0° E matchesGSAT-24. Let's map longitude to an offset angle:
        // Let's map Longitudes to angles from PI/2 to 3*PI/2 (left side facing sun is ~PI, right side is 0)
        // Let's assign custom fixed angles for clear visualization:
        let baseAngle;
        if (sat.id === "gsat-24") baseAngle = Math.PI + 0.55; // GSAT-24 (~75E)
        else if (sat.id === "gsat-31") baseAngle = Math.PI + 0.25; // GSAT-31 (~83E)
        else if (sat.id === "insat-3dr") baseAngle = Math.PI + 0.70; // INSAT-3DR (~74E)
        else baseAngle = Math.PI - 0.45; // GSAT-19 (~82.5E)

        // Slowly sway sat position just for visual dynamics
        const orbitalSway = Math.sin(time * 0.002 + index) * 0.02;
        const satAngle = baseAngle + orbitalSway;

        const satX = earthX + Math.cos(satAngle) * geoRadius;
        const satY = earthY + Math.sin(satAngle) * geoRadius;

        const isSelected = sat.id === selectedSatelliteId;
        const isHovered = sat.id === hoveredSatId;

        // Draw line linking satellite to ground point (sub-satellite point)
        ctx.strokeStyle = isSelected 
          ? "rgba(34, 211, 238, 0.45)" 
          : "rgba(14, 165, 233, 0.1)";
        ctx.lineWidth = isSelected ? 1.5 : 0.8;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(satX, satY);
        // Ground intercept on Earth surface
        const surfX = earthX + Math.cos(satAngle) * earthRadius;
        const surfY = earthY + Math.sin(satAngle) * earthRadius;
        ctx.lineTo(surfX, surfY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Satellite Shield Glow base on radiation exposure
        const exposure = sat.radiationExposure;
        let shieldColor = "rgba(34, 197, 94, 0.3)"; // safe Green
        let shieldStroke = "rgba(34, 197, 94, 0.7)";
        
        if (exposure > 5.0) {
          shieldColor = isStormActive ? "rgba(239, 68, 68, 0.45)" : "rgba(239, 68, 68, 0.25)"; // critical Red
          shieldStroke = "#ef4444";
        } else if (exposure > 2.0) {
          shieldColor = "rgba(249, 115, 22, 0.3)"; // warning Orange
          shieldStroke = "#f97316";
        }

        // Draw Shield bubble around satellite
        if (isSelected || sat.shieldingStatus === "Reinforced" || isStormActive) {
          ctx.beginPath();
          const shieldRadius = isSelected ? 18 + Math.sin(time * 0.06) * 2 : 14;
          ctx.arc(satX, satY, shieldRadius, 0, Math.PI * 2);
          ctx.fillStyle = shieldColor;
          ctx.fill();
          ctx.strokeStyle = shieldStroke;
          ctx.lineWidth = isSelected ? 1.5 : 0.8;
          ctx.stroke();
        }

        // Draw Satellite body
        const satSize = isSelected ? 8 : 5.5;
        ctx.fillStyle = isSelected ? "#22d3ee" : "#38bdf8";
        ctx.beginPath();
        ctx.rect(satX - satSize / 2, satY - satSize / 2, satSize, satSize);
        ctx.fill();

        // Draw Solar panels (Left & Right arms)
        ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 0.5;
        // Left Panel
        ctx.fillRect(satX - satSize * 1.8, satY - satSize / 3, satSize * 1.3, satSize * 0.6);
        ctx.strokeRect(satX - satSize * 1.8, satY - satSize / 3, satSize * 1.3, satSize * 0.6);
        // Right Panel
        ctx.fillRect(satX + satSize * 0.5, satY - satSize / 3, satSize * 1.3, satSize * 0.6);
        ctx.strokeRect(satX + satSize * 0.5, satY - satSize / 3, satSize * 1.3, satSize * 0.6);

        // Selection Highlight Ring
        if (isSelected) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(satX, satY, 24, 0, Math.PI * 2);
          ctx.stroke();

          // Text marker
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 9.5px var(--font-display)";
          ctx.fillText(sat.name, satX - 22, satY - 26);
          ctx.fillStyle = "#22d3ee";
          ctx.font = "8px monospace";
          ctx.fillText(`${sat.longitude} | ${sat.radiationExposure.toFixed(2)} rad/h`, satX - 35, satY + 31);
        } else if (isHovered) {
          ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(satX, satY, 20, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = "#22d3ee";
          ctx.font = "bold 9px var(--font-display)";
          ctx.fillText(sat.name, satX - 18, satY - 22);
        } else {
          // Regular small labels
          ctx.fillStyle = "rgba(148, 163, 184, 0.8)";
          ctx.font = "8px var(--font-mono)";
          ctx.fillText(sat.name, satX - 15, satY - 12);
        }
      });
    };

    // Canvas Mouse events to select/hover satellites
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      let foundId: string | null = null;
      satellites.forEach((sat, index) => {
        let baseAngle;
        if (sat.id === "gsat-24") baseAngle = Math.PI + 0.55;
        else if (sat.id === "gsat-31") baseAngle = Math.PI + 0.25;
        else if (sat.id === "insat-3dr") baseAngle = Math.PI + 0.70;
        else baseAngle = Math.PI - 0.45;

        const orbitalSway = Math.sin(time * 0.002 + index) * 0.02;
        const satAngle = baseAngle + orbitalSway;
        const satX = earthX + Math.cos(satAngle) * geoRadius;
        const satY = earthY + Math.sin(satAngle) * geoRadius;

        // Calculate distance
        const dist = Math.sqrt((mouseX - satX) ** 2 + (mouseY - satY) ** 2);
        if (dist < 25) {
          foundId = sat.id;
        }
      });
      setHoveredSatId(foundId);
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      satellites.forEach((sat, index) => {
        let baseAngle;
        if (sat.id === "gsat-24") baseAngle = Math.PI + 0.55;
        else if (sat.id === "gsat-31") baseAngle = Math.PI + 0.25;
        else if (sat.id === "insat-3dr") baseAngle = Math.PI + 0.70;
        else baseAngle = Math.PI - 0.45;

        const orbitalSway = Math.sin(time * 0.002 + index) * 0.02;
        const satAngle = baseAngle + orbitalSway;
        const satX = earthX + Math.cos(satAngle) * geoRadius;
        const satY = earthY + Math.sin(satAngle) * geoRadius;

        const dist = Math.sqrt((mouseX - satX) ** 2 + (mouseY - satY) ** 2);
        if (dist < 25) {
          setSelectedSatelliteId(sat.id);
        }
      });
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleMouseClick);

    // Frame runner
    const run = () => {
      render();
      animationFrameId = requestAnimationFrame(run);
    };
    run();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleMouseClick);
    };
  }, [dimensions, satellites, selectedSatelliteId, isStormActive, solarWindSpeed, hoveredSatId]);

  // Find active satellite details to show quick metrics overlay
  const activeSat = satellites.find((s) => s.id === selectedSatelliteId) || satellites[0];

  return (
    <div className="relative glass-panel rounded-xl overflow-hidden flex flex-col h-full border border-cyber-blue/15 shadow-lg">
      {/* Header telemetry info */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="bg-slate-950/80 backdrop-blur border border-cyber-blue/20 px-3 py-1.5 rounded flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
          <span className="text-[10px] font-mono text-cyan-300 tracking-wider font-bold">LIVE TELEMETRY VIEW (GEOSYNCHRONOUS ORBITAL PLANE)</span>
        </div>

        {isStormActive && (
          <div className="bg-red-950/90 backdrop-blur border border-red-500/30 px-3 py-1.5 rounded flex items-center gap-2 animate-pulse">
            <Zap className="w-3 h-3 text-red-400 animate-bounce" />
            <span className="text-[10px] font-mono text-red-400 tracking-widest font-black uppercase">SOLAR WIND IMPACT DETECTED // FLUX CRITICAL</span>
          </div>
        )}
      </div>

      {/* Hover Info Tooltip */}
      <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur border border-cyan-500/15 p-3 rounded-lg pointer-events-none z-10 max-w-xs space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          <span>Interactive Orbit Canvas</span>
        </div>
        <p className="text-[10px] text-gray-400 leading-normal">
          Click on any satellite on the geostationary ring to inspect payloads, local radiation shielding status, and view AI forecast margins.
        </p>
      </div>

      {/* Floating Active Sat Stats overlay */}
      <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur border border-cyber-blue/20 p-3 rounded-lg pointer-events-none z-10 space-y-2 text-xs w-48 shadow-xl">
        <div className="flex items-center justify-between border-b border-cyber-blue/10 pb-1">
          <span className="font-display font-bold text-cyan-300 text-[11px]">{activeSat.name}</span>
          <span className="font-mono text-[9px] text-gray-400">{activeSat.longitude}</span>
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 text-[10px] font-mono">
          <span className="text-gray-500">Altitude:</span>
          <span className="text-gray-200 text-right">35,786 km</span>
          
          <span className="text-gray-500">Health:</span>
          <span className={`text-right font-bold ${activeSat.health > 90 ? "text-green-400" : "text-orange-400"}`}>
            {activeSat.health}%
          </span>
          
          <span className="text-gray-500">Local Shield:</span>
          <span className={`text-right font-bold flex items-center gap-1 justify-end ${
            activeSat.shieldingStatus === "Reinforced" ? "text-cyan-400" : "text-gray-300"
          }`}>
            <Shield className="w-2.5 h-2.5" />
            {activeSat.shieldingStatus}
          </span>
          
          <span className="text-gray-500">Radiation:</span>
          <span className={`text-right font-bold ${activeSat.radiationExposure > 5 ? "text-red-400" : "text-green-400"}`}>
            {activeSat.radiationExposure.toFixed(2)} rad/h
          </span>
        </div>
      </div>

      {/* The main canvas */}
      <div ref={containerRef} className="flex-1 w-full min-h-[360px] cursor-pointer relative">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
    </div>
  );
}

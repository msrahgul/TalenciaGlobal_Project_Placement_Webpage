import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { memo, useDeferredValue, useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
  X,
  Sparkles,
  Globe,
  Building2,
  ArrowRight,
} from "lucide-react";

import { useCompanies } from "@/lib/companyApi";
import { type CompanySummary } from "@/lib/companyData";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompany } from "@/context/CompanyContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KITS Companies Research & Placement Analytics Portal" },
      {
        name: "description",
        content:
          "Browse companies recruiting at Karunya Institute of Technology and Sciences with deep intelligence and skill insights.",
      },
    ],
  }),
  component: IndexPage,
});

const COLLEGE_SHORT = "KITS";
const COLLEGE_NAME = "Karunya Institute of Technology and Sciences";

const nil = (v?: string | null) =>
  !v || ["na", "n/a", "none", "-", "null", "undefined", ""].includes(v.trim().toLowerCase());

function domain(url?: string | null) {
  if (!url || nil(url)) return null;
  return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/^www\./, "");
}

const PlacementNetworkBackground = memo(function PlacementNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Re-initialize width and height on resize
    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener("resize", handleResize);

    const colors = [
      "rgba(59, 130, 246, 0.45)",  // blue
      "rgba(139, 92, 246, 0.45)",  // violet
      "rgba(16, 185, 129, 0.45)",  // emerald
      "rgba(245, 158, 11, 0.45)",  // amber
      "rgba(148, 163, 184, 0.55)"  // slate
    ];

    interface Particle {
      leftPercent: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      swayAmount: number;
      swaySpeed: number;
      swayPhase: number;
      pulseSpeed: number;
      pulsePhase: number;
      offsetX: number;
      offsetY: number;
      activeFactor: number;
      drawX: number;
      drawY: number;
      mouseDist: number;
    }

    const particles: Particle[] = Array.from({ length: 32 }).map((_, i) => {
      const leftPercent = Math.random() * 100;
      
      let size = 2;
      if (i < 16) {
        size = 3.5;
      } else {
        size = Math.random() < 0.3 ? 3.5 : Math.random() < 0.6 ? 2.5 : 1.5;
      }

      const duration = 16 + Math.random() * 22; // 16s to 38s
      const delay = -Math.random() * duration;

      const color = colors[i % colors.length];
      const swayAmount = 30 + Math.random() * 50;

      // Vertical starting position (distribute randomly across the screen)
      const startingYFraction = Math.random();
      const speed = (height + 150) / (duration * 60);
      const startingY = height + 50 - startingYFraction * (height + 100);

      return {
        leftPercent,
        y: startingY,
        size,
        speed,
        color,
        swayAmount,
        swaySpeed: 0.01 + Math.random() * 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        offsetX: 0,
        offsetY: 0,
        activeFactor: 0,
        drawX: 0,
        drawY: 0,
        mouseDist: 10000,
      };
    });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseMove);

    let time = 0;

    const animate = () => {
      time += 0.5;
      ctx.clearRect(0, 0, width, height);

      const mX = mouseRef.current.x;
      const mY = mouseRef.current.y;

      // Update particle positions and mouse distance
      particles.forEach((p) => {
        // Rise up
        p.y -= p.speed;
        if (p.y < -50) {
          p.y = height + 50;
          p.leftPercent = Math.random() * 100;
        }

        // Base coordinates before interaction
        const baseX = (p.leftPercent * width) / 100;
        const swayX = Math.sin(time * p.swaySpeed + p.swayPhase) * p.swayAmount;
        const targetX = baseX + swayX;
        const targetY = p.y;

        // Interaction with mouse
        if (mX > -500 && mY > -500) {
          const dx = targetX - mX;
          const dy = targetY - mY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.mouseDist = dist;

          if (dist < 200) {
            const force = (200 - dist) / 200;
            // Push away locally
            const pushX = (dx / (dist || 1)) * force * 45;
            const pushY = (dy / (dist || 1)) * force * 45;

            p.offsetX += (pushX - p.offsetX) * 0.12;
            p.offsetY += (pushY - p.offsetY) * 0.12;
            p.activeFactor += (1 - p.activeFactor) * 0.12;
          } else {
            p.offsetX += (0 - p.offsetX) * 0.08;
            p.offsetY += (0 - p.offsetY) * 0.08;
            p.activeFactor += (0 - p.activeFactor) * 0.08;
          }
        } else {
          p.mouseDist = 10000;
          p.offsetX += (0 - p.offsetX) * 0.08;
          p.offsetY += (0 - p.offsetY) * 0.08;
          p.activeFactor += (0 - p.activeFactor) * 0.08;
        }

        p.drawX = targetX + p.offsetX;
        p.drawY = targetY + p.offsetY;
      });

      // Draw local connection lines (neural network web near mouse)
      if (mX > -500 && mY > -500) {
        ctx.shadowBlur = 0; // Turn off shadows for line rendering speed
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i];
          if (p1.mouseDist > 200) continue;

          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.mouseDist > 200) continue;

            const dx = p1.drawX - p2.drawX;
            const dy = p1.drawY - p2.drawY;
            const distBetween = Math.sqrt(dx * dx + dy * dy);

            if (distBetween < 120) {
              const alpha1 = (200 - p1.mouseDist) / 200;
              const alpha2 = (200 - p2.mouseDist) / 200;
              const alphaDist = (120 - distBetween) / 120;
              // Combined connection opacity
              const finalAlpha = alpha1 * alpha2 * alphaDist * 0.25;

              ctx.beginPath();
              ctx.moveTo(p1.drawX, p1.drawY);
              ctx.lineTo(p2.drawX, p2.drawY);
              ctx.strokeStyle = `rgba(59, 130, 246, ${finalAlpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        // Outer pulsating circle
        const pulse = 1 + Math.sin(time * p.pulseSpeed + p.pulsePhase) * 0.55;
        const outerRadius = p.size * 3.5 * pulse;
        
        ctx.shadowBlur = 0; // No shadow for faint outer rings
        ctx.beginPath();
        ctx.arc(p.drawX, p.drawY, outerRadius, 0, Math.PI * 2);
        
        // Parse raw color to modify alpha
        const outerColor = p.color
          .replace("0.45", (0.12 + 0.15 * p.activeFactor).toFixed(2))
          .replace("0.55", (0.15 + 0.15 * p.activeFactor).toFixed(2));
        ctx.strokeStyle = outerColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(p.drawX, p.drawY, p.size, 0, Math.PI * 2);
        
        ctx.shadowBlur = 8 + 8 * p.activeFactor;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color.replace("0.45", "0.85").replace("0.55", "0.95");
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    />
  );
});

/* ═══════════════════════════════════════════════════════
   CLEAN COMPANY CARD — minimal, professional
   ═══════════════════════════════════════════════════════ */
const getCardStyles = () => {
  const baseStyles = "border-slate-800/80 bg-slate-900/40";
  const hoverStyles = "hover:bg-gradient-to-b hover:from-slate-900/95 hover:to-slate-950/90 hover:border-slate-500/80 hover:shadow-[0_0_30px_rgba(148,163,184,0.25)]";
  return `${baseStyles} ${hoverStyles}`;
};

const CompanyCard = memo(function CompanyCard({
  company, onSelect, index,
}: { company: CompanySummary; onSelect: (c: CompanySummary) => void; index: number }) {
  const growth    = company.yoy_growth_rate ?? "";
  const neg       = growth.trim().startsWith("-");
  const webDomain = domain(company.website_url);

  const primaryLocation = useMemo(() => {
    if (!company.office_locations || nil(company.office_locations)) return "";
    const parts = company.office_locations.split(/[,;/·]/);
    return parts[0].trim();
  }, [company.office_locations]);

  const shortCategory = useMemo(() => {
    return catShortName(company.category);
  }, [company.category]);

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(company)}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={`group flex flex-col rounded-2xl text-left transition-[background-color,border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 p-5 min-h-[230px] ${getCardStyles()}`}
    >
      {/* ── Top Header: Logo + Category Badge ── */}
      <div className="flex items-start justify-between gap-3 w-full">
        <CompanyLogo
          name={company.name}
          logoUrl={company.logo_url}
          website={company.website_url}
          size={44}
          className="shrink-0 rounded-xl border border-slate-800 bg-slate-900/60 p-0.5"
        />
        {shortCategory && (
          <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all">
            {shortCategory}
          </span>
        )}
      </div>

      {/* ── Title & Location ── */}
      <div className="mt-4 flex-1 min-w-0">
        <h3 className="truncate font-heading text-[15px] font-bold leading-snug text-slate-100 group-hover:text-white transition-colors">
          {company.name}
        </h3>
        
        {primaryLocation ? (
          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
            <MapPin className="h-3 w-3 shrink-0 text-slate-500 group-hover:text-blue-400 transition-colors" />
            <span className="truncate">{primaryLocation}</span>
          </div>
        ) : (
          <div className="mt-1 text-[11px] text-slate-600 italic">Location unlisted</div>
        )}
      </div>

      {/* ── Stats Grid (Bento style) ── */}
      <div className="grid grid-cols-2 gap-2 mt-4 w-full">
        {/* Employees */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-950/40 border border-slate-900/60 px-3 py-2">
          <Users className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-slate-350 transition-colors" />
          <span className="truncate text-[11px] font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
            {!nil(company.employee_size) ? company.employee_size.replace(/\s+/g, "") : "—"}
          </span>
        </div>

        {/* Growth */}
        <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
          nil(growth)
            ? "bg-slate-950/40 border-slate-900/60"
            : neg
              ? "bg-red-500/5 border-red-500/10 text-red-400"
              : "bg-emerald-500/5 border-emerald-500/10 text-emerald-400"
        }`}>
          {nil(growth) ? (
            <TrendingUp className="h-3.5 w-3.5 shrink-0 text-slate-600" />
          ) : neg ? (
            <TrendingDown className="h-3.5 w-3.5 shrink-0" />
          ) : (
            <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          )}
          <span className="truncate text-[11px] font-bold">
            {!nil(growth) ? growth : "—"}
          </span>
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between w-full">
        <span className="flex items-center gap-1.5 text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors truncate max-w-[65%]">
          {webDomain && (
            <>
              <Globe className="h-3 w-3 shrink-0" />
              <span className="truncate">{webDomain}</span>
            </>
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 group-hover:text-blue-400 transition-colors shrink-0">
          <span>Explore</span>
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.button>
  );
});

const parseGrowth = (str?: string | null): number | null => {
  if (!str) return null;
  const s = str.replace(/[+%]/g, "").trim();
  const val = parseFloat(s);
  return isNaN(val) ? null : val;
};

const classifySize = (sizeStr?: string | null): "Enterprise" | "Large" | "Mid-size" | "Small" | "Unknown" => {
  if (!sizeStr || nil(sizeStr)) return "Unknown";
  const s = sizeStr.toLowerCase().replace(/,/g, "").trim();
  if (s.includes("10k") || s.includes("50k") || s.includes("100k") || s.includes("10000") || s.includes("50000") || s.includes("100000")) return "Enterprise";
  if (s.includes("1k") || s.includes("5k") || s.includes("1000") || s.includes("2000") || s.includes("5000")) return "Large";
  if (s.includes("100") || s.includes("200") || s.includes("500") || s.includes("mid")) return "Mid-size";
  const num = parseFloat(s);
  if (!isNaN(num)) {
    if (num >= 10000) return "Enterprise";
    if (num >= 1000) return "Large";
    if (num >= 100) return "Mid-size";
    return "Small";
  }
  return "Small";
};

interface HomepageAnalyticsDashboardProps {
  companies: CompanySummary[];
}

function HomepageAnalyticsDashboard({ companies }: HomepageAnalyticsDashboardProps) {
  const [showDashboard, setShowDashboard] = useState(true);

  // 1. Calculations
  const totalCompanies = companies.length;

  const growthRates = useMemo(() => {
    return companies
      .map((c) => ({ company: c, val: parseGrowth(c.yoy_growth_rate) }))
      .filter((item) => item.val !== null);
  }, [companies]);

  const avgGrowth = useMemo(() => {
    if (growthRates.length === 0) return 0;
    const sum = growthRates.reduce((acc, curr) => acc + curr.val!, 0);
    return sum / growthRates.length;
  }, [growthRates]);

  const positiveGrowthCount = useMemo(() => {
    return growthRates.filter((item) => item.val! > 0).length;
  }, [growthRates]);

  const growthRatio = totalCompanies > 0 ? (positiveGrowthCount / totalCompanies) * 100 : 0;

  const uniqueCountries = useMemo(() => {
    const countriesSet = new Set<string>();
    companies.forEach((c) => {
      if (c.operating_countries && !nil(c.operating_countries)) {
        const list = c.operating_countries.split(/[,;/·]/g);
        list.forEach((item) => {
          const name = item.trim();
          if (name && !nil(name)) {
            let stdName = name;
            if (name.toLowerCase() === "usa") stdName = "United States";
            if (name.toLowerCase() === "uk") stdName = "United Kingdom";
            countriesSet.add(stdName.charAt(0).toUpperCase() + stdName.slice(1));
          }
        });
      } else {
        countriesSet.add("India");
      }
    });
    return countriesSet;
  }, [companies]);

  // Top 5 Growth Leaderboard
  const topGrowthCompanies = useMemo(() => {
    return [...growthRates]
      .sort((a, b) => b.val! - a.val!)
      .slice(0, 5);
  }, [growthRates]);

  // Size distribution
  const sizeDistribution = useMemo(() => {
    let enterprise = 0;
    let large = 0;
    let mid = 0;
    let small = 0;

    companies.forEach((c) => {
      const cls = classifySize(c.employee_size);
      if (cls === "Enterprise") enterprise++;
      else if (cls === "Large") large++;
      else if (cls === "Mid-size") mid++;
      else if (cls === "Small") small++;
    });

    const totalClassified = enterprise + large + mid + small;
    const pEnterprise = totalClassified > 0 ? (enterprise / totalClassified) * 100 : 0;
    const pLarge = totalClassified > 0 ? (large / totalClassified) * 100 : 0;
    const pMid = totalClassified > 0 ? (mid / totalClassified) * 100 : 0;
    const pSmall = totalClassified > 0 ? (small / totalClassified) * 100 : 0;

    return {
      totalClassified,
      enterprise,
      large,
      mid,
      small,
      pEnterprise,
      pLarge,
      pMid,
      pSmall,
    };
  }, [companies]);

  if (totalCompanies === 0) return null;

  return (
    <div className="mb-10 w-full relative z-10">
      {/* Dashboard Toggle Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.1)]">
            <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
          </div>
          <h2 className="font-heading text-xs font-bold text-slate-200 tracking-wider uppercase">
            Karunya Placement Analytics Dashboard
          </h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDashboard(!showDashboard)}
          className="rounded-full border-slate-850/80 bg-slate-900/40 text-[11px] font-semibold text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        >
          {showDashboard ? "Collapse Stats" : "Expand Stats"}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden space-y-6"
          >
            {/* Metric widgets row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Partners */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-24 hover:border-slate-800 transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Recruiting Partners</span>
                  <Building2 className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading text-slate-100 leading-none">
                    {totalCompanies}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Verified Organizations</span>
                </div>
              </div>

              {/* Card 2: Average YoY Growth */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-24 hover:border-slate-800 transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Avg YoY Growth</span>
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading text-emerald-400 leading-none">
                    +{avgGrowth.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Annual Growth Trajectory</span>
                </div>
              </div>

              {/* Card 3: Global Footprint */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-24 hover:border-slate-800 transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Global Coverage</span>
                  <Globe className="h-4 w-4 text-violet-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading text-slate-100 leading-none">
                    {uniqueCountries.size}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Operating Countries</span>
                </div>
              </div>

              {/* Card 4: Growth Ratio */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-24 hover:border-slate-800 transition-all duration-300">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Growth Ratio</span>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold font-heading text-amber-400 leading-none">
                    {growthRatio.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-1">Expanding Partners</span>
                </div>
              </div>
            </div>

            {/* Graphics & Charts Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Graphic 1: Growth Leaderboard */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/25 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Top YoY Growth Leaders
                  </h3>
                  <div className="space-y-3.5">
                    {topGrowthCompanies.map(({ company, val }, idx) => {
                      const maxVal = topGrowthCompanies[0]?.val || 100;
                      const pct = maxVal > 0 ? (val! / maxVal) * 100 : 0;
                      return (
                        <div key={company.company_id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                            <span className="truncate pr-4">{company.name}</span>
                            <span className="tabular-nums text-emerald-400 font-bold">+{val?.toFixed(1)}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-950/80 border border-slate-900/60 overflow-hidden relative group/bar">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Graphic 2: Size Distribution (Donut Chart) */}
              <div className="rounded-2xl border border-slate-850/80 bg-slate-950/25 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                    Workforce Scale Distribution
                  </h3>
                  <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                    {/* Donut Chart */}
                    {sizeDistribution.totalClassified > 0 ? (
                      <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                        <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-90">
                          {/* Base circle background */}
                          <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="#090d16" strokeWidth="4.5" />
                          
                          {/* Segment 1: Enterprise (Blue) */}
                          {sizeDistribution.pEnterprise > 0 && (
                            <motion.circle
                              cx="20"
                              cy="20"
                              r="15.9155"
                              fill="transparent"
                              stroke="#3b82f6"
                              strokeWidth="4.5"
                              strokeDasharray={`${sizeDistribution.pEnterprise} 100`}
                              strokeDashoffset={0}
                              initial={{ strokeDasharray: "0 100" }}
                              animate={{ strokeDasharray: `${sizeDistribution.pEnterprise} 100` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                          
                          {/* Segment 2: Large (Indigo) */}
                          {sizeDistribution.pLarge > 0 && (
                            <motion.circle
                              cx="20"
                              cy="20"
                              r="15.9155"
                              fill="transparent"
                              stroke="#6366f1"
                              strokeWidth="4.5"
                              strokeDasharray={`${sizeDistribution.pLarge} 100`}
                              strokeDashoffset={-sizeDistribution.pEnterprise}
                              initial={{ strokeDasharray: "0 100" }}
                              animate={{ strokeDasharray: `${sizeDistribution.pLarge} 100` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}

                          {/* Segment 3: Mid-size (Violet) */}
                          {sizeDistribution.pMid > 0 && (
                            <motion.circle
                              cx="20"
                              cy="20"
                              r="15.9155"
                              fill="transparent"
                              stroke="#8b5cf6"
                              strokeWidth="4.5"
                              strokeDasharray={`${sizeDistribution.pMid} 100`}
                              strokeDashoffset={-(sizeDistribution.pEnterprise + sizeDistribution.pLarge)}
                              initial={{ strokeDasharray: "0 100" }}
                              animate={{ strokeDasharray: `${sizeDistribution.pMid} 100` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}

                          {/* Segment 4: Small (Emerald) */}
                          {sizeDistribution.pSmall > 0 && (
                            <motion.circle
                              cx="20"
                              cy="20"
                              r="15.9155"
                              fill="transparent"
                              stroke="#10b981"
                              strokeWidth="4.5"
                              strokeDasharray={`${sizeDistribution.pSmall} 100`}
                              strokeDashoffset={-(sizeDistribution.pEnterprise + sizeDistribution.pLarge + sizeDistribution.pMid)}
                              initial={{ strokeDasharray: "0 100" }}
                              animate={{ strokeDasharray: `${sizeDistribution.pSmall} 100` }}
                              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            />
                          )}
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Classified</span>
                          <span className="text-sm font-bold text-slate-200 mt-0.5">{sizeDistribution.totalClassified}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic">No size metrics available</span>
                    )}

                    {/* Donut Legend */}
                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-[240px]">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 leading-none">Enterprise</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-0.5">
                            {sizeDistribution.enterprise} ({sizeDistribution.pEnterprise.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 leading-none">Large</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-0.5">
                            {sizeDistribution.large} ({sizeDistribution.pLarge.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-violet-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 leading-none">Mid-size</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-0.5">
                            {sizeDistribution.mid} ({sizeDistribution.pMid.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-400 leading-none">Small</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-0.5">
                            {sizeDistribution.small} ({sizeDistribution.pSmall.toFixed(0)}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INDEX PAGE
   ═══════════════════════════════════════════════════════ */
const catShortName = (cat?: string | null): string => {
  if (!cat || nil(cat)) return "";
  const s = cat.trim();
  if (s.toLowerCase().includes("information technology") || s.toLowerCase() === "it" || s.toLowerCase().includes("software")) return "Tech";
  if (s.toLowerCase().includes("consulting")) return "Consulting";
  if (s.toLowerCase().includes("finance") || s.toLowerCase().includes("banking")) return "Finance";
  if (s.toLowerCase().includes("healthcare") || s.toLowerCase().includes("pharma")) return "Healthcare";
  if (s.toLowerCase().includes("education") || s.toLowerCase().includes("edtech")) return "EdTech";
  return s.split(/\s+/)[0]; // return first word
};



function IndexPage() {
  const navigate = useNavigate();
  const { selectCompany } = useCompany();
  const [query, setQuery] = useState("");
  const { data: companies = [], isLoading, isError, refetch } = useCompanies();

  const deferred = useDeferredValue(query);
  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) => {
      return (
        c.name.toLowerCase().includes(q) ||
        c.short_name.toLowerCase().includes(q) ||
        (c.office_locations ?? "").toLowerCase().includes(q) ||
        (c.operating_countries ?? "").toLowerCase().includes(q)
      );
    });
  }, [companies, deferred]);

  const handleSelect = (c: CompanySummary) => {
    selectCompany({ companyId: c.company_id, companyName: c.name, logoUrl: c.logo_url });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <div className="mesh-bg relative min-h-screen">
      {/* Premium subtle background grid pattern overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <PlacementNetworkBackground />
      {/* ── HERO ─────────────────────────────────── */}
      <header className="relative overflow-hidden z-10">
        <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-900/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-violet-900/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-16 text-center sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-4 py-1.5 text-xs font-semibold text-slate-400 shadow-sm backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-slate-500" />
            {COLLEGE_SHORT} · INTELLIGENCE PLATFORM
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {COLLEGE_NAME}
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">Placement Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 text-base text-slate-400 sm:text-lg"
          >
            Your strategic edge for campus placements.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto mt-8 flex max-w-xl items-center rounded-full border border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-5 py-1 shadow-inner focus-within:border-slate-700/80"
          >
            <Search className="pointer-events-none h-4 w-4 shrink-0 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies, locations…"
              className="h-12 flex-1 border-0 bg-transparent px-3 text-sm text-slate-100 placeholder-slate-500 shadow-none focus-visible:ring-0"
            />
            <AnimatePresence>
              {query && (
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  onClick={() => setQuery("")}
                  className="rounded-full p-1.5 text-slate-500 hover:bg-slate-800"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </header>

      {/* ── META ─────────────────────────────── */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-4 relative z-10">
          <p className="text-xs font-medium text-slate-500">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}
          </p>
        </div>
      )}

      {/* ── GRID ──────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 relative z-10">
        {!isLoading && !isError && companies.length > 0 && (
          <HomepageAnalyticsDashboard companies={companies} />
        )}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 p-5 min-h-[230px] justify-between">
                <div className="flex items-start justify-between w-full">
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800" />
                  <div className="h-4.5 w-12 animate-pulse rounded-lg bg-slate-800" />
                </div>
                <div className="space-y-2 mt-4 flex-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800" />
                  <div className="h-3.5 w-1/2 animate-pulse rounded bg-slate-800/50" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                  <div className="h-9 animate-pulse rounded-xl bg-slate-800/40" />
                  <div className="h-9 animate-pulse rounded-xl bg-slate-800/40" />
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/40 flex items-center justify-between w-full">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-slate-800/30" />
                  <div className="h-3.5 w-12 animate-pulse rounded bg-slate-800/30" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-14 text-center backdrop-blur-md">
            <Building2 className="mx-auto mb-4 h-9 w-9 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">Failed to load companies.</p>
            <Button variant="outline" className="mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-14 text-center backdrop-blur-md">
            <Search className="mx-auto mb-4 h-9 w-9 text-slate-700" />
            <p className="text-sm text-slate-500">No companies match your search.</p>
            <Button variant="outline" className="mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c, i) => (
              <CompanyCard key={c.company_id} company={c} onSelect={handleSelect} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

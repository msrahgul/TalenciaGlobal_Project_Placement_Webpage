import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { memo, useDeferredValue, useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
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
import { type CompanySummary, getCategoryAccent, getCategoryHue } from "@/lib/companyData";
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
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let rafId: number;
    let paused = false;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let lastMouseTime = 0;
    const onMouse = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < 16) return;
      lastMouseTime = now;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onVisibility = () => { paused = document.hidden; };

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const COLORS = [
      { outer: "rgba(59, 130, 246, 0.18)", fill: "rgba(59, 130, 246, 0.75)" },
      { outer: "rgba(139, 92, 246, 0.18)", fill: "rgba(139, 92, 246, 0.75)" },
      { outer: "rgba(16, 185, 129, 0.18)", fill: "rgba(16, 185, 129, 0.75)" },
      { outer: "rgba(245, 158, 11, 0.15)", fill: "rgba(245, 158, 11, 0.75)" },
      { outer: "rgba(148, 163, 184, 0.15)", fill: "rgba(148, 163, 184, 0.70)" }
    ];

    const particles = Array.from({ length: 40 }, (_, i) => {
      const dur = 18 + Math.random() * 24;
      const yFrac = Math.random();
      return {
        lp: Math.random() * 100,
        y: H + 50 - yFrac * (H + 100),
        sz: i < 8 ? 2.5 : (Math.random() < 0.4 ? 2 : 1.5),
        spd: (H + 150) / (dur * 60),
        col: COLORS[i % COLORS.length],
        swA: 25 + Math.random() * 40,
        swS: 0.007 + Math.random() * 0.007,
        swP: Math.random() * Math.PI * 2,
        ox: 0, oy: 0,
        af: 0,
        dx: 0, dy: 0,
        md: 9999,
      };
    });

    let t = 0;

    const draw = () => {
      if (paused) {
        rafId = requestAnimationFrame(draw);
        return;
      }

      t += 0.4;
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseActive = mx > -500;

      for (const p of particles) {
        p.y -= p.spd;
        if (p.y < -50) { p.y = H + 50; p.lp = Math.random() * 100; }

        const tx = (p.lp * W) / 100 + Math.sin(t * p.swS + p.swP) * p.swA;

        if (mouseActive) {
          const dx = tx - mx, dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          p.md = dist;
          if (dist < 160) {
            const f = (160 - dist) / 160;
            p.ox += ((dx / (dist || 1)) * f * 36 - p.ox) * 0.1;
            p.oy += ((dy / (dist || 1)) * f * 36 - p.oy) * 0.1;
            p.af += (1 - p.af) * 0.1;
          } else {
            p.ox *= 0.9; p.oy *= 0.9; p.af *= 0.9;
          }
        } else {
          p.md = 9999; p.ox *= 0.9; p.oy *= 0.9; p.af *= 0.9;
        }
        p.dx = tx + p.ox;
        p.dy = p.y + p.oy;
      }

      if (mouseActive) {
        ctx.lineWidth = 0.7;
        for (let i = 0; i < particles.length; i++) {
          const a = particles[i];
          if (a.md > 160) continue;
          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j];
            if (b.md > 160) continue;
            const ex = a.dx - b.dx, ey = a.dy - b.dy;
            const ed2 = ex * ex + ey * ey;
            if (ed2 < 12100) {
              const alpha =
                ((160 - a.md) / 160) *
                ((160 - b.md) / 160) *
                (1 - ed2 / 12100) * 0.16;
              ctx.beginPath();
              ctx.moveTo(a.dx, a.dy);
              ctx.lineTo(b.dx, b.dy);
              ctx.strokeStyle = `rgba(99,130,246,\${alpha.toFixed(3)})`;
              ctx.stroke();
            }
          }
        }
      }

      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";

      for (const p of particles) {
        const outerRadius = p.sz * 3.5 * (1 + Math.sin(t * 0.02 + p.swP) * 0.25);
        ctx.beginPath();
        ctx.arc(p.dx, p.dy, outerRadius, 0, Math.PI * 2);
        ctx.strokeStyle = p.col.outer;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.dx, p.dy, p.sz, 0, Math.PI * 2);
        ctx.fillStyle = p.col.fill;
        ctx.fill();
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 select-none bg-[#0a0a0c] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/40 via-transparent to-transparent z-0" />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-10"
      />
    </div>
  );
});



const CompanyCard = memo(function CompanyCard({
  company, onSelect, index,
}: { company: CompanySummary; onSelect: (c: CompanySummary) => void; index: number }) {
  const growth = company.yoy_growth_rate ?? "";
  const neg = growth.trim().startsWith("-");
  const webDomain = domain(company.website_url);

  const primaryLocation = useMemo(() => {
    if (!company.office_locations || nil(company.office_locations)) return "";
    const parts = company.office_locations.split(/[,;/·]/);
    return parts[0].trim();
  }, [company.office_locations]);

  const shortCategory = useMemo(() => catShortName(company.category), [company.category]);
  const accent = useMemo(() => getCategoryAccent(company.category), [company.category]);

  const cardRef = useRef<HTMLButtonElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        ref={cardRef}
        type="button"
        onMouseMove={handleMouseMove}
        onClick={() => onSelect(company)}
        className={`group relative overflow-hidden flex flex-col w-full rounded-2xl text-left border border-white/[0.05] bg-slate-900/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 p-6 min-h-[248px] transition-all duration-300 ease-in-out hover:bg-slate-800/40 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.45)] ${accent.hoverBorder}`}
      >
        {/* Glow Effects */}
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.06), transparent 40%)"
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 z-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: "radial-gradient(250px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(99, 102, 241, 0.8), transparent 40%) border-box",
            WebkitMask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            border: "2px solid transparent"
          }}
        />

        {/* Main Content (Needs relative z-index to sit above glow) */}
        <div className="relative z-10 flex flex-col w-full h-full">
          {/* ── Category-colored top accent stripe (matches stat card design) ── */}
          <div className={`absolute -top-6 -left-6 -right-6 h-px bg-gradient-to-r ${accent.stripe}`} />

          {/* ── Top Header: Logo + Category Badge ── */}
          <div className="flex items-start justify-between gap-3 w-full">
            <CompanyLogo
              name={company.name}
              logoUrl={company.logo_url}
              website={company.website_url}
              size={44}
              className="shrink-0 rounded-xl border border-slate-800/80 bg-slate-900/80 p-0.5"
            />
            {shortCategory && (
              <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${accent.badgeBg} ${accent.badgeBorder} ${accent.badgeText}`}>
                {shortCategory}
              </span>
            )}
          </div>

          {/* ── Title & Location ── */}
          <div className="mt-4 flex-1 min-w-0">
            <h3 className="truncate font-heading text-[15px] font-bold leading-snug text-slate-100 group-hover:text-white transition-colors duration-200">
              {company.name}
            </h3>
            {primaryLocation ? (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors duration-200">
                <MapPin className="h-3 w-3 shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors duration-200" />
                <span className="truncate">{primaryLocation}</span>
              </div>
            ) : (
              <div className="mt-1.5 text-[11px] text-slate-600 italic">Location unlisted</div>
            )}
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 gap-2 mt-4 w-full">
            <div className="flex items-center gap-2 rounded-xl bg-slate-950/20 border border-white/[0.04] px-3 py-2.5 group-hover:bg-slate-950/50 group-hover:border-slate-800/40 transition-all duration-300 ease-in-out">
              <Users className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <span className="truncate text-[11px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors duration-200">
                {!nil(company.employee_size) ? company.employee_size!.replace(/\s+/g, "") : "—"}
              </span>
            </div>
            <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all duration-300 ease-in-out ${nil(growth)
              ? "bg-slate-950/20 border-white/[0.04] group-hover:bg-slate-950/50 group-hover:border-slate-800/40"
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
              <span className="truncate text-[11px] font-semibold">
                {!nil(growth) ? growth : "—"}
              </span>
            </div>
          </div>

          {/* ── Footer CTA ── */}
          <div className="mt-5 pt-3.5 border-t border-white/[0.04] group-hover:border-slate-800/30 flex items-center justify-between w-full transition-all duration-300 ease-in-out">
            <span className="flex items-center gap-1.5 text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors duration-200 truncate max-w-[65%]">
              {webDomain && (
                <>
                  <Globe className="h-3 w-3 shrink-0" />
                  <span className="truncate">{webDomain}</span>
                </>
              )}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 group-hover:text-slate-300 transition-colors duration-200 shrink-0">
              <span>Explore</span>
              <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </button>
    </motion.div>
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
  const [showDashboard, setShowDashboard] = useState(false);

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
    <div className="mb-12 w-full relative z-10">
      {/* Dashboard Toggle Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/10 shadow-[0_0_16px_rgba(59,130,246,0.12)]">
            <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h2 className="font-heading text-[11px] font-bold text-slate-200 tracking-[0.12em] uppercase leading-none">
              Karunya Placement Analytics
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">Live recruiting intelligence</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDashboard(!showDashboard)}
          className="rounded-full border-slate-700/60 bg-slate-900/50 text-[11px] font-semibold text-slate-400 hover:bg-slate-800/80 hover:text-slate-200 hover:border-slate-600 transition-all duration-200"
        >
          {showDashboard ? "Collapse" : "Expand"}
        </Button>
      </div>

      <AnimatePresence initial={false}>
        {showDashboard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden space-y-5"
          >
            {/* Metric widgets row */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >

              {/* Card 1: Total Partners */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-blue-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default"
              >
                {/* Accent top line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Recruiting Partners</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/15">
                    <Building2 className="h-3 w-3 text-blue-400" />
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <span className="text-3xl font-extrabold font-heading text-slate-100 leading-none tabular-nums">
                    {totalCompanies}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1.5">Verified Organizations</span>
                </div>
              </motion.div>

              {/* Card 2: Average YoY Growth */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-emerald-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Avg YoY Growth</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/15">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <span className="text-3xl font-extrabold font-heading text-emerald-400 leading-none tabular-nums">
                    +{avgGrowth.toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1.5">Annual Growth Trajectory</span>
                </div>
              </motion.div>

              {/* Card 3: Global Footprint */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-violet-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Global Coverage</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/15">
                    <Globe className="h-3 w-3 text-violet-400" />
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <span className="text-3xl font-extrabold font-heading text-slate-100 leading-none tabular-nums">
                    {uniqueCountries.size}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1.5">Operating Countries</span>
                </div>
              </motion.div>

              {/* Card 4: Growth Ratio */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.985 }}
                className="group relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-5 flex flex-col justify-between hover:border-amber-500/20 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-all duration-300 cursor-default"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-slate-500">Growth Ratio</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/15">
                    <Sparkles className="h-3 w-3 text-amber-400" />
                  </div>
                </div>
                <div className="flex flex-col mt-3">
                  <span className="text-3xl font-extrabold font-heading text-amber-400 leading-none tabular-nums">
                    {growthRatio.toFixed(0)}%
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1.5">Expanding Partners</span>
                </div>
              </motion.div>
            </motion.div>


            {/* Graphics & Charts Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Graphic 1: Growth Leaderboard */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-6 flex flex-col hover:border-slate-700/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                <h3 className="text-[9.5px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-5">
                  Top YoY Growth Leaders
                </h3>
                <div className="space-y-4">
                  {topGrowthCompanies.map(({ company, val }, idx) => {
                    const maxVal = topGrowthCompanies[0]?.val || 100;
                    const pct = maxVal > 0 ? (val! / maxVal) * 100 : 0;
                    return (
                      <div key={company.company_id} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="truncate pr-4 text-[12px] font-semibold text-slate-300">{company.name}</span>
                          <span className="tabular-nums text-[12px] font-bold text-emerald-400 shrink-0">+{val?.toFixed(1)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-950/80 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 1, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Graphic 2: Size Distribution (Donut Chart) */}
              <div className="relative overflow-hidden rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/70 to-slate-950/80 p-6 flex flex-col hover:border-slate-700/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <h3 className="text-[9.5px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-5">
                  Workforce Scale Distribution
                </h3>
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6">
                  {/* Donut Chart */}
                  {sizeDistribution.totalClassified > 0 ? (
                    <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
                      <svg viewBox="0 0 40 40" className="w-full h-full transform -rotate-90">
                        <circle cx="20" cy="20" r="15.9155" fill="transparent" stroke="#0a0f1a" strokeWidth="5" />

                        {sizeDistribution.pEnterprise > 0 && (
                          <motion.circle
                            cx="20" cy="20" r="15.9155"
                            fill="transparent" stroke="#3b82f6" strokeWidth="5"
                            strokeDasharray={`${sizeDistribution.pEnterprise} 100`}
                            strokeDashoffset={0}
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${sizeDistribution.pEnterprise} 100` }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}

                        {sizeDistribution.pLarge > 0 && (
                          <motion.circle
                            cx="20" cy="20" r="15.9155"
                            fill="transparent" stroke="#6366f1" strokeWidth="5"
                            strokeDasharray={`${sizeDistribution.pLarge} 100`}
                            strokeDashoffset={-sizeDistribution.pEnterprise}
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${sizeDistribution.pLarge} 100` }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}

                        {sizeDistribution.pMid > 0 && (
                          <motion.circle
                            cx="20" cy="20" r="15.9155"
                            fill="transparent" stroke="#8b5cf6" strokeWidth="5"
                            strokeDasharray={`${sizeDistribution.pMid} 100`}
                            strokeDashoffset={-(sizeDistribution.pEnterprise + sizeDistribution.pLarge)}
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${sizeDistribution.pMid} 100` }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}

                        {sizeDistribution.pSmall > 0 && (
                          <motion.circle
                            cx="20" cy="20" r="15.9155"
                            fill="transparent" stroke="#10b981" strokeWidth="5"
                            strokeDasharray={`${sizeDistribution.pSmall} 100`}
                            strokeDashoffset={-(sizeDistribution.pEnterprise + sizeDistribution.pLarge + sizeDistribution.pMid)}
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${sizeDistribution.pSmall} 100` }}
                            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                          />
                        )}
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">Total</span>
                        <span className="text-base font-extrabold text-slate-200 mt-0.5">{sizeDistribution.totalClassified}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 italic">No size metrics available</span>
                  )}

                  {/* Legend */}
                  <div className="flex-1 grid grid-cols-2 gap-x-5 gap-y-3 w-full max-w-[240px]">
                    {[
                      { color: "bg-blue-500", label: "Enterprise", count: sizeDistribution.enterprise, pct: sizeDistribution.pEnterprise },
                      { color: "bg-indigo-500", label: "Large", count: sizeDistribution.large, pct: sizeDistribution.pLarge },
                      { color: "bg-violet-500", label: "Mid-size", count: sizeDistribution.mid, pct: sizeDistribution.pMid },
                      { color: "bg-emerald-500", label: "Small", count: sizeDistribution.small, pct: sizeDistribution.pSmall },
                    ].map(({ color, label, count, pct }) => (
                      <div key={label} className="flex items-start gap-2">
                        <span className={`h-2 w-2 rounded-full ${color} shrink-0 mt-0.5`} />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-slate-500 leading-none">{label}</span>
                          <span className="text-[11px] font-bold text-slate-200 mt-1">
                            {count} <span className="text-slate-500 font-medium">({pct.toFixed(0)}%)</span>
                          </span>
                        </div>
                      </div>
                    ))}
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
  const [sortBy, setSortBy] = useState<"name" | "sector">("name");
  const [filterSector, setFilterSector] = useState<string | null>(null);
  const { data: companies = [], isLoading, isError, refetch } = useCompanies();

  const sectors = useMemo(() => {
    const set = new Set<string>();
    companies.forEach((c) => {
      const cat = catShortName(c.category);
      if (cat) set.add(cat);
    });
    return Array.from(set).sort();
  }, [companies]);

  const deferred = useDeferredValue(query);
  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    let result = [...companies];
    
    if (filterSector) {
      result = result.filter((c) => catShortName(c.category) === filterSector);
    }

    if (q) {
      result = result.filter((c) => {
        return (
          c.name.toLowerCase().includes(q) ||
          c.short_name.toLowerCase().includes(q) ||
          (c.office_locations ?? "").toLowerCase().includes(q) ||
          (c.operating_countries ?? "").toLowerCase().includes(q) ||
          (c.category ?? "").toLowerCase().includes(q)
        );
      });
    }

    if (sortBy === "sector") {
      result.sort((a, b) => {
        const catA = a.category || "";
        const catB = b.category || "";
        if (catA !== catB) return catA.localeCompare(catB);
        return a.name.localeCompare(b.name);
      });
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return result;
  }, [companies, deferred, sortBy, filterSector]);

  const handleSelect = (c: CompanySummary) => {
    selectCompany({ companyId: c.company_id, companyName: c.name, logoUrl: c.logo_url });
    navigate({ to: "/company/intelligence" });
  };

  return (
    <div className="mesh-bg relative min-h-screen">
      <div className="grid-bg absolute inset-0 z-0 pointer-events-none" />
      <PlacementNetworkBackground />


      {/* ── HERO ─────────────────────────────────── */}
      <header className="relative z-10">
        <div className="relative mx-auto max-w-5xl px-6 pb-16 pt-24 sm:pt-32">
          {/* Platform badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
            </span>
            {COLLEGE_SHORT} · Placement Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="font-heading text-[2.5rem] font-semibold tracking-[-0.035em] text-foreground sm:text-[3.5rem] lg:text-[4.25rem] leading-[1.02]"
          >
            Every recruiter at {COLLEGE_SHORT},
            <br />
            <span className="text-muted-foreground">in one quiet place.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground"
          >
            Deep company intelligence, skill maps, and growth analytics — engineered for the
            students and faculty of {COLLEGE_NAME}.
          </motion.p>

          {/* Search bar & Sort Controls */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 max-w-xl"
          >
            <div className="glass-search relative flex items-center px-5">
              <Search className="pointer-events-none h-4 w-4 shrink-0 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search companies, locations, categories…"
                className="h-12 flex-1 border-0 bg-transparent px-3 text-[14px] text-foreground placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
              />
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.12 }}
                    onClick={() => setQuery("")}
                    className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-3.5 w-3.5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 flex flex-col gap-3 px-1">
              {/* Sort Controls */}
              <div className="flex items-center gap-3 text-[13px] text-muted-foreground">
                 <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Sort by:</span>
                 <button 
                   onClick={() => setSortBy("name")} 
                   className={`px-3 py-1 rounded-full transition-colors border ${sortBy === "name" ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800"}`}
                 >
                   Company Name
                 </button>
                 <button 
                   onClick={() => setSortBy("sector")} 
                   className={`px-3 py-1 rounded-full transition-colors border ${sortBy === "sector" ? "bg-slate-800 text-slate-200 border-slate-700" : "bg-transparent border-transparent hover:bg-slate-800/50 hover:border-slate-800"}`}
                 >
                   Industry Sector
                 </button>
              </div>

              {/* Filter Controls */}
              {sectors.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
                  <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px] mr-1 shrink-0">Filter:</span>
                  <button
                    onClick={() => setFilterSector(null)}
                    className={`shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${filterSector === null ? "bg-slate-800 text-slate-200 border-slate-700 shadow-[0_0_12px_rgba(148,163,184,0.15)]" : "bg-transparent text-slate-400 border-slate-800/60 hover:bg-slate-800/50"}`}
                  >
                    All
                  </button>
                  {sectors.map((s) => {
                    const isActive = filterSector === s;
                    const accent = getCategoryAccent(s);
                    const hue = getCategoryHue(s);
                    
                    return (
                      <button
                        key={s}
                        onClick={() => setFilterSector(isActive ? null : s)}
                        className={`group shrink-0 px-3 py-1 rounded-full text-[12px] font-medium transition-colors border ${isActive ? `${accent.badgeBg} ${accent.badgeText} ${accent.badgeBorder}` : "bg-transparent text-slate-400 border-slate-800/60 hover:bg-slate-800/50"}`}
                        style={isActive ? { boxShadow: `0 0 12px hsla(${hue}, 80%, 60%, 0.2)` } : undefined}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <main className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 relative z-10">

        {/* Thin divider between hero and content */}
        <div className="border-t border-border mb-10" />

        {/* Analytics Dashboard — only shown when data loaded */}
        {!isLoading && !isError && companies.length > 0 && (
          <HomepageAnalyticsDashboard companies={companies} />
        )}

        {/* Result count */}
        {!isLoading && !isError && filtered.length > 0 && (
          <p className="mb-5 text-[11px] font-semibold text-slate-500 tracking-wide">
            {filtered.length} {filtered.length === 1 ? "company" : "companies"}
          </p>
        )}

        {/* Company grid / states */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative overflow-hidden flex flex-col rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-950/70 p-6 min-h-[248px] justify-between">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/40 to-transparent" />
                <div className="flex items-start justify-between w-full">
                  <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-800/80" />
                  <div className="h-5 w-14 animate-pulse rounded-lg bg-slate-800/60" />
                </div>
                <div className="space-y-2 mt-4 flex-1">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-slate-800/70" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-800/40" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4 w-full">
                  <div className="h-9 animate-pulse rounded-xl bg-slate-800/40" />
                  <div className="h-9 animate-pulse rounded-xl bg-slate-800/40" />
                </div>
                <div className="mt-5 pt-3 border-t border-slate-800/30 flex items-center justify-between w-full">
                  <div className="h-3 w-24 animate-pulse rounded bg-slate-800/30" />
                  <div className="h-3 w-12 animate-pulse rounded bg-slate-800/30" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-16 text-center">
            <Building2 className="mx-auto mb-4 h-9 w-9 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">Failed to load companies.</p>
            <Button variant="outline" className="mt-5 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600" onClick={() => refetch()}>
              Try again
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/50 bg-slate-900/40 p-16 text-center">
            <Search className="mx-auto mb-4 h-9 w-9 text-slate-700" />
            <p className="text-sm font-medium text-slate-500">No companies match your search.</p>
            <Button variant="outline" className="mt-5 rounded-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="company-grid grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((c, i) => (
              <CompanyCard key={c.company_id} company={c} onSelect={handleSelect} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

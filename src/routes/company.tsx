import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState, memo, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Building2, GraduationCap, Globe, Building, Briefcase } from "lucide-react";

import { useCompany, readStoredCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";
import { useCompanyProfile } from "@/lib/companyApi";
import { CompanyAIChatbot } from "@/components/CompanyAIChatbot";

export const Route = createFileRoute("/company")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/company" || location.pathname === "/company/") {
      throw redirect({ to: "/company/intelligence" });
    }
  },
  component: CompanyLayout,
});

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
    // Cap DPR at 1.5 to reduce fill rate overhead on high-DPI screens
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

    // Throttle mouse moves to avoid high frequency triggers
    let lastMouseTime = 0;
    const onMouse = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < 16) return;
      lastMouseTime = now;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };

    // Pause when tab is inactive
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

    // Reduced count from 32 to 18
    const particles = Array.from({ length: 18 }, (_, i) => {
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

      // Update positions
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

      // Draw connections using squared-distance to avoid Math.sqrt in nested loop
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
            if (ed2 < 12100) { // < 110px
              const alpha =
                ((160 - a.md) / 160) *
                ((160 - b.md) / 160) *
                (1 - ed2 / 12100) * 0.16;
              ctx.beginPath();
              ctx.moveTo(a.dx, a.dy);
              ctx.lineTo(b.dx, b.dy);
              ctx.strokeStyle = `rgba(99,130,246,${alpha.toFixed(3)})`;
              ctx.stroke();
            }
          }
        }
      }

      // Draw particles (disable shadowBlur for massive performance boost)
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
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden"
    />
  );
});

function CompanyLayout() {
  const navigate = useNavigate();
  const { selected, selectCompany } = useCompany();
  const { data: profile } = useCompanyProfile(selected?.companyId ?? 0);
  const pathname = useRouterState({
    select: (s) => s.location.pathname,
  });

  // Hydrate from localStorage on direct refresh / SSR boundary.
  useEffect(() => {
    if (selected) return;
    const stored = readStoredCompany();
    if (stored) {
      selectCompany(stored);
    } else {
      navigate({ to: "/" });
    }
  }, [selected, selectCompany, navigate]);

  if (!selected) return null;

  return (
    <div className="mesh-bg min-h-screen w-full flex flex-col relative">
      <div className="grid-bg absolute inset-0 z-0 pointer-events-none" />
      <PlacementNetworkBackground />


      {/* ── UNIFIED STICKY TOP HEADER ─────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 border-b border-slate-900/60 bg-slate-950/95 backdrop-blur-sm shadow-lg relative"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Left: Back button + Logo + Company details */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Back Button */}
            <motion.div whileHover={{ x: -2 }} whileTap={{ scale: 0.92 }}>
              <Link
                to="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-850/60 bg-slate-900/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all shrink-0 cursor-pointer"
                title="Back to all companies"
              >
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </motion.div>

            {/* Logo */}
            <CompanyLogo
              name={selected.companyName}
              logoUrl={selected.logoUrl}
              size={40}
              className="shrink-0 rounded-xl border border-slate-850/65 bg-slate-900/40 p-0.5"
            />

            {/* Titles & Sticky Meta Info */}
            <div className="min-w-0">
              <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-100 leading-snug break-words">
                {selected.companyName}
              </h1>
              {/* Sticky Sector / Type / Website row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-medium text-slate-400">
                {profile?.category ? (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-slate-500" />
                    {String(profile.category)}
                  </span>
                ) : null}
                {profile?.nature_of_company ? (
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3 text-slate-500" />
                    {String(profile.nature_of_company)}
                  </span>
                ) : null}
                {profile?.website_url ? (
                  <a
                    href={String(profile.website_url)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Globe className="h-3 w-3" /> Website
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* Right: Toggle Switcher Segment */}
          <div className="flex items-center gap-4 self-end md:self-auto shrink-0 relative z-10">
            <div className="flex bg-slate-900/40 p-1 border border-slate-850/80 rounded-full">
              <Link
                to="/company/intelligence"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${pathname === "/company/intelligence"
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/10 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.25)] font-bold"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
              >
                <motion.div whileHover={{ rotate: -8 }} whileTap={{ scale: 0.95 }}>
                  <Building2 className="h-3.5 w-3.5" />
                </motion.div>
                <span>Intelligence</span>
              </Link>
              <Link
                to="/company/skills"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${pathname === "/company/skills"
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/10 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.25)] font-bold"
                  : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
              >
                <motion.div whileHover={{ rotate: 12 }} whileTap={{ scale: 0.95 }}>
                  <GraduationCap className="h-3.5 w-3.5" />
                </motion.div>
                <span>Skills</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── MAIN VIEWPORT CONTAINER ─────────────────── */}
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      {/* ── FLOATING AI CHATBOT ─────────────────────── */}
      <CompanyAIChatbot />
    </div>
  );
}

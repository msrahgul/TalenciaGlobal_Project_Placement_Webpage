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
import { ChevronLeft, Building2, GraduationCap } from "lucide-react";

import { useCompany, readStoredCompany } from "@/context/CompanyContext";
import { CompanyLogo } from "@/components/CompanyLogo";

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

function CompanyLayout() {
  const navigate = useNavigate();
  const { selected, selectCompany } = useCompany();
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
      {/* Interactive float node background */}
      <PlacementNetworkBackground />

      {/* ── UNIFIED STICKY TOP HEADER ─────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-30 border-b border-slate-900/60 bg-slate-950/70 backdrop-blur-xl shadow-lg relative"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Left: Back button + Logo + Company details */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-850/60 bg-slate-900/40 text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 transition-all shrink-0 cursor-pointer"
              title="Back to all companies"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>

            {/* Logo */}
            <CompanyLogo
              name={selected.companyName}
              logoUrl={selected.logoUrl}
              size={40}
              className="shrink-0 rounded-xl border border-slate-850/65 bg-slate-900/40 p-0.5"
            />

            {/* Titles */}
            <div className="min-w-0">
              {/* Wrapped title without truncate for full visibility */}
              <h1 className="font-heading text-lg sm:text-xl font-bold text-slate-100 leading-snug break-words">
                {selected.companyName}
              </h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">
                Placement Hub
              </p>
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
                <Building2 className="h-3.5 w-3.5" />
                <span>Intelligence</span>
              </Link>
              <Link
                to="/company/skills"
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${pathname === "/company/skills"
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/10 shadow-[0_2px_8px_-2px_rgba(59,130,246,0.25)] font-bold"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
              >
                <GraduationCap className="h-3.5 w-3.5" />
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
    </div>
  );
}

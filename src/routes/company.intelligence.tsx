import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Linkedin, ExternalLink, Star, Activity, Users, Award } from "lucide-react";

import { useCompanyProfile } from "@/lib/companyApi";
import { useCompany, readStoredCompany } from "@/context/CompanyContext";
import {
  isNullish,
  splitItems,
  asString,
  type CompanyProfile,
} from "@/lib/companyData";
import { buildIntelligenceSections, type IntelField } from "@/data/intelligenceData";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/company/intelligence")({
  head: () => ({
    meta: [
      { title: "Company Intelligence — KITS Placement Hub" },
      {
        name: "description",
        content: "22-section deep dive on a recruiting company.",
      },
    ],
  }),
  component: CompanyIntelligencePage,
});

function NotAvailable() {
  return (
    <span className="text-xs font-medium text-slate-600/50 italic">
      Not provided
    </span>
  );
}

function renderValue(value: unknown, type?: IntelField["type"]): ReactNode {
  if (isNullish(value)) return <NotAvailable />;
  const s = asString(value);

  if (type === "url" || /^https?:\/\//i.test(s)) {
    return (
      <a
        href={s}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 font-semibold text-blue-400 hover:text-blue-300 transition-colors group/link"
      >
        <span className="truncate max-w-[200px] sm:max-w-[300px]">{s.replace(/^https?:\/\/(www\.)?/, '')}</span>
        <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 shrink-0" />
      </a>
    );
  }

  if (type === "video") {
    return (
      <a
        href={s}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-violet-500/10 border border-violet-500/20 px-3 py-1.5 text-xs font-semibold text-violet-400 transition-all hover:bg-violet-500/20 hover:border-violet-500/30 shadow-[0_0_12px_rgba(139,92,246,0.05)] hover:scale-[1.02]"
      >
        <span>Watch Video Clip</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
    );
  }

  if (type === "rating") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-xs font-semibold text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.08)]">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
        {s} / 5.0
      </span>
    );
  }

  if (type === "list" || (type !== "paragraph" && /[;\n•]/.test(s))) {
    const items = splitItems(s);
    if (items.length > 1) {
      return (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {items.map((it, i) => (
            <span
              key={i}
              className="inline-flex items-center rounded-lg bg-slate-950/60 border border-slate-800/60 px-2.5 py-1 text-xs font-medium text-slate-300 hover:border-slate-700/60 hover:text-white transition-all cursor-default"
            >
              {it}
            </span>
          ))}
        </div>
      );
    }
  }

  if (type === "paragraph") {
    return (
      <p className="leading-relaxed text-slate-300 text-sm border-l-2 border-blue-500/30 bg-blue-500/[0.02] pl-3 py-1 rounded-r-md mt-0.5 whitespace-pre-line">
        {s}
      </p>
    );
  }

  return <span className="font-semibold text-slate-200 text-sm">{s}</span>;
}

function BentoFieldCell({
  label,
  value,
  type,
}: {
  label: string;
  value: unknown;
  type?: IntelField["type"];
}) {
  const empty = isNullish(value);
  const s = asString(value);
  
  // Decide responsive column spans based on length and format type
  let colSpan = "col-span-1";
  if (type === "paragraph" || type === "video" || s.length > 120 || (type === "list" && s.split(/[;\n•]/).length > 4)) {
    colSpan = "md:col-span-2 lg:col-span-3 col-span-1";
  } else if (type === "list" || s.length > 50) {
    colSpan = "md:col-span-2 col-span-1";
  }

  return (
    <div
      className={`group/cell relative flex flex-col gap-1.5 rounded-xl border transition-all duration-300 ${
        empty
          ? "border-slate-855/30 bg-slate-955/10 opacity-30 hover:opacity-50 p-3"
          : "border-slate-800/40 bg-slate-900/10 hover:border-slate-700/40 hover:bg-slate-900/20 p-4 shadow-sm hover:shadow-[0_2px_12px_-2px_rgba(59,130,246,0.04)]"
      } ${colSpan}`}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 transition-colors group-hover/cell:text-slate-400">
        {label}
      </div>
      <div className="flex-1 text-sm text-slate-200">
        {renderValue(value, type)}
        {!empty && type === "rating" && (
          <div className="mt-3 h-1.5 rounded-full bg-slate-950 border border-slate-900/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.25)]"
              style={{ width: `${(parseFloat(s) || 0) * 20}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   INTELLIGENCE OVERVIEW DASHBOARD (REAL DATABASE DATA ONLY)
   ═══════════════════════════════════════════════════════ */
interface DashboardProps {
  profile: CompanyProfile;
}

function IntelligenceOverviewDashboard({ profile }: DashboardProps) {
  // 1. Get YoY Growth Rate
  const growthRaw = asString(profile.yoy_growth_rate);
  const hasGrowth = !isNullish(profile.yoy_growth_rate);
  const isNegGrowth = growthRaw.trim().startsWith("-");

  // 2. Get Reputation Rating
  const ratingRaw = asString(profile.glassdoor_rating || profile.google_rating || profile.indeed_rating);
  const ratingLabel = profile.glassdoor_rating ? "Glassdoor Rating" : profile.google_rating ? "Google Rating" : profile.indeed_rating ? "Indeed Rating" : "Reputation";
  const hasRating = !isNullish(profile.glassdoor_rating || profile.google_rating || profile.indeed_rating);
  const ratingVal = parseFloat(ratingRaw) || 0;

  // 3. Get workforce scale
  const sizeRaw = asString(profile.employee_size);
  const hasSize = !isNullish(profile.employee_size);

  // 4. Get tech adoption rating
  const techRaw = asString(profile.tech_adoption_rating || profile.ai_ml_adoption_level);
  const techLabel = profile.tech_adoption_rating ? "Tech Rating" : "AI/ML Adoption";
  const hasTech = !isNullish(profile.tech_adoption_rating || profile.ai_ml_adoption_level);
  const techVal = parseFloat(techRaw) || (techRaw.toLowerCase().includes("high") ? 8 : techRaw.toLowerCase().includes("medium") ? 5 : 3);

  // Radial progress maths
  const radialRadius = 16;
  const radialCircumference = 2 * Math.PI * radialRadius;
  const radialOffset = radialCircumference - Math.min(1, Math.max(0, ratingVal / 5)) * radialCircumference;

  if (!hasGrowth && !hasRating && !hasSize && !hasTech) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* YoY Growth Card */}
      {hasGrowth && (
        <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-28 hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">YoY Growth</span>
            <Activity className="h-4 w-4 text-slate-400" />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className={`text-xl font-bold font-heading tabular-nums leading-none ${isNegGrowth ? "text-red-400" : "text-emerald-400"}`}>
                {growthRaw}
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">Growth Indicator</span>
            </div>
            
            {/* Sparkline Graph */}
            <svg className={`w-16 h-8 shrink-0 ${isNegGrowth ? "text-red-500/80" : "text-emerald-500/80"}`} viewBox="0 0 50 20">
              <path
                d={isNegGrowth ? "M0 2 L 12 8 L 25 7 L 37 14 L 50 18" : "M0 18 L 12 12 L 25 14 L 37 5 L 50 2"}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Rating Card */}
      {hasRating && (
        <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-28 hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">{ratingLabel}</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold font-heading text-slate-100 leading-none">
                {ratingVal.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 5.0</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">Employer Brand</span>
            </div>
            
            {/* Radial progress ring */}
            <div className="relative flex items-center justify-center h-10 w-10 shrink-0">
              <svg className="w-10 h-10 transform -rotate-90">
                <circle cx="20" cy="20" r={radialRadius} className="text-slate-900" strokeWidth="2.5" stroke="currentColor" fill="transparent" />
                <circle
                  cx="20"
                  cy="20"
                  r={radialRadius}
                  className="text-amber-500/80"
                  strokeWidth="2.5"
                  strokeDasharray={radialCircumference}
                  strokeDashoffset={radialOffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                />
              </svg>
              <Star className="absolute h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            </div>
          </div>
        </div>
      )}

      {/* Workforce Scale Card */}
      {hasSize && (
        <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-28 hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">Workforce Scale</span>
            <Users className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold font-heading text-slate-100 truncate leading-none">
              {sizeRaw}
            </span>
            {/* Horizontal capacity bar */}
            <div className="h-2 rounded-full bg-slate-950 border border-slate-900/50 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                style={{ width: sizeRaw.toLowerCase().includes("10k") || sizeRaw.toLowerCase().includes("50k") || sizeRaw.toLowerCase().includes("100k") || parseFloat(sizeRaw) > 10000 ? "85%" : "45%" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tech Adoption Card */}
      {hasTech && (
        <div className="rounded-2xl border border-slate-850/80 bg-slate-950/20 p-4 flex flex-col justify-between h-28 hover:border-slate-800 transition-all duration-300">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] font-bold uppercase tracking-widest">{techLabel}</span>
            <Award className="h-4 w-4 text-violet-400" />
          </div>
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold font-heading text-slate-100 leading-none">
                {techVal.toFixed(1)} <span className="text-xs text-slate-500 font-normal">/ 10.0</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold mt-1">Innovation Index</span>
            </div>
            
            {/* Segmented index tracks */}
            <div className="flex gap-0.5 shrink-0 pb-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = techVal >= (i + 1) * 2;
                return (
                  <span
                    key={i}
                    className={`h-4 w-1.5 rounded-sm ${filled ? "bg-violet-500/80 shadow-[0_0_8px_rgba(139,92,246,0.3)]" : "bg-slate-900"}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyIntelligencePage() {
  const { selected } = useCompany();
  const stored = selected ?? readStoredCompany();
  const companyId = stored?.companyId ?? 1;

  const { data: profile, isLoading, isError, refetch } = useCompanyProfile(companyId);

  const sections = useMemo(
    () => buildIntelligenceSections(profile ?? undefined),
    [profile],
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const isScrollingRef = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!profile) return;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      // Offset adjusts for sticky header
      const offset = window.innerWidth >= 1024 ? 120 : 160;
      let current = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top - offset <= 0) current = i;
      });
      setActiveIdx(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [profile]);

  useEffect(() => {
    // Scroll mobile tabs
    const mobileEl = tabsRef.current?.querySelector<HTMLButtonElement>(
      `[data-tab-idx="${activeIdx}"]`,
    );
    mobileEl?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIdx]);

  // Synchronized scrolling between window and left sidebar (desktop) with smooth LERP damping
  useEffect(() => {
    if (!profile) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    let syncTimeout: number | null = null;
    let activeSource: "window" | "sidebar" | null = null;

    const clearSync = () => {
      activeSource = null;
    };

    const targetSidebarTop = { current: sidebar.scrollTop };
    const currentSidebarTop = { current: sidebar.scrollTop };
    let animationFrameId: number;

    const smoothScrollLoop = () => {
      if (activeSource === "window") {
        const diff = targetSidebarTop.current - currentSidebarTop.current;
        if (Math.abs(diff) > 0.5) {
          currentSidebarTop.current += diff * 0.15; // Smooth LERP speed
          sidebar.scrollTop = currentSidebarTop.current;
        } else {
          currentSidebarTop.current = targetSidebarTop.current;
          sidebar.scrollTop = currentSidebarTop.current;
        }
      }
      animationFrameId = requestAnimationFrame(smoothScrollLoop);
    };

    animationFrameId = requestAnimationFrame(smoothScrollLoop);

    const handleWindowScroll = () => {
      if (activeSource === "sidebar") return;
      activeSource = "window";

      const windowScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const sidebarScrollable = sidebar.scrollHeight - sidebar.clientHeight;
      if (windowScrollable > 0 && sidebarScrollable > 0) {
        const pct = window.scrollY / windowScrollable;
        targetSidebarTop.current = pct * sidebarScrollable;
      }

      if (syncTimeout) window.clearTimeout(syncTimeout);
      syncTimeout = window.setTimeout(clearSync, 100);
    };

    const handleSidebarScroll = () => {
      if (activeSource === "window") return;
      activeSource = "sidebar";

      // Sync refs when directly scrolling the sidebar
      currentSidebarTop.current = sidebar.scrollTop;
      targetSidebarTop.current = sidebar.scrollTop;

      const windowScrollable = document.documentElement.scrollHeight - window.innerHeight;
      const sidebarScrollable = sidebar.scrollHeight - sidebar.clientHeight;
      if (windowScrollable > 0 && sidebarScrollable > 0) {
        const pct = sidebar.scrollTop / sidebarScrollable;
        window.scrollTo(window.scrollX, pct * windowScrollable);
      }

      if (syncTimeout) window.clearTimeout(syncTimeout);
      syncTimeout = window.setTimeout(clearSync, 100);
    };

    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    sidebar.addEventListener("scroll", handleSidebarScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleWindowScroll);
      sidebar.removeEventListener("scroll", handleSidebarScroll);
      if (syncTimeout) window.clearTimeout(syncTimeout);
    };
  }, [profile]);

  const scrollToSection = (i: number) => {
    const el = sectionRefs.current[i];
    if (!el) return;
    isScrollingRef.current = true;
    setActiveIdx(i);
    // Align scroll offset correctly factoring in sticky header
    const headerHeight = window.innerWidth >= 1024 ? 90 : 135;
    const y = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: y, behavior: "smooth" });
    window.setTimeout(() => { isScrollingRef.current = false; }, 600);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Info Strip Skeleton */}
        <div className="h-14 animate-pulse rounded-2xl bg-slate-900/30 border border-slate-900 mb-8" />
        
        {/* Body Skeleton (Split Pane) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Skeleton */}
          <div className="hidden lg:flex lg:flex-col gap-2 w-72 shrink-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-slate-900/30 border border-slate-900" />
            ))}
          </div>
          
          {/* Right Content Skeleton */}
          <div className="flex-1 space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-900/40 border border-slate-900 p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-800/50" />
                    <div className="h-5 w-40 bg-slate-800/50 rounded-lg" />
                  </div>
                  <div className="h-5 w-12 bg-slate-800/30 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-16 bg-slate-900/20 border border-slate-850 rounded-xl" />
                  <div className="h-16 bg-slate-900/20 border border-slate-850 rounded-xl" />
                  <div className="h-16 bg-slate-900/20 border border-slate-850 rounded-xl col-span-1 md:col-span-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-sm font-medium text-red-400">Failed to load company intelligence details.</p>
        <Button variant="outline" className="mt-4 rounded-full border-slate-800 text-slate-300 hover:bg-slate-800" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-muted-foreground">
        Company profile not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
      
      {/* ── INFO STRIP & MOBILE TABS INDEX ─────────────────── */}
      <div className="mb-6 flex flex-col gap-4">
        {/* Info Strip (Category + External Links) */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950/20 border border-slate-900/50 rounded-2xl px-5 py-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sector:</span>
            {!isNullish(profile.category) ? (
              <span className="inline-flex items-center rounded-lg bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">
                {asString(profile.category)}
              </span>
            ) : (
              <NotAvailable />
            )}
          </div>
          <div className="flex gap-2">
            {!isNullish(profile.website_url) && (
              <Button asChild size="sm" variant="outline" className="rounded-full border-slate-800/80 bg-slate-900/40 text-xs text-slate-350 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 hover:scale-[1.03] transition-all">
                <a href={asString(profile.website_url)} target="_blank" rel="noreferrer">
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Website
                </a>
              </Button>
            )}
            {!isNullish(profile.linkedin_url) && (
              <Button asChild size="sm" variant="outline" className="rounded-full border-slate-800/80 bg-slate-900/40 text-xs text-slate-350 hover:bg-blue-500/10 hover:border-blue-500/20 hover:text-blue-400 hover:scale-[1.03] transition-all">
                <a href={asString(profile.linkedin_url)} target="_blank" rel="noreferrer">
                  <Linkedin className="mr-1.5 h-3.5 w-3.5" /> LinkedIn
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Sticky Tab Nav (lg:hidden) */}
        <div
          ref={tabsRef}
          className="sticky top-[72px] z-20 flex gap-1 overflow-x-auto rounded-2xl border border-slate-850/80 bg-slate-950/75 p-1 shadow-md backdrop-blur-xl lg:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {sections.map((s, i) => (
            <button
              key={s.id}
              data-tab-idx={i}
              onClick={() => scrollToSection(i)}
              className="relative inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors duration-150 focus-visible:outline-none cursor-pointer"
              style={{
                color: activeIdx === i ? "#60a5fa" : "#94a3b8",
                zIndex: 1,
              }}
            >
              {activeIdx === i && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute inset-0 rounded-xl border border-blue-500/20"
                  style={{
                    background: "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(139,92,246,0.1) 100%)",
                    boxShadow: "0 4px 12px -2px rgba(59,130,246,0.15)",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <s.icon className="relative h-3.5 w-3.5" />
              <span className="relative">{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── DUAL PANE DASHBOARD LAYOUT ─────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Column (Command Panel Sidebar) */}
        <div
          ref={sidebarRef}
          className="hidden lg:flex lg:flex-col gap-1 w-72 sticky top-[88px] max-h-[calc(100vh-120px)] overflow-y-auto pr-2 border-r border-slate-900/60 no-scrollbar select-none shrink-0"
        >
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Intelligence Categories
          </div>
          {sections.map((s, i) => {
            const populated = s.fields.filter((f) => !isNullish(profile[f.key])).length;
            const isActive = activeIdx === i;
            return (
              <button
                key={s.id}
                data-tab-idx={i}
                onClick={() => scrollToSection(i)}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-slate-900/40 border border-slate-800/80 text-blue-400 shadow-[0_4px_12px_-2px_rgba(59,130,246,0.1)]"
                    : "border border-transparent text-slate-400 hover:bg-slate-900/10 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <s.icon className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-blue-400 animate-pulse" : "text-slate-500 group-hover:text-slate-300"}`} />
                  <span className="truncate">{s.title}</span>
                </div>
                <span className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full border transition-colors shrink-0 ${
                  isActive
                    ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                    : "bg-slate-950/60 border-slate-900/80 text-slate-500 group-hover:text-slate-400"
                }`}>
                  {populated}/{s.fields.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column (Analytics Canvas) */}
        <div className="flex-1 w-full space-y-6 pb-24">
          {/* Real-Data Overview Dashboard strip at the top of the canvas */}
          <IntelligenceOverviewDashboard profile={profile} />

          {sections.map((section, i) => {
            const populated = section.fields.filter(
              (f) => !isNullish(profile[f.key]),
            ).length;
            return (
              <div
                key={section.id}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className="scroll-mt-[88px] lg:scroll-mt-[88px] rounded-2xl border border-slate-850/80 bg-gradient-to-b from-slate-900/40 to-slate-950/60 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-gradient-to-b hover:from-slate-900/95 hover:to-slate-950/90 hover:border-slate-500/80 hover:shadow-[0_0_30px_rgba(148,163,184,0.25)]"
              >
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-900 pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.08)] bg-gradient-to-br from-blue-500/15 to-violet-500/5 shrink-0"
                    >
                      <section.icon className="h-4.5 w-4.5 text-blue-400" style={{ width: 18, height: 18 }} />
                    </div>
                    <h2 className="font-heading text-lg font-bold text-slate-100 tracking-tight">
                      {section.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-slate-950/80 border border-slate-900 px-3 py-0.5 text-xs font-semibold tabular-nums text-slate-400">
                    {populated}/{section.fields.length} Completeness
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.fields.map((f) => (
                    <BentoFieldCell
                      key={f.key}
                      label={f.label}
                      value={profile[f.key]}
                      type={f.type}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

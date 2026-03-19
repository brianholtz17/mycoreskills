"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LaunchAreaWithTiles } from "@/lib/supabase/types";
import { SectionBlock, TileListOverlay } from "./components/section-block";
import { DASHBOARD_HERO_GIF } from "./config/auth";

type DashboardClientProps = {
  initialAreas: LaunchAreaWithTiles[];
};

export function DashboardClient({ initialAreas }: DashboardClientProps) {
  const [areas] = useState(initialAreas);
  const [openArea, setOpenArea] = useState<LaunchAreaWithTiles | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalSections = 1 + areas.length;

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    // Use 50% threshold so a section is "active" when at least half of it is in view (more stable)
    const index = Math.floor((el.scrollTop + vh * 0.5) / vh);
    setCurrentSection(Math.max(0, Math.min(index, totalSections - 1)));
  }, [totalSections]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    handleScroll();
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="h-screen flex flex-col bg-neutral-950 text-white overflow-hidden">
      {/* Moving dot - only on hero (section 0) */}
      <div
        className="fixed left-1/2 bottom-8 z-20 -translate-x-1/2 transition-opacity duration-300 pointer-events-none"
        style={{ opacity: currentSection === 0 ? 1 : 0 }}
        aria-hidden
      >
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {/* Hero - top page with GIF background */}
        <section
          id="hero"
          className="relative h-screen w-full flex-shrink-0 snap-start snap-always flex flex-col items-center justify-center bg-neutral-900 bg-cover bg-center"
          style={{ backgroundImage: `url(${DASHBOARD_HERO_GIF})` }}
        >
          <div className="absolute inset-0 bg-black/55 pointer-events-none" aria-hidden />
          {/* Top-right: Admin */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <a
              href="/admin"
              className="text-sm text-neutral-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
            >
              Admin
            </a>
          </div>
          <h1 className="relative z-10 text-4xl md:text-5xl font-semibold tracking-tight text-white drop-shadow-md flex flex-wrap justify-center items-center gap-0">
            <span className="hero-word-my inline-block">My</span>
            <span className="hero-word-core inline-block">Core</span>
            <span className="hero-word-skills inline-block">Skills</span>
          </h1>
        </section>

        {/* Launch area sections */}
        {areas.map((area, index) => (
          <SectionBlock
            key={area.id}
            area={area}
            index={index + 1}
            isActive={currentSection === index + 1}
            onClick={() => area.tiles.length > 0 && setOpenArea(area)}
          />
        ))}
      </div>

      {/* Full-page tile list overlay */}
      {openArea && (
        <TileListOverlay area={openArea} onClose={() => setOpenArea(null)} />
      )}
    </div>
  );
}

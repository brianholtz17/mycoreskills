"use client";

import { useEffect, useRef } from "react";
import type { LaunchAreaWithTiles } from "@/lib/supabase/types";
import { LAUNCH_VIDEOS } from "@/app/config/launch-videos";
import { EnglishGrammarRollingTitle } from "./english-grammar-rolling-title";
import { TileListItem } from "./tile-list-item";

type SectionBlockProps = {
  area: LaunchAreaWithTiles;
  index: number;
  isActive: boolean;
  onClick: () => void;
};

export function SectionBlock({ area, index, isActive, onClick }: SectionBlockProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wasActiveRef = useRef(false);
  const videoSrc = LAUNCH_VIDEOS[area.slug];

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    const justBecameActive = isActive && !wasActiveRef.current;
    wasActiveRef.current = isActive;
    if (isActive) {
      if (justBecameActive) video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isActive, videoSrc]);

  return (
    <section
      id={`section-${area.slug}`}
      className="relative h-screen w-full flex-shrink-0 snap-start snap-always overflow-hidden"
      data-section-index={index}
    >
      {videoSrc && (
        <div className="absolute inset-0 bg-neutral-900">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            data-launch-video
            className="absolute inset-0 w-full h-full object-cover portrait:object-contain object-center"
            src={videoSrc}
          />
          <div className="absolute inset-0 bg-black/45 pointer-events-none" aria-hidden />
        </div>
      )}
      {!videoSrc && <div className="absolute inset-0 bg-neutral-900" />}

      <button
        type="button"
        onClick={onClick}
        className="relative z-10 flex flex-col items-center justify-center h-full w-full text-white hover:bg-white/5 transition-colors cursor-pointer"
      >
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight drop-shadow-md flex flex-wrap justify-center items-center gap-0">
          {area.slug === "math" ? (
            <>
              <span className="math-char-m inline-block">M</span>
              <span className="math-char-a inline-block">a</span>
              <span className="math-char-t inline-block">t</span>
              <span className="math-char-h inline-block">h</span>
            </>
          ) : area.slug === "reading" ? (
            <>
              <span className="readtheory-char-r inline-block">R</span>
              <span className="readtheory-char-e inline-block">e</span>
              <span className="readtheory-char-a inline-block">a</span>
              <span className="readtheory-char-d inline-block">d</span>
              <span className="readtheory-th inline-block">Th</span>
              <span className="readtheory-eo inline-block">eo</span>
              <span className="readtheory-ry inline-block">ry</span>
            </>
          ) : area.slug === "english-grammar" ? (
            <EnglishGrammarRollingTitle />
          ) : area.slug === "science" || area.slug === "my-workshops" ? (
            null
          ) : area.slug === "typing" ? (
            <>
              <span className="typing-char-t inline-block">T</span>
              <span className="typing-char-y inline-block">y</span>
              <span className="typing-char-p inline-block">p</span>
              <span className="typing-char-i inline-block">i</span>
              <span className="typing-char-n inline-block">n</span>
              <span className="typing-char-g inline-block">g</span>
            </>
          ) : area.slug === "im-bored" ? (
            <>
              <span className="imbored-static imbored-gap">I&apos;m</span>
              <span className="imbored-b inline-block">B</span>
              <span className="imbored-o inline-block">o</span>
              <span className="imbored-r inline-block">r</span>
              <span className="imbored-e inline-block">e</span>
              <span className="imbored-d inline-block">d</span>
              <span className="imbored-excl1 inline-block">!</span>
            </>
          ) : (
            area.title
          )}
        </h2>
      </button>
    </section>
  );
}

type TileListOverlayProps = {
  area: LaunchAreaWithTiles;
  onClose: () => void;
};

export function TileListOverlay({ area, onClose }: TileListOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 bg-neutral-950 flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-white/10">
        <button
          type="button"
          onClick={onClose}
          aria-label="Back"
          className="p-2.5 rounded-xl bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-neutral-950 shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">{area.title}</h1>
        <div className="w-14" />
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2 max-w-2xl mx-auto">
          {area.tiles.map((tile) => (
            <li key={tile.id}>
              <TileListItem title={tile.title} url={tile.url} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

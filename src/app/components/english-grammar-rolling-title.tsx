"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const TEXT = "English Grammar and Sentence Writing";
const CHARS = TEXT.split("");

export function EnglishGrammarRollingTitle() {
  const wrapRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const chars = Array.from(wrap.querySelectorAll<HTMLElement>("[data-char]"));
    if (chars.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set(chars, { rotateX: -90, opacity: 0, transformOrigin: "bottom center" });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
      tl.to(chars, {
        rotateX: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.04,
        ease: "back.out(1.2)",
      }).to(
        chars,
        {
          rotateX: 90,
          opacity: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: "back.in(1.2)",
        },
        "+=1.2"
      );
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <span
      ref={wrapRef}
      className="inline-flex justify-center items-end overflow-visible"
      style={{ perspective: "600px" }}
    >
      {CHARS.map((char, i) => (
        <span
          key={`${i}-${char}`}
          data-char
          className="inline-block origin-bottom"
          style={{ transformStyle: "preserve-3d" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { NAV_HEIGHT } from "./Header";
import { useTheme } from "../context/ThemeContext";
import { font } from "../theme/tokens";

export interface RailItem {
  id: string;
  label: string;
}

// Sticky right-hand "on this page" rail. Highlights every section currently
// visible in the viewport with a bright segment that hugs the label glyphs,
// over a subtle full-list track. Sections are located by DOM id.
const InPageRail: React.FC<{ items: RailItem[]; hidden?: boolean }> = ({ items, hidden = false }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState<Set<number>>(() => new Set([0]));
  const [hl, setHl] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
  const [track, setTrack] = useState<{ top: number; height: number }>({ top: 0, height: 0 });
  const [hoverStep, setHoverStep] = useState<number | null>(null);
  const labelRefs = useRef<(HTMLElement | null)[]>([]);
  const railRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const topEdge = NAV_HEIGHT + 8;
      const next = new Set<number>();
      items.forEach((it, i) => {
        const el = document.getElementById(it.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < vh - 8 && r.bottom > topEdge) next.add(i);
      });
      if (next.size === 0) next.add(0);
      setVisible((prev) => (prev.size === next.size && [...next].every((n) => prev.has(n)) ? prev : next));

      const idxs = [...next];
      const first = labelRefs.current[Math.min(...idxs)];
      const last = labelRefs.current[Math.max(...idxs)];
      const rail = railRef.current;
      if (first && last && rail) {
        const base = rail.getBoundingClientRect().top;
        const range = document.createRange();
        const glyph = (el: HTMLElement) => {
          range.selectNodeContents(el);
          return range.getBoundingClientRect();
        };
        const fTop = glyph(first).top;
        const lBottom = glyph(last).bottom;
        const top = fTop - base;
        const height = lBottom - fTop;
        setHl((prev) => (prev.top === top && prev.height === height ? prev : { top, height }));

        const all = labelRefs.current.filter(Boolean) as HTMLElement[];
        if (all.length) {
          const tTop = glyph(all[0]).top - base;
          const tHeight = glyph(all[all.length - 1]).bottom - base - tTop;
          setTrack((prev) => (prev.top === tTop && prev.height === tHeight ? prev : { top: tTop, height: tHeight }));
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  const scrollTo = (i: number) => {
    const el = document.getElementById(items[i].id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - (NAV_HEIGHT + 24);
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (hidden) return null;

  return (
    <nav
      aria-label="On this page"
      style={{ position: "sticky", top: `${NAV_HEIGHT + 80}px`, width: "289px", flexShrink: 0, padding: "16px 0" }}
    >
      <div ref={railRef} style={{ position: "relative" }}>
        {/* Subtle track spanning the labels' text extent */}
        <div style={{ position: "absolute", left: 0, top: `${track.top}px`, height: `${track.height}px`, width: "1px", background: colors.stroke }} />
        {/* Bright segment spanning the visible steps */}
        <div
          style={{
            position: "absolute",
            left: 0,
            width: "2px",
            top: `${hl.top}px`,
            height: `${hl.height}px`,
            background: colors.accent,
            transition: "top 0.2s ease, height 0.2s ease",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "16px" }}>
          {items.map((it, i) => {
            const isActive = visible.has(i);
            const isHover = hoverStep === i;
            return (
              <button
                key={it.id}
                onClick={() => scrollTo(i)}
                onMouseEnter={() => setHoverStep(i)}
                onMouseLeave={() => setHoverStep(null)}
                style={{
                  display: "block",
                  width: "100%",
                  paddingBottom: "24px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  ref={(el) => (labelRefs.current[i] = el)}
                  style={{
                    display: "inline-block",
                    fontFamily: font.family,
                    fontSize: `${font.size.bodyMedium}px`,
                    lineHeight: `${font.lineHeight.body}px`,
                    fontWeight: isActive ? 500 : 400,
                    color: isActive || isHover ? colors.text : colors.textMuted,
                    transform: isHover ? "translateX(3px)" : "translateX(0)",
                    transition: "color 0.15s ease, transform 0.15s ease",
                  }}
                >
                  {it.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default InPageRail;

import React, { useEffect, useRef, useState } from "react";
import { NAV_HEIGHT } from "./Header";
import { font, layout } from "../theme/tokens";

export interface RailItem {
  id: string;
  label: string;
  sectionIds?: string[];
}

// Sticky right-hand "on this page" rail.
//
// Figma: Eufemia — Web, branch 1DFIwNXmRTUnL5a1UhZR6o, node 68520:3309
// ("In-page navigation"). Values taken verbatim from get_design_context:
//
//   container   196px wide, flex column, gap 4
//   header      "On this page", 18/24 regular, pb 16, pl 16
//   body        px 16
//   active      full-width pill: 1px stroke-neutral-subtle, radius 99,
//               padding 8/16, label 16/20 regular, text-neutral
//   inactive    label 16/20 regular, text-neutral-alternative, pl 16,
//               29px apart
//
// The previous rail was a different pattern entirely — a document icon, a
// 1px full-list track with a 2px accent segment spanning *every* section in
// view, bold active labels and a hover nudge. This design has none of that:
// no icon, no track, and exactly one active item shown as a bordered pill.
// So the "set of visible sections" model collapses to a single active index.
//
// Colours are var(--eu-*) tokens rather than the frame's hexes, so the rail
// follows the portal's light/dark toggle and brand switch. On DNB-dark they
// resolve to the frame's own values (#48484a stroke, #8e8e93 muted label).

const B = "eu-ipr";

const CSS = `
.${B} {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  font-family: ${font.family};
}

.${B}__header {
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0 0 16px 16px;
  color: var(--eu-text);
  font-size: ${font.size.body}px;
  line-height: ${font.lineHeight.body}px;
  font-weight: 400;
}

.${B}__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  padding: 0 16px;
}

.${B}__list {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Inactive item — plain muted label, no box. */
.${B}__item {
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0 0 0 16px;
  border: 0;
  border-radius: 0;
  background: none;
  color: var(--eu-textMuted);
  font-family: inherit;
  font-size: ${font.size.small}px;
  line-height: ${font.lineHeight.small}px;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: color 0.15s ease;
}
.${B}__item:hover { color: var(--eu-text); }
.${B}__item:focus-visible {
  outline: 2px solid var(--eu-accentStrong);
  outline-offset: 2px;
  border-radius: 99px;
}

/* Active item — the section currently in view. Bordered pill. */
.${B}__item--active,
.${B}__item--active:hover {
  padding: 8px 16px;
  border: 1px solid var(--eu-strokeSubtle);
  border-radius: 99px;
  color: var(--eu-text);
}

/* 29px between two plain labels; 16px wherever the pill is adjacent. The
   pill's own 8px padding accounts for the rest of the frame's rhythm. */
.${B}__item + .${B}__item { margin-top: 29px; }
.${B}__item--active + .${B}__item,
.${B}__item + .${B}__item--active { margin-top: 16px; }

/* Long lists (changelog) scroll inside the rail with the scrollbar hidden. */
.${B}__scroll { scrollbar-width: none; }
.${B}__scroll::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .${B}__item { transition: none; }
}
`;

const InPageRail: React.FC<{
  items: RailItem[];
  hidden?: boolean;
  scrollable?: boolean;
  autoFollow?: boolean;
}> = ({ items, hidden = false, scrollable = false, autoFollow = false }) => {
  const [active, setActive] = useState(0);
  const [scrollFade, setScrollFade] = useState<"none" | "top" | "bottom" | "both">("none");
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Active = the last section whose start has passed the top edge. At the top of
  // the page nothing has passed yet, so it stays on the first item.
  useEffect(() => {
    const onScroll = () => {
      const topEdge = NAV_HEIGHT + 24;
      let next = 0;
      items.forEach((it, i) => {
        const ids = it.sectionIds ?? [it.id];
        const passed = ids.some((id) => {
          const el = document.getElementById(id);
          if (!el) return false;
          return el.getBoundingClientRect().top - topEdge <= 0;
        });
        if (passed) next = i;
      });
      setActive((prev) => (prev === next ? prev : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  useEffect(() => {
    if (!scrollable) {
      setScrollFade("none");
      return;
    }
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      const hasTop = el.scrollTop > 1;
      const hasBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 1;
      const next = hasTop
        ? hasBottom
          ? "both"
          : "top"
        : hasBottom
          ? "bottom"
          : "none";
      setScrollFade((current) => (current === next ? current : next));
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [scrollable, items]);

  // Keep the active item in view within a scrollable rail.
  useEffect(() => {
    if (!autoFollow) return;
    const el = itemRefs.current[active];
    const container = scrollRef.current;
    if (!el || !container) return;
    const b = el.getBoundingClientRect();
    const cb = container.getBoundingClientRect();
    container.scrollTo({
      top:
        container.scrollTop +
        b.top -
        cb.top -
        (container.clientHeight - b.height) / 2,
      behavior: "smooth",
    });
  }, [autoFollow, active]);

  const scrollTo = (i: number) => {
    const el = document.getElementById(items[i].id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - (NAV_HEIGHT + 24);
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (hidden) return null;

  const mask =
    scrollFade === "top"
      ? "linear-gradient(to bottom, transparent, black 40px)"
      : scrollFade === "bottom"
        ? "linear-gradient(to bottom, black calc(100% - 40px), transparent)"
        : scrollFade === "both"
          ? "linear-gradient(to bottom, transparent, black 40px, black calc(100% - 40px), transparent)"
          : undefined;

  return (
    <nav
      aria-label="On this page"
      style={{
        position: "sticky",
        top: `${NAV_HEIGHT + 80}px`,
        width: `${layout.railWidth}px`,
        flexShrink: 0,
      }}
    >
      <style>{CSS}</style>
      <div className={B}>
        <div className={`${B}__header`}>On this page</div>

        <div className={`${B}__body`}>
          <div
            ref={scrollRef}
            className={scrollable ? `${B}__scroll` : undefined}
            style={{
              width: "100%",
              maxHeight: scrollable
                ? `calc(100vh - ${NAV_HEIGHT + 152}px)`
                : undefined,
              overflowY: scrollable ? "auto" : undefined,
              overscrollBehavior: scrollable ? "contain" : undefined,
              WebkitMaskImage: mask,
              maskImage: mask,
            }}
          >
            <div className={`${B}__list`}>
              {items.map((it, i) => (
                <button
                  key={it.id}
                  type="button"
                  ref={(el) => {
                    itemRefs.current[i] = el;
                  }}
                  className={`${B}__item${i === active ? ` ${B}__item--active` : ""}`}
                  aria-current={i === active ? "location" : undefined}
                  onClick={() => scrollTo(i)}
                >
                  {it.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default InPageRail;

import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import { ICONS, ICON_CATEGORIES, type IconEntry } from "../data/icons";

const CATEGORY_LABELS: Record<string, string> = {
  essentials: "Essentials",
  objects: "Objects",
  products: "Products",
  actions: "Actions",
  navigation: "Navigation",
};

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: "inherit" }}>
    <path d="M11.5 11.5 15 15m-3.182-8.59A5.41 5.41 0 1 1 1 6.41a5.41 5.41 0 0 1 10.818 0Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const IconTile: React.FC<{ icon: IconEntry; onCopy: (name: string) => void; copied: boolean }> = ({ icon, onCopy, copied }) => {
  const { colors } = useTheme();
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onCopy(icon.name)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      title={`${icon.name}${icon.tags.length ? " — " + icon.tags.join(", ") : ""}\nClick to copy the name`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        padding: "18px 10px 12px",
        borderRadius: `${radius.md}`,
        border: `1px solid ${hover ? colors.strokeAction : colors.strokeSubtle}`,
        background: hover ? colors.surfaceAlt : colors.surface,
        color: colors.text,
        cursor: "pointer",
        transition: "border-color 0.12s ease, background 0.12s ease",
        minWidth: 0,
      }}
    >
      <span
        aria-hidden
        style={{ color: colors.text, display: "inline-flex", width: "28px", height: "28px", alignItems: "center", justifyContent: "center" }}
        dangerouslySetInnerHTML={{ __html: icon.svg.replace("<svg ", '<svg width="28" height="28" ') }}
      />
      <span
        style={{
          fontFamily: font.family,
          fontSize: `${font.size.small}px`,
          lineHeight: "18px",
          color: copied ? colors.accent : colors.textMuted,
          textAlign: "center",
          wordBreak: "break-word",
          width: "100%",
        }}
      >
        {copied ? "Copied!" : icon.name}
      </span>
    </button>
  );
};

const IconsPage: React.FC = () => {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (name: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(name).catch(() => {});
    setCopied(name);
    setTimeout(() => setCopied((c) => (c === name ? null : c)), 1200);
  };

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return ICONS;
    return ICONS.filter((i) => i.name.toLowerCase().includes(q) || i.tags.some((t) => t.toLowerCase().includes(q)));
  }, [q]);

  const byCategory = useMemo(() => {
    const map: Record<string, IconEntry[]> = {};
    for (const cat of ICON_CATEGORIES) map[cat] = [];
    for (const i of filtered) (map[i.category] ??= []).push(i);
    return map;
  }, [filtered]);

  const h1: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.h1}px`,
    lineHeight: `${font.lineHeight.h1}px`,
    color: colors.text,
  };
  const para: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.textMuted,
    maxWidth: "720px",
  };

  return (
    <Layout currentPlatform="web" currentPath="/icons">
      <PageShell contentStyle={{ gap: "32px" }}>
        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={h1}>Icons</h1>
          <p style={para}>
            The complete Eufemia icon library — {ICONS.length} icons across {ICON_CATEGORIES.length} categories, primary and secondary
            shown together. For web, icons ship as SVG files and ready-to-use React components. Click any icon to copy its name.
          </p>
        </div>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: `${radius.lg}`,
            border: `1px solid ${colors.strokeSubtle}`,
            background: colors.surface,
            color: colors.textMuted,
            maxWidth: "440px",
          }}
        >
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons by name or keyword…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              color: colors.text,
              fontFamily: font.family,
              fontSize: `${font.size.body}px`,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{ background: "none", border: "none", cursor: "pointer", color: colors.textMuted, display: "flex" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {q && (
          <span style={{ ...para, marginTop: "-16px" }}>
            {filtered.length} {filtered.length === 1 ? "icon" : "icons"} match "{query}"
          </span>
        )}

        {/* Category sections */}
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              borderRadius: `${radius.lg}`,
              border: `1px dashed ${colors.strokeSubtle}`,
              background: colors.surface,
              textAlign: "center",
            }}
          >
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
              No icons match "{query}"
            </span>
          </div>
        ) : (
          ICON_CATEGORIES.map((cat) => {
            const items = byCategory[cat];
            if (!items || items.length === 0) return null;
            return (
              <section key={cat} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <h2 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>
                    {CATEGORY_LABELS[cat] || cat}
                  </h2>
                  <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>{items.length}</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {items.map((icon) => (
                    <IconTile key={icon.name} icon={icon} onCopy={copy} copied={copied === icon.name} />
                  ))}
                </div>
              </section>
            );
          })
        )}
      </PageShell>
    </Layout>
  );
};

export default IconsPage;

export const Head = () => <title>Icons | Eufemia Design System</title>;

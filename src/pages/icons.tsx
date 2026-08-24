import React, { useMemo, useState } from "react";
import { H1, H2, Input, P } from "@dnb/eufemia";
import Layout from "../components/Layout";
import EufemiaThemeScope from "../components/EufemiaThemeScope";
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
    setTimeout(() => setCopied((current) => (current === name ? null : current)), 1200);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!normalizedQuery) return ICONS;
    return ICONS.filter((icon) => icon.name.toLowerCase().includes(normalizedQuery) || icon.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery)));
  }, [normalizedQuery]);

  const byCategory = useMemo(() => {
    const map: Record<string, IconEntry[]> = {};
    for (const category of ICON_CATEGORIES) map[category] = [];
    for (const icon of filtered) (map[icon.category] ??= []).push(icon);
    return map;
  }, [filtered]);

  return (
    <Layout currentPlatform="web" currentPath="/icons">
      <PageShell contentStyle={{ gap: "32px" }}>
        <EufemiaThemeScope>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <header style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <H1 style={{ margin: 0, color: colors.text }}>Icons</H1>
              <P style={{ margin: 0, maxWidth: "720px", color: colors.textMuted }}>
                The complete Eufemia icon library — {ICONS.length} icons across {ICON_CATEGORIES.length} categories, primary and secondary shown together. For web, icons ship as SVG files and ready-to-use React components. Click any icon to copy its name.
              </P>
            </header>

            <Input
              label="Search icons"
              labelSrOnly
              type="search"
              value={query}
              onChange={({ value }) => setQuery(value)}
              onClear={() => setQuery("")}
              placeholder="Search icons by name or keyword…"
              showClearButton
              stretch
              style={{ maxWidth: "440px" }}
            />

            {normalizedQuery && (
              <P size="small" style={{ margin: "-16px 0 0", color: colors.textMuted }}>
                {filtered.length} {filtered.length === 1 ? "icon" : "icons"} match &quot;{query}&quot;
              </P>
            )}

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
                <P size="medium" weight="medium" style={{ margin: 0, color: colors.text }}>
                  No icons match &quot;{query}&quot;
                </P>
              </div>
            ) : (
              ICON_CATEGORIES.map((category) => {
                const items = byCategory[category];
                if (!items || items.length === 0) return null;
                return (
                  <section key={category} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                      <H2 style={{ margin: 0, color: colors.text }}>{CATEGORY_LABELS[category] || category}</H2>
                      <P size="small" style={{ margin: 0, color: colors.textMuted }}>{items.length}</P>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(104px, 1fr))", gap: "12px" }}>
                      {items.map((icon) => <IconTile key={icon.name} icon={icon} onCopy={copy} copied={copied === icon.name} />)}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default IconsPage;

export const Head = () => <title>Icons | Eufemia Design System</title>;

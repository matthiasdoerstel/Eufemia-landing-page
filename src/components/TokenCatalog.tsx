import React, { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import {
  TOKEN_ROWS,
  SECTIONS,
  BRAND_COLUMNS,
  MODIFIER_LABELS,
  type TokenRow,
  type TokenSection,
} from "../data/design-tokens";

type SortKey = "group" | "token";
type SortDir = "asc" | "desc";

const prettyGroup = (g: string) =>
  g.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// A single color swatch cell. Hover shows the foundation ref; click copies the
// full CSS custom property.
const SwatchCell: React.FC<{
  cell?: { hex: string; ref: string };
  token: string;
  copied: boolean;
  onCopy: (token: string) => void;
}> = ({ cell, token, copied, onCopy }) => {
  const { colors } = useTheme();
  if (!cell) {
    return (
      <td style={{ padding: "10px 12px", textAlign: "center", color: colors.textMuted, borderLeft: `1px solid ${colors.strokeSubtle}` }}>
        —
      </td>
    );
  }
  return (
    <td style={{ padding: "10px 12px", textAlign: "center", borderLeft: `1px solid ${colors.strokeSubtle}`, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <button
          onClick={() => onCopy(token)}
          title={cell.ref}
          aria-label={`${token} — ${cell.ref} (${cell.hex}). Click to copy variable.`}
          style={{
            width: "34px",
            height: "34px",
            background: cell.hex,
            borderRadius: `${radius.sm}px`,
            border: `1px solid ${colors.strokeSubtle}`,
            cursor: "pointer",
            padding: 0,
            transition: "transform 0.15s ease",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")}
        />
        <code style={{ fontSize: "10px", color: colors.textMuted, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {cell.hex}
        </code>
      </div>
      {copied && (
        <span
          style={{
            position: "absolute",
            top: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            background: colors.accent,
            color: colors.pageBg,
            padding: "3px 8px",
            borderRadius: `${radius.sm}px`,
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          Copied!
        </span>
      )}
    </td>
  );
};

const SortHeader: React.FC<{
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  sticky?: boolean;
}> = ({ label, active, dir, onClick, sticky }) => {
  const { colors } = useTheme();
  return (
    <th
      style={{
        padding: "12px",
        textAlign: "left",
        fontWeight: 500,
        fontSize: `${font.size.small}px`,
        color: colors.text,
        whiteSpace: "nowrap",
        position: sticky ? "sticky" : undefined,
        left: sticky ? 0 : undefined,
        background: colors.surfaceAlt,
        zIndex: sticky ? 3 : undefined,
      }}
    >
      <button
        onClick={onClick}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          font: "inherit",
          fontWeight: 500,
          color: active ? colors.accent : colors.text,
        }}
      >
        {label}
        <span style={{ fontSize: "10px", opacity: active ? 1 : 0.35 }}>
          {active ? (dir === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
};

const Section: React.FC<{
  section: TokenSection;
  label: string;
  rows: TokenRow[];
  copied: string | null;
  onCopy: (token: string) => void;
}> = ({ section, label, rows, copied, onCopy }) => {
  const { colors } = useTheme();
  const [active, setActive] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("group");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Modifiers present in this section, ordered by MODIFIER_LABELS order.
  const mods = useMemo(() => {
    const present = new Set<string>();
    rows.forEach((r) => r.modifiers.forEach((m) => present.add(m)));
    return Object.keys(MODIFIER_LABELS).filter((m) => present.has(m));
  }, [rows]);

  const toggleMod = (m: string) =>
    setActive((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const sortBy = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visible = useMemo(() => {
    const filtered = rows.filter((r) => active.every((m) => r.modifiers.includes(m)));
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sortKey === "group" ? `${a.group} ${a.token}` : a.token;
      const bv = sortKey === "group" ? `${b.group} ${b.token}` : b.token;
      return av.localeCompare(bv) * dir;
    });
  }, [rows, active, sortKey, sortDir]);

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h2
          style={{
            margin: 0,
            fontFamily: font.family,
            fontWeight: 500,
            fontSize: `${font.size.headingLg}px`,
            lineHeight: `${font.lineHeight.headingLg}px`,
            color: colors.text,
          }}
        >
          {label}
          <span style={{ color: colors.textMuted, fontSize: `${font.size.small}px`, fontWeight: 400, marginLeft: "10px" }}>
            {visible.length}/{rows.length}
          </span>
        </h2>

        {/* Filter pills */}
        {mods.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {mods.map((m) => {
              const on = active.includes(m);
              return (
                <button
                  key={m}
                  onClick={() => toggleMod(m)}
                  style={{
                    padding: "5px 12px",
                    fontFamily: font.family,
                    fontSize: `${font.size.small}px`,
                    borderRadius: "999px",
                    cursor: "pointer",
                    background: on ? colors.selectedSubtle : "transparent",
                    color: on ? colors.textSelected : colors.textMuted,
                    border: `1px solid ${on ? colors.strokeAction : colors.strokeSubtle}`,
                    transition: "all 0.15s ease",
                  }}
                >
                  {MODIFIER_LABELS[m]}
                </button>
              );
            })}
            {active.length > 0 && (
              <button
                onClick={() => setActive([])}
                style={{
                  padding: "5px 12px",
                  fontFamily: font.family,
                  fontSize: `${font.size.small}px`,
                  borderRadius: "999px",
                  cursor: "pointer",
                  background: "transparent",
                  color: colors.accent,
                  border: "none",
                  textDecoration: "underline",
                }}
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto", border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.md}px` }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: colors.surface }}>
          <thead>
            <tr style={{ background: colors.surfaceAlt, borderBottom: `1px solid ${colors.stroke}` }}>
              <SortHeader label="Group" active={sortKey === "group"} dir={sortDir} onClick={() => sortBy("group")} sticky />
              <SortHeader label="Token" active={sortKey === "token"} dir={sortDir} onClick={() => sortBy("token")} />
              {BRAND_COLUMNS.map((c) => (
                <th
                  key={c.key}
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    fontWeight: 500,
                    fontSize: `${font.size.small}px`,
                    color: colors.text,
                    whiteSpace: "nowrap",
                    borderLeft: `1px solid ${colors.strokeSubtle}`,
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.token} style={{ borderBottom: `1px solid ${colors.strokeSubtle}` }}>
                <td
                  style={{
                    padding: "10px 12px",
                    fontFamily: font.family,
                    fontSize: `${font.size.small}px`,
                    color: colors.text,
                    whiteSpace: "nowrap",
                    position: "sticky",
                    left: 0,
                    background: colors.surface,
                    zIndex: 1,
                  }}
                >
                  {prettyGroup(r.group)}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <code
                    style={{
                      fontSize: "12px",
                      color: colors.accent,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.token.replace("--token-color-", "")}
                  </code>
                </td>
                {BRAND_COLUMNS.map((c) => (
                  <SwatchCell key={c.key} cell={r.cells[c.key]} token={r.token} copied={copied === `${r.token}:${c.key}`} onCopy={() => onCopy(`${r.token}:${c.key}`)} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const TokenCatalog: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = (id: string) => {
    const token = id.split(":")[0];
    if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(`var(${token})`);
    setCopied(id);
    setTimeout(() => setCopied((c) => (c === id ? null : c)), 1400);
  };

  const bySection = useMemo(() => {
    const map: Record<string, TokenRow[]> = {};
    TOKEN_ROWS.forEach((r) => (map[r.section] ||= []).push(r));
    return map;
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {SECTIONS.map((s) => (
        <Section key={s.id} section={s.id} label={s.label} rows={bySection[s.id] ?? []} copied={copied} onCopy={onCopy} />
      ))}
    </div>
  );
};

export default TokenCatalog;

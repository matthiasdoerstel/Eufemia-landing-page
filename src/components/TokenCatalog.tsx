import React, { useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import {
  TOKEN_ROWS,
  TOKEN_USAGE,
  COMPONENT_STATUS,
  SECTIONS,
  BRAND_COLUMNS,
  MODIFIER_LABELS,
  type TokenRow,
  type TokenSection,
} from "../data/design-tokens";

const COMPONENT_DOCS = (slug: string) => `https://eufemia.dnb.no/uilib/components/${slug}/`;

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

// Maintainer-only: which components reference a token (its change blast radius).
const UsagePanel: React.FC<{ users: string[] }> = ({ users }) => {
  const { colors } = useTheme();

  if (users.length === 0) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: `${radius.md}px`,
          border: `1px dashed ${colors.strokeSubtle}`,
          background: colors.surface,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.25" stroke={colors.textMuted} strokeWidth="1.3" />
          <path d="M5.5 8.2L7.2 10L10.5 6" stroke={colors.textMuted} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
          Not used by any component — safe to change.
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.body}px`, color: colors.text }}>
          Connected components
        </span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "22px",
            height: "22px",
            padding: "0 7px",
            borderRadius: "999px",
            background: colors.selectedSubtle,
            color: colors.textSelected,
            fontFamily: font.family,
            fontSize: `${font.size.small}px`,
            fontWeight: 500,
          }}
        >
          {users.length}
        </span>
        <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
          reference this token — changing it affects them.
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "8px" }}>
        {users.map((slug) => (
          <a
            key={slug}
            href={COMPONENT_DOCS(slug)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "9px 12px",
              borderRadius: `${radius.md}px`,
              border: `1px solid ${colors.strokeSubtle}`,
              background: colors.surface,
              color: colors.text,
              fontFamily: font.family,
              fontSize: `${font.size.small}px`,
              textDecoration: "none",
            }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{slug}</span>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: colors.textMuted }}>
              <path d="M6 3.5H12.5V10M12 4L4 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

const Section: React.FC<{
  section: TokenSection;
  label: string;
  rows: TokenRow[];
  copied: string | null;
  onCopy: (token: string) => void;
  maintainer: boolean;
  search: string;
}> = ({ section, label, rows, copied, onCopy, maintainer, search }) => {
  const { colors } = useTheme();
  const isMaintainer = maintainer;
  const [active, setActive] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
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
    const q = search.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        active.every((m) => r.modifiers.includes(m)) &&
        (q === "" || r.token.toLowerCase().includes(q) || r.group.toLowerCase().includes(q))
    );
    const dir = sortDir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = sortKey === "group" ? `${a.group} ${a.token}` : a.token;
      const bv = sortKey === "group" ? `${b.group} ${b.token}` : b.token;
      return av.localeCompare(bv) * dir;
    });
  }, [rows, active, sortKey, sortDir, search]);

  // Hide a section entirely when a search excludes all its rows.
  if (search.trim() !== "" && visible.length === 0) return null;

  return (
    <section id={`tokens-${section}`} style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
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
            {visible.map((r) => {
              const isOpen = isMaintainer && selected === r.token;
              const users = TOKEN_USAGE[r.token] ?? [];
              return (
              <React.Fragment key={r.token}>
              <tr
                onClick={isMaintainer ? () => setSelected((s) => (s === r.token ? null : r.token)) : undefined}
                style={{
                  borderBottom: `1px solid ${colors.strokeSubtle}`,
                  cursor: isMaintainer ? "pointer" : "default",
                  background: isOpen ? colors.surfaceAlt : "transparent",
                }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    fontFamily: font.family,
                    fontSize: `${font.size.small}px`,
                    color: colors.text,
                    whiteSpace: "nowrap",
                    position: "sticky",
                    left: 0,
                    background: isOpen ? colors.surfaceAlt : colors.surface,
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
                  {isMaintainer && (
                    <span style={{ marginLeft: "10px", fontSize: `${font.size.small}px`, color: users.length ? colors.textMuted : colors.strokeAction }}>
                      {users.length ? `${users.length} component${users.length === 1 ? "" : "s"}` : "unused"}
                    </span>
                  )}
                </td>
                {BRAND_COLUMNS.map((c) => (
                  <SwatchCell key={c.key} cell={r.cells[c.key]} token={r.token} copied={copied === `${r.token}:${c.key}`} onCopy={() => onCopy(`${r.token}:${c.key}`)} />
                ))}
              </tr>
              {isOpen && (
                <tr style={{ borderBottom: `1px solid ${colors.strokeSubtle}` }}>
                  <td colSpan={2 + BRAND_COLUMNS.length} style={{ padding: "4px 16px 18px", background: colors.surfaceAlt }}>
                    <UsagePanel users={users} />
                  </td>
                </tr>
              )}
              </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

// Maintainer-only: token adoption across components (migration insight).
const AdoptionPanel: React.FC = () => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const total = COMPONENT_STATUS.length;
  const onTokens = COMPONENT_STATUS.filter((c) => c.usesTokens);
  const notYet = COMPONENT_STATUS.filter((c) => !c.usesTokens);
  const pct = total ? Math.round((onTokens.length / total) * 100) : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        padding: "20px 24px",
        borderRadius: `${radius.lg}px`,
        border: `1px solid ${colors.strokeSubtle}`,
        background: colors.surface,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
          Token adoption
        </span>
        <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
          {onTokens.length} of {total} components on semantic tokens ({pct}%)
        </span>
      </div>

      <div style={{ height: "8px", width: "100%", background: colors.surfaceAlt, borderRadius: "999px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: colors.accent }} />
      </div>

      {notYet.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => setOpen((v) => !v)}
            style={{
              alignSelf: "flex-start",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontFamily: font.family,
              fontSize: `${font.size.small}px`,
              color: colors.accent,
            }}
          >
            {open ? "Hide" : "Show"} {notYet.length} component{notYet.length === 1 ? "" : "s"} not on tokens yet
          </button>
          {open && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {notYet.map((c) => (
                <a
                  key={c.name}
                  href={COMPONENT_DOCS(c.name)}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: "4px 12px",
                    borderRadius: "999px",
                    border: `1px solid ${colors.strokeSubtle}`,
                    background: colors.surfaceAlt,
                    color: colors.text,
                    fontFamily: font.family,
                    fontSize: `${font.size.small}px`,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.name}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const TokenCatalog: React.FC<{ maintainer?: boolean }> = ({ maintainer = false }) => {
  const { colors } = useTheme();
  const [copied, setCopied] = useState<string | null>(null);
  const [search, setSearch] = useState("");

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

  const totalMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOKEN_ROWS.length;
    return TOKEN_ROWS.filter((r) => r.token.toLowerCase().includes(q) || r.group.toLowerCase().includes(q)).length;
  }, [search]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
      {maintainer && <AdoptionPanel />}

      {maintainer && (
        <div style={{ position: "relative", maxWidth: "420px" }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          >
            <circle cx="7" cy="7" r="5" stroke={colors.textMuted} strokeWidth="1.4" />
            <path d="M11 11L14 14" stroke={colors.textMuted} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tokens by name or group…"
            aria-label="Search tokens"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "10px 14px 10px 40px",
              borderRadius: `${radius.md}px`,
              border: `1px solid ${colors.stroke}`,
              background: colors.surface,
              color: colors.text,
              fontFamily: font.family,
              fontSize: `${font.size.body}px`,
              outline: "none",
            }}
          />
          {search.trim() !== "" && (
            <span style={{ display: "block", marginTop: "8px", fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
              {totalMatches} token{totalMatches === 1 ? "" : "s"} match “{search.trim()}”
            </span>
          )}
        </div>
      )}

      {SECTIONS.map((s) => (
        <Section key={s.id} section={s.id} label={s.label} rows={bySection[s.id] ?? []} copied={copied} onCopy={onCopy} maintainer={maintainer} search={search} />
      ))}
    </div>
  );
};

export default TokenCatalog;

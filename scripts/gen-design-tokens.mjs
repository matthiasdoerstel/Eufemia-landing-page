// Generates src/data/design-tokens.ts from the real @dnb/eufemia package.
// Source: scripts/.eufemia/package (freshly pulled via `npm pack @dnb/eufemia@latest`).
// Resolves every --token-color-* to a concrete color per brand/theme by
// following its foundation reference, and indexes component token usage.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_DIR = path.join(__dirname, ".eufemia/package"); // .../@dnb/eufemia
const THEMES_DIR = path.join(PKG_DIR, "style/themes");
const OUT = path.join(__dirname, "../src/data/design-tokens.ts");

// --- color helpers ---------------------------------------------------------
function normalizeColor(raw) {
  const v = raw.trim();
  // rgba(r g b / a%) space syntax -> rgba(r, g, b, a)
  const m = v.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\/\s*([\d.]+)%\s*\)$/);
  if (m) {
    const [, r, g, b, a] = m;
    return `rgba(${r}, ${g}, ${b}, ${(+a / 100).toString()})`;
  }
  // #fff / #333 -> 6 digit
  const h = v.match(/^#([0-9a-fA-F]{3})$/);
  if (h) {
    const s = h[1];
    return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
  }
  return v.toLowerCase();
}

// --- SCSS parsers ----------------------------------------------------------
function parseFoundation(file) {
  const txt = fs.readFileSync(file, "utf8");
  const map = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let m;
  while ((m = re.exec(txt))) map[m[1]] = normalizeColor(m[2]);
  return map;
}

function parseTokens(file) {
  // Values wrap across lines: --x: var(\n --y\n );  -> collapse whitespace first.
  const txt = fs.readFileSync(file, "utf8").replace(/\s+/g, " ");
  const map = {};
  const re = /(--token-color-[a-z0-9-]+)\s*:\s*var\(\s*(--[a-z0-9-]+)\s*\)\s*;/gi;
  let m;
  while ((m = re.exec(txt))) map[m[1]] = m[2];
  return map;
}

const foundations = {
  dnb: parseFoundation(path.join(THEMES_DIR, "ui/foundation.scss")),
  sbanken: parseFoundation(path.join(THEMES_DIR, "sbanken/foundation.scss")),
  carnegie: parseFoundation(path.join(THEMES_DIR, "carnegie/foundation.scss")),
};

const tokenSets = {
  dnbLight: { tokens: parseTokens(path.join(THEMES_DIR, "ui/tokens.scss")), fnd: "dnb" },
  dnbDark: { tokens: parseTokens(path.join(THEMES_DIR, "ui/tokens-dark.scss")), fnd: "dnb" },
  sbankenLight: { tokens: parseTokens(path.join(THEMES_DIR, "sbanken/tokens.scss")), fnd: "sbanken" },
  sbankenDark: { tokens: parseTokens(path.join(THEMES_DIR, "sbanken/tokens-dark.scss")), fnd: "sbanken" },
  carnegie: { tokens: parseTokens(path.join(THEMES_DIR, "carnegie/tokens.scss")), fnd: "carnegie" },
};

// --- grouping --------------------------------------------------------------
const SECTIONS = ["background", "text", "icon", "stroke", "decorative"];
const MODIFIERS = [
  "hover", "pressed", "focus", "disabled", "subtle", "inverse",
  "ondark", "onlight", "static", "bold", "alternative", "muted", "base", "intense",
];

function classify(token) {
  // token = --token-color-{section}-{rest...}
  const rest = token.replace("--token-color-", "");
  const parts = rest.split("-");
  const section = parts[0];
  if (!SECTIONS.includes(section)) return null; // skip component/etc
  const tail = parts.slice(1);
  const mods = [];
  const groupParts = [];
  for (const p of tail) {
    if (MODIFIERS.includes(p)) mods.push(p);
    else groupParts.push(p);
  }
  return { section, group: groupParts.join("-") || section, modifiers: mods };
}

// --- build rows ------------------------------------------------------------
const columns = ["dnbLight", "dnbDark", "sbankenLight", "sbankenDark", "carnegie"];

// Canonical token order = DNB light file order.
const orderedTokens = Object.keys(tokenSets.dnbLight.tokens);
// Include any tokens present elsewhere but not in DNB light.
for (const c of columns) {
  for (const t of Object.keys(tokenSets[c].tokens)) {
    if (!orderedTokens.includes(t)) orderedTokens.push(t);
  }
}

const rows = [];
for (const token of orderedTokens) {
  const info = classify(token);
  if (!info) continue;
  const cells = {};
  for (const col of columns) {
    const { tokens, fnd } = tokenSets[col];
    const ref = tokens[token];
    if (!ref) continue;
    const hex = foundations[fnd][ref];
    if (!hex) continue;
    cells[col] = { hex, ref };
  }
  if (Object.keys(cells).length === 0) continue;
  rows.push({ token, ...info, cells });
}

// --- component usage -------------------------------------------------------
// Scan each component's shipped styles in the same @dnb/eufemia package for
// semantic token references (var(--token-color-*)) to build a token -> components
// index, and track adoption (semantic tokens vs legacy --color-* palette).
const COMPONENTS_DIR = path.join(PKG_DIR, "components");
const semRe = /var\(\s*(--token-color-[a-z0-9-]+)/g;
const legacyRe = /var\(\s*--color-[a-z0-9-]+/;

function collectComponentUsage() {
  const usage = {}; // token -> Set(component)
  const status = []; // { name, usesTokens, usesLegacy, tokenCount }
  if (!fs.existsSync(COMPONENTS_DIR)) return { usage, status };

  for (const name of fs.readdirSync(COMPONENTS_DIR).sort()) {
    const dir = path.join(COMPONENTS_DIR, name);
    if (!fs.statSync(dir).isDirectory()) continue;
    const tokens = new Set();
    let usesLegacy = false;
    let hasCss = false;

    const walk = (d) => {
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entry.name);
        if (entry.isDirectory()) walk(p);
        else if (entry.name.endsWith(".css") && !entry.name.includes("--isolated") && !entry.name.endsWith(".min.css")) {
          hasCss = true;
          const txt = fs.readFileSync(p, "utf8");
          let m;
          semRe.lastIndex = 0;
          while ((m = semRe.exec(txt))) tokens.add(m[1]);
          if (legacyRe.test(txt)) usesLegacy = true;
        }
      }
    };
    walk(dir);
    if (!hasCss) continue; // no styles → nothing to say about token usage

    for (const t of tokens) (usage[t] ||= new Set()).add(name);
    status.push({ name, usesTokens: tokens.size > 0, usesLegacy, tokenCount: tokens.size });
  }

  // Sets -> sorted arrays
  const usageOut = {};
  for (const [t, set] of Object.entries(usage)) usageOut[t] = [...set].sort();
  return { usage: usageOut, status };
}

const { usage: tokenUsage, status: componentStatus } = collectComponentUsage();

// --- emit .ts --------------------------------------------------------------
const header = `// AUTO-GENERATED by scripts/gen-design-tokens.mjs — do not edit by hand.
// Source: @dnb/eufemia v11 theme SCSS (ui / sbanken / carnegie) + component styles.
// Every value is resolved from the token's foundation reference.

export type TokenSection = "background" | "text" | "icon" | "stroke" | "decorative";

export interface TokenCell {
  hex: string; // resolved color (hex or rgba)
  ref: string; // foundation variable it points to, e.g. --dnb-coldgreen-600
}

export interface TokenRow {
  token: string; // full custom property, e.g. --token-color-background-action
  section: TokenSection;
  group: string; // semantic group, e.g. "action", "neutral", "decorative-first"
  modifiers: string[]; // filter tags: hover, pressed, subtle, inverse, ondark, ...
  cells: {
    dnbLight?: TokenCell;
    dnbDark?: TokenCell;
    sbankenLight?: TokenCell;
    sbankenDark?: TokenCell;
    carnegie?: TokenCell;
  };
}

export const MODIFIER_LABELS: Record<string, string> = {
  hover: "Hover",
  pressed: "Pressed",
  focus: "Focus",
  disabled: "Disabled",
  subtle: "Subtle",
  inverse: "Inverse",
  ondark: "On dark",
  onlight: "On light",
  static: "Static",
  bold: "Bold",
  alternative: "Alternative",
  muted: "Muted",
  base: "Base",
  intense: "Intense",
};

export const SECTIONS: { id: TokenSection; label: string }[] = [
  { id: "background", label: "Background" },
  { id: "text", label: "Text" },
  { id: "icon", label: "Icon" },
  { id: "stroke", label: "Stroke" },
  { id: "decorative", label: "Decorative" },
];

export const BRAND_COLUMNS = [
  { key: "dnbLight", label: "DNB Light" },
  { key: "dnbDark", label: "DNB Dark" },
  { key: "sbankenLight", label: "Sbanken Light" },
  { key: "sbankenDark", label: "Sbanken Dark" },
  { key: "carnegie", label: "Carnegie" },
] as const;

export const TOKEN_ROWS: TokenRow[] = ${JSON.stringify(rows, null, 2)};

// Component token usage — which components reference each semantic token in
// their shipped styles (Web / @dnb/eufemia). Absence means the component does
// not use the token, so changing it has no effect on that component.
export interface ComponentStatus {
  name: string; // component slug (matches eufemia.dnb.no/uilib/components/<name>/)
  usesTokens: boolean; // references any --token-color-* token
  usesLegacy: boolean; // still references the legacy --color-* palette
  tokenCount: number; // distinct semantic tokens referenced
}

// token (--token-color-*) -> component slugs that reference it.
export const TOKEN_USAGE: Record<string, string[]> = ${JSON.stringify(tokenUsage, null, 2)};

// Every component (with styles) and its token-adoption status.
export const COMPONENT_STATUS: ComponentStatus[] = ${JSON.stringify(componentStatus, null, 2)};
`;

fs.writeFileSync(OUT, header);
console.log(`Wrote ${rows.length} token rows to ${OUT}`);
const bySection = {};
for (const r of rows) bySection[r.section] = (bySection[r.section] || 0) + 1;
console.log("Per section:", bySection);
const allMods = new Set();
rows.forEach((r) => r.modifiers.forEach((m) => allMods.add(m)));
console.log("Modifiers seen:", [...allMods].sort().join(", "));
console.log(
  `Components: ${componentStatus.length} with styles, ` +
    `${componentStatus.filter((c) => c.usesTokens).length} use semantic tokens, ` +
    `${componentStatus.filter((c) => !c.usesTokens).length} not on tokens yet.`
);
console.log(`Tokens referenced by \u2265 1 component: ${Object.keys(tokenUsage).length}`);

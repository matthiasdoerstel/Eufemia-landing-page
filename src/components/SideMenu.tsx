import React, { useEffect, useMemo, useState } from "react";
import { Link } from "gatsby";
import { Icon as EufemiaIcon } from "@dnb/eufemia";
// Unsuffixed names are the 16px artwork. The `_medium` variants Sidebar uses are
// 24px and render at that size regardless of the Icon `size` prop being omitted.
import { ai, brush, chip, information, user_feedback, web } from "@dnb/eufemia/icons";
import EufemiaWordmark from "./EufemiaWordmark";
import {
  webNavItems,
  webComponentNavGroups,
  iosNavItems,
  androidNavItems,
  availableWebComponentPaths,
  type NavItem,
} from "./Sidebar";

/**
 * SideMenu — two-tier navigation from the Figma Sandbox file
 * (aD38asiLSTitzeMxy3RJCBWT), frames "Menu extended" and "Menu".
 *
 * Tier 1: 160px icon rail — section switcher.
 * Tier 2: 269px panel — collapsible tree for the active section.
 *
 * Clicking the active rail item collapses the panel, which is the difference
 * between the two Figma frames.
 *
 * The tree is fed by the same nav data `Sidebar` uses (imported, not copied) so
 * the two menus cannot drift apart. The frame only draws two levels; web
 * components need three (Components > group > component), which is the same
 * pattern nested one deeper.
 *
 * Colours are the Sandbox design's own values rather than the portal's --eu-*
 * tokens, per the brief to keep the Sandbox design. Dark is the base (it is the
 * design, and the portal's default); the light block uses the light values of
 * the same Figma variables. It does not follow the Sbanken/Carnegie brand
 * switch — that would mean going to --eu-* properly.
 *
 * Icons are monochrome SVGs exported from Figma, drawn as CSS masks tinted with
 * `currentColor`. The exports have white (and one mint) strokes baked in, which
 * would be invisible on a light surface — masking lets one asset serve both
 * themes and every row state.
 */

const RAIL_WIDTH = 160;
const PANEL_WIDTH = 301; // 269 in the frame, widened by 32px

/**
 * Intrinsic SVG sizes, so each glyph lands exactly as drawn in Figma.
 *
 * Only for glyphs Eufemia does not ship — the iOS and Android marks, and the
 * two panel indicators taken straight from the frame. Rail icons use the
 * package's own icon set (see the imports above).
 */
type IconSpec = { src: string; w: number; h: number };

const icons = {
  // Cropped from the 48x40 pill export down to the glyph itself, so these match
  // the 16px rail icons instead of filling the pill.
  ios: { src: "/menu/ios.svg", w: 16, h: 16 },
  android: { src: "/menu/android.svg", w: 16, h: 10 },
  chevron: { src: "/menu/chevron.svg", w: 11.5, h: 6.5 },
  arrowRight: { src: "/menu/arrow-right.svg", w: 15, h: 11.5 },
} satisfies Record<string, IconSpec>;

/** Masked icon — takes its colour from the surrounding row. */
const Ico: React.FC<{ icon: IconSpec }> = ({ icon }) => (
  <span
    aria-hidden
    className="efm-ico"
    style={{
      width: icon.w,
      height: icon.h,
      WebkitMaskImage: `url(${icon.src})`,
      maskImage: `url(${icon.src})`,
    }}
  />
);

// Navigation model ---------------------------------------------------------

type Node = {
  label: string;
  to?: string;
  /** Documented in the nav data but with no page behind it yet. */
  disabled?: boolean;
  children?: Node[];
};

type Section = {
  id: string;
  label: string;
  /** Icon from the Eufemia package — preferred. */
  euIcon?: typeof information;
  /** Masked SVG export, for glyphs Eufemia does not ship. */
  maskIcon?: IconSpec;
  /** Route matched to light this section up in the rail. */
  match: string[];
  tree: Node[];
};

const platformTree = (items: NavItem[]): Node[] =>
  items.map((i) => ({ label: i.label, to: i.path }));

const webTree: Node[] = [
  { label: webNavItems[0].label, to: webNavItems[0].path },
  {
    label: "Components",
    children: webComponentNavGroups.map((group) => ({
      label: group.label,
      children: group.items.map((item) => ({
        label: item.label,
        to: item.path,
        disabled: !availableWebComponentPaths.has(item.path),
      })),
    })),
  },
  { label: webNavItems[1].label, to: webNavItems[1].path },
];

const DIVIDER = "divider";

/**
 * The five menu points, then the platforms below the divider.
 *
 * Same set and order as `Sidebar`'s top-level menu. Each of the five is a
 * single page, so they navigate directly with no second tier — only the
 * platform sections have a panel.
 *
 * Not included: Maintainer tools, which `Sidebar` gates behind `useAuth`'s
 * isMaintainer.
 */
const sections: Section[] = [
  {
    id: "about",
    label: "About",
    euIcon: information,
    match: ["/about"],
    tree: [{ label: "About Eufemia", to: "/about" }],
  },
  {
    id: "designer-guide",
    label: "Designers",
    euIcon: brush,
    match: ["/docs/design"],
    tree: [{ label: "Designer Guide", to: "/docs/design" }],
  },
  {
    id: "developer-guide",
    label: "Developers",
    euIcon: chip,
    match: ["/getting-started"],
    tree: [{ label: "Developer Guide", to: "/getting-started" }],
  },
  {
    id: "contribute",
    label: "Contribute",
    euIcon: user_feedback,
    match: ["/contribute"],
    tree: [{ label: "Contribute", to: "/contribute" }],
  },
  {
    id: "ai",
    label: "Eufemia & AI",
    euIcon: ai,
    match: ["/eufemia-and-ai"],
    tree: [{ label: "Eufemia & AI", to: "/eufemia-and-ai" }],
  },
  { id: DIVIDER, label: "", match: [], tree: [] },
  {
    id: "web",
    label: "Web",
    euIcon: web,
    match: ["/docs/web"],
    tree: webTree,
  },
  {
    id: "ios",
    label: "iOS",
    maskIcon: icons.ios,
    match: ["/docs/ios"],
    tree: platformTree(iosNavItems),
  },
  {
    id: "android",
    label: "Android",
    maskIcon: icons.android,
    match: ["/docs/android"],
    tree: platformTree(androidNavItems),
  },
];

/** Prefix match — for "is the route somewhere under here". */
const isOn = (path: string, to?: string) =>
  !!to && (path === to || (to !== "/" && path.startsWith(`${to}/`)));

const norm = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

/**
 * Exact match — for "is this row the page you are on".
 *
 * Deliberately not `isOn`: a section overview like /docs/web is a prefix of
 * every component page under it, so prefix matching marked both Overview and
 * the actual component as current at the same time.
 */
const samePath = (path: string, to?: string) => !!to && norm(path) === norm(to);

/**
 * A section only earns the second tier if it has something to show there — more
 * than one destination, or a branch to expand. A section holding a single page
 * is just an icon in the rail that navigates straight there.
 */
const hasPanel = (s: Section) =>
  s.tree.length > 1 || s.tree.some((n) => !!n.children?.length);

/**
 * First reachable destination in a tree, depth-first. Clicking a rail item
 * navigates here, so a section always lands you on its first entry rather than
 * opening a panel with nothing selected.
 */
const firstDestination = (nodes: Node[]): string | undefined => {
  for (const node of nodes) {
    if (node.children?.length) {
      const found = firstDestination(node.children);
      if (found) return found;
    } else if (node.to && !node.disabled) {
      return node.to;
    }
  }
  return undefined;
};

/**
 * Longest matching prefix wins, so /docs/web/... beats /docs.
 * Returns "" on the overview page, which no section owns — the wordmark does.
 */
const sectionForPath = (path: string): string => {
  let best = "";
  let bestLen = -1;
  sections.forEach((s) => {
    s.match.forEach((m) => {
      if (isOn(path, m) && m.length > bestLen) {
        best = s.id;
        bestLen = m.length;
      }
    });
  });
  return best;
};

/** Keys of every branch that contains the active route, so it opens itself. */
const openBranchesFor = (tree: Node[], path: string): Record<string, boolean> => {
  const open: Record<string, boolean> = {};
  const walk = (nodes: Node[], prefix: string): boolean => {
    let hit = false;
    nodes.forEach((node, i) => {
      const key = `${prefix}${i}`;
      const childHit = node.children ? walk(node.children, `${key}-`) : false;
      if (childHit) open[key] = true;
      if (childHit || samePath(path, node.to)) hit = true;
    });
    return hit;
  };
  walk(tree, "");
  return open;
};

const styles = `
.efm {
  /* Dark — the Sandbox design as drawn, except the surface: both tiers sit on
     background-neutral rather than the frame's background-neutral-subtle. */
  --efm-surface: #1c1c1e;
  --efm-stroke: #48484a;
  --efm-pill: #333333;
  --efm-selected: #0d4637;
  --efm-text: #ffffff;
  --efm-muted: #8e8e93;
  --efm-accent: #a5e1d2;
  --efm-radius: 24px;

  display: flex;
  align-items: stretch;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  /* Above the 64px Header (z-index 100) — in the frame the panel is drawn over
     the top bar, whose controls all sit far right. */
  z-index: 110;
  font-family: DNB, sans-serif;
  color: var(--efm-text);
}

/* Light — the light values of the same Figma variables. */
html[data-theme="light"] .efm {
  --efm-surface: #ffffff;
  --efm-stroke: #ebebeb;
  --efm-pill: #ebebeb;
  --efm-selected: #e4eed7;
  --efm-text: #333333;
  --efm-muted: #737373;
  --efm-accent: #007272;
}

/* Masked icon — one asset, any colour. */
.efm-ico {
  display: block;
  flex: none;
  background: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

/* ---------- Tier 1: rail ---------- */

.efm-rail {
  width: ${RAIL_WIDTH}px;
  flex: none;
  box-sizing: border-box;
  padding: 24px 16px;
  background: var(--efm-surface);
  border-right: 1px solid var(--efm-stroke);
  overflow-y: auto;
  scrollbar-width: none;
  /* Above the panel, so the panel can slide out of sight behind it. */
  position: relative;
  z-index: 1;
}
.efm-rail::-webkit-scrollbar { display: none; }

.efm-rail-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.efm-rail-items {
  display: flex;
  flex-direction: column;
  /* 16px, not the frame's 24px. */
  gap: 16px;
  width: 100%;
}

.efm-rail-divider { height: 1px; width: 100%; background: var(--efm-stroke); }

.efm-wordmark {
  display: inline-flex;
  align-items: center;
  color: var(--efm-text);
  text-decoration: none;
  line-height: 0;
}
.efm-wordmark:focus-visible {
  outline: 2px solid var(--efm-accent);
  outline-offset: 4px;
}

.efm-rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-decoration: none;
}

.efm-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 56px — 8px wider than the frame's 48px; the icon stays centred. */
  width: 56px;
  height: 40px;
  border-radius: var(--efm-radius);
  border: 1px solid transparent;
  background: var(--efm-pill);
  transition: background 0.15s ease, border-color 0.15s ease;
}

.efm-rail-item:hover .efm-pill { border-color: var(--efm-stroke); }

.efm-rail-item[aria-current="true"] .efm-pill {
  background: var(--efm-selected);
  border-color: var(--efm-stroke);
}

.efm-rail-label {
  /* Text x-small (14/20) rather than the frame's Text basis (18/24) — the rail
     is only 127px wide, so the smaller step reads better and gives the longer
     labels room. */
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  text-align: center;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.efm-rail-item[aria-current="true"] .efm-rail-label { font-weight: 500; }

.efm-rail-item:focus-visible,
.efm-row:focus-visible {
  outline: 2px solid var(--efm-accent);
  outline-offset: 2px;
  border-radius: var(--efm-radius);
}

/* ---------- Tier 2: panel ---------- */

/* Taken out of flow deliberately: animating a flex child would change .efm's
   width and shove the content column sideways. Absolute means the slide is
   purely visual — the page never moves with it. */
.efm-panel {
  position: absolute;
  top: 0;
  left: ${RAIL_WIDTH}px;
  height: 100%;
  width: ${PANEL_WIDTH}px;
  z-index: 0;
  box-sizing: border-box;
  padding: 22px 21px 32px 23px;
  background: var(--efm-surface);
  border-right: 1px solid var(--efm-stroke);
  border-radius: 0 var(--efm-radius) var(--efm-radius) 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;

  /* Parked behind the rail until opened. */
  transform: translateX(-100%);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.28s cubic-bezier(0.2, 0, 0, 1), opacity 0.18s ease;
}

.efm-panel--open {
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  .efm-panel { transition: none; }
}

.efm-panel-inner {
  display: flex;
  flex-direction: column;
  /* 16px, not the frame's 32px — matches the group and child gaps, so every
     vertical step in the panel is the same. */
  gap: 16px;
  /* Tracks the panel width rather than a fixed 225px, so widening the panel
     gives the rows the extra room instead of leaving dead space. */
  width: 100%;
}

.efm-group { display: flex; flex-direction: column; gap: 16px; }

.efm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 16px;
  border-radius: var(--efm-radius);
  border: 1px solid transparent;
  background: none;
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  line-height: 24px;
  font-weight: 400;
  color: var(--efm-text);
  text-align: left;
  text-decoration: none;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.efm-row > span:first-child { min-width: 0; overflow: hidden; text-overflow: ellipsis; }

.efm-row:hover { background: var(--efm-pill); }

/* Expanded parent keeps the filled + outlined treatment. */
.efm-row[aria-expanded="true"] {
  background: var(--efm-pill);
  border-color: var(--efm-stroke);
}

.efm-chevron {
  width: 16px;
  height: 16px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}
.efm-row[aria-expanded="true"] .efm-chevron { transform: rotate(180deg); }

.efm-children {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 24px;
}

/* Leaves hug their content until selected, matching the frame. */
.efm-leaf { width: auto; }
.efm-leaf[aria-current="page"] {
  width: 100%;
  background: var(--efm-selected);
  font-weight: 500;
}
.efm-leaf[aria-current="page"]:hover { background: var(--efm-selected); }

.efm-leaf-arrow {
  width: 16px;
  height: 16px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--efm-accent);
}

/* Documented but not built yet. */
.efm-leaf--disabled,
.efm-leaf--disabled:hover {
  color: var(--efm-muted);
  background: none;
  cursor: not-allowed;
}
`;

/**
 * Whether a route lands on a section with a second tier. Used by the chrome to
 * seed the content offset before the menu has reported in.
 */
export const hasPanelForPath = (path: string): boolean => {
  const s = sections.find((x) => x.id === sectionForPath(path));
  return !!s && hasPanel(s);
};

type SideMenuProps = {
  /** Current route, used for rail + leaf selection and auto-expansion. */
  currentPath?: string;
  /** start with the second tier collapsed (the "Menu" frame) */
  initialCollapsed?: boolean;
  /** fires when the second tier opens/closes, so the page can offset content */
  onCollapsedChange?: (collapsed: boolean) => void;
};

const SideMenu: React.FC<SideMenuProps> = ({
  currentPath = "",
  initialCollapsed = false,
  onCollapsedChange,
}) => {
  const routeSection = useMemo(() => sectionForPath(currentPath), [currentPath]);
  const [activeSection, setActiveSection] = useState(routeSection);
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const section = sections.find((s) => s.id === activeSection);
  /** Whether the panel should be showing right now. */
  const wantsPanel = !!section && hasPanel(section) && !collapsed;

  /**
   * Which tree the panel holds. Keeps the last panelled section after you leave
   * it, so there is still something to animate out.
   */
  const [panelSection, setPanelSection] = useState<Section | undefined>(() =>
    section && hasPanel(section) ? section : undefined
  );

  /**
   * Starts closed and flips on the next frame, so the opening slide has a start
   * state. The menu is persistent chrome (see SideMenuChrome), so from here on
   * every open/close is a plain class change on an element that stays put.
   */
  const [panelOpen, setPanelOpen] = useState(false);

  // Follow the route: switch section and open the branch holding the page.
  useEffect(() => {
    setActiveSection(routeSection);
  }, [routeSection]);

  useEffect(() => {
    if (section && hasPanel(section)) setPanelSection(section);
  }, [section]);

  // One frame late, so there is a start state to transition from.
  useEffect(() => {
    const id = requestAnimationFrame(() => setPanelOpen(wantsPanel));
    return () => cancelAnimationFrame(id);
  }, [wantsPanel]);

  useEffect(() => {
    const target = sections.find((s) => s.id === routeSection);
    if (!target) return;
    setOpenGroups((prev) => ({ ...prev, ...openBranchesFor(target.tree, currentPath) }));
  }, [routeSection, currentPath]);

  // Report the effective state, so the page reclaims the panel's width when the
  // active section has no panel to show. Deliberately keyed to wantsPanel, not
  // panelOpen — the content should land immediately, not wait for the slide.
  useEffect(() => {
    onCollapsedChange?.(!wantsPanel);
  }, [wantsPanel, onCollapsedChange]);

  const renderNodes = (nodes: Node[], prefix = ""): React.ReactNode =>
    nodes.map((node, i) => {
      const key = `${prefix}${i}`;

      if (node.children?.length) {
        const isOpen = !!openGroups[key];
        return (
          <div key={key} className="efm-group">
            <button
              type="button"
              className="efm-row"
              aria-expanded={isOpen}
              onClick={() => setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }))}
            >
              <span>{node.label}</span>
              <span className="efm-chevron">
                <Ico icon={icons.chevron} />
              </span>
            </button>
            {isOpen && <div className="efm-children">{renderNodes(node.children, `${key}-`)}</div>}
          </div>
        );
      }

      if (node.disabled) {
        return (
          <span key={key} className="efm-row efm-leaf efm-leaf--disabled" aria-disabled="true">
            <span>{node.label}</span>
          </span>
        );
      }

      const active = samePath(currentPath, node.to);
      const content = (
        <>
          <span>{node.label}</span>
          {active && (
            <span className="efm-leaf-arrow">
              <Ico icon={icons.arrowRight} />
            </span>
          )}
        </>
      );

      return node.to ? (
        <Link
          key={key}
          to={node.to}
          className="efm-row efm-leaf"
          aria-current={active ? "page" : undefined}
        >
          {content}
        </Link>
      ) : (
        <button key={key} type="button" className="efm-row efm-leaf">
          {content}
        </button>
      );
    });

  return (
    <div className="efm">
      <style>{styles}</style>

      <nav className="efm-rail" aria-label="Sections">
        <div className="efm-rail-inner">
          <Link
            className="efm-wordmark"
            to="/"
            aria-label="Eufemia — overview"
            aria-current={samePath(currentPath, "/") ? "page" : undefined}
          >
            <EufemiaWordmark height={22} />
          </Link>
          <div className="efm-rail-items">
            {sections.map((s) => {
              if (s.id === DIVIDER) {
                return <div key={DIVIDER} className="efm-rail-divider" role="separator" />;
              }

              const inner = (
                <>
                  <span className="efm-pill">
                    {s.euIcon ? (
                      // No size prop: Eufemia's default is 16px, while
                      // size="medium" would render 24px.
                      <EufemiaIcon icon={s.euIcon} aria-hidden />
                    ) : s.maskIcon ? (
                      <Ico icon={s.maskIcon} />
                    ) : null}
                  </span>
                  <span className="efm-rail-label">{s.label}</span>
                </>
              );
              const isActive = s.id === activeSection;
              const panelled = hasPanel(s);
              const target = firstDestination(s.tree);

              if (!target) {
                return (
                  <button key={s.id} type="button" className="efm-rail-item" aria-current={isActive}>
                    {inner}
                  </button>
                );
              }

              return (
                <Link
                  key={s.id}
                  to={target}
                  className="efm-rail-item"
                  aria-current={isActive}
                  aria-expanded={panelled ? (isActive ? panelOpen : false) : undefined}
                  onClick={(e) => {
                    // Re-clicking the section you are already in collapses the
                    // second tier — the difference between the two Figma frames.
                    if (isActive && panelled) {
                      e.preventDefault();
                      setCollapsed((c) => !c);
                      return;
                    }
                    setActiveSection(s.id);
                    setCollapsed(false);
                  }}
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {panelSection && (
        <nav
          className={`efm-panel${panelOpen ? " efm-panel--open" : ""}`}
          aria-label={panelSection.label}
          aria-hidden={!panelOpen}
        >
          <div className="efm-panel-inner">{renderNodes(panelSection.tree)}</div>
        </nav>
      )}
    </div>
  );
};

export default SideMenu;
export { RAIL_WIDTH, PANEL_WIDTH };

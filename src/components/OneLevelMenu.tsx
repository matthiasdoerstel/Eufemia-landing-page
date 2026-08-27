import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "gatsby";
import { Icon as EufemiaIcon } from "@dnb/eufemia";
import { chevron_down, chevron_up } from "@dnb/eufemia/icons";
import PlatformIcon from "./PlatformIcon";
import {
  navFor,
  NavNode,
  NavGroup,
  DocPlatform,
  PLATFORM_LABELS,
} from "../data/portal-nav";
import { radius, font } from "../theme/tokens";

// One-level sidebar — Figma Sandbox aD38asiLSTitzeMxy3RJCBWT, node 8931:86484
// ("Final testing; One level sidebar" / Frame 11335877).
//
// Geometry is taken verbatim from `get_design_context` on that node:
//
//   panel        384px, padding 32/16/24, flex column, gap 40
//   nav column   gap 24 between every top-level block
//   row          w-full, padding 8px 16px, radius 24, gap 8, icon 16px, 18/24
//   group        gap 8 between header and its children
//   children     pl 24 then px 16  -> level 2 rows sit at x=40, right inset 16
//   level 3      a further pl 32   -> rows at x=72, headings outdented to x=56
//   hover        background-neutral-subtle, NO border, weight 500
//   selected     background-neutral-base + 1px subtle border, weight 400
//
// Note the hover/selected split: the design distinguishes them by *border and
// weight*, not by colour intensity — selected carries the border and stays
// regular, hover carries the medium weight and no border.
//
// Deliberately NOT built on MenuRow: that is the old Sidebar's row (56px, square
// corners, hairline separators, bordered container, tinted level-2 fill), a
// different system entirely.
//
// Colours are `var(--eu-*)` tokens rather than the frame's hardcoded hexes, so
// the menu survives the portal's light/dark toggle and the DNB / Sbanken /
// Carnegie brand switch. The design's `--token-color-*` names map as:
//   background-neutral         -> --eu-surface
//   background-neutral-base    -> --eu-surfaceAlt   (selected fill)
//   background-neutral-subtle  -> --eu-surfaceAlt   (hover fill)
//   stroke-neutral-subtle      -> --eu-strokeSubtle
//   text-neutral               -> --eu-text
// The portal's token set has one raised-surface step where the design has two,
// so hover and selected share a fill and are told apart by border + weight —
// which is the design's own mechanism.

export const PANEL_WIDTH = 384;

const B = "eu-olm";

// Indentation is applied by each group's children container, relative to the
// group — a group wrapper already shifts everything inside it, so an absolute
// per-depth inset on the rows would compound.
//
// Level 2 = the design's `pl-24` + `px-16`. Level 3 adds its `pl-32`.
const STEP_L2 = 40;
const STEP_L2_RIGHT = 16;
const STEP_DEEP = 32;

const CSS = `
.${B}-panel {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 40px;
  width: ${PANEL_WIDTH}px;
  height: 100vh;
  box-sizing: border-box;
  padding: 32px 16px 24px;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: var(--eu-surface);
  border-right: 1px solid var(--eu-strokeSubtle);
  font-family: ${font.family};
  z-index: 95;
}
/* Off-canvas on mobile. */
.${B}-panel--drawer {
  max-width: 86vw;
  transform: translateX(-100%);
  transition: transform 0.25s ease;
}
.${B}-panel--drawer.${B}-panel--open {
  transform: translateX(0);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
}

.${B}-wordmark {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  color: var(--eu-text);
  text-decoration: none;
}

/* Rows ------------------------------------------------------------------- */
/* Shared by menu rows and the contextual switcher: 40px tall (8 + 24 + 8),
   full width, 24px radius, 8px gap, 16px horizontal padding. */
.${B}-row,
.${B}-context {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  min-height: 40px;
  margin: 0;
  padding: 8px 16px;
  border: 0;
  border-radius: ${radius.xl};
  background: transparent;
  color: var(--eu-text);
  font-family: inherit;
  font-size: ${font.size.body}px;
  line-height: ${font.lineHeight.body}px;
  font-weight: 400;
  text-align: left;
  text-decoration: none;
  word-break: break-word;
  cursor: pointer;
  transition: background 0.15s ease;
}

/* Contextual switcher — bordered but unfilled at rest. The frame fills it with
   background-neutral-base; per review the fill is dropped so the switcher reads
   as an outline control and does not compete with the selected row's fill. */
.${B}-context {
  background: transparent;
  border: 1px solid var(--eu-strokeSubtle);
}
.${B}-context:hover { background: var(--eu-surfaceAlt); }

.${B}-row__icon,
.${B}-context__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  color: currentColor;
}
.${B}-row__label { flex: 1 1 auto; }
.${B}-row__chevron {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
  color: currentColor;
}
.${B}-row__trailing { display: inline-flex; flex-shrink: 0; }

/* Hover — subtle fill only. The frame also switches the label to medium weight,
   but per review that is dropped: the reflow as the text thickens is distracting
   on a long list, and it read as a selected state. */
.${B}-row:hover {
  background: var(--eu-surfaceAlt);
}

/* Selected — the current page. Base fill plus a 1px subtle border, weight
   unchanged. Padding is NOT compensated for the border, so a selected row is
   42px against its siblings' 40px — which is what the frame measures. */
.${B}-row--selected,
.${B}-row--selected:hover {
  background: var(--eu-surfaceAlt);
  border: 1px solid var(--eu-strokeSubtle);
  font-weight: 400;
}

/* Focus — not in the design, but a keyboard user needs it. */
.${B}-row:focus-visible,
.${B}-context:focus-visible {
  outline: 2px solid var(--eu-accentStrong);
  outline-offset: 0;
  background: var(--eu-surfaceAlt);
}

/* Disabled — the page does not exist yet. */
.${B}-row--disabled,
.${B}-row--disabled:hover {
  background: transparent;
  color: var(--eu-textMuted);
  font-weight: 400;
  cursor: not-allowed;
}

/* Platform switcher ------------------------------------------------------- */
/* The trigger and its popover share a positioning context, and sit above the
   nav list so the popover can overlay it. */
.${B}-switcher {
  position: relative;
  width: 100%;
  z-index: 2;
}

/* The switcher's dropdown — an overlay, not a block in the flow. Absolute so
   opening it lays the menu *over* the nav list instead of pushing every row
   down; the offset is the trigger's full height plus the frame's 6px gap. */
.${B}-context-menu {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  border: 1px solid var(--eu-strokeSubtle);
  border-radius: ${radius.xl};
  background: var(--eu-surfaceAlt);
  /* Frame effect "UI sharp": drop shadow, y+1, blur 6, #00000029. */
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.16);
  animation: ${B}-pop 0.12s ease-out;
}
@keyframes ${B}-pop {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 56px rows — taller than a nav row, per the frame's "Menu items". */
.${B}-context-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;
  min-height: 56px;
  padding: 16px;
  border: 0;
  border-radius: ${radius.sm};
  background: transparent;
  color: var(--eu-text);
  font-family: inherit;
  font-size: ${font.size.body}px;
  line-height: ${font.lineHeight.body}px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}
.${B}-context-option:hover { background: var(--eu-selectedSubtle); }
.${B}-context-option:focus-visible {
  outline: 2px solid var(--eu-accentStrong);
  outline-offset: -2px;
  background: var(--eu-selectedSubtle);
}
/* Hairline between rows, matching the frame's padded dividers. */
.${B}-context-option-item + .${B}-context-option-item {
  border-top: 1px solid var(--eu-strokeSubtle);
}
.${B}-context__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
  color: currentColor;
}

/* Nav list + its dimmer. Positioned so the dimmer can cover it, and below the
   switcher in the stack so the popover wins. Keeps the 24px block rhythm the
   nav used when these rows were its direct children. */
.${B}-navlist {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  z-index: 1;
}

/* Dimmer over everything the platform choice is about to replace.
   Deliberately the panel's OWN background rather than a black wash: where the
   dimmer extends past the rows there is nothing under it but panel, so surface
   over surface is invisible and the layer has no visible edge. Over the rows the
   same fill veils them toward the panel colour. Click-to-dismiss. */
.${B}-dim {
  position: absolute;
  inset: -8px;
  border: 0;
  padding: 0;
  background: var(--eu-surface);
  opacity: 0.8;
  cursor: pointer;
  animation: ${B}-fade 0.12s ease-out;
}
@keyframes ${B}-fade {
  from { opacity: 0; }
  to { opacity: 0.8; }
}

/* Blocks ----------------------------------------------------------------- */
.${B}-nav {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}
.${B}-group { width: 100%; }
.${B}-children {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}
.${B}-children--l2 {
  margin-left: ${STEP_L2}px;
  margin-right: ${STEP_L2_RIGHT}px;
}
.${B}-children--deep { margin-left: ${STEP_DEEP}px; }
.${B}-divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: 1px solid var(--eu-strokeSubtle);
}

/* Heading — non-interactive label sub-dividing a group's children. Hugs its
   text and outdents by its own padding, so the label sits one step left of the
   rows it labels. */
.${B}-heading {
  align-self: flex-start;
  margin: 0 0 0 -16px;
  padding: 8px 16px;
  color: var(--eu-text);
  font-size: ${font.size.body}px;
  line-height: ${font.lineHeight.body}px;
  font-weight: 500;
}

/* Beta tag / unread dot. currentColor so they follow the row. */
.${B}-tag {
  padding: 0 7px;
  border: 1px solid currentColor;
  border-radius: ${radius.sm};
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}
.${B}-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .${B}-row, .${B}-context, .${B}-panel--drawer, .${B}-context-option { transition: none; }
  .${B}-context-menu, .${B}-dim { animation: none; }
}
`;

// Keys ----------------------------------------------------------------------
// Group open state is keyed by position in the tree, so two groups with the same
// label (e.g. "Components" under Web and under iOS) never share a key.
const keyFor = (parentKey: string, label: string) => `${parentKey}/${label}`;

/**
 * Gatsby's `trailingSlash` default means the router reports `/about/` while the
 * nav data holds `/about`. Strip query, hash and any trailing slash from both
 * sides before comparing, or nothing ever matches and no row is ever selected.
 */
const normalizePath = (p?: string): string => {
  if (!p) return "";
  const clean = p.split(/[?#]/)[0];
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean;
};

const samePath = (a?: string, b?: string) =>
  !!a && !!b && normalizePath(a) === normalizePath(b);

/** Every group key on the path from the root down to `to`, so ancestors open. */
const ancestorKeysFor = (
  nodes: NavNode[],
  to: string,
  parentKey = ""
): string[] | null => {
  for (const node of nodes) {
    if (node.kind === "link") {
      if (samePath(node.to, to)) return [];
      continue;
    }
    if (node.kind !== "group") continue;
    const key = keyFor(parentKey, node.label);
    const found = ancestorKeysFor(node.children, to, key);
    if (found) return [key, ...found];
  }
  return null;
};

/**
 * Open state for the branch containing `path`. Used to seed `useState` during
 * the first render rather than only in an effect — otherwise the server renders
 * every group collapsed and the menu visibly expands a frame after hydration.
 */
const seedOpenFor = (
  nodes: NavNode[],
  path: string
): Record<string, boolean> => {
  const seed: Record<string, boolean> = {};
  ancestorKeysFor(nodes, path)?.forEach((k) => {
    seed[k] = true;
  });
  return seed;
};

// Rows ----------------------------------------------------------------------

type IconDef = NonNullable<Extract<NavNode, { kind: "link" }>["icon"]>;

const RowIcon: React.FC<{ icon?: IconDef }> = ({ icon }) =>
  icon ? (
    <span className={`${B}-row__icon`}>
      <EufemiaIcon icon={icon} size="default" aria-hidden />
    </span>
  ) : null;

const Trailing: React.FC<{ badge?: "beta" | "unread"; unread?: boolean }> = ({
  badge,
  unread,
}) => {
  if (badge === "beta") {
    return (
      <span className={`${B}-row__trailing`}>
        <span className={`${B}-tag`}>Beta</span>
      </span>
    );
  }
  if (badge === "unread" && unread) {
    return (
      <span className={`${B}-row__trailing`}>
        <span className={`${B}-dot`} aria-label="Unread feedback" />
      </span>
    );
  }
  return null;
};

interface TreeProps {
  nodes: NavNode[];
  depth: number;
  parentKey: string;
  currentPath: string;
  open: Record<string, boolean>;
  toggle: (key: string) => void;
  hasUnread: boolean;
  onNavigate?: () => void;
}

const Tree: React.FC<TreeProps> = ({
  nodes,
  depth,
  parentKey,
  currentPath,
  open,
  toggle,
  hasUnread,
  onNavigate,
}) => (
  <>
    {nodes.map((node, i) => {
      if (node.kind === "divider") {
        return <hr key={`divider-${i}`} className={`${B}-divider`} />;
      }

      if (node.kind === "heading") {
        return (
          <div
            key={`heading-${parentKey}-${node.label}`}
            className={`${B}-heading`}
          >
            {node.label}
          </div>
        );
      }

      if (node.kind === "link") {
        const disabled = !node.to;
        const selected = samePath(node.to, currentPath);
        const className = [
          `${B}-row`,
          selected && `${B}-row--selected`,
          disabled && `${B}-row--disabled`,
        ]
          .filter(Boolean)
          .join(" ");
        const content = (
          <>
            <RowIcon icon={node.icon} />
            <span className={`${B}-row__label`}>{node.label}</span>
            <Trailing badge={node.badge} unread={hasUnread} />
          </>
        );

        if (disabled) {
          return (
            <span
              key={`link-${parentKey}-${node.label}`}
              className={className}
              aria-disabled="true"
              title="Not documented yet"
            >
              {content}
            </span>
          );
        }

        return (
          <Link
            key={`link-${parentKey}-${node.label}`}
            className={className}
            to={node.to as string}
            onClick={onNavigate}
            aria-current={selected ? "page" : undefined}
          >
            {content}
          </Link>
        );
      }

      // Group.
      const g = node as NavGroup;
      const key = keyFor(parentKey, g.label);
      const isOpen = open[key] ?? g.defaultOpen ?? false;

      return (
        <div key={`group-${key}`} className={`${B}-group`}>
          <button
            type="button"
            className={`${B}-row`}
            onClick={() => toggle(key)}
            aria-expanded={isOpen}
          >
            <RowIcon icon={g.icon} />
            <span className={`${B}-row__label`}>{g.label}</span>
            <span className={`${B}-row__chevron`}>
              <EufemiaIcon
                icon={isOpen ? chevron_up : chevron_down}
                size="default"
                aria-hidden
              />
            </span>
          </button>

          {isOpen && (
            <div
              className={`${B}-children ${
                depth === 1 ? `${B}-children--l2` : `${B}-children--deep`
              }`}
            >
              <Tree
                nodes={g.children}
                depth={depth + 1}
                parentKey={key}
                currentPath={currentPath}
                open={open}
                toggle={toggle}
                hasUnread={hasUnread}
                onNavigate={onNavigate}
              />
            </div>
          )}
        </div>
      );
    })}
  </>
);

// Panel ---------------------------------------------------------------------

export interface OneLevelMenuProps {
  currentPath?: string;
  platform: DocPlatform;
  onPlatformChange: (p: DocPlatform) => void;
  isMaintainer?: boolean;
  hasUnreadFeedback?: boolean;
  onNavigate?: () => void;
  /** Renders off-canvas, driven by `open`. */
  isMobile?: boolean;
  open?: boolean;
  /** Rendered in the wordmark slot. */
  wordmark?: React.ReactNode;
}

const OneLevelMenu: React.FC<OneLevelMenuProps> = ({
  currentPath = "",
  platform,
  onPlatformChange,
  isMaintainer = false,
  hasUnreadFeedback = false,
  onNavigate,
  isMobile = false,
  open: drawerOpen = false,
  wordmark,
}) => {
  const [contextOpen, setContextOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Now that the menu overlays rather than occupying flow, it needs the usual
  // popover dismissals: Escape, and a click anywhere outside the switcher. The
  // dimmer covers the nav list, but the wordmark and the panel's padding are
  // still exposed — a click there should close it too.
  useEffect(() => {
    if (!contextOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setContextOpen(false);
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!switcherRef.current?.contains(e.target as Node)) setContextOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [contextOpen]);

  const nodes = useMemo(
    () => navFor({ platform, isMaintainer }),
    [platform, isMaintainer]
  );

  // Seeded during the first render so the current branch is already open in the
  // server-rendered markup.
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    seedOpenFor(nodes, currentPath)
  );

  // Re-open on navigation, without collapsing anything the user opened by hand.
  useEffect(() => {
    if (!currentPath) return;
    const keys = ancestorKeysFor(nodes, currentPath);
    if (!keys?.length) return;
    setOpen((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        next[k] = true;
      });
      return next;
    });
  }, [currentPath, nodes]);

  const toggle = (key: string) =>
    setOpen((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));

  const className = [
    `${B}-panel`,
    isMobile && `${B}-panel--drawer`,
    isMobile && drawerOpen && `${B}-panel--open`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <aside className={className} aria-hidden={isMobile && !drawerOpen}>
      <style>{CSS}</style>

      <Link to="/" className={`${B}-wordmark`} aria-label="Eufemia — home">
        {wordmark}
      </Link>

      <nav className={`${B}-nav`} aria-label="Portal">
        <div className={`${B}-switcher`} ref={switcherRef}>
          <button
            type="button"
            className={`${B}-context`}
            onClick={() => setContextOpen((o) => !o)}
            aria-expanded={contextOpen}
            aria-haspopup="menu"
          >
            <span className={`${B}-context__glyph`} aria-hidden>
              <PlatformIcon platform={platform} />
            </span>
            <span className={`${B}-row__label`}>{PLATFORM_LABELS[platform]}</span>
            <span className={`${B}-row__chevron`}>
              <EufemiaIcon
                icon={contextOpen ? chevron_up : chevron_down}
                size="default"
                aria-hidden
              />
            </span>
          </button>

          {contextOpen && (
            // A "switch to" menu, not a value picker: the frame lists only the
            // platforms you are not on, so the active one has no row and there
            // is nothing to mark as checked. Hence `menu`/`menuitem` rather than
            // the radiogroup this used to be.
            <ul className={`${B}-context-menu`} role="menu" aria-label="Switch platform">
              {(["web", "ios", "android"] as DocPlatform[])
                .filter((p) => p !== platform)
                .map((p) => (
                  <li key={p} className={`${B}-context-option-item`} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={`${B}-context-option`}
                      onClick={() => {
                        onPlatformChange(p);
                        setContextOpen(false);
                      }}
                    >
                      <span className={`${B}-context__glyph`} aria-hidden>
                        <PlatformIcon platform={p} />
                      </span>
                      <span>{PLATFORM_LABELS[p]}</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className={`${B}-navlist`}>
          <Tree
            nodes={nodes}
            depth={1}
            parentKey=""
            currentPath={currentPath}
            open={open}
            toggle={toggle}
            hasUnread={hasUnreadFeedback}
            onNavigate={onNavigate}
          />

          {contextOpen && (
            // A div, not a button: it is `aria-hidden`, and an aria-hidden
            // focusable element is an a11y violation. Keyboard users dismiss
            // with Escape instead.
            <div
              className={`${B}-dim`}
              aria-hidden
              onClick={() => setContextOpen(false)}
            />
          )}
        </div>
      </nav>
    </aside>
  );
};

export default OneLevelMenu;

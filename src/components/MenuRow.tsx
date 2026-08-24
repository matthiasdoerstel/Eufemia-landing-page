import React from "react";
import { Link } from "gatsby";
import { Icon as EufemiaIcon } from "@dnb/eufemia";
import { chevron_down, chevron_up, home_medium } from "@dnb/eufemia/icons";

// Eufemia "Menu" navigation row (Figma node 6505:8066, Size = Large).
//
// Geometry and states are taken straight from the design: 56px tall, square
// corners, 16px padding, 24px icon at x=16 and the label at x=56, a 1px bottom
// hairline, and a 2px emphasis outline on hover/focus. Hover and focus live in
// CSS rather than React state so `:focus-visible` can be expressed at all — an
// inline style object cannot.
//
// Colours are theme tokens (var(--eu-*)), so the DNB-light spec above also
// resolves correctly in dark mode and for the Sbanken / Carnegie brands.

export type MenuRowLevel = 1 | 2;
export type MenuRowState = "default" | "selected" | "highlighted";
export type MenuRowChevron = "none" | "down" | "up";

type EufemiaIconDefinition = typeof home_medium;

const B = "eu-menu-row";

/** Class for the bounded container the rows are stacked inside. */
export const MENU_LIST_CLASS = `${B}-list`;

// Figma draws the emphasis ring OUTSIDE the row — the Hover and Focus variants
// measure 244x60 against a 240x56 row. So it is a real `outline`, not an inset
// shadow: an inset ring would sit 2px inside the row and read as a different
// shape. The container therefore must not clip its children (see below).
const RING = `outline: 2px solid var(--eu-accentStrong); outline-offset: 0; z-index: 1;`;
// Drawn on top of every row but the first, so siblings are separated without
// doubling up against the container's own bottom border. Inset, so it costs no
// height — rows stay exactly 56px (16 + 24 + 16).
const HAIRLINE = `box-shadow: inset 0 1px 0 var(--eu-strokeSubtle);`;
// Row corners are inset by the container's 1px border so the fill of the first
// and last row follows the container's curve exactly.
const INNER_RADIUS = `calc(var(--eu-radius-lg) - 1px)`;

export const MENU_ROW_CSS = `
/* The list container. Figma wraps the rows in a bounded box with a 1px border on
   all four sides; the radius is the brand-aware 'lg' token (16px on DNB and
   Sbanken, 4px on Carnegie). Overflow stays visible so the outward focus ring is
   never clipped — instead the first and last rows carry matching corner radii. */
.${B}-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--eu-strokeSubtle);
  border-radius: var(--eu-radius-lg);
  background: var(--eu-surface);
}

.${B} {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
  min-height: 56px;
  margin: 0;
  padding: 16px;
  border: 0;
  border-radius: 0;
  background: var(--eu-surface);
  color: var(--eu-text);
  font-family: DNB, sans-serif;
  font-size: 18px;
  line-height: 24px;
  font-weight: 400;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  outline: none;
  transition: background 0.15s ease, color 0.15s ease;
}
.${B}:first-child {
  border-top-left-radius: ${INNER_RADIUS};
  border-top-right-radius: ${INNER_RADIUS};
}
.${B}:last-child {
  border-bottom-left-radius: ${INNER_RADIUS};
  border-bottom-right-radius: ${INNER_RADIUS};
}

/* Separator between sibling rows. */
.${B}:not(:first-child) { ${HAIRLINE} }

/* Icon slot — rendered only when there is an icon, so a level 2 row's label
   starts at x=16 as in Figma rather than being pushed out to x=56. */
.${B}__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 24px;
  width: 24px;
  height: 24px;
  color: var(--eu-accent);
}
.${B}__label { flex: 1 1 auto; }
.${B}__trailing,
.${B}__chevron {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: auto;
}
.${B}__chevron { color: var(--eu-accent); }

/* Level 2 sits on a tinted surface at rest and turns white on hover. */
.${B}--l2 { background: var(--eu-accentSubtle); }

/* Hover — level 1 gains the ring, level 2 only inverts its surface. -------- */
.${B}--l1:hover { ${RING} }
.${B}--l2:hover {
  background: var(--eu-surface);
  color: var(--eu-accent);
}

/* Focus — keyboard only. Both levels get the ring on a white surface. ------ */
.${B}:focus-visible {
  ${RING}
  background: var(--eu-surface);
}
.${B}--l2:focus-visible { color: var(--eu-accent); }

/* Pressed — Figma's Active variant has no ring, on either level. ---------- */
.${B}:active {
  background: var(--eu-accentSubtle);
  color: var(--eu-text);
  outline: none;
}

/* Selected — the current page. Solid accent fill, content inverted. ------- */
.${B}--selected,
.${B}--selected:hover,
.${B}--selected:active {
  background: var(--eu-accent);
  color: var(--eu-textOnAccent);
}
.${B}--selected .${B}__icon,
.${B}--selected .${B}__chevron { color: var(--eu-textOnAccent); }

/* Highlighted — an ancestor of the current page. -------------------------- */
.${B}--highlighted,
.${B}--highlighted:hover {
  background: var(--eu-surfaceAlt);
  color: var(--eu-text);
}
.${B}--highlighted .${B}__icon,
.${B}--highlighted .${B}__chevron { color: var(--eu-accentStrong); }

/* Disabled — component pages that have no content yet. ------------------- */
.${B}--disabled,
.${B}--disabled:hover,
.${B}--disabled:active {
  background: var(--eu-accentSubtle);
  color: var(--eu-textMuted);
  cursor: not-allowed;
  outline: none;
}
.${B}--disabled .${B}__icon { color: var(--eu-textMuted); }
`;

interface MenuRowProps {
  level: MenuRowLevel;
  label: React.ReactNode;
  icon?: EufemiaIconDefinition;
  to?: string;
  onClick?: () => void;
  chevron?: MenuRowChevron;
  state?: MenuRowState;
  disabled?: boolean;
  expanded?: boolean;
  /** Trailing slot — Beta tag, unread dot. Inherits the row's text colour. */
  children?: React.ReactNode;
}

const MenuRow: React.FC<MenuRowProps> = ({
  level,
  label,
  icon,
  to,
  onClick,
  chevron = "none",
  state = "default",
  disabled = false,
  expanded,
  children,
}) => {
  const className = [
    B,
    `${B}--l${level}`,
    state !== "default" && `${B}--${state}`,
    disabled && `${B}--disabled`,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {icon && (
        <span className={`${B}__icon`}>
          <EufemiaIcon icon={icon} size="medium" aria-hidden />
        </span>
      )}
      <span className={`${B}__label`}>{label}</span>
      {children && <span className={`${B}__trailing`}>{children}</span>}
      {chevron !== "none" && (
        <span className={`${B}__chevron`}>
          <EufemiaIcon icon={chevron === "up" ? chevron_up : chevron_down} aria-hidden />
        </span>
      )}
    </>
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true">
        {content}
      </span>
    );
  }

  if (to) {
    return (
      <Link className={className} to={to} onClick={onClick} aria-current={state === "selected" ? "page" : undefined}>
        {content}
      </Link>
    );
  }

  return (
    <button className={className} type="button" onClick={onClick} aria-expanded={expanded}>
      {content}
    </button>
  );
};

export default MenuRow;

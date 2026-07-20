import React from "react";
import { font, radius } from "../theme/tokens";
import { isPrimaryCategory, type Release } from "../data/release-data";
import type { ColorTokens } from "../theme/tokens";

const ReleaseNotes: React.FC<{
  release: Release;
  colors: ColorTokens;
  compact?: boolean;
}> = ({ release, colors, compact = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {release.categories.map((category) => {
      const primary = isPrimaryCategory(category);
      const visibleItems = category.items.slice(0, compact ? (primary ? 3 : 1) : undefined);
      const remaining = category.items.length - visibleItems.length;

      return (
        <section
          key={category.slug}
          aria-label={`${category.title}: ${category.items.length} updates`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: primary ? "14px 16px" : "0",
            borderLeft: primary ? `3px solid ${colors.accent}` : undefined,
            background: primary ? colors.selectedSubtle : "transparent",
            borderRadius: primary ? `0 ${radius.md} ${radius.md} 0` : undefined,
          }}
        >
          <span style={{ fontFamily: font.family, fontWeight: primary ? 500 : 400, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: primary ? colors.text : colors.textMuted }}>
            {category.title}
          </span>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {visibleItems.map((item, index) => (
              <li key={index} style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.text }}>
                {item}
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
              + {remaining} more {category.title.toLowerCase()} in release notes
            </span>
          )}
        </section>
      );
    })}
  </div>
);

export default ReleaseNotes;

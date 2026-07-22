import React from "react";
import { font } from "../theme/tokens";
import type { Release } from "../data/release-data";
import type { ColorTokens } from "../theme/tokens";

const eufemiaRepositoryUrl = "https://github.com/dnbexperience/eufemia";
const referencePattern = /(\(#\d+\)|\([a-f0-9]{7,}\))/gi;

const renderReleaseNoteItem = (item: string, colors: ColorTokens) => {
  const componentMatch = /^([^:]+):\s*/.exec(item);
  const text = componentMatch ? item.slice(componentMatch[0].length) : item;
  const content = text.split(referencePattern).map((part, index) => {
    const match = /^\((#\d+|[a-f0-9]{7,})\)$/i.exec(part);
    if (!match) return <React.Fragment key={index}>{part}</React.Fragment>;

    const reference = match[1];
    const href = reference.startsWith("#")
      ? `${eufemiaRepositoryUrl}/issues/${reference.slice(1)}`
      : `${eufemiaRepositoryUrl}/commit/${reference}`;

    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noreferrer"
        style={{ color: colors.accent, textDecoration: "underline", textUnderlineOffset: "3px" }}
      >
        {part}
      </a>
    );
  });

  return componentMatch ? (
    <>
      <strong style={{ fontWeight: 500 }}>{componentMatch[1]}</strong>: {content}
    </>
  ) : (
    <>{content}</>
  );
};

const ReleaseNotes: React.FC<{
  release: Release;
  colors: ColorTokens;
  compact?: boolean;
}> = ({ release, colors, compact = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {release.categories.map((category) => {
      const visibleItems = category.items.slice(0, compact ? 2 : undefined);
      const remaining = category.items.length - visibleItems.length;

      return (
        <section
          key={category.slug}
          aria-label={`${category.title}: ${category.items.length} updates`}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
            {category.title}
          </span>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {visibleItems.map((item, index) => (
              <li key={index} style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.text }}>
                {renderReleaseNoteItem(item, colors)}
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

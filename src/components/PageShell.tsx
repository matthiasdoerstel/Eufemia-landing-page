import React from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { font, layout } from "../theme/tokens";
import { useTheme } from "../context/ThemeContext";

// Standard docs/content page frame: a padded row holding a left content column
// (capped at layout.contentMax) and a right gutter of layout.railWidth. Pass a
// rail via `rail` to fill that gutter; otherwise it's reserved as empty space
// so every page — with or without an on-this-page rail — has an identical
// content column width. On mobile the gutter/rail collapses and padding shrinks.
const PageShell: React.FC<{
  children: React.ReactNode;
  rail?: React.ReactNode;
  contentStyle?: React.CSSProperties;
}> = ({ children, rail, contentStyle }) => {
  const isMobile = useIsMobile();
  const { colors } = useTheme();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: isMobile ? 0 : `${layout.railGap}px`,
        padding: isMobile ? layout.pagePaddingMobile : layout.pagePadding,
        fontFamily: font.family,
        color: colors.text,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: "1 1 0",
          minWidth: 0,
          maxWidth: `${layout.contentMax}px`,
          ...contentStyle,
        }}
      >
        {children}
      </div>
      {!isMobile && (rail ?? <div aria-hidden style={{ width: `${layout.railWidth}px`, flexShrink: 0 }} />)}
    </div>
  );
};

export default PageShell;

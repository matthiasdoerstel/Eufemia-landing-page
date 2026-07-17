import React from "react";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import type { ColorTokens } from "../theme/tokens";
import { Block, ComponentData } from "../data/sanity-component";

interface Props {
  first: ComponentData;
  second: ComponentData;
}

// Helper to build Sanity image URL
const buildImageUrl = (ref: string) => {
  const [, id, dimensions, format] = ref.split("-");
  return `https://cdn.sanity.io/images/sy4b7kpu/production/${id}-${dimensions}.${format}`;
};

// Render portable text blocks
const renderBlock = (block: Block, index: number, colors: ColorTokens) => {
  // Handle images
  if (block._type === "image" && block.asset?._ref) {
    const imageUrl = buildImageUrl(block.asset._ref);
    return (
      <div
        key={index}
        style={{
          margin: "24px 0",
          borderRadius: radius.md,
          overflow: "hidden",
          border: `1px solid ${colors.strokeSubtle}`,
        }}
      >
        <img
          src={imageUrl}
          alt=""
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </div>
    );
  }

  if (block._type !== "block") return null;

  const text = block.children?.map((child, i) => {
    if (child.marks?.includes("strong")) {
      return <strong key={i}>{child.text}</strong>;
    }
    if (child.marks?.includes("em")) {
      return <em key={i}>{child.text}</em>;
    }
    if (child.marks?.includes("code")) {
      return (
        <code
          key={i}
          style={{
            background: colors.surfaceAlt,
            padding: "2px 6px",
            borderRadius: radius.sm,
            fontSize: `${font.size.small}px`,
          }}
        >
          {child.text}
        </code>
      );
    }
    return child.text;
  });

  switch (block.style) {
    case "h2":
      return (
        <h2 key={index} style={{ fontFamily: font.family, fontSize: `${font.size.lead}px`, fontWeight: 500, marginTop: "32px", marginBottom: "16px", color: colors.text }}>
          {text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={index} style={{ fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, marginTop: "24px", marginBottom: "12px", color: colors.text }}>
          {text}
        </h3>
      );
    case "h4":
      return (
        <h4 key={index} style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, fontWeight: 500, marginTop: "16px", marginBottom: "8px", color: colors.text }}>
          {text}
        </h4>
      );
    default:
      return (
        <p key={index} style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: 1.6, color: colors.textMuted, marginBottom: "16px" }}>
          {text}
        </p>
      );
  }
};

const FigmaIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
    <path d="M4 12C4 9.792 5.792 8 8 8H12V16H8C5.792 16 4 14.208 4 12Z" fill="#A259FF" />
    <path d="M4 4C4 1.792 5.792 0 8 0H12V8H8C5.792 8 4 6.208 4 4Z" fill="#F24E1E" />
    <path d="M12 0H16C18.208 0 20 1.792 20 4C20 6.208 18.208 8 16 8H12V0Z" fill="#FF7262" />
    <path d="M20 12C20 14.208 18.208 16 16 16C13.792 16 12 14.208 12 12C12 9.792 13.792 8 16 8C18.208 8 20 9.792 20 12Z" fill="#1ABCFE" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9 23.126 9 22.81V20.576C5.662 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.545 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17 4.343 15.971 4.343 11.374C4.343 10.063 4.812 8.993 5.579 8.153C5.455 7.85 5.044 6.629 5.696 4.977C5.696 4.977 6.704 4.655 8.997 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 15.006 6.207C17.297 4.655 18.303 4.977 18.303 4.977C18.956 6.63 18.545 7.851 18.421 8.153C19.191 8.993 19.656 10.064 19.656 11.374C19.656 15.983 16.849 16.998 14.177 17.295C14.607 17.667 15 18.397 15 19.517V22.81C15 23.129 15.192 23.504 15.801 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z" />
  </svg>
);

const ResourceLink: React.FC<{ href: string; label: string; icon: React.ReactNode; colors: ColorTokens }> = ({ href, label, icon, colors }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "6px 12px",
      background: colors.surface,
      border: `1px solid ${colors.stroke}`,
      borderRadius: radius.md,
      fontFamily: font.family,
      fontSize: `${font.size.small}px`,
      fontWeight: 500,
      color: colors.text,
      textDecoration: "none",
      transition: "border-color 0.2s, color 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = colors.accent;
      e.currentTarget.style.color = colors.accent;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = colors.stroke;
      e.currentTarget.style.color = colors.text;
    }}
  >
    {icon}
    {label}
  </a>
);

// Shared section wrapper (heading + body) with a bottom divider.
const Section: React.FC<{ title: string; children: React.ReactNode; colors: ColorTokens; preWrap?: boolean }> = ({ title, children, colors, preWrap }) => (
  <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${colors.strokeSubtle}` }}>
    <h3 style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, fontWeight: 500, marginTop: 0, marginBottom: "12px", color: colors.text }}>
      {title}
    </h3>
    <p style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: 1.6, color: colors.textMuted, whiteSpace: preWrap ? "pre-wrap" : "normal", margin: 0 }}>
      {children}
    </p>
  </div>
);

const ComponentCard: React.FC<{ component: ComponentData; isDark: boolean; colors: ColorTokens }> = ({ component, isDark, colors }) => {
  const platformLabel = component.platform === "ios" ? "iOS" : "Android";

  return (
    <div style={{ padding: "0 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              background: colors.selectedSubtle,
              borderRadius: radius.sm,
              fontFamily: font.family,
              fontSize: `${font.size.small}px`,
              fontWeight: 500,
              color: colors.accent,
            }}
          >
            {platformLabel}
          </div>
          {component.status && (
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: colors.surfaceAlt,
                borderRadius: radius.sm,
                fontFamily: font.family,
                fontSize: `${font.size.small}px`,
                fontWeight: 500,
                color: colors.textMuted,
              }}
            >
              {component.status}
            </div>
          )}
        </div>
        <h2 style={{ fontFamily: font.family, fontSize: `${font.size.headingLg}px`, fontWeight: 500, color: colors.text, margin: "0 0 12px 0" }}>
          {component.name}
        </h2>
        {component.shortDescription && (
          <p style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: 1.6, color: colors.textMuted, margin: 0 }}>
            {component.shortDescription}
          </p>
        )}
      </div>

      {/* Preview Image */}
      {(component._rawPreviewImage?.light?.asset?.url || component._rawPreviewImage?.light?.asset?._ref ||
        component._rawPreviewImage?.dark?.asset?.url || component._rawPreviewImage?.dark?.asset?._ref) && (
        <div
          style={{
            marginBottom: "24px",
            borderRadius: radius.md,
            overflow: "hidden",
            border: `1px solid ${colors.strokeSubtle}`,
          }}
        >
          {isDark && component._rawPreviewImage?.dark?.asset && (
            <img
              src={component._rawPreviewImage.dark.asset.url || buildImageUrl(component._rawPreviewImage.dark.asset._ref || "")}
              alt={component.name}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
          {!isDark && component._rawPreviewImage?.light?.asset && (
            <img
              src={component._rawPreviewImage.light.asset.url || buildImageUrl(component._rawPreviewImage.light.asset._ref || "")}
              alt={component.name}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          )}
        </div>
      )}

      {/* Links */}
      {(component.figmaLink || component.githubLink) && (
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: `1px solid ${colors.strokeSubtle}`,
          }}
        >
          {component.figmaLink && (
            <ResourceLink href={component.figmaLink} label="Figma" icon={<FigmaIcon />} colors={colors} />
          )}
          {component.githubLink && (
            <ResourceLink href={component.githubLink} label="GitHub" icon={<GitHubIcon />} colors={colors} />
          )}
        </div>
      )}

      {/* Guidelines */}
      {component.guidelines && (
        <Section title="Guidelines" colors={colors}>{component.guidelines}</Section>
      )}

      {/* Usage */}
      {component.usage && (
        <Section title="Usage" colors={colors} preWrap>{component.usage}</Section>
      )}

      {/* Do's and Don'ts */}
      {component.dosAndDonts && (
        <Section title="Do's and Don'ts" colors={colors} preWrap>{component.dosAndDonts}</Section>
      )}

      {/* Accessibility */}
      {component.accessibilityInfo && (
        <Section title="Accessibility" colors={colors} preWrap>{component.accessibilityInfo}</Section>
      )}

      {/* Documentation */}
      {component._rawDocumentation && component._rawDocumentation.length > 0 && (
        <div>
          <h3 style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, fontWeight: 500, marginTop: 0, marginBottom: "12px", color: colors.text }}>
            Documentation
          </h3>
          {component._rawDocumentation.map((block, i) => renderBlock(block, i, colors))}
        </div>
      )}
    </div>
  );
};

const ComparisonView: React.FC<Props> = ({ first, second }) => {
  const { theme, colors } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        borderTop: `1px solid ${colors.strokeSubtle}`,
        paddingTop: "32px",
        position: "relative",
      }}
    >
      {/* Vertical divider line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: "1px",
          background: `linear-gradient(to bottom, transparent, ${colors.strokeSubtle}, transparent)`,
          transform: "translateX(-50%)",
        }}
      />

      <ComponentCard component={first} isDark={isDark} colors={colors} />
      <ComponentCard component={second} isDark={isDark} colors={colors} />
    </div>
  );
};

export default ComparisonView;

import React from "react";
import { useTheme } from "../context/ThemeContext";

interface Block {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{
    _key: string;
    _type: string;
    text?: string;
    marks?: string[];
  }>;
  asset?: {
    _ref?: string;
    url?: string;
  };
}

interface ComponentData {
  id: string;
  name: string;
  platform: string;
  shortDescription: string | null;
  _rawDocumentation: Block[] | null;
  _rawPreviewImage?: {
    light?: {
      asset?: {
        _ref?: string;
        url?: string;
      };
    };
    dark?: {
      asset?: {
        _ref?: string;
        url?: string;
      };
    };
  } | null;
  guidelines?: string;
  usage?: string;
  dosAndDonts?: string;
  accessibilityInfo?: string;
  figmaLink: string | null;
  githubLink: string | null;
  status?: string;
  slug: {
    current: string;
  };
}

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
const renderBlock = (block: Block, index: number, isDark: boolean) => {
  // Handle images
  if (block._type === "image" && block.asset?._ref) {
    const imageUrl = buildImageUrl(block.asset._ref);
    return (
      <div
        key={index}
        style={{
          margin: "24px 0",
          borderRadius: "8px",
          overflow: "hidden",
          border: `1px solid ${isDark ? "#333" : "#e8e8e8"}`,
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
            background: isDark ? "#222" : "#f5f5f5",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "14px",
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
        <h2 key={index} style={{ fontSize: "20px", fontWeight: 600, marginTop: "32px", marginBottom: "16px" }}>
          {text}
        </h2>
      );
    case "h3":
      return (
        <h3 key={index} style={{ fontSize: "18px", fontWeight: 600, marginTop: "24px", marginBottom: "12px" }}>
          {text}
        </h3>
      );
    case "h4":
      return (
        <h4 key={index} style={{ fontSize: "16px", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>
          {text}
        </h4>
      );
    default:
      return (
        <p key={index} style={{ fontSize: "15px", lineHeight: 1.6, color: isDark ? "#999" : "#555", marginBottom: "16px" }}>
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

const ComponentCard: React.FC<{ component: ComponentData; isDark: boolean }> = ({ component, isDark }) => {
  const platformLabel = component.platform === "ios" ? "iOS" : "Android";
  const platformBg = component.platform === "ios" ? "#e3f2fd" : "#e8f5e9";
  const platformColor = component.platform === "ios" ? "#1565c0" : "#2e7d32";

  return (
    <div style={{ padding: "0 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "4px 10px",
              background: platformBg,
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 500,
              color: platformColor,
            }}
          >
            {platformLabel}
          </div>
          {component.status && (
            <div
              style={{
                display: "inline-block",
                padding: "4px 10px",
                background: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: 500,
                color: "#666",
              }}
            >
              {component.status}
            </div>
          )}
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: isDark ? "#fff" : "#1c1c1e", margin: "0 0 12px 0" }}>
          {component.name}
        </h2>
        {component.shortDescription && (
          <p style={{ fontSize: "15px", lineHeight: 1.6, color: isDark ? "#999" : "#555", margin: 0 }}>
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
            borderRadius: "8px",
            overflow: "hidden",
            border: `1px solid ${isDark ? "#333" : "#e8e8e8"}`,
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
            borderBottom: `1px solid ${isDark ? "#333" : "#e8e8e8"}`,
          }}
        >
          {component.figmaLink && (
            <a
              href={component.figmaLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: isDark ? "#1c1c1e" : "#fff",
                border: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: isDark ? "#ddd" : "#333",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark ? "#a5e1d2" : "#007272";
                e.currentTarget.style.color = isDark ? "#a5e1d2" : "#007272";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.color = "#333";
              }}
            >
              <FigmaIcon />
              Figma
            </a>
          )}
          {component.githubLink && (
            <a
              href={component.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                background: isDark ? "#1c1c1e" : "#fff",
                border: `1px solid ${isDark ? "#333" : "#e0e0e0"}`,
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: isDark ? "#ddd" : "#333",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = isDark ? "#a5e1d2" : "#007272";
                e.currentTarget.style.color = isDark ? "#a5e1d2" : "#007272";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e0e0e0";
                e.currentTarget.style.color = "#333";
              }}
            >
              <GitHubIcon />
              GitHub
            </a>
          )}
        </div>
      )}

      {/* Guidelines */}
      {component.guidelines && (
        <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${isDark ? "#333" : "#e8e8e8"}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px", color: isDark ? "#fff" : "#1c1c1e" }}>
            Guidelines
          </h3>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: isDark ? "#999" : "#555", margin: 0 }}>
            {component.guidelines}
          </p>
        </div>
      )}

      {/* Usage */}
      {component.usage && (
        <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${isDark ? "#333" : "#e8e8e8"}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px", color: isDark ? "#fff" : "#1c1c1e" }}>
            Usage
          </h3>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: isDark ? "#999" : "#555", whiteSpace: "pre-wrap", margin: 0 }}>
            {component.usage}
          </p>
        </div>
      )}

      {/* Do's and Don'ts */}
      {component.dosAndDonts && (
        <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${isDark ? "#333" : "#e8e8e8"}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px", color: isDark ? "#fff" : "#1c1c1e" }}>
            Do's and Don'ts
          </h3>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: isDark ? "#999" : "#555", whiteSpace: "pre-wrap", margin: 0 }}>
            {component.dosAndDonts}
          </p>
        </div>
      )}

      {/* Accessibility */}
      {component.accessibilityInfo && (
        <div style={{ marginBottom: "24px", paddingBottom: "24px", borderBottom: `1px solid ${isDark ? "#333" : "#e8e8e8"}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px", color: isDark ? "#fff" : "#1c1c1e" }}>
            Accessibility
          </h3>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: isDark ? "#999" : "#555", whiteSpace: "pre-wrap", margin: 0 }}>
            {component.accessibilityInfo}
          </p>
        </div>
      )}

      {/* Documentation */}
      {component._rawDocumentation && component._rawDocumentation.length > 0 && (
        <div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, marginTop: 0, marginBottom: "12px", color: isDark ? "#fff" : "#1c1c1e" }}>
            Documentation
          </h3>
          {component._rawDocumentation.map((block, i) => renderBlock(block, i, isDark))}
        </div>
      )}
    </div>
  );
};

const ComparisonView: React.FC<Props> = ({ first, second }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "40px",
        borderTop: `1px solid ${isDark ? "#333" : "#e8e8e8"}`,
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
          background: "linear-gradient(to bottom, transparent, #d0e8e8, transparent)",
          transform: "translateX(-50%)",
        }}
      />

      <ComponentCard component={first} isDark={isDark} />
      <ComponentCard component={second} isDark={isDark} />
    </div>
  );
};

export default ComparisonView;

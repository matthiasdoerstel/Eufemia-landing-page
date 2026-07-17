import React, { useState } from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail, { RailItem } from "../components/InPageRail";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

interface BlockChild {
  _key: string;
  _type: string;
  text?: string;
  marks?: string[];
}

interface Block {
  _key: string;
  _type: string;
  style?: string;
  children?: BlockChild[];
  asset?: {
    _ref?: string;
    url?: string;
  };
}

interface ComponentData {
  id: string;
  name?: string;
  platform?: string;
  shortDescription?: string;
  figmaLink?: string;
  githubLink?: string;
  guidelines?: string | null;
  usage?: string | null;
  dosAndDonts?: string | null;
  accessibilityInfo?: string | null;
  _rawDocumentation?: Block[] | null;
  _rawPreviewImage?: {
    light?: { asset?: { _ref?: string; url?: string } };
    dark?: { asset?: { _ref?: string; url?: string } };
  } | null;
}

interface Props {
  data: {
    sanityComponent: ComponentData;
  };
}

const buildImageUrl = (ref: string) => {
  const [, id, dimensions, format] = ref.split("-");
  return `https://cdn.sanity.io/images/sy4b7kpu/production/${id}-${dimensions}.${format}`;
};

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M12 8.667v4C12 13.404 11.404 14 10.667 14H3.333A1.333 1.333 0 0 1 2 12.667V5.333C2 4.596 2.596 4 3.333 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 2h4v4M6.667 9.333 14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CompareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M2.5 5.5h8M8 2.5l3 3-3 3M13.5 10.5h-8M8 13.5l-3-3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FigmaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4Z" fill="#0ACF83" />
    <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4Z" fill="#A259FF" />
    <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4Z" fill="#F24E1E" />
    <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0Z" fill="#FF7262" />
    <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4Z" fill="#1ABCFE" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-4.18 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.72.23 3.89.11 4.18.74.84 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const renderBlock = (block: Block, colors: ReturnType<typeof useTheme>["colors"]) => {
  if (block._type === "image" && block.asset?._ref) {
    return (
      <div key={block._key} style={{ overflow: "hidden", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.lg }}>
        <img src={buildImageUrl(block.asset._ref)} alt="" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>
    );
  }

  if (block._type !== "block") return null;

  const text = block.children?.map((child) => {
    if (child.marks?.includes("strong")) return <strong key={child._key}>{child.text}</strong>;
    if (child.marks?.includes("em")) return <em key={child._key}>{child.text}</em>;
    if (child.marks?.includes("code")) {
      return (
        <code key={child._key} style={{ padding: "2px 6px", borderRadius: radius.sm, background: colors.surfaceAlt, color: colors.text, fontSize: "0.875em" }}>
          {child.text}
        </code>
      );
    }
    return child.text;
  });

  const headingSize = block.style === "h2" ? font.size.headingLg : block.style === "h3" ? font.size.bodyMedium : font.size.body;
  const headingLineHeight = block.style === "h2" ? font.lineHeight.headingLg : font.lineHeight.body;

  if (block.style === "h2" || block.style === "h3" || block.style === "h4") {
    const Tag = block.style;
    return (
      <Tag key={block._key} style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${headingSize}px`, lineHeight: `${headingLineHeight}px`, color: colors.text }}>
        {text}
      </Tag>
    );
  }

  return (
    <p key={block._key} style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
      {text}
    </p>
  );
};

const ComponentTemplate: React.FC<Props> = ({ data }) => {
  const component = data.sanityComponent;
  const { colors, theme } = useTheme();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const platform = component.platform === "android" || component.platform === "web" ? component.platform : "ios";
  const platformLabel = platform === "ios" ? "iOS" : platform === "android" ? "Android" : "Web";
  const platformPath = `/docs/${platform}`;
  const previewImage = theme === "dark"
    ? component._rawPreviewImage?.dark?.asset || component._rawPreviewImage?.light?.asset
    : component._rawPreviewImage?.light?.asset || component._rawPreviewImage?.dark?.asset;
  const previewLabel = previewImage === component._rawPreviewImage?.dark?.asset ? "Dark mode preview" : "Light mode preview";
  const hasPreview = Boolean(component._rawPreviewImage?.light?.asset || component._rawPreviewImage?.dark?.asset);
  const hasDocumentation = Boolean(component._rawDocumentation?.length);

  const sections: RailItem[] = [
    ...(hasPreview ? [{ id: "preview", label: "Preview" }] : []),
    { id: "resources", label: "Resources" },
    ...(component.guidelines ? [{ id: "guidelines", label: "Guidelines" }] : []),
    ...(component.usage ? [{ id: "usage", label: "Usage" }] : []),
    ...(component.dosAndDonts ? [{ id: "dos-and-donts", label: "Do’s and don’ts" }] : []),
    ...(component.accessibilityInfo ? [{ id: "accessibility", label: "Accessibility" }] : []),
    ...(hasDocumentation ? [{ id: "documentation", label: "Documentation" }] : []),
  ];

  const sectionStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingBottom: "40px",
    borderBottom: `1px solid ${colors.strokeSubtle}`,
    scrollMarginTop: "112px",
  };
  const headingStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.headingLg}px`,
    lineHeight: `${font.lineHeight.headingLg}px`,
    color: colors.text,
  };
  const bodyStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.textMuted,
  };

  const resourceAction = (key: string, icon: React.ReactNode, label: string, onClick?: () => void, href?: string) => {
    const content = <>{icon}<span>{label}</span>{href ? <ExternalLinkIcon /> : null}</>;
    const style: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      minHeight: "44px",
      padding: "10px 16px",
      border: `1px solid ${key === "compare" ? colors.strokeAction : colors.strokeSubtle}`,
      borderRadius: radius.md,
      background: hoveredAction === key ? (key === "compare" ? colors.selectedSubtle : colors.surfaceAlt) : colors.surface,
      color: key === "compare" ? colors.accent : colors.text,
      fontFamily: font.family,
      fontSize: `${font.size.small}px`,
      lineHeight: `${font.lineHeight.small}px`,
      fontWeight: 500,
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.15s ease, border-color 0.15s ease",
    };

    if (href) {
      return (
        <a key={key} href={href} target="_blank" rel="noreferrer" onMouseEnter={() => setHoveredAction(key)} onMouseLeave={() => setHoveredAction(null)} style={style}>
          {content}
        </a>
      );
    }

    return (
      <button key={key} type="button" onClick={onClick} onMouseEnter={() => setHoveredAction(key)} onMouseLeave={() => setHoveredAction(null)} style={style}>
        {content}
      </button>
    );
  };

  if (!component.name) {
    return (
      <Layout currentPlatform={platform} currentPath={`${platformPath}/components`}>
        <PageShell contentStyle={{ maxWidth: "880px" }}>
          <p style={bodyStyle}>Component not found.</p>
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout currentPlatform={platform} currentPath={`${platformPath}/components`}>
      <PageShell contentStyle={{ maxWidth: "880px", gap: "40px" }} rail={<InPageRail items={sections} />}>
        <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "8px", fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
          <Link to={platformPath} style={{ color: colors.accent, textDecoration: "none" }}>{platformLabel}</Link>
          <span aria-hidden>/</span>
          <Link to={platformPath} style={{ color: colors.textMuted, textDecoration: "none" }}>Components</Link>
          <span aria-hidden>/</span>
          <span style={{ color: colors.text }}>{component.name}</span>
        </nav>

        <header style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
          <span style={{ padding: "4px 10px", borderRadius: radius.sm, background: colors.selectedSubtle, color: colors.textSelected, fontFamily: font.family, fontSize: "14px", lineHeight: "20px", fontWeight: 500 }}>
            {platformLabel}
          </span>
          <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
            {component.name}
          </h1>
          {component.shortDescription ? <p style={{ ...bodyStyle, maxWidth: "680px" }}>{component.shortDescription}</p> : null}
        </header>

        {hasPreview && previewImage ? (
          <section id="preview" style={sectionStyle}>
            <h2 style={headingStyle}>Preview</h2>
            <div style={{ overflow: "hidden", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.lg, background: colors.surface }}>
              <img src={previewImage.url || buildImageUrl(previewImage._ref || "")} alt={`${component.name} ${previewLabel.toLowerCase()}`} style={{ display: "block", width: "100%", height: "auto" }} />
            </div>
          </section>
        ) : null}

        <section id="resources" style={sectionStyle}>
          <h2 style={headingStyle}>Resources</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {resourceAction("compare", <CompareIcon />, "Compare", () => window.dispatchEvent(new Event("openSearchCompare")))}
            {component.figmaLink ? resourceAction("figma", <FigmaIcon />, "Open in Figma", undefined, component.figmaLink) : null}
            {component.githubLink ? resourceAction("github", <GitHubIcon />, "View source", undefined, component.githubLink) : null}
          </div>
        </section>

        {component.guidelines ? (
          <section id="guidelines" style={sectionStyle}>
            <h2 style={headingStyle}>Guidelines</h2>
            <p style={{ ...bodyStyle, whiteSpace: "pre-wrap" }}>{component.guidelines}</p>
          </section>
        ) : null}

        {component.usage ? (
          <section id="usage" style={sectionStyle}>
            <h2 style={headingStyle}>Usage</h2>
            <p style={{ ...bodyStyle, whiteSpace: "pre-wrap" }}>{component.usage}</p>
          </section>
        ) : null}

        {component.dosAndDonts ? (
          <section id="dos-and-donts" style={sectionStyle}>
            <h2 style={headingStyle}>Do’s and don’ts</h2>
            <p style={{ ...bodyStyle, whiteSpace: "pre-wrap" }}>{component.dosAndDonts}</p>
          </section>
        ) : null}

        {component.accessibilityInfo ? (
          <section id="accessibility" style={sectionStyle}>
            <h2 style={headingStyle}>Accessibility</h2>
            <p style={{ ...bodyStyle, whiteSpace: "pre-wrap" }}>{component.accessibilityInfo}</p>
          </section>
        ) : null}

        {hasDocumentation ? (
          <section id="documentation" style={sectionStyle}>
            <h2 style={headingStyle}>Documentation</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {component._rawDocumentation?.map((block) => renderBlock(block, colors))}
            </div>
          </section>
        ) : null}

        <Link to={platformPath} style={{ display: "inline-flex", alignItems: "center", gap: "8px", width: "fit-content", fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.accent, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="m10 12-4-4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to {platformLabel} components
        </Link>
      </PageShell>
    </Layout>
  );
};

export default ComponentTemplate;

export const Head: React.FC<Props> = ({ data }) => <title>{data.sanityComponent.name || "Component"} | Eufemia Design System</title>;

export const query = graphql`
  query ComponentQuery($id: String!) {
    sanityComponent(id: { eq: $id }) {
      id
      name
      platform
      shortDescription
      figmaLink
      githubLink
      guidelines
      usage
      dosAndDonts
      accessibilityInfo
      _rawDocumentation
      _rawPreviewImage
    }
  }
`;

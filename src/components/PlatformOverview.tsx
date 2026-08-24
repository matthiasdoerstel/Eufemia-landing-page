import React, { useState } from "react";
import { Link, navigate } from "gatsby";
import { H1, H2, H3, P } from "@dnb/eufemia";
import EufemiaThemeScope from "./EufemiaThemeScope";
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import PageShell from "./PageShell";
import { useIsMobile } from "../hooks/useIsMobile";
import { CmsComponent } from "../data/sanity-component";
import buttonPreview from "../images/components/button-preview.svg";
import avatarGroupPreview from "../images/components/avatar-group-preview.svg";
import dropdownPreview from "../images/components/dropdown-preview.svg";
import cardPreview from "../images/components/card-preview.svg";
import dialogPreview from "../images/components/dialog-preview.svg";
import badgePreview from "../images/components/badge-preview.svg";
import componentPlaceholder from "../images/components/component-placeholder.svg";

export type PlatformKey = "web" | "ios" | "android";
export type WebComponentCategory =
  | "Basic UI"
  | "Form and Input"
  | "Navigation and Structure"
  | "Feedback and Communication"
  | "Other / Templates"
  | "Accessibility / Navigation";

export interface OverviewComponent {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
  category?: WebComponentCategory;
  href?: string;
  external?: boolean;
}

interface PlatformMeta {
  title: string;
  intro: string[];
  figmaUrl: string;
  githubUrl: string;
}

// Per-platform copy + resource links. Pages no longer pass these in — they only
// supply the platform key and the component list.
export const PLATFORM_META: Record<PlatformKey, PlatformMeta> = {
  web: {
    title: "Web Overview",
    intro: [
      "Components are the core of any design system, crafted to tackle specific UI challenges. Eufemia Web is a comprehensive set of accessible React components, allowing you to create consistent DNB experiences across the web.",
      "Just getting started? Take a look at the start designing and start developing guides.",
    ],
    figmaUrl: "https://www.figma.com/@dnb",
    githubUrl: "https://github.com/dnbexperience/eufemia",
  },
  ios: {
    title: "iOS Components",
    intro: [
      "Components are the core of any design system, crafted to tackle specific UI challenges. Eufemia Native iOS is a tailored set of components that blends with Apple's native elements, allowing you to create one-of-a-kind DNB experiences that feel right at home on the platform.",
      "Just getting started? Take a look at the start designing and start developing guides.",
    ],
    figmaUrl: "https://www.figma.com/@dnb",
    githubUrl: "https://github.com/dnbexperience/eufemia-native",
  },
  android: {
    title: "Android Components",
    intro: [
      "Components are the core of any design system, crafted to tackle specific UI challenges. Eufemia Native Android is a tailored set of components that blends with Material Design, allowing you to create one-of-a-kind DNB experiences that feel right at home on the platform.",
      "Just getting started? Take a look at the start designing and start developing guides.",
    ],
    figmaUrl: "https://www.figma.com/@dnb",
    githubUrl: "https://github.com/dnbexperience/eufemia-native",
  },
};

// Map raw Sanity component nodes to the overview card shape.
export const mapCmsComponents = (nodes: CmsComponent[] | null | undefined): OverviewComponent[] =>
  (nodes || []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.shortDescription,
    slug: c.slug?.current ?? null,
  }));

interface PlatformOverviewProps {
  platform: PlatformKey;
  components: OverviewComponent[];
}

const WEB_CATEGORY_ORDER: WebComponentCategory[] = [
  "Basic UI",
  "Form and Input",
  "Navigation and Structure",
  "Feedback and Communication",
  "Other / Templates",
  "Accessibility / Navigation",
];

const WEB_CATEGORY_COPY: Record<WebComponentCategory, string> = {
  "Basic UI": "Core components used throughout interfaces.",
  "Form and Input": "Components for collecting, selecting, and formatting information.",
  "Navigation and Structure": "Components for moving through and organizing content.",
  "Feedback and Communication": "Components for status, guidance, and focused messages.",
  "Other / Templates": "Supporting components and technical building blocks.",
  "Accessibility / Navigation": "Components that improve accessibility and keyboard navigation.",
};

const componentPreviews: Partial<Record<string, string>> = {
  avatar: avatarGroupPreview,
  button: buttonPreview,
  dropdown: dropdownPreview,
  card: cardPreview,
  dialog: dialogPreview,
  badge: badgePreview,
};

const categoryId = (category: WebComponentCategory) =>
  `category-${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;

const LaunchIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, color }}>
    <path d="M14 5h5v5M19 5l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FigmaLogo = () => (
  <svg width="32" height="48" viewBox="0 0 32 48" fill="none" style={{ flexShrink: 0 }}>
    <path d="M8 48a8 8 0 0 0 8-8v-8H8a8 8 0 1 0 0 16Z" fill="#0ACF83" />
    <path d="M0 24a8 8 0 0 1 8-8h8v16H8a8 8 0 0 1-8-8Z" fill="#A259FF" />
    <path d="M0 8a8 8 0 0 1 8-8h8v16H8a8 8 0 0 1-8-8Z" fill="#F24E1E" />
    <path d="M16 0h8a8 8 0 1 1 0 16h-8V0Z" fill="#FF7262" />
    <path d="M32 24a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" fill="#1ABCFE" />
  </svg>
);

const GithubLogo = ({ color }: { color: string }) => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color }}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const PlatformOverview: React.FC<PlatformOverviewProps> = ({ platform, components }) => {
  const { colors } = useTheme();
  const isMobile = useIsMobile();
  const [hover, setHover] = useState<string | null>(null);
  const { title, intro, figmaUrl, githubUrl } = PLATFORM_META[platform];
  const compactWebOverview = platform === "web" && components.length > 6;
  const previewHeight = compactWebOverview && isMobile ? "120px" : compactWebOverview ? "124px" : "160px";
  const cardGap = compactWebOverview ? "12px" : "16px";

  const divider = (
    <div style={{ height: "1px", width: "100%", background: colors.strokeSubtle }} />
  );

  const resourceCard = (key: string, logo: React.ReactNode, name: string, sub: string, href: string) => (
    <a
      key={key}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(key)}
      onMouseLeave={() => setHover(null)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        width: "368px",
        maxWidth: "100%",
        minHeight: "90px",
        boxSizing: "border-box",
        padding: "16px 24px",
        borderRadius: `${radius.xl}`,
        border: `1px solid ${colors.strokeSubtle}`,
        background: hover === key ? colors.surfaceAlt : colors.surface,
        textDecoration: "none",
        transition: "background 0.15s ease",
      }}
    >
      {logo}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>{name}</span>
        <span style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>{sub}</span>
      </div>
      <LaunchIcon color={colors.accent} />
    </a>
  );

  const renderComponentCard = (component: OverviewComponent) => {
    const to = component.href ?? `/docs/${platform}/components/${component.slug}`;
    const isInteractive = platform === "web" && Boolean(component.href);
    const preview = componentPreviews[component.slug ?? ""] ?? componentPlaceholder;
    const componentName = platform === "web" ? (
      <H3
        id={component.slug ? `component-${component.slug}-title` : undefined}
        style={{ margin: 0, color: colors.text }}
      >
        {component.name}
      </H3>
    ) : (
      <H2 style={{ margin: 0, color: colors.text }}>
        {component.name}
      </H2>
    );
    const cardContent = (
      <>
        <div
          style={{
            height: previewHeight,
            width: "100%",
            overflow: "hidden",
            borderRadius: `${radius.xl}`,
            background: colors.surfaceAlt,
            transform: hover === component.id ? "translateY(-2px)" : "none",
            boxShadow: hover === component.id ? "0 8px 16px rgba(0,0,0,0.12)" : "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
        >
          {platform === "web" && (
            <img
              src={preview}
              alt=""
              aria-hidden
              style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>
        {componentName}
        <P size="small" style={{ margin: 0, color: colors.textMuted }}>
          {component.description || "No description available."}
        </P>
      </>
    );

    if (platform === "web" && isInteractive) {
      return (
        <article
          key={component.id}
          id={component.slug ? `component-${component.slug}` : undefined}
          role="link"
          tabIndex={0}
          aria-labelledby={component.slug ? `component-${component.slug}-title` : undefined}
          onClick={() => navigate(to)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              navigate(to);
            }
          }}
          onMouseEnter={() => setHover(component.id)}
          onMouseLeave={() => setHover(null)}
          onFocus={() => setHover(component.id)}
          onBlur={() => setHover(null)}
          style={{ display: "flex", cursor: "pointer", flexDirection: "column", gap: cardGap, width: "100%", maxWidth: "240px", minWidth: 0, outlineOffset: "4px" }}
        >
          {cardContent}
        </article>
      );
    }

    if (platform === "web") {
      return (
        <article
          key={component.id}
          id={component.slug ? `component-${component.slug}` : undefined}
          aria-labelledby={component.slug ? `component-${component.slug}-title` : undefined}
          style={{ display: "flex", flexDirection: "column", gap: cardGap, width: "100%", maxWidth: "240px", minWidth: 0 }}
        >
          {cardContent}
        </article>
      );
    }

    return (
      <Link
        key={component.id}
        to={to}
        onMouseEnter={() => setHover(component.id)}
        onMouseLeave={() => setHover(null)}
        style={{ display: "flex", flexDirection: "column", gap: cardGap, width: "240px", textDecoration: "none" }}
      >
        {cardContent}
      </Link>
    );
  };

  return (
    <Layout currentPlatform={platform} currentPath={`/docs/${platform}`}>
      <PageShell contentStyle={{ gap: "32px" }}>
        <EufemiaThemeScope>
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {/* Title + intro */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <H1 style={{ margin: 0, color: colors.text }}>
              {title}
            </H1>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {intro.map((paragraph, index) => (
                <P key={index} style={{ margin: 0, color: colors.text }}>
                  {paragraph}
                </P>
              ))}
            </div>
          </div>

          {divider}

          {/* Resources */}
          <H2 style={{ margin: 0, color: colors.text }}>
            Resources
          </H2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {resourceCard("figma", <FigmaLogo />, "Figma", "Component for designers", figmaUrl)}
            {resourceCard("github", <GithubLogo color={colors.text} />, "Github", "Component for developers", githubUrl)}
          </div>

          {divider}

          {/* Component grid */}
          {components.length === 0 ? (
            <P style={{ margin: 0, color: colors.textMuted }}>
              No components yet. Add components in Sanity Studio to see them here.
            </P>
          ) : platform === "web" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: compactWebOverview ? "32px" : "36px" }}>
              {WEB_CATEGORY_ORDER.map((category) => {
                const categoryComponents = components.filter((component) => component.category === category);
                if (categoryComponents.length === 0) return null;

                return (
                  <section key={category} aria-labelledby={categoryId(category)} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <H2
                        id={categoryId(category)}
                        size={compactWebOverview ? "large" : "x-large"}
                        style={{ margin: 0, color: colors.text }}
                      >
                        {category}
                      </H2>
                      <P size="small" style={{ margin: 0, maxWidth: "680px", color: colors.textMuted }}>
                        {WEB_CATEGORY_COPY[category]}
                      </P>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))", gap: compactWebOverview ? "20px 12px" : "24px 18px" }}>
                      {categoryComponents.map((component) => renderComponentCard(component))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: "32px 18px" }}>
              {components.map((component) => renderComponentCard(component))}
            </div>
          )}
          </div>
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default PlatformOverview;

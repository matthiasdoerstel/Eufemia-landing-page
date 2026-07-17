import React, { useState } from "react";
import { Link } from "gatsby";
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import PageShell from "./PageShell";

export type PlatformKey = "web" | "ios" | "android";

export interface OverviewComponent {
  id: string;
  name: string;
  description: string | null;
  slug: string | null;
}

interface PlatformOverviewProps {
  platform: PlatformKey;
  title: string;
  intro: string[];
  figmaUrl: string;
  githubUrl: string;
  components: OverviewComponent[];
}

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

const PlatformOverview: React.FC<PlatformOverviewProps> = ({ platform, title, intro, figmaUrl, githubUrl, components }) => {
  const { colors } = useTheme();
  const [hover, setHover] = useState<string | null>(null);

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

  return (
    <Layout currentPlatform={platform} currentPath={`/docs/${platform}`}>
      <PageShell contentStyle={{ gap: "32px" }}>
          {/* Title + intro */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
              {title}
            </h1>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {intro.map((p, i) => (
                <p key={i} style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          {divider}

          {/* Resources */}
          <h2 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>
            Resources
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {resourceCard("figma", <FigmaLogo />, "Figma", "Component for designers", figmaUrl)}
            {resourceCard("github", <GithubLogo color={colors.text} />, "Github", "Component for developers", githubUrl)}
          </div>

          {divider}

          {/* Component grid */}
          {components.length === 0 ? (
            <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
              No components yet. Add components in Sanity Studio to see them here.
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 240px)", gap: "32px 18px" }}>
              {components.map((c) => {
                const to = c.slug ? `/docs/${platform}/components/${c.slug}` : "#";
                return (
                  <Link
                    key={c.id}
                    to={to}
                    onMouseEnter={() => setHover(c.id)}
                    onMouseLeave={() => setHover(null)}
                    style={{ display: "flex", flexDirection: "column", gap: "16px", width: "240px", textDecoration: "none" }}
                  >
                    <div
                      style={{
                        height: "160px",
                        width: "240px",
                        borderRadius: `${radius.xl}`,
                        background: colors.surfaceAlt,
                        transform: hover === c.id ? "translateY(-2px)" : "none",
                        boxShadow: hover === c.id ? "0 8px 16px rgba(0,0,0,0.12)" : "none",
                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      }}
                    />
                    <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>
                      {c.name}
                    </span>
                    <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
                      {c.description || "No description available."}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
      </PageShell>
    </Layout>
  );
};

export default PlatformOverview;

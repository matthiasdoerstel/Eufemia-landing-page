import React from "react";
import { Link } from "gatsby";
import Layout from "../../components/Layout";
import { useTheme } from "../../context/ThemeContext";
import { font, radius } from "../../theme/tokens";
import PageShell from "../../components/PageShell";

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color }}>
    <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FigmaLogo = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
    <path d="M10.667 32C13.612 32 16 29.612 16 26.667V21.333H10.667C7.721 21.333 5.333 23.721 5.333 26.667C5.333 29.612 7.721 32 10.667 32Z" fill="#0ACF83" />
    <path d="M5.333 16C5.333 13.055 7.721 10.667 10.667 10.667H16V21.333H10.667C7.721 21.333 5.333 18.945 5.333 16Z" fill="#A259FF" />
    <path d="M5.333 5.333C5.333 2.388 7.721 0 10.667 0H16V10.667H10.667C7.721 10.667 5.333 8.279 5.333 5.333Z" fill="#F24E1E" />
    <path d="M16 0H21.333C24.279 0 26.667 2.388 26.667 5.333C26.667 8.279 24.279 10.667 21.333 10.667H16V0Z" fill="#FF7262" />
    <path d="M26.667 16C26.667 18.945 24.279 21.333 21.333 21.333C18.388 21.333 16 18.945 16 16C16 13.055 18.388 10.667 21.333 10.667C24.279 10.667 26.667 13.055 26.667 16Z" fill="#1ABCFE" />
  </svg>
);

const figmaLibraries = [
  { name: "Eufemia Core", description: "Foundation components, colors, typography, and spacing", link: "https://figma.com" },
  { name: "Eufemia Web", description: "Complete web component library with all variants", link: "https://figma.com" },
  { name: "Eufemia Icons", description: "Full icon set with multiple sizes and styles", link: "https://figma.com" },
  { name: "Eufemia Mobile", description: "iOS and Android specific components and patterns", link: "https://figma.com" },
];

const setupSteps = [
  "Sign in to Figma with your DNB account",
  "Navigate to the team libraries section",
  "Enable the Eufemia libraries you need",
  "Start using components in your designs",
];

const bestPractices = [
  { title: "Use components, don't detach", description: "Always use library components instead of detaching them. This ensures you receive updates automatically." },
  { title: "Follow the naming conventions", description: "Use consistent naming for layers and frames. This helps with developer handoff and file organization." },
  { title: "Leverage auto-layout", description: "Build your designs with auto-layout to ensure they're responsive and match component behavior." },
  { title: "Document your work", description: "Add notes and annotations to explain design decisions and interactive states." },
];

const DesignPage: React.FC = () => {
  const { colors } = useTheme();
  const [hovered, setHovered] = React.useState<string | null>(null);

  const h2 = { margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text } as React.CSSProperties;
  const para = { margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted } as React.CSSProperties;
  const divider = <div style={{ height: "1px", width: "100%", background: colors.strokeSubtle }} />;

  return (
    <Layout currentPath="/docs/design">
      <PageShell contentStyle={{ gap: "32px" }}>
          {/* Hero */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
              Start designing
            </h1>
            <p style={{ ...para, maxWidth: "640px" }}>
              Get set up with Eufemia's Figma libraries and learn how to use our design system effectively. We provide everything you need to create consistent, beautiful designs.
            </p>
          </div>

          {/* Figma setup */}
          <div style={{ padding: "32px", background: colors.surface, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.xl}px`, display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FigmaLogo />
              <h2 style={h2}>Figma setup</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {setupSteps.map((step, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "24px", height: "24px", flexShrink: 0, borderRadius: "50%", background: colors.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.family, fontSize: "12px", fontWeight: 600, color: colors.text }}>
                    {index + 1}
                  </div>
                  <span style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {divider}

          {/* Figma libraries */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={h2}>Figma libraries</h2>
            <p style={para}>Enable these libraries in Figma to access all Eufemia components and styles.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {figmaLibraries.map((library) => (
                <a
                  key={library.name}
                  href={library.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHovered(library.name)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ display: "block", padding: "20px", background: colors.surface, border: `1px solid ${hovered === library.name ? colors.accent : colors.strokeSubtle}`, borderRadius: `${radius.lg}px`, textDecoration: "none", transition: "border-color 0.15s ease" }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                    <h3 style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{library.name}</h3>
                    <span style={{ color: colors.textMuted }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                  <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>{library.description}</p>
                </a>
              ))}
            </div>
          </div>

          {divider}

          {/* Best practices */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h2 style={h2}>Best practices</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {bestPractices.map((practice) => (
                <div key={practice.title} style={{ display: "flex", gap: "16px", padding: "20px", background: colors.surfaceAlt, borderRadius: `${radius.lg}px` }}>
                  <div style={{ flexShrink: 0, marginTop: "3px" }}><CheckIcon color={colors.accent} /></div>
                  <div>
                    <h3 style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{practice.title}</h3>
                    <p style={{ margin: "4px 0 0 0", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>{practice.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {divider}

          {/* Next steps CTA */}
          <div style={{ padding: "32px", background: colors.selectedSubtle, borderRadius: `${radius.xl}px`, display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
            <h3 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.textSelected }}>
              Ready to explore components?
            </h3>
            <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textSelected }}>
              Now that you're set up, explore our component library and start designing.
            </p>
            <Link to="/docs/web" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 24px", background: colors.surface, borderRadius: `${radius.xl}px`, border: `1px solid ${colors.accent}`, color: colors.accent, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
              Browse components
              <ArrowIcon />
            </Link>
          </div>
      </PageShell>
    </Layout>
  );
};

export default DesignPage;

export const Head = () => <title>Start Designing | Eufemia Design System</title>;

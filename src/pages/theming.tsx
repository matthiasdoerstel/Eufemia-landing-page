import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

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

const points = [
  {
    title: "Eufemia handles theming for you",
    description:
      "Colors, typography and spacing come from the design system. Build with Eufemia components and they automatically pick up the right values for the active brand and theme — you don't wire up colors by hand.",
  },
  {
    title: "Brand colors are translated for digital",
    description:
      "The colors defined in Brand Center are translated into a digital palette. That translation can shift a color slightly from its Brand Center reference — this is expected and intentional, not a mistake.",
  },
  {
    title: "Accessibility drives the adjustments",
    description:
      "Small changes exist so our brand works in real interfaces: sufficient contrast between text and background, legibility at small sizes, and consistent behaviour across light and dark themes. The goal is a brand that is both recognisable and accessible on screen.",
  },
];

const ThemingPage: React.FC = () => {
  const { colors } = useTheme();

  const h1: React.CSSProperties = { margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text };
  const h2: React.CSSProperties = { margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text };
  const para: React.CSSProperties = { margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted, maxWidth: "720px" };
  const divider = <div style={{ height: "1px", width: "100%", background: colors.strokeSubtle }} />;

  return (
    <Layout currentPlatform="web" currentPath="/theming">
      <PageShell contentStyle={{ gap: "32px" }}>
        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={h1}>Theming</h1>
          <p style={para}>
            Eufemia takes care of theming across brands and themes. This page explains how brand colors become the digital
            palette — and why the digital colors may differ slightly from Brand Center.
          </p>
        </div>

        {/* Key points */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {points.map((p) => (
            <div key={p.title} style={{ display: "flex", gap: "16px", padding: "20px", background: colors.surfaceAlt, borderRadius: `${radius.lg}px` }}>
              <div style={{ flexShrink: 0, marginTop: "3px" }}><CheckIcon color={colors.accent} /></div>
              <div>
                <h3 style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{p.title}</h3>
                <p style={{ margin: "4px 0 0 0", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        {divider}

        {/* Callout: expected and fine */}
        <div style={{ padding: "28px 32px", background: colors.selectedSubtle, borderRadius: `${radius.xl}px`, display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2 style={{ ...h2, color: colors.textSelected }}>Slight color differences are expected</h2>
          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textSelected, maxWidth: "720px" }}>
            If a color on screen doesn't exactly match its Brand Center value, that's fine. Eufemia translates our brand
            colors into digital solutions so they stay accessible and consistent in real products. The brand is preserved —
            it's just tuned for the screen.
          </p>
        </div>

        {divider}

        {/* Where the values live */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={h2}>Where the values come from</h2>
          <p style={para}>
            The resolved colors are exposed as design tokens. Browse the full catalog to see the actual values per brand and
            theme, and read the Eufemia docs for how theming works under the hood.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            <Link
              to="/docs/web/design-tokens"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: colors.surface, borderRadius: `${radius.xl}px`, border: `1px solid ${colors.accent}`, color: colors.accent, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}
            >
              Browse design tokens
              <ArrowIcon />
            </Link>
            <a
              href="https://eufemia.dnb.no/uilib/usage/customisation/theming/"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: "transparent", borderRadius: `${radius.xl}px`, border: `1px solid ${colors.strokeSubtle}`, color: colors.text, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}
            >
              Theming docs
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </PageShell>
    </Layout>
  );
};

export default ThemingPage;

export const Head = () => <title>Theming | Eufemia Design System</title>;

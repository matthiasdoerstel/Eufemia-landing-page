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

// Theme-aware hero graphic: a small fan of theme "cards" (the brands/themes
// Eufemia manages), with the front card showing the brand accent translated into
// tokens and an accessible "Aa" sample. Uses live theme tokens, so it adapts to
// light/dark and the brand accent. Animates in with a staggered fan-out and a
// gentle float; respects prefers-reduced-motion.
const ThemingHeroGraphic: React.FC = () => {
  const { colors } = useTheme();
  const [playKey, setPlayKey] = React.useState(0);
  return (
    <svg
      width="100%"
      viewBox="0 0 360 260"
      fill="none"
      role="img"
      aria-label="Themes and brands translated into an accessible palette"
      onClick={() => setPlayKey((k) => k + 1)}
      style={{ maxWidth: "360px", cursor: "pointer" }}
    >
      <title>Replay animation</title>
      <style>{`
        .thm-card { transform-box: fill-box; transform-origin: center; opacity: 0;
          animation: thm-in 0.65s cubic-bezier(.2,.7,.2,1) forwards; }
        .thm-c1 { --rot: -10deg; animation-delay: .05s; }
        .thm-c2 { --rot: -4deg;  animation-delay: .16s; }
        .thm-c3 { --rot: 4deg;   animation-delay: .28s; }
        @keyframes thm-in {
          from { opacity: 0; transform: translateY(20px) scale(.94) rotate(0deg); }
          to   { opacity: 1; transform: translateY(0) scale(1) rotate(var(--rot)); }
        }
        .thm-float { transform-box: fill-box; transform-origin: center;
          animation: thm-float 6s ease-in-out infinite; animation-delay: 1s; }
        @keyframes thm-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .thm-badge { transform-box: fill-box; transform-origin: center; opacity: 0;
          animation: thm-pop .4s cubic-bezier(.2,.9,.3,1.4) forwards; animation-delay: .95s; }
        @keyframes thm-pop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @media (prefers-reduced-motion: reduce) {
          .thm-card { opacity: 1; animation: none; transform: rotate(var(--rot)); }
          .thm-float, .thm-badge { animation: none; opacity: 1; }
        }
      `}</style>

      <g className="thm-float" key={playKey}>
        {/* Back cards — the other brands/themes in the stack */}
        <g className="thm-card thm-c1">
          <rect x="108" y="46" width="150" height="168" rx="16" fill={colors.surfaceAlt} stroke={colors.strokeSubtle} strokeWidth="1.5" />
        </g>
        <g className="thm-card thm-c2">
          <rect x="108" y="46" width="150" height="168" rx="16" fill={colors.selectedSubtle} />
        </g>

        {/* Front card */}
        <g className="thm-card thm-c3">
          <rect x="108" y="46" width="150" height="168" rx="16" fill={colors.surface} stroke={colors.strokeSubtle} strokeWidth="1.5" />
          {/* brand accent dot */}
          <circle cx="132" cy="76" r="12" fill={colors.accent} />
          {/* token lines */}
          <rect x="152" y="70" width="78" height="10" rx="5" fill={colors.strokeSubtle} />
          <rect x="124" y="102" width="110" height="9" rx="4.5" fill={colors.strokeSubtle} />
          <rect x="124" y="120" width="72" height="9" rx="4.5" fill={colors.strokeSubtle} />
          {/* accessible contrast sample */}
          <rect x="124" y="150" width="110" height="46" rx="10" fill={colors.accent} />
          <text x="140" y="181" fontFamily="DNB, sans-serif" fontWeight="500" fontSize="24" fill={colors.pageBg}>Aa</text>
          <g className="thm-badge">
            <circle cx="212" cy="173" r="12" fill={colors.surface} stroke={colors.strokeSubtle} strokeWidth="1" />
            <path d="M206.5 173.5L210.5 177.5L218 169.5" stroke={colors.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </g>
    </svg>
  );
};

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
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: "1 1 340px", minWidth: "min(100%, 340px)" }}>
            <h1 style={h1}>Theming</h1>
            <p style={para}>
              Eufemia takes care of theming across brands and themes. This page explains how brand colors become the digital
              palette — and why the digital colors may differ slightly from Brand Center.
            </p>
          </div>
          <div style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}>
            <ThemingHeroGraphic />
          </div>
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

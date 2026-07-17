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
const HERO_SVG = `<svg viewBox="0 0 1055 584" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Eufemia brand gradient" style="display:block;height:auto">
<g clip-path="url(#clip0_5369_3153)">
<rect width="1055" height="584" transform="translate(1055 584) rotate(180)" fill="white"/>
<g filter="url(#filter1_f_5369_3153)">
<ellipse cx="641.329" cy="-16.7907" rx="861.328" ry="358.209" transform="rotate(180 641.329 -16.7907)" fill="#BCE5AC"/>
</g>
<g filter="url(#filter2_f_5369_3153)">
<ellipse cx="643.484" cy="50.1957" rx="479.484" ry="173.196" transform="rotate(180 643.484 50.1957)" fill="#0D4637"/>
</g>
<g filter="url(#filter3_f_5369_3153)" style="mix-blend-mode:plus-lighter">
<ellipse cx="982.822" cy="28.8046" rx="861.328" ry="173.196" transform="rotate(180 982.822 28.8046)" fill="white"/>
</g>
<g clip-path="url(#clip1_5369_3153)">
<rect width="3840" height="2160" transform="translate(-1393 -788)" fill="white"/>
<g filter="url(#filter5_f_5369_3153)">
<path d="M3691.5 -257.388C3691.5 -10.2403 1584.86 1519.61 736 1519.61C-112.862 1519.61 -3928 2309.76 -3928 2062.61C-3928 1815.47 -1546.5 193.112 736 624.612C2667.5 884.111 3691.5 -504.535 3691.5 -257.388Z" fill="url(#paint0_linear_5369_3153)"/>
</g>
<g filter="url(#filter6_f_5369_3153)" style="mix-blend-mode:overlay">
<path d="M196.94 325.3L-766.5 677L-1062.26 755.028C-1260.37 807.291 -1361.26 1027.61 -1271.42 1211.74C-1167.88 1423.94 -879.747 1458.38 -729.119 1276.54L-685.649 1224.07C-615.563 1139.47 -511.415 1090.5 -401.551 1090.5H-140.95C-8.14924 1090.5 107.617 1180.86 139.862 1309.69C169.862 1429.54 272.629 1517.15 395.723 1527.8L953.649 1576.07C1244.5 1601.23 1503.92 1393.74 1543.29 1104.47C1572.07 892.941 1475.27 683.976 1295.31 569.148L1061.33 419.859C803.65 255.443 484.073 220.484 196.94 325.3Z" fill="#390014"/>
</g>
<g filter="url(#filter7_f_5369_3153)" style="mix-blend-mode:overlay">
<ellipse cx="1979" cy="718" rx="1219" ry="259" fill="#031117"/>
</g>
</g>
<g clip-path="url(#clip2_5369_3153)">
<rect width="1155.56" height="650" transform="translate(-29.9999 -49.9999)" fill="#031117"/>
<g filter="url(#filter9_f_5369_3153)">
<ellipse cx="547.777" cy="492.118" rx="668.958" ry="278.206" fill="#031117"/>
</g>
<g filter="url(#filter10_f_5369_3153)">
<ellipse cx="479.468" cy="409.514" rx="646.088" ry="134.514" fill="#390014"/>
</g>
<g filter="url(#filter11_f_5369_3153)" style="mix-blend-mode:overlay">
<path d="M1223.36 262.963C1223.36 337.253 923.853 397.477 554.398 397.477C184.942 397.477 -114.56 337.253 -114.56 262.963C-114.56 188.673 184.942 128.449 554.398 128.449C923.853 128.449 1223.36 188.673 1223.36 262.963Z" fill="white"/>
</g>
</g>
</g>
<defs>
<filter id="filter1_f_5369_3153" x="-422.72" y="-577.72" width="2128.1" height="1121.86" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="101.36" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter2_f_5369_3153" x="-38.7202" y="-325.72" width="1364.41" height="751.832" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="101.36" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter3_f_5369_3153" x="-81.227" y="-347.111" width="2128.1" height="751.832" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="101.36" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter5_f_5369_3153" x="-4275.2" y="-634.2" width="8313.9" height="3091.89" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="173.6" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter6_f_5369_3153" x="-1651.7" y="-81.4059" width="3547.2" height="2006.74" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="173.6" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter7_f_5369_3153" x="412.8" y="111.8" width="3132.4" height="1212.4" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="173.6" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter9_f_5369_3153" x="-278.626" y="56.4678" width="1652.81" height="871.301" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="78.7222" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter10_f_5369_3153" x="-324.064" y="117.556" width="1607.06" height="583.917" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="78.7222" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<filter id="filter11_f_5369_3153" x="-272.005" y="-28.9953" width="1652.81" height="583.916" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="78.7222" result="effect1_foregroundBlur_5369_3153"/>
</filter>
<linearGradient id="paint0_linear_5369_3153" x1="-3928" y1="911.745" x2="3691.5" y2="911.745" gradientUnits="userSpaceOnUse">
<stop stop-color="#031117"/>
<stop offset="1" stop-color="#390014"/>
</linearGradient>
<clipPath id="clip0_5369_3153">
<rect width="1055" height="584" fill="white" transform="translate(1055 584) rotate(180)"/>
</clipPath>
<clipPath id="clip1_5369_3153">
<rect width="3840" height="2160" fill="white" transform="translate(-1393 -788)"/>
</clipPath>
<clipPath id="clip2_5369_3153">
<rect width="1155.56" height="650" fill="white" transform="translate(-29.9999 -49.9999)"/>
</clipPath>
</defs>
</svg>`;

const ThemingHeroGraphic: React.FC = () => (
  <div
    style={{ width: "100%", maxWidth: "560px", borderRadius: radius.lg, overflow: "hidden", lineHeight: 0 }}
    dangerouslySetInnerHTML={{ __html: HERO_SVG }}
  />
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
            <div key={p.title} style={{ display: "flex", gap: "16px", padding: "20px", background: colors.surfaceAlt, borderRadius: `${radius.lg}` }}>
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
        <div style={{ padding: "28px 32px", background: colors.selectedSubtle, borderRadius: `${radius.xl}`, display: "flex", flexDirection: "column", gap: "10px" }}>
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
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: colors.surface, borderRadius: `${radius.xl}`, border: `1px solid ${colors.accent}`, color: colors.accent, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}
            >
              Browse design tokens
              <ArrowIcon />
            </Link>
            <a
              href="https://eufemia.dnb.no/uilib/usage/customisation/theming/"
              target="_blank"
              rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "8px 20px", background: "transparent", borderRadius: `${radius.xl}`, border: `1px solid ${colors.strokeSubtle}`, color: colors.text, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}
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

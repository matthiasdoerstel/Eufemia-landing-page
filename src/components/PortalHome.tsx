import React, { useState } from "react";
import { Link } from "gatsby";
import Layout from "./Layout";
import { useTheme } from "../context/ThemeContext";
import { radius, font } from "../theme/tokens";

// Hero backdrop artwork (deep teal → maroon glow), matching the frontpage cards.
const HERO_SVG = `<svg viewBox="0 0 1055 584" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" preserveAspectRatio="xMidYMid slice" style="display:block;height:auto">
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

// Staggered "fade-in-up" that mirrors the Figma card motion. It stays static
// (fully visible) until the card is hovered, then plays once.
const cardMotionCSS = `
@keyframes pieceIn {
  0%   { opacity: 0; transform: translateY(14px); }
  60%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 1; transform: translateY(0); }
}
.pc { opacity: 1; }
.pieces--play .pc {
  animation-name: pieceIn;
  animation-duration: 0.9s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}
@media (prefers-reduced-motion: reduce) { .pieces--play .pc { animation: none; opacity: 1; } }
`;

const ArrowRight = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color }}>
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Piece = an SVG group that fades/rises on a staggered delay.
const Piece: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => (
  <g className="pc" style={{ animationDelay: `${delay}s` }}>
    {children}
  </g>
);

const DesignGraphic = ({ playing, stroke }: { playing: boolean; stroke: string }) => (
  <svg className={playing ? "pieces--play" : ""} width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden style={{ color: stroke }}>
    <Piece delay={0}>
      <circle cx="30" cy="52" r="18" fill="currentColor" fillOpacity="0.25" />
    </Piece>
    <Piece delay={0.09}>
      <circle cx="46" cy="34" r="24" stroke="currentColor" strokeWidth="1.5" />
    </Piece>
    <Piece delay={0.16}>
      <circle cx="66" cy="16" r="8" fill="currentColor" fillOpacity="0.45" />
    </Piece>
    <Piece delay={0.24}>
      <path d="M20 60 L40 34 L58 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Piece>
    <Piece delay={0.32}>
      <rect x="37" y="45" width="42" height="18" rx="4" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
    </Piece>
  </svg>
);

const DevelopGraphic = ({ playing, stroke }: { playing: boolean; stroke: string }) => (
  <svg className={playing ? "pieces--play" : ""} width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden style={{ color: stroke }}>
    <Piece delay={0.05}>
      <rect x="2" y="30" width="78" height="50" rx="5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
    </Piece>
    <Piece delay={0.08}>
      <rect x="28" y="2" width="50" height="50" rx="5" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
    </Piece>
    <Piece delay={0.03}>
      <circle cx="57" cy="20" r="9" fill="currentColor" fillOpacity="0.4" />
    </Piece>
    <Piece delay={0.22}>
      <circle cx="57" cy="50" r="9" fill="currentColor" fillOpacity="0.4" />
    </Piece>
    <Piece delay={0.1}>
      <path d="M57 29 V41" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </Piece>
    <Piece delay={0.15}>
      <path d="M57 59 V71 M52 66 L57 71 L62 66" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </Piece>
  </svg>
);

const cards = [
  { title: "Design", desc: "Figma UI kits and more", to: "/docs/design", Graphic: DesignGraphic },
  { title: "Develop", desc: "Get started with installation guides", to: "/getting-started", Graphic: DevelopGraphic },
];

const moreCols: string[][] = [
  ["Images", "Animations", "Icons"],
  ["Theming", "Grid", "Tokens"],
];
const moreHref: Record<string, string> = {
  Images: "https://eufemia.dnb.no/uilib/usage/best-practices/for-designers/",
  Animations: "https://eufemia.dnb.no/uilib/usage/animation/",
  Icons: "/icons/",
  Theming: "/theming/",
  Grid: "https://eufemia.dnb.no/uilib/usage/layout/grid/",
  Tokens: "https://eufemia.dnb.no/uilib/usage/customisation/design-tokens/",
};

const updateItems = [
  { date: "November, 12. 2021", text: "Updated icon sizes for component Button variant tertiary (16px default, 24px for icon position top)." },
  { date: "November, 12. 2021", text: "Updated icon sizes for component Button variant secondary." },
  { date: "October, 08. 2021", text: "Default shadow (defaultDropShadow() and .dnb-drop-shadow) was changed to 0.8pc 16px rgba (51,51,51, 0.08)" },
  { date: "October, 08. 2021", text: "Default shadow (defaultDropShadow() and .dnb-drop-shadow) was changed to 0.8pc 16px rgba (51,51,51, 0.08)" },
];

const tabs = ["Web", "Android", "iOS"];

const PortalHome: React.FC = () => {
  const { colors } = useTheme();

  const [tab, setTab] = useState("Web");
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  const [moreHover, setMoreHover] = useState<string | null>(null);

  const divider = <div style={{ height: "1px", width: "761px", maxWidth: "100%", background: colors.strokeSubtle }} />;

  // Cards invert between themes (Figma): bright green on dark, dark navy on light.
  // Fixed card colors (requested): Design = deep teal-black, Develop = deep maroon.
  const cardTheme = {
    design: "#041318",
    develop: "#390015",
    text: "#ffffff",
    stroke: "#a5e1d2",
    developStroke: "#e2a2a5",
  };

  return (
    <Layout currentPath="/" currentPlatform="web">
      <style>{cardMotionCSS}</style>
      <div style={{ position: "relative", fontFamily: font.family, color: colors.text, overflow: "hidden" }}>
        {/* Hero backdrop artwork — fades out towards the bottom into the page */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            lineHeight: 0,
            pointerEvents: "none",
            userSelect: "none",
            WebkitMaskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.4) 75%, transparent 100%)",
          }}
          dangerouslySetInnerHTML={{ __html: HERO_SVG }}
        />

        {/* Hero */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "144px 40px 0", textAlign: "center" }}>
          <h1 style={{ margin: 0, width: "464px", maxWidth: "100%", fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: "#ffffff" }}>
            Welcome to Eufemia
          </h1>
          <p style={{ margin: 0, width: "691px", maxWidth: "100%", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: "#ffffff" }}>
            Eufemia is DNB's design system, which consist of resources for designers and developers in
            order to maintain consistency and efficiency when building applications for web and our
            native platforms.
          </p>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px", padding: "127px 40px 80px" }}>
          {/* Cards */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {cards.map(({ title, desc, to, Graphic }) => {
              const bg = title === "Design" ? cardTheme.design : cardTheme.develop;
              const graphicStroke = title === "Design" ? cardTheme.stroke : cardTheme.developStroke;
              const inner = (
                <div
                  onMouseEnter={() => setHoverCard(title)}
                  onMouseLeave={() => setHoverCard(null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                    width: "368px",
                    maxWidth: "100%",
                    minHeight: "162px",
                    boxSizing: "border-box",
                    padding: "16px 24px",
                    borderRadius: `${radius.xl}`,
                    background: bg,
                    textDecoration: "none",
                    transform: hoverCard === title ? "translateY(-2px)" : "none",
                    boxShadow: hoverCard === title ? "0 8px 16px rgba(0,0,0,0.25)" : "none",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", width: "219px" }}>
                    <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: cardTheme.text }}>{title}</span>
                    <span style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: cardTheme.text }}>{desc}</span>
                  </div>
                  <Graphic playing={hoverCard === title} stroke={graphicStroke} />
                </div>
              );
              return to.startsWith("http") ? (
                <a key={title} href={to} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>{inner}</a>
              ) : (
                <Link key={title} to={to} style={{ textDecoration: "none" }}>{inner}</Link>
              );
            })}
          </div>

          {divider}

          {/* More */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "761px", maxWidth: "100%" }}>
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>More</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "8px", rowGap: "8px" }}>
              {moreCols.map((col, ci) => (
                <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {col.map((label) => {
                    const to = moreHref[label];
                    const internal = to.startsWith("/");
                    const linkStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", padding: "8px 0", fontFamily: font.family, fontWeight: 500, fontSize: "34px", lineHeight: "40px", color: colors.accent, textDecoration: "underline", textDecorationColor: moreHover === label ? colors.accent : "transparent", textUnderlineOffset: "4px", width: "fit-content", opacity: moreHover === label ? 1 : 0.9, transform: moreHover === label ? "translateX(6px)" : "translateX(0)", transition: "transform 0.15s ease, opacity 0.15s ease, text-decoration-color 0.15s ease" };
                    const handlers = { onMouseEnter: () => setMoreHover(label), onMouseLeave: () => setMoreHover(null) };
                    return internal ? (
                      <Link key={label} to={to} {...handlers} style={linkStyle}>{label}</Link>
                    ) : (
                      <a key={label} href={to} target="_blank" rel="noreferrer" {...handlers} style={linkStyle}>{label}</a>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {divider}

          {/* Updates */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "761px", maxWidth: "100%" }}>
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>Updates</span>
            <div style={{ display: "flex", gap: "40px", borderBottom: `1px solid ${colors.strokeSubtle}` }}>
              {tabs.map((t) => {
                const active = tab === t;
                return (
                  <button key={t} onClick={() => setTab(t)}
                    style={{ position: "relative", background: "none", border: "none", cursor: "pointer", padding: "8px 0", fontFamily: font.family, fontWeight: active ? 500 : 400, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: active ? colors.textSelected : colors.textMuted }}>
                    {t}
                    {active && <span style={{ position: "absolute", left: 0, right: 0, bottom: "-1px", height: "2px", borderRadius: "2px", background: colors.selected }} />}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "368px 368px", gap: "25px 18px", maxWidth: "100%" }}>
              {updateItems.map((u, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "368px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.accent }}>{u.date}</span>
                    <ArrowRight color={colors.accent} />
                  </div>
                  <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{u.text}</p>
                </div>
              ))}
            </div>
            <a href="https://eufemia.dnb.no/uilib/getting-started/versions/" target="_blank" rel="noreferrer"
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "fit-content", padding: "8px 24px", borderRadius: `${radius.xl}`, border: `1px solid ${colors.accent}`, background: colors.surface, color: colors.accent, textDecoration: "none", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
              See all Eufemia updates
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PortalHome;

import React, { useState } from "react";
import { Link } from "gatsby";
import { Button, Tabs } from "@dnb/eufemia";
import Layout from "./Layout";
import EufemiaThemeScope from "./EufemiaThemeScope";
import { useTheme } from "../context/ThemeContext";
import { radius, font } from "../theme/tokens";
import {
  formatReleaseDate,
  releases,
  type Release,
} from "../data/release-data";
import heroGlow from "../images/home/hero-glow.png";
import heroGlowLight from "../images/home/hero-glow-light.png";
import sbankenHeroGlow from "../images/home/sbanken-hero-glow.png";
import sbankenHeroGlowLight from "../images/home/sbanken-hero-glow-light.png";
import carnegieHero from "../images/home/carnegie-hero.png";


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

const updateMotionCSS = `
.update-link .update-date {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
  transition: text-decoration-color 0.15s ease;
}
.update-link .update-arrow {
  display: inline-flex;
  transition: transform 0.15s ease;
}
.update-link:hover .update-date,
.update-link:focus-visible .update-date {
  text-decoration-color: currentColor;
}
.update-link:hover .update-arrow,
.update-link:focus-visible .update-arrow {
  transform: translateX(6px);
}
@media (prefers-reduced-motion: reduce) {
  .update-link .update-date,
  .update-link .update-arrow { transition: none; }
}
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

const updatePlatforms = [
  { key: "web", title: "Web" },
  { key: "ios", title: "iOS" },
  { key: "android", title: "Android" },
] as const;

type UpdatePlatform = (typeof updatePlatforms)[number]["key"];

type MockUpdate = {
  date: string;
  text: string;
};

const mockNativeUpdates: Record<Exclude<UpdatePlatform, "web">, MockUpdate[]> = {
  ios: [
    { date: "July 16, 2026", text: "Updated Avatar guidance with accessibility examples for profile and payment flows." },
    { date: "July 9, 2026", text: "Added iOS token examples for spacing and color usage." },
    { date: "June 25, 2026", text: "Refined component anatomy guidance for native navigation patterns." },
    { date: "June 12, 2026", text: "Published accessibility notes for iOS component states." },
  ],
  android: [
    { date: "July 15, 2026", text: "Added Android guidance for Avatar in payment and profile contexts." },
    { date: "July 2, 2026", text: "Updated Android design token examples for typography and color." },
    { date: "June 18, 2026", text: "Refined native component documentation for Material-aligned layouts." },
    { date: "June 4, 2026", text: "Published accessibility guidance for Android interaction states." },
  ],
};

const ReleaseSummary: React.FC<{
  release: Release;
  colors: ReturnType<typeof useTheme>["colors"];
}> = ({ release, colors }) => {
  const category = release.categories.find(
    (item) => item.slug === "features" || item.slug === "bug-fixes"
  );
  const summary = category ? (
    <>
      {release.tag}: <strong style={{ color: colors.accent, fontWeight: 500 }}>{category.title}</strong>: {category.items[0]}
    </>
  ) : (
    `${release.tag}: ${release.intro}`
  );

  return (
    <a className="update-link" href={release.url} target="_blank" rel="noreferrer" style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0, color: colors.text, textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span className="update-date" style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.accent }}>{formatReleaseDate(release.date)}</span>
        <span className="update-arrow"><ArrowRight color={colors.accent} /></span>
      </div>
      <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>
        {summary}
      </p>
    </a>
  );
};

const PortalHome: React.FC = () => {
  const { colors, theme, brand } = useTheme();

  // Brand + theme specific hero glow.
  const heroSrc =
    brand === "Sbanken"
      ? theme === "dark"
        ? sbankenHeroGlow
        : sbankenHeroGlowLight
      : theme === "dark"
      ? heroGlow
      : heroGlowLight;
  const [hoverCard, setHoverCard] = useState<string | null>(null);
  const [moreHover, setMoreHover] = useState<string | null>(null);

  const divider = <div style={{ height: "1px", width: "761px", maxWidth: "100%", background: colors.strokeSubtle }} />;

  const isCarnegie = brand === "Carnegie";

  // Cards invert between themes (Figma): bright green on dark, dark navy on light.
  // Carnegie is light-only and uses the fixed teal/maroon card colors.
  const cardTheme = isCarnegie
    ? { design: "#041318", develop: "#390015", text: "#ffffff", stroke: "#a5e1d2", developStroke: "#e2a2a5" }
    : brand === "Sbanken"
      ? theme === "dark"
        ? { design: "#d9b3ff", develop: "#ecd9ff", text: "#333333", stroke: "#6b2c91", developStroke: "#8a5cad" }
        : { design: "#2a0e3a", develop: "#3d1259", text: "#ffffff", stroke: "#c9a3e6", developStroke: "#c9a3e6" }
      : theme === "dark"
      ? { design: "#99ff9a", develop: "#deffcd", text: "#333333", stroke: "#007272", developStroke: "#4a948d" }
      : { design: "#0e1e26", develop: "#003842", text: "#ffffff", stroke: "#a5e1d2", developStroke: "#a5e1d2" };

  return (
    <Layout currentPath="/" currentPlatform="web">
      <style>{cardMotionCSS}{updateMotionCSS}</style>
      <div style={{ position: "relative", fontFamily: font.family, color: colors.text, overflow: "hidden" }}>
        {isCarnegie ? (
          /* Carnegie hero — pre-rendered artwork (PNG for performance), fades out at the bottom */
          <img
            src={carnegieHero}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "auto",
              pointerEvents: "none",
              userSelect: "none",
              WebkitMaskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.4) 75%, transparent 100%)",
              maskImage: "linear-gradient(to bottom, #000 45%, rgba(0,0,0,0.4) 75%, transparent 100%)",
            }}
          />
        ) : (
          /* Real hero glow image (exported from Figma). Dark: green→black raster
             blended with `screen`; light: green→white raster blended with
             `multiply` — both drop their base colour into the page seamlessly. */
          <img
            src={heroSrc}
            alt=""
            aria-hidden
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "auto",
              mixBlendMode: theme === "dark" ? "screen" : "multiply",
              pointerEvents: "none",
              userSelect: "none",
            }}
          />
        )}

        {/* Hero */}
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "144px 40px 0", textAlign: "center" }}>
          <h1 style={{ margin: 0, width: "464px", maxWidth: "100%", fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: isCarnegie ? "#ffffff" : colors.text }}>
            Welcome to Eufemia
          </h1>
          <p style={{ margin: 0, width: "691px", maxWidth: "100%", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: isCarnegie ? "#ffffff" : colors.text }}>
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

          {/* Eufemia resources */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "761px", maxWidth: "100%" }}>
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>Eufemia resources</span>
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
          <section aria-labelledby="updates-heading" style={{ display: "flex", flexDirection: "column", gap: "24px", width: "761px", maxWidth: "100%", marginTop: "-24px" }}>
            <h2 id="updates-heading" style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>Updates</h2>

            <EufemiaThemeScope>
              <Tabs
                id="portal-updates"
                label="Platform updates"
                breakout={false}
                data={updatePlatforms}
              />

              <Tabs.Content id="portal-updates" contentInnerSpace={{ block: "large", inline: false }}>
                {({ key }: { key: UpdatePlatform }) => (
                  key === "web" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "25px 18px", width: "100%" }}>
                      {releases.slice(0, 4).map((release) => (
                        <ReleaseSummary key={release.tag} release={release} colors={colors} />
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "25px 18px", width: "100%" }}>
                      {mockNativeUpdates[key].map((update) => (
                        <article key={update.date} className="update-link" style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="update-date" style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.accent }}>{update.date}</span>
                            <span className="update-arrow"><ArrowRight color={colors.accent} /></span>
                          </div>
                          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>{update.text}</p>
                        </article>
                      ))}
                    </div>
                  )
                )}
              </Tabs.Content>
            </EufemiaThemeScope>

            <EufemiaThemeScope>
              <Button
                variant="secondary"
                text="See all Eufemia updates"
                icon="chevron_right"
                href="https://github.com/dnbexperience/eufemia/releases"
                target="_blank"
                rel="noreferrer"
              />
            </EufemiaThemeScope>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default PortalHome;

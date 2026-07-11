import React from "react";
import Layout from "./Layout";
import PageShell from "./PageShell";
import InPageRail from "./InPageRail";
import { NAV_HEIGHT } from "./Header";
import { useTheme } from "../context/ThemeContext";
import { font } from "../theme/tokens";

type Block =
  | { type: "p"; text: string }
  | { type: "names"; items: string[] }
  | { type: "bullets"; items: string[] }
  | { type: "subhead"; text: string }
  | { type: "links"; items: { label: string; href: string }[] };

interface Section {
  id: string;
  title: string;
  step: string; // label shown in the right-hand rail
  blocks: Block[];
}

// Exact copy from the Figma "Home" frame (About Eufemia) + expanded sections.
const sections: Section[] = [
  {
    id: "the-vision",
    title: "The vision",
    step: "The Vision",
    blocks: [
      { type: "p", text: "Eufemia is DNB's design system, providing resources for designers and developers to maintain consistency and efficiency when building accessible web applications. The goal is a single source of truth for design-covering color, typography, layout guidelines, and fully coded components for applications." },
    ],
  },
  {
    id: "human-ai-ready",
    title: "Human & AI Ready",
    step: "Human & AI Ready",
    blocks: [
      { type: "p", text: "Eufemia is built to serve both human designers and developers, and the AI systems working alongside them. As a single source of truth for DNB's design language, Eufemia provides structured, machine-readable tokens, components, and guidelines — so whether you're a person crafting an interface or an AI agent generating one, you're always working from the same foundation." },
    ],
  },
  {
    id: "accessibility",
    title: "Accessibility",
    step: "Accessibility",
    blocks: [
      { type: "p", text: "With Eufemia, DNB can continually increase product quality for both visual users and users relying on assistive technologies. It follows industry and regulatory standards-UU Tilsynet and WCAG 2.1." },
      { type: "p", text: "You can read more about DNB UX's minimal accessibility requirements for web applications." },
    ],
  },
  {
    id: "please-contribute",
    title: "Please contribute",
    step: "Contribute",
    blocks: [
      { type: "p", text: "Eufemia is a living design system that does not have a 'finished' state. Continuous improvement, removal, and addition of content are essential to keeping it relevant as a resource for current and future DNB products and services." },
      { type: "p", text: "Your input, comments, and discussions are all valuable. Please reach out to us and contribute." },
    ],
  },
  {
    id: "special-thanks",
    title: "Special thanks",
    step: "Special thanks",
    blocks: [
      { type: "p", text: "Thank you to everyone who has contributed to building Eufemia. Notable contributors include:" },
      {
        type: "names",
        items: [
          "Jens Thuland", "Casper Brekke", "Mats Ødegaard Vassli", "Sindre Marken",
          "Kevin Murphy", "Tobias Høegh", "Anders Langseth", "Joakim Bjerknes",
          "Snorre Kim", "Henrik Haugberg", "Yngve Sundfjord", "Dina Rosvoll",
          "Thayanan Tharmapalan", "Hans Kristian Smedsrød", "Arne Haltstrand", "Kirsti Merete Frelsøy",
        ],
      },
    ],
  },
  {
    id: "transparency",
    title: "Transparency",
    step: "Transparency",
    blocks: [
      { type: "p", text: "The UX team created the Eufemia design system to streamline design and development processes at DNB." },
      { type: "p", text: "Access to code and documentation is essential for building strong relationships and maintaining balance between contribution, development, and communication." },
      { type: "p", text: "To ensure transparency, we've made both the code on GitHub and the Eufemia Portal available without restrictions." },
      { type: "p", text: "This approach:" },
      {
        type: "bullets",
        items: [
          "Enables anyone to contribute",
          "Strengthens the identity of design and development processes at DNB",
          "Defines user ownership of the design system",
          "Increases professionalization of development processes",
          "Contributes to maximum transparency with partners and DNB customers",
          "Simplifies daily work for design system users",
          "Makes the design system available to those without internal DNB access",
        ],
      },
      { type: "p", text: "It reflects DNB's reputation for clarity, transparency, and pride in our work. Sharing our design system openly makes it accessible to collaborators and signals our continuous commitment to creating the best solutions." },
    ],
  },
  {
    id: "credits",
    title: "Credits",
    step: "Credits",
    blocks: [
      { type: "p", text: "The Eufemia Portal includes third-party services." },
      { type: "subhead", text: "Additional links" },
      {
        type: "links",
        items: [
          { label: "Privacy", href: "https://www.dnb.no/en/about-us/privacy-policy" },
          { label: "License", href: "https://github.com/dnbexperience/eufemia/blob/main/LICENSE" },
        ],
      },
    ],
  },
];

const AboutEufemia: React.FC = () => {
  const { colors } = useTheme();

  const paraStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.text,
  };

  const renderBlock = (b: Block, key: number) => {
    switch (b.type) {
      case "p":
        return <p key={key} style={paraStyle}>{b.text}</p>;
      case "subhead":
        return (
          <h3
            key={key}
            style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}
          >
            {b.text}
          </h3>
        );
      case "names":
        return (
          <div key={key} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "24px", rowGap: "8px" }}>
            {b.items.map((n) => (
              <span key={n} style={paraStyle}>{n}</span>
            ))}
          </div>
        );
      case "bullets":
        return (
          <ul key={key} style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {b.items.map((it) => (
              <li key={it} style={paraStyle}>{it}</li>
            ))}
          </ul>
        );
      case "links":
        return (
          <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {b.items.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{ ...paraStyle, color: colors.accent, textDecoration: "underline", textUnderlineOffset: "3px", width: "fit-content" }}
              >
                {l.label}
              </a>
            ))}
          </div>
        );
    }
  };

  return (
    <Layout currentPath="/about" currentPlatform="web">
      <PageShell
        contentStyle={{ gap: "72px" }}
        rail={<InPageRail items={sections.map((s) => ({ id: s.id, label: s.step }))} />}
      >
          <h1
            style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}
          >
            About Eufemia
          </h1>

          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              style={{ display: "flex", flexDirection: "column", gap: "24px", scrollMarginTop: `${NAV_HEIGHT + 24}px` }}
            >
              <h2
                style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}
              >
                {s.title}
              </h2>
              {s.blocks.map((b, j) => renderBlock(b, j))}
            </section>
          ))}
      </PageShell>
    </Layout>
  );
};

export default AboutEufemia;

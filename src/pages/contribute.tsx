import React from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

const contributionTypes = [
  "Report bugs.",
  "Suggest new features.",
  "Add more demos.",
  "Fix spelling.",
  "Add more documentation.",
  "Give feedback on design and usage.",
  "Test and review pull requests.",
  "Test and verify new releases of Eufemia in your application code.",
];

const diveIn = [
  {
    title: "Ground rules",
    description: "Code of conduct and Development principles",
    href: "https://eufemia.dnb.no/contribute/rules/",
  },
  {
    title: "New contributor",
    description: "Your first contribution, Pull Requests and Technical information",
    href: "https://eufemia.dnb.no/contribute/first-contribution/",
  },
  {
    title: "Getting started",
    description: "Set up environment, Make changes and Run tests",
    href: "https://eufemia.dnb.no/contribute/getting-started/",
  },
];

const directLinks = [
  { label: "Style guides", href: "https://eufemia.dnb.no/contribute/style-guides/" },
  { label: "Deployment", href: "https://eufemia.dnb.no/contribute/deploy/" },
  { label: "FAQ", href: "https://eufemia.dnb.no/contribute/faq/" },
  { label: "Contact", href: "https://eufemia.dnb.no/contribute/contact/" },
];

const resources = [
  {
    label: "Eufemia GitHub Repository",
    description: "The repository where you make changes in code and documentation.",
    href: "https://github.com/dnbexperience/eufemia",
  },
  {
    label: "Slack channel #eufemia-web",
    description: "For all kinds of discussion topics and questions.",
    href: "https://dnb-it.slack.com/archives/CMXABCHEY",
  },
  {
    label: "Jira Issue Tracking",
    description: "Where you can report or find new issues.",
    href: "https://dnb-asa.atlassian.net/jira/software/c/projects/EDS/summary",
  },
  {
    label: "GitHub Issue Tracking",
    description: "Where you can report or find new issues.",
    href: "https://github.com/dnbexperience/eufemia/issues",
  },
  {
    label: "Starter Templates",
    description: "Quickly reproduce issues when reporting bugs.",
    href: "https://eufemia.dnb.no/issue/",
  },
];

const ArrowIcon = ({ external = false }: { external?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden style={{ flexShrink: 0 }}>
    {external ? (
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

const ContributionPage: React.FC = () => {
  const { colors } = useTheme();

  const h1: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.h1}px`,
    lineHeight: `${font.lineHeight.h1}px`,
    color: colors.text,
  };
  const h2: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.headingLg}px`,
    lineHeight: `${font.lineHeight.headingLg}px`,
    color: colors.text,
  };
  const h3: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.bodyMedium}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.text,
  };
  const paragraph: React.CSSProperties = {
    margin: 0,
    maxWidth: "720px",
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.textMuted,
  };
  const textLink: React.CSSProperties = {
    color: colors.accent,
    textDecoration: "underline",
    textUnderlineOffset: "3px",
  };
  const card: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minWidth: 0,
    padding: "24px",
    background: colors.surface,
    border: `1px solid ${colors.strokeSubtle}`,
    borderRadius: `${radius.lg}`,
    color: colors.text,
    textDecoration: "none",
    transition: "border-color 0.15s ease, background 0.15s ease, transform 0.15s ease",
  };

  return (
    <Layout currentPath="/contribute" currentPlatform="web">
      <PageShell
        contentStyle={{ gap: "48px" }}
        rail={
          <InPageRail
            items={[
              { id: "ways-to-contribute", label: "Contribute" },
              { id: "dive-in", label: "Dive in" },
              { id: "direct-links", label: "Go directly to" },
              { id: "resources", label: "Resources" },
              { id: "people", label: "People of Eufemia" },
            ]}
          />
        }
      >
        <style>{`
          .contribute-card:hover { border-color: ${colors.accent}; background: ${colors.surfaceAlt}; transform: translateY(-2px); }
          .contribute-card:focus-visible, .contribute-action:focus-visible { outline: 3px solid ${colors.accent}; outline-offset: 3px; }
          .contribute-action:hover { background: ${colors.selectedSubtle}; border-color: ${colors.accent}; }
          .contribute-text-link:hover { text-decoration-thickness: 2px; }
          @media (prefers-reduced-motion: reduce) { .contribute-card { transition: none; } }
        `}</style>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={h1}>Contribution Guide</h1>
          <p style={paragraph}>Welcome to the contribution pages of Eufemia.</p>
          <p style={paragraph}>
            We want to <strong style={{ color: colors.text, fontWeight: 500 }}>thank you</strong> for being interested,
            and we are so glad you want to help out. Following these guidelines will help you get started, make appropriate
            changes, and guide you through Eufemia&apos;s environment.
          </p>
          <p style={paragraph}>
            Eufemia is a{" "}
            <a className="contribute-text-link" style={textLink} href="https://eufemia.dnb.no/design-system/about/living-system/" target="_blank" rel="noreferrer">
              living design system
            </a>
            . It does not have a &apos;finished&apos; state. Continuous improvement, removal, and addition of content is important
            if it is to remain relevant as a resource for current and future DNB products and services.
          </p>
          <p style={paragraph}>
            Note that{" "}
            <a className="contribute-text-link" style={textLink} href="https://eufemia.dnb.no/license/" target="_blank" rel="noreferrer">
              license
            </a>{" "}
            states <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.9em" }}>@dnb/eufemia</code> is for internal DNB development only.
          </p>
        </div>

        <section id="ways-to-contribute" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2}>How can I contribute?</h2>
          <p style={paragraph}>There are more ways to contribute than submitting code. Other contributions are equally valuable:</p>
          <ul style={{ margin: 0, paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "8px", maxWidth: "720px" }}>
            {contributionTypes.map((item) => (
              <li key={item} style={paragraph}>{item}</li>
            ))}
          </ul>
          <div style={{ marginTop: "8px", padding: "24px", background: colors.selectedSubtle, borderRadius: `${radius.lg}`, display: "flex", flexDirection: "column", gap: "8px", maxWidth: "720px" }}>
            <h3 style={{ ...h3, color: colors.textSelected }}>DNB Brand Guidelines</h3>
            <p style={{ ...paragraph, color: colors.textSelected }}>
              Colors, fonts and logo guidelines are set in DNB Brandbook and digital version, the{" "}
              <a className="contribute-text-link" style={{ ...textLink, color: colors.textSelected }} href="https://bc.dnb.no/" target="_blank" rel="noreferrer">
                Brand Center
              </a>
              . Please familiarize yourself with them.
            </p>
          </div>
        </section>

        <section id="dive-in" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2}>Dive in</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {diveIn.map((item) => (
              <a key={item.title} className="contribute-card" href={item.href} target="_blank" rel="noreferrer" style={card}>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h3 style={h3}>{item.title}</h3>
                  <p style={paragraph}>{item.description}</p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "auto", color: colors.accent, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
                  Read more
                  <ArrowIcon />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section id="direct-links" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2}>Or go directly to</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {directLinks.map((item) => (
              <a
                key={item.label}
                className="contribute-action"
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  border: `1px solid ${colors.strokeSubtle}`,
                  borderRadius: `${radius.xl}`,
                  color: colors.text,
                  background: colors.surface,
                  fontFamily: font.family,
                  fontSize: `${font.size.body}px`,
                  lineHeight: `${font.lineHeight.body}px`,
                  textDecoration: "none",
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
              >
                {item.label}
                <ArrowIcon />
              </a>
            ))}
          </div>
        </section>

        <section id="resources" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2}>Links to important resources</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
            {resources.map((item) => (
              <a key={item.label} className="contribute-card" href={item.href} target="_blank" rel="noreferrer" style={{ ...card, gap: "8px", padding: "20px" }}>
                <span style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ ...h3, color: colors.accent }}>{item.label}</span>
                  <span style={{ color: colors.accent }}><ArrowIcon external /></span>
                </span>
                <span style={{ ...paragraph, display: "block" }}>{item.description}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="people" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2}>People of Eufemia</h2>
          <p style={paragraph}>
            We want to thank every{" "}
            <a className="contribute-text-link" style={textLink} href="https://eufemia.dnb.no/design-system/about/#special-thanks" target="_blank" rel="noreferrer">
              contributor of Eufemia
            </a>
            , without you Eufemia would not be the design system it is today.
          </p>
        </section>
      </PageShell>
    </Layout>
  );
};

export default ContributionPage;

export const Head = () => <title>Contribution Guide | Eufemia Design System</title>;

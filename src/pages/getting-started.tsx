import React, { useState } from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

const installSnippet = `npm i @dnb/eufemia react react-dom
# or
yarn add @dnb/eufemia react react-dom
# or
pnpm add @dnb/eufemia react react-dom`;

const importSnippet = `import '@dnb/eufemia/style'`;

const renderSnippet = `import { Button } from '@dnb/eufemia'

export default function App() {
  return (
    <Button text="Hello Eufemia" onClick={() => console.log('clicked')} />
  )
}`;

const startHere = [
  { label: "Quick Intro", href: "https://eufemia.dnb.no/uilib/getting-started/" },
  { label: "Quick Start", href: "#quick-start" },
];

const choosePath: { label: string; href: string }[] = [
  { label: "First steps and basics", href: "https://eufemia.dnb.no/uilib/usage/first-steps/" },
  { label: "Quick reference", href: "https://eufemia.dnb.no/uilib/getting-started/" },
  { label: "Use components", href: "https://eufemia.dnb.no/uilib/components/" },
  { label: "Use HTML elements", href: "https://eufemia.dnb.no/uilib/elements/" },
  { label: "Styling and CSS setup", href: "https://eufemia.dnb.no/uilib/usage/customisation/styling/" },
  { label: "Layout", href: "https://eufemia.dnb.no/uilib/layout/" },
  { label: "Theming and brand customization", href: "https://eufemia.dnb.no/uilib/usage/customisation/theming/" },
  { label: "Internationalization (i18n)", href: "https://eufemia.dnb.no/uilib/usage/customisation/localization/" },
  { label: "Helpers and tools", href: "https://eufemia.dnb.no/uilib/helpers/" },
  { label: "Contribution guide", href: "https://eufemia.dnb.no/contribute/" },
  { label: "Forms, validation and schema", href: "https://eufemia.dnb.no/uilib/extensions/forms/" },
];

const MONO = "'SF Mono', ui-monospace, 'Menlo', 'Consolas', monospace";
const KEYWORDS = new Set(["import", "from", "export", "default", "function", "return", "const", "let", "var", "new"]);

interface EditorPalette {
  bg: string;
  header: string;
  text: string;
  comment: string;
  string: string;
  keyword: string;
}

// Lightweight tokenizer — highlights strings, line comments, and keywords.
function highlight(code: string, lang: string, pal: EditorPalette): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  code.split("\n").forEach((line, li) => {
    if (li > 0) nodes.push("\n");
    if (lang === "bash" && line.trimStart().startsWith("#")) {
      nodes.push(<span key={`c${li}`} style={{ color: pal.comment }}>{line}</span>);
      return;
    }
    let i = 0;
    let plain = "";
    let k = 0;
    const seg: React.ReactNode[] = [];
    const flush = () => {
      if (plain) {
        seg.push(plain);
        plain = "";
      }
    };
    while (i < line.length) {
      const rest = line.slice(i);
      let m: RegExpExecArray | null;
      if (lang !== "bash" && (m = /^\/\/.*/.exec(rest))) {
        flush();
        seg.push(<span key={`k${li}-${k++}`} style={{ color: pal.comment }}>{m[0]}</span>);
        i += m[0].length;
        continue;
      }
      if ((m = /^(['"`])(?:\\.|(?!\1).)*\1/.exec(rest))) {
        flush();
        seg.push(<span key={`k${li}-${k++}`} style={{ color: pal.string }}>{m[0]}</span>);
        i += m[0].length;
        continue;
      }
      if ((m = /^[A-Za-z_$][\w$]*/.exec(rest))) {
        const w = m[0];
        if (lang !== "bash" && KEYWORDS.has(w)) {
          flush();
          seg.push(<span key={`k${li}-${k++}`} style={{ color: pal.keyword }}>{w}</span>);
        } else {
          plain += w;
        }
        i += w.length;
        continue;
      }
      plain += line[i];
      i += 1;
    }
    flush();
    nodes.push(...seg);
  });
  return nodes;
}

const GettingStartedPage: React.FC = () => {
  const { colors, theme } = useTheme();
  const [hover, setHover] = useState<string | null>(null);

  const editor: EditorPalette =
    theme === "dark"
      ? { bg: "#141416", header: "#1e1e20", text: "#e6e6e6", comment: "#6f6f76", string: "#a5e1d2", keyword: "#c792ea" }
      : { bg: "#f7f7f9", header: "#ececef", text: "#1c1c1e", comment: "#8a8a90", string: "#0a7d6b", keyword: "#8250df" };

  const h2Style: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.headingLg}px`,
    lineHeight: `${font.lineHeight.headingLg}px`,
    color: colors.text,
  };
  const paraStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.text,
  };

  const link = (label: string, href: string) => (
    <a
      key={label}
      href={href}
      target={href.startsWith("#") ? undefined : "_blank"}
      rel={href.startsWith("#") ? undefined : "noreferrer"}
      onMouseEnter={() => setHover(label)}
      onMouseLeave={() => setHover(null)}
      style={{
        fontFamily: font.family,
        fontSize: `${font.size.body}px`,
        lineHeight: `${font.lineHeight.body}px`,
        color: colors.accent,
        textDecoration: "underline",
        textDecorationColor: hover === label ? colors.accent : "transparent",
        textUnderlineOffset: "3px",
        width: "fit-content",
        transform: hover === label ? "translateX(3px)" : "translateX(0)",
        transition: "transform 0.15s ease, text-decoration-color 0.15s ease",
      }}
    >
      {label}
    </a>
  );

  const CodeBlock = ({ code, lang }: { code: string; lang: string }) => (
    <pre
      style={{
        margin: 0,
        padding: "20px 24px",
        background: editor.bg,
        border: `1px solid ${colors.strokeSubtle}`,
        borderRadius: `${radius.md}`,
        overflowX: "auto",
      }}
    >
      <code style={{ fontFamily: MONO, fontSize: "14px", lineHeight: "24px", color: editor.text, whiteSpace: "pre" }}>
        {highlight(code, lang, editor)}
      </code>
    </pre>
  );

  return (
    <Layout currentPath="/getting-started" currentPlatform="web">
      <PageShell
        contentStyle={{ gap: "48px" }}
        rail={
          <InPageRail
            items={[
              { id: "start-here", label: "Start Here" },
              { id: "quick-start", label: "Quick Start" },
              { id: "choose-your-path", label: "Choose Your Path" },
              { id: "code-editor-extensions", label: "Code Editor Extensions" },
              { id: "please-contribute", label: "Please contribute" },
            ]}
          />
        }
      >
        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              margin: 0,
              fontFamily: font.family,
              fontWeight: 500,
              fontSize: `${font.size.h1}px`,
              lineHeight: `${font.lineHeight.h1}px`,
              color: colors.text,
            }}
          >
            Developer Guide
          </h1>
          <p style={{ ...paraStyle, maxWidth: "640px" }}>
            Welcome to Eufemia — DNB's design system for building accessible, consistent digital
            experiences. Pick the guided intro or jump straight into the quick start below.
          </p>
        </div>

        {/* Start Here */}
        <section id="start-here" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Start Here</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {startHere.map((l) => link(l.label, l.href))}
          </div>
        </section>

        {/* Quick Start */}
        <section id="quick-start" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Quick Start</h2>

          <p style={paraStyle}>Install the library (React and React DOM are required):</p>
          <CodeBlock code={installSnippet} lang="bash" />

          <p style={paraStyle}>Import the CSS once in your app entry (theme included):</p>
          <CodeBlock code={importSnippet} lang="tsx" />

          <p style={paraStyle}>Render your first component:</p>
          <CodeBlock code={renderSnippet} lang="tsx" />

          <p style={paraStyle}>
            Learn more about importing CSS in{" "}
            {link("Importing Styles", "https://eufemia.dnb.no/uilib/usage/customisation/styling/")}.
          </p>
        </section>

        {/* Choose Your Path */}
        <section id="choose-your-path" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Choose Your Path</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "24px", rowGap: "12px" }}>
            {choosePath.map((l) => link(l.label, l.href))}
          </div>
        </section>

        {/* Code Editor Extensions */}
        <section id="code-editor-extensions" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Code Editor Extensions</h2>
          <p style={paraStyle}>
            Boost your workflow with the{" "}
            {link("Eufemia VS Code extension", "https://eufemia.dnb.no/uilib/usage/first-steps/editor-support/")}{" "}
            (spacing, typography and more).
          </p>
        </section>

        {/* Please contribute */}
        <section id="please-contribute" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Please contribute</h2>
          <p style={paraStyle}>
            Eufemia is a living design system that does not have a "finished" state. Continuous
            improvement, removal, and addition of content are essential to keeping it relevant as a
            resource for current and future DNB products and services.
          </p>
          <p style={paraStyle}>
            Your input, comments, and discussions are all valuable. Please reach out to us and
            contribute.
          </p>
        </section>
      </PageShell>
    </Layout>
  );
};

export default GettingStartedPage;

export const Head = () => <title>Developer Guide | Eufemia Design System</title>;

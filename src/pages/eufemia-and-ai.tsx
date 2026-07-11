import React, { useState } from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

const connectSnippet = `{
  "mcpServers": {
    "eufemia": {
      "url": "https://eufemia.dnb.no/mcp"
    }
  }
}`;

const askExamples = [
  "Which token do I use for a card background in Sbanken dark?",
  "Give me the import and props for the Button component.",
  "Search for a date-picker component.",
  "Find an icon for a calendar.",
];

const MONO = "'SF Mono', ui-monospace, 'Menlo', 'Consolas', monospace";

interface EditorPalette {
  bg: string;
  text: string;
  comment: string;
  string: string;
  key: string;
}

// Minimal JSON highlighter: object keys, string values, punctuation.
function highlightJson(code: string, pal: EditorPalette): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  code.split("\n").forEach((line, li) => {
    if (li > 0) nodes.push("\n");
    const m = /^(\s*)"([^"]+)"(\s*:\s*)?(.*)$/.exec(line);
    if (m) {
      const [, indent, name, colon, rest] = m;
      nodes.push(indent);
      // A key has a trailing colon; otherwise it's a string value.
      const isKey = !!colon;
      nodes.push(
        <span key={`n${li}`} style={{ color: isKey ? pal.key : pal.string }}>
          "{name}"
        </span>
      );
      if (colon) nodes.push(colon);
      if (rest) {
        const valm = /^"([^"]*)"(.*)$/.exec(rest);
        if (valm) {
          nodes.push(
            <span key={`v${li}`} style={{ color: pal.string }}>
              "{valm[1]}"
            </span>
          );
          nodes.push(valm[2]);
        } else {
          nodes.push(rest);
        }
      }
    } else {
      nodes.push(line);
    }
  });
  return nodes;
}

const EufemiaAndAiPage: React.FC = () => {
  const { colors, theme } = useTheme();
  const [hover, setHover] = useState<string | null>(null);

  const editor: EditorPalette =
    theme === "dark"
      ? { bg: "#141416", text: "#e6e6e6", comment: "#6f6f76", string: "#a5e1d2", key: "#c792ea" }
      : { bg: "#f7f7f9", text: "#1c1c1e", comment: "#8a8a90", string: "#0a7d6b", key: "#8250df" };

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

  const CodeBlock = ({ code }: { code: string }) => (
    <pre
      style={{
        margin: 0,
        padding: "20px 24px",
        background: editor.bg,
        border: `1px solid ${colors.strokeSubtle}`,
        borderRadius: `${radius.md}px`,
        overflowX: "auto",
      }}
    >
      <code style={{ fontFamily: MONO, fontSize: "14px", lineHeight: "24px", color: editor.text, whiteSpace: "pre" }}>
        {highlightJson(code, editor)}
      </code>
    </pre>
  );

  const Pill = ({ children, tone = "accent" }: { children: React.ReactNode; tone?: "accent" | "muted" }) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "3px 12px",
        borderRadius: "999px",
        fontFamily: font.family,
        fontSize: `${font.size.small}px`,
        lineHeight: `${font.lineHeight.small}px`,
        background: tone === "accent" ? colors.selectedSubtle : "transparent",
        color: tone === "accent" ? colors.textSelected : colors.textMuted,
        border: `1px solid ${tone === "accent" ? colors.strokeAction : colors.strokeSubtle}`,
      }}
    >
      {children}
    </span>
  );

  return (
    <Layout currentPath="/eufemia-and-ai" currentPlatform="web">
      <PageShell
        contentStyle={{ gap: "48px" }}
        rail={
          <InPageRail
            items={[
              { id: "web-mcp", label: "Web MCP" },
              { id: "connect", label: "Connect" },
              { id: "ask", label: "What you can ask" },
              { id: "native", label: "Native" },
              { id: "learn-more", label: "Learn more" },
            ]}
          />
        }
      >
        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
            Eufemia and AI
          </h1>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Bring Eufemia into your AI tools. Our Model Context Protocol (MCP) server lets an assistant
            answer questions about the design system — tokens, components, icons and code — grounded in
            the real library, right where you work.
          </p>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            We're striving to make Eufemia and its documentation readable and navigable for both humans
            and AI. This is an ongoing effort, and your feedback is always appreciated — {link("tell us what would help", "https://eufemia.dnb.no/contribute/")}.
          </p>
        </div>

        {/* Web MCP */}
        <section id="web-mcp" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={h2Style}>Web MCP</h2>
            <Pill>Available</Pill>
          </div>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            The Eufemia Web MCP exposes the web library to any MCP-compatible assistant (Cursor, Claude,
            VS Code and others). Ask about the system in natural language and get answers backed by the
            actual tokens, component guidelines and code — no copy-pasting from docs.
          </p>
        </section>

        {/* Connect */}
        <section id="connect" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Connect to the Web MCP</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Add the server to your AI client's MCP configuration, then reload. It's a hosted (web) server,
            so you only need the URL — nothing to install.
          </p>
          <CodeBlock code={connectSnippet} />
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Once connected, the assistant picks up the Eufemia tools automatically and can call them while
            it answers.
          </p>
        </section>

        {/* What you can ask */}
        <section id="ask" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>What you can ask</h2>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {askExamples.map((q) => (
              <li key={q} style={{ ...paraStyle, color: colors.textMuted }}>
                {q}
              </li>
            ))}
          </ul>
        </section>

        {/* Native */}
        <section id="native" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={h2Style}>Native</h2>
            <Pill tone="muted">In progress</Pill>
          </div>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            We're building the same experience for native — an MCP server covering the iOS and Android
            component libraries and tokens — so the same AI workflows work beyond the web. Coming soon.
          </p>
        </section>

        {/* Learn more */}
        <section id="learn-more" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Learn more</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {link("Eufemia documentation", "https://eufemia.dnb.no/")}
            {link("Developer Guide", "/getting-started")}
            {link("Design tokens", "/docs/web/design-tokens")}
          </div>
        </section>
      </PageShell>
    </Layout>
  );
};

export default EufemiaAndAiPage;

export const Head = () => <title>Eufemia and AI | Eufemia Design System</title>;

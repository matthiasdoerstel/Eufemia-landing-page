import React, { useState } from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

const hostedEndpoint = "https://eufemia-mcp.eufemia.workers.dev/mcp";
const hostedCommand = `claude mcp add --transport http eufemia https://eufemia-mcp.eufemia.workers.dev/mcp
# or
raicode mcp add --transport http eufemia https://eufemia-mcp.eufemia.workers.dev/mcp`;

const localInstallCommand = `npm install @dnb/eufemia @modelcontextprotocol/sdk
# or
yarn add @dnb/eufemia @modelcontextprotocol/sdk
# or
pnpm add @dnb/eufemia @modelcontextprotocol/sdk`;

const localConfig = `{
  "servers": {
    "eufemia": {
      "command": "node",
      "args": [
        "\${workspaceFolder}/node_modules/@dnb/eufemia/mcp/mcp-docs-server.js"
      ]
    }
  }
}`;

const localCommand = `claude mcp add --transport stdio eufemia -- node node_modules/@dnb/eufemia/mcp/mcp-docs-server.js
# or
raicode mcp add --transport stdio eufemia -- node node_modules/@dnb/eufemia/mcp/mcp-docs-server.js`;

const eslintRecommended = `import eufemiaEslint from '@dnb/eufemia/plugins/eslint.js'

export default [eufemiaEslint.recommended]`;

const stylelintRecommended = `import eufemiaStylelint from '@dnb/eufemia/plugins/stylelint.js'

export default eufemiaStylelint.recommended`;

const postcssConfig = `import styleScopePlugin from '@dnb/eufemia/plugins/postcss-isolated-style-scope.js'

export default {
  plugins: [styleScopePlugin()],
}`;

const askExamples = [
  "Find the spacing system rules in Eufemia.",
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
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
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
        borderRadius: `${radius.md}`,
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
              { id: "mcp", label: "MCP server" },
              { id: "hosted-mcp", label: "Hosted MCP" },
              { id: "local-mcp", label: "Local MCP" },
              { id: "how-to-use", label: "How to use" },
              { id: "editor-extension", label: "VS Code" },
              { id: "lint-plugins", label: "Lint plugins" },
              { id: "postcss", label: "PostCSS" },
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
            and AI. This is an ongoing effort, and your feedback is always appreciated — {link("tell us what would help", "/contribute")}.
          </p>
        </div>

        {/* MCP server */}
        <section id="mcp" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={h2Style}>AI Assistance and MCP Server</h2>
            <Pill>Experimental</Pill>
          </div>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            If your AI coding agent supports the Model Context Protocol (MCP), connect it to Eufemia’s documentation. The server helps assistants apply Eufemia patterns more accurately, but always review generated output carefully.
          </p>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Choose hosted MCP for latest released documentation, or local MCP for documentation pinned to exact Eufemia version installed in your project.
          </p>
        </section>

        {/* Hosted MCP */}
        <section id="hosted-mcp" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={h2Style}>Hosted MCP server</h2>
            <Pill>Recommended</Pill>
          </div>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            No installation needed. Hosted on Cloudflare Workers and always serves latest released Eufemia docs through Streamable HTTP.
          </p>
          <CodeBlock code={hostedEndpoint} />
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Health endpoint: {link("https://eufemia-mcp.eufemia.workers.dev/healthz", "https://eufemia-mcp.eufemia.workers.dev/healthz")}.
          </p>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Add it with Claude CLI or raicode:
          </p>
          <CodeBlock code={hostedCommand} />
        </section>

        {/* Local MCP */}
        <section id="local-mcp" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Local MCP server</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Run locally for offline or air-gapped work, or when documentation must match installed <code style={{ fontFamily: MONO, fontSize: "0.9em" }}>@dnb/eufemia</code> version exactly.
          </p>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Install Eufemia and MCP SDK in your project:
          </p>
          <CodeBlock code={localInstallCommand} />
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Then add this configuration, for example in <code style={{ fontFamily: MONO, fontSize: "0.9em" }}>.vscode/mcp.json</code>:
          </p>
          <CodeBlock code={localConfig} />
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Or add it directly from Claude CLI or raicode:
          </p>
          <CodeBlock code={localCommand} />
        </section>

        {/* How to use */}
        <section id="how-to-use" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>How to use MCP</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            The server provides documentation context only. It does not execute code or access your network. Ask your AI tool to search or summarize Eufemia documentation.
          </p>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {askExamples.map((question) => (
              <li key={question} style={{ ...paraStyle, color: colors.textMuted }}>{question}</li>
            ))}
          </ul>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            If local server does not start, confirm Eufemia is installed and path points to <code style={{ fontFamily: MONO, fontSize: "0.9em" }}>node_modules/@dnb/eufemia/mcp/mcp-docs-server.js</code>.
          </p>
        </section>

        {/* VS Code */}
        <section id="editor-extension" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Visual Studio Code extension</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Eufemia’s VS Code extension supports px/rem conversion, px/rem value annotations, and autocomplete for spacing, font size, and line height.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {link("Install VS Code extension", "https://marketplace.visualstudio.com/items?itemName=dnbexperience.vscode-eufemia")}
            {link("View extension source", "https://github.com/dnbexperience/vscode-eufemia")}
          </div>
        </section>

        {/* Lint plugins */}
        <section id="lint-plugins" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>Lint plugins</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Eufemia includes ESLint and Stylelint plugins. Install ESLint and/or Stylelint in your app if needed, then use recommended presets or configure rules directly.
          </p>
          <h3 style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>ESLint</h3>
          <CodeBlock code={eslintRecommended} />
          <h3 style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>Stylelint</h3>
          <CodeBlock code={stylelintRecommended} />
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li style={{ ...paraStyle, color: colors.textMuted }}><code style={{ fontFamily: MONO, fontSize: "0.9em" }}>eufemia/no-deprecated-color-variables</code> warns about deprecated <code style={{ fontFamily: MONO, fontSize: "0.9em" }}>--color-*</code> CSS variables and suggests design tokens.</li>
            <li style={{ ...paraStyle, color: colors.textMuted }}><code style={{ fontFamily: MONO, fontSize: "0.9em" }}>eufemia/token-name-policy</code> validates token names, semantics, brand prefixes, and cross-brand parity.</li>
          </ul>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            For SCSS, configure Stylelint with {link("postcss-scss", "https://www.npmjs.com/package/postcss-scss")} as custom syntax.
          </p>
        </section>

        {/* PostCSS */}
        <section id="postcss" style={{ display: "flex", flexDirection: "column", gap: "16px", scrollMarginTop: "88px" }}>
          <h2 style={h2Style}>PostCSS style isolation</h2>
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            When using Eufemia’s PostCSS style-isolation plugin, deprecated color-variable warnings are enabled at build time.
          </p>
          <CodeBlock code={postcssConfig} />
          <p style={{ ...paraStyle, color: colors.textMuted, maxWidth: "680px" }}>
            Set <code style={{ fontFamily: MONO, fontSize: "0.9em" }}>warnOnDeprecatedColorVariables: false</code> to disable warnings.
          </p>
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

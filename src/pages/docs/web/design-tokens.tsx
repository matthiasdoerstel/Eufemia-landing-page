import React from "react";
import { Link } from "gatsby";
import Layout from "../../../components/Layout";
import PageShell from "../../../components/PageShell";
import TokenCatalog from "../../../components/TokenCatalog";
import InPageRail from "../../../components/InPageRail";
import { SECTIONS } from "../../../data/design-tokens";
import { useTheme } from "../../../context/ThemeContext";
import { font } from "../../../theme/tokens";

const WebDesignTokensPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Layout currentPlatform="web" currentPath="/docs/web/design-tokens">
      <PageShell
        contentStyle={{ gap: "40px" }}
        rail={<InPageRail items={SECTIONS.map((s) => ({ id: `tokens-${s.id}`, label: s.label }))} />}
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
              Design tokens
            </h1>
            <p
              style={{
                margin: 0,
                fontFamily: font.family,
                fontSize: `${font.size.body}px`,
                lineHeight: `${font.lineHeight.body}px`,
                color: colors.textMuted,
                maxWidth: "720px",
              }}
            >
              The Eufemia Web colour tokens, resolved per brand and theme. Each cell shows the concrete
              value a token maps to; hover a swatch to see its foundation variable, and click to copy the
              token as <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", color: colors.accent }}>var(--token-color-…)</code>.
              Use the pills to filter by state, and the column headers to sort. For the full contract, see the{" "}
              <a
                href="https://eufemia.dnb.no/uilib/usage/customisation/theming/design-tokens"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: colors.accent, textDecoration: "underline" }}
              >
                Eufemia design tokens documentation
              </a>
              .
            </p>
          </div>

          <TokenCatalog />

          {/* Back link */}
          <div style={{ paddingTop: "24px", borderTop: `1px solid ${colors.strokeSubtle}` }}>
            <Link
              to="/docs/web"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: font.family,
                fontSize: `${font.size.body}px`,
                color: colors.accent,
                textDecoration: "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Web
            </Link>
          </div>
      </PageShell>
    </Layout>
  );
};

export default WebDesignTokensPage;

export const Head = () => <title>Design Tokens | Eufemia Design System</title>;

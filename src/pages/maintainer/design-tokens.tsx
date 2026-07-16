import React from "react";
import { Link } from "gatsby";
import Layout from "../../components/Layout";
import PageShell from "../../components/PageShell";
import TokenCatalog from "../../components/TokenCatalog";
import InPageRail from "../../components/InPageRail";
import { SECTIONS } from "../../data/design-tokens";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { font, radius } from "../../theme/tokens";

const MicrosoftLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7.2" height="7.2" fill="#F25022" />
    <rect x="8.8" y="0" width="7.2" height="7.2" fill="#7FBA00" />
    <rect x="0" y="8.8" width="7.2" height="7.2" fill="#00A4EF" />
    <rect x="8.8" y="8.8" width="7.2" height="7.2" fill="#FFB900" />
  </svg>
);

const MaintainerDesignTokensPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, signingIn, signIn } = useAuth();

  const h1: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontWeight: 500,
    fontSize: `${font.size.h1}px`,
    lineHeight: `${font.lineHeight.h1}px`,
    color: colors.text,
  };
  const para: React.CSSProperties = {
    margin: 0,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.textMuted,
    maxWidth: "720px",
  };

  // Signed-out gate.
  if (!isMaintainer) {
    return (
      <Layout currentPath="/maintainer/design-tokens" currentPlatform="web">
        <PageShell contentStyle={{ gap: "20px" }}>
          <h1 style={h1}>Design Tokens</h1>
          <p style={para}>This is a maintainer tool. Sign in with your DNB Microsoft account to continue.</p>
          <button
            onClick={() => signIn()}
            disabled={signingIn}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              alignSelf: "flex-start",
              padding: "10px 16px",
              borderRadius: `${radius.md}px`,
              border: `1px solid ${colors.stroke}`,
              background: colors.surface,
              color: colors.text,
              fontFamily: font.family,
              fontSize: `${font.size.body}px`,
              cursor: signingIn ? "default" : "pointer",
              opacity: signingIn ? 0.6 : 1,
            }}
          >
            <MicrosoftLogo />
            {signingIn ? "Signing in…" : "Maintainer sign-in"}
          </button>
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout currentPlatform="web" currentPath="/maintainer/design-tokens">
      <PageShell
        contentStyle={{ gap: "40px" }}
        rail={<InPageRail items={SECTIONS.map((s) => ({ id: `tokens-${s.id}`, label: s.label }))} />}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={h1}>Design Tokens</h1>
          <p style={para}>
            Maintainer view of the Eufemia Web colour tokens. Select a token to see which components
            reference it — its blast radius if you change it — and track token adoption across the
            component library. Tokens with no usage are safe to change.
          </p>
        </div>

        <TokenCatalog maintainer />

        <div style={{ paddingTop: "24px", borderTop: `1px solid ${colors.strokeSubtle}` }}>
          <Link
            to="/maintainer"
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
            Back to Maintainer tools
          </Link>
        </div>
      </PageShell>
    </Layout>
  );
};

export default MaintainerDesignTokensPage;

export const Head = () => <title>Design Tokens | Maintainer tools</title>;

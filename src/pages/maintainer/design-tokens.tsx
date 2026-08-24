import React from "react";
import { Anchor, Breadcrumb, Button, H1, P } from "@dnb/eufemia";
import Layout from "../../components/Layout";
import PageShell from "../../components/PageShell";
import EufemiaThemeScope from "../../components/EufemiaThemeScope";
import TokenCatalog from "../../components/TokenCatalog";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

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

  if (!isMaintainer) {
    return (
      <Layout currentPath="/maintainer/design-tokens" currentPlatform="web">
        <PageShell contentStyle={{ gap: "20px" }}>
          <EufemiaThemeScope>
            <H1 style={{ margin: 0, color: colors.text }}>Design Tokens</H1>
            <P style={{ margin: 0, maxWidth: "720px", color: colors.textMuted }}>This is a maintainer tool. Sign in with your DNB Microsoft account to continue.</P>
            <Button
              icon={<MicrosoftLogo />}
              iconPosition="left"
              text={signingIn ? "Signing in…" : "Maintainer sign-in"}
              onClick={signIn}
              disabled={signingIn}
            />
          </EufemiaThemeScope>
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout currentPlatform="web" currentPath="/maintainer/design-tokens">
      <PageShell contentStyle={{ gap: "40px", maxWidth: "none" }} rail={<></>}>
        <EufemiaThemeScope>
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <header style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Breadcrumb
                variant="responsive"
                navText="Page hierarchy"
                data={[
                  { text: "Maintainer tools", href: "/maintainer" },
                  { text: "Design Tokens" },
                ]}
              />
              <H1 style={{ margin: 0, color: colors.text }}>Design Tokens</H1>
              <P style={{ margin: 0, maxWidth: "720px", color: colors.textMuted }}>
                Maintainer view of the Eufemia Web colour tokens. Select a token to see which components reference it — its blast radius if you change it — and track token adoption across the component library. Tokens with no usage are safe to change.
              </P>
            </header>

            <TokenCatalog maintainer />

            <div style={{ paddingTop: "24px", borderTop: `1px solid ${colors.strokeSubtle}` }}>
              <Anchor href="/maintainer" icon="chevron_left" iconPosition="left">Back to Maintainer tools</Anchor>
            </div>
          </div>
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default MaintainerDesignTokensPage;

export const Head = () => <title>Design Tokens | Maintainer tools</title>;

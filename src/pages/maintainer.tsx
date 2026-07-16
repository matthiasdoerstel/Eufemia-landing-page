import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { font, radius } from "../theme/tokens";

const MicrosoftLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7.2" height="7.2" fill="#F25022" />
    <rect x="8.8" y="0" width="7.2" height="7.2" fill="#7FBA00" />
    <rect x="0" y="8.8" width="7.2" height="7.2" fill="#00A4EF" />
    <rect x="8.8" y="8.8" width="7.2" height="7.2" fill="#FFB900" />
  </svg>
);

interface Tool {
  name: string;
  description: string;
  to: string;
  external?: boolean;
  Icon: React.FC<{ color: string }>;
}

// Color-token glyph: overlapping swatches (tokens resolving across themes).
const TokensIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
    <circle cx="9" cy="9" r="5.25" stroke={color} strokeWidth="1.6" />
    <circle cx="15" cy="9" r="5.25" stroke={color} strokeWidth="1.6" />
    <circle cx="12" cy="14.5" r="5.25" stroke={color} strokeWidth="1.6" />
  </svg>
);

// CMS glyph: a document with content lines.
const CmsIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M6 3.5h8L18.5 8v12.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M13.5 3.5V8H18.5" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8.5 12.5h7M8.5 16h7" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SANITY_PROJECT_ID = "sy4b7kpu";
// No Studio host is deployed yet, so link to the Sanity project console. Swap
// this for the deployed Studio URL (e.g. https://<host>.sanity.studio) — or the
// local studio (http://localhost:3333) in dev — once one exists.
const CMS_URL = `https://www.sanity.io/manage/project/${SANITY_PROJECT_ID}`;

const tools: Tool[] = [
  {
    name: "Design Tokens",
    description: "Browse the resolved token catalog across every brand and theme, and see which components use each token.",
    to: "/maintainer/design-tokens",
    Icon: TokensIcon,
  },
  {
    name: "Content Studio",
    description: "Open the Sanity CMS to edit components, guidelines and page content.",
    to: CMS_URL,
    external: true,
    Icon: CmsIcon,
  },
];

const MaintainerPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, user, signingIn, signIn } = useAuth();

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
  };

  // Signed-out gate. Client-side auth only hides the UI — any privileged
  // action behind these tools must still be enforced server-side.
  if (!isMaintainer) {
    return (
      <Layout currentPath="/maintainer" currentPlatform="web">
        <PageShell contentStyle={{ gap: "20px" }}>
          <h1 style={h1}>Maintainer tools</h1>
          <p style={{ ...para, maxWidth: "560px" }}>
            This area is for Eufemia maintainers. Sign in with your DNB Microsoft account to continue.
          </p>
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
              lineHeight: `${font.lineHeight.body}px`,
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

  const card = (t: Tool) => {
    const inner = (
      <>
        <t.Icon color={colors.accent} />
        <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>
          {t.name}
        </span>
        <span style={para}>{t.description}</span>
      </>
    );
    const style: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      padding: "24px",
      borderRadius: `${radius.lg}px`,
      border: `1px solid ${colors.strokeSubtle}`,
      background: colors.surface,
      textDecoration: "none",
    };
    return t.external ? (
      <a key={t.name} href={t.to} target="_blank" rel="noreferrer" style={style}>
        {inner}
      </a>
    ) : (
      <Link key={t.name} to={t.to} style={style}>
        {inner}
      </Link>
    );
  };

  return (
    <Layout currentPath="/maintainer" currentPlatform="web">
      <PageShell contentStyle={{ gap: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1 style={h1}>Maintainer tools</h1>
          <p style={{ ...para, maxWidth: "640px" }}>
            Signed in as {user?.name} ({user?.email}). Manage Eufemia's content, tokens and releases.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {tools.map(card)}
        </div>
      </PageShell>
    </Layout>
  );
};

export default MaintainerPage;

export const Head = () => <title>Maintainer tools | Eufemia Design System</title>;

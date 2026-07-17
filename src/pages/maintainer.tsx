import React from "react";
import { Link } from "gatsby";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { unreadCount } from "../lib/feedback";
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
  comingSoon?: boolean;
  hoverColor?: string;
  Icon: React.FC<{ color: string }>;
}

// Color-token glyph: overlapping swatches (tokens resolving across themes).
const TokensIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, color }}>
    <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="15" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="12" cy="14.5" r="5.25" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

// Sanity brand logomark (official), rendered in Sanity's brand red.
const SANITY_RED = "#F03E2F";
const SanityLogo = (_props: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={SANITY_RED} aria-hidden style={{ flexShrink: 0 }}>
    <path d="m23.327 15.205-.893-1.555-4.321 2.632 4.799-6.11.726-.426-.179-.27.33-.421-1.515-1.261-.693.883-13.992 8.186 5.173-6.221 9.636-5.282-.915-1.769-5.248 2.876 2.584-3.106-1.481-1.305-5.816 6.994-5.777 3.168 4.423-5.847 2.771-1.442-.88-1.789-8.075 4.203L6.186 4.43 4.648 3.198 0 9.349l.072.058.868 1.768 5.153-2.683-4.696 6.207.77.617.458.885 5.425-2.974-5.974 7.185 1.481 1.304.297-.358 14.411-8.459-4.785 6.094.078.065-.007.005.992 1.726 6.364-3.877-2.451 3.954 1.642 1.077L24 15.648z" />
  </svg>
);

// Figma brand logo (official five-shape mark).
const FigmaLogo = (_props: { color: string }) => (
  <svg width="16" height="24" viewBox="0 0 38 57" fill="none" aria-hidden style={{ flexShrink: 0 }}>
    <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE" />
    <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#0ACF83" />
    <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#FF7262" />
    <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E" />
    <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF" />
  </svg>
);

// Feedback glyph: a speech bubble.
const FeedbackIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden style={{ flexShrink: 0, color }}>
    <path d="M4 5.5h16v11H9l-4 3.5v-3.5H4v-11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M8 9.5h8M8 12.5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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
    name: "Feedback",
    description: "Read feedback submitted by portal visitors and triage what needs attention.",
    to: "/maintainer/feedback",
    Icon: FeedbackIcon,
  },
  {
    name: "Sanity CMS",
    description: "Open the Sanity CMS to edit components, guidelines and page content.",
    to: CMS_URL,
    external: true,
    hoverColor: SANITY_RED,
    Icon: SanityLogo,
  },
  {
    name: "Figma insights",
    description: "See how Eufemia components are used across Figma files and libraries.",
    to: "",
    comingSoon: true,
    Icon: FigmaLogo,
  },
];

const MaintainerPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, user, signingIn, signIn } = useAuth();
  const [unread, setUnread] = React.useState(0);

  React.useEffect(() => {
    if (isMaintainer) setUnread(unreadCount());
  }, [isMaintainer]);

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
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <t.Icon color={colors.accent} />
          {t.external && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
              className="maint-launch"
              style={{ marginLeft: "auto", color: colors.textMuted, transition: "transform 0.15s ease" }}
            >
              <path d="M6 3.5H12.5V10M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {t.to === "/maintainer/feedback" && unread > 0 && (
            <span
              title={`${unread} unread`}
              style={{
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "20px",
                height: "20px",
                padding: "0 7px",
                borderRadius: "999px",
                background: colors.accent,
                color: colors.pageBg,
                fontFamily: font.family,
                fontSize: `${font.size.small}px`,
                fontWeight: 600,
              }}
            >
              {unread}
            </span>
          )}
        </div>
        <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, lineHeight: `${font.lineHeight.lead}px`, color: colors.text }}>
          {t.name}
          {t.comingSoon && (
            <span
              style={{
                marginLeft: "10px",
                padding: "2px 8px",
                borderRadius: "999px",
                border: `1px dashed ${colors.strokeSubtle}`,
                fontFamily: font.family,
                fontSize: `${font.size.small}px`,
                fontWeight: 400,
                color: colors.textMuted,
                verticalAlign: "middle",
                whiteSpace: "nowrap",
              }}
            >
              Coming soon
            </span>
          )}
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
      ["--hover-border" as string]: t.hoverColor ?? colors.strokeAction,
    } as React.CSSProperties;
    if (t.comingSoon) {
      return (
        <div key={t.name} style={{ ...style, opacity: 0.7, cursor: "default" }}>
          {inner}
        </div>
      );
    }
    return t.external ? (
      <a key={t.name} href={t.to} target="_blank" rel="noreferrer" className="maint-card" style={style}>
        {inner}
      </a>
    ) : (
      <Link key={t.name} to={t.to} className="maint-card" style={style}>
        {inner}
      </Link>
    );
  };

  return (
    <Layout currentPath="/maintainer" currentPlatform="web">
      <PageShell contentStyle={{ gap: "32px" }}>
        <style>{`.maint-card { transition: border-color 0.15s ease; } .maint-card:hover { border-color: var(--hover-border) !important; } .maint-card:hover .maint-launch { transform: translate(3px, -3px); }`}</style>
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

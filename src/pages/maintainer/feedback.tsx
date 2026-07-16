import React, { useEffect, useState } from "react";
import { Link } from "gatsby";
import Layout from "../../components/Layout";
import PageShell from "../../components/PageShell";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { font, radius } from "../../theme/tokens";
import {
  listFeedback,
  markRead,
  markAllRead,
  CATEGORY_LABELS,
  type FeedbackEntry,
} from "../../lib/feedback";

const MicrosoftLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7.2" height="7.2" fill="#F25022" />
    <rect x="8.8" y="0" width="7.2" height="7.2" fill="#7FBA00" />
    <rect x="0" y="8.8" width="7.2" height="7.2" fill="#00A4EF" />
    <rect x="8.8" y="8.8" width="7.2" height="7.2" fill="#FFB900" />
  </svg>
);

const timeAgo = (ms: number) => {
  const s = Math.round((Date.now() - ms) / 1000);
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};

const MaintainerFeedbackPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, signingIn, signIn } = useAuth();
  const [items, setItems] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    if (isMaintainer) setItems(listFeedback());
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
    maxWidth: "720px",
  };

  if (!isMaintainer) {
    return (
      <Layout currentPath="/maintainer/feedback" currentPlatform="web">
        <PageShell contentStyle={{ gap: "20px" }}>
          <h1 style={h1}>Feedback</h1>
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

  const unread = items.filter((i) => !i.read).length;

  const onMarkRead = (id: string) => {
    markRead(id);
    setItems(listFeedback());
  };
  const onMarkAll = () => {
    markAllRead();
    setItems(listFeedback());
  };

  const backLink = (
    <Link
      to="/maintainer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        alignSelf: "flex-start",
        fontFamily: font.family,
        fontSize: `${font.size.small}px`,
        color: colors.textMuted,
        textDecoration: "none",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Maintainer tools
    </Link>
  );

  return (
    <Layout currentPlatform="web" currentPath="/maintainer/feedback">
      <PageShell contentStyle={{ gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {backLink}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={h1}>
              Feedback
              {unread > 0 && (
                <span style={{ marginLeft: "12px", fontFamily: font.family, fontSize: `${font.size.body}px`, fontWeight: 400, color: colors.textMuted }}>
                  {unread} unread
                </span>
              )}
            </h1>
            {unread > 0 && (
              <button
                onClick={onMarkAll}
                style={{
                  padding: "8px 14px",
                  borderRadius: `${radius.md}px`,
                  border: `1px solid ${colors.strokeSubtle}`,
                  background: "transparent",
                  color: colors.text,
                  fontFamily: font.family,
                  fontSize: `${font.size.small}px`,
                  cursor: "pointer",
                }}
              >
                Mark all read
              </button>
            )}
          </div>
          <p style={para}>Feedback submitted from the portal's feedback button.</p>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "48px 24px",
              borderRadius: `${radius.lg}px`,
              border: `1px dashed ${colors.strokeSubtle}`,
              background: colors.surface,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
              No feedback yet
            </span>
            <span style={{ ...para, maxWidth: "420px" }}>
              When visitors use the feedback button on the portal, their messages show up here.
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((f) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "20px",
                  borderRadius: `${radius.lg}px`,
                  border: `1px solid ${f.read ? colors.strokeSubtle : colors.strokeAction}`,
                  background: colors.surface,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  {!f.read && <span aria-label="unread" style={{ width: "8px", height: "8px", borderRadius: "999px", background: colors.accent, flexShrink: 0 }} />}
                  <span
                    style={{
                      padding: "2px 10px",
                      borderRadius: "999px",
                      background: colors.selectedSubtle,
                      color: colors.textSelected,
                      fontFamily: font.family,
                      fontSize: `${font.size.small}px`,
                      fontWeight: 500,
                    }}
                  >
                    {CATEGORY_LABELS[f.category]}
                  </span>
                  <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
                    {timeAgo(f.createdAt)} · from{" "}
                    <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{f.page || "/"}</code>
                  </span>
                  {!f.read && (
                    <button
                      onClick={() => onMarkRead(f.id)}
                      style={{
                        marginLeft: "auto",
                        padding: "4px 10px",
                        borderRadius: `${radius.md}px`,
                        border: `1px solid ${colors.strokeSubtle}`,
                        background: "transparent",
                        color: colors.text,
                        fontFamily: font.family,
                        fontSize: `${font.size.small}px`,
                        cursor: "pointer",
                      }}
                    >
                      Mark read
                    </button>
                  )}
                </div>

                <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text, whiteSpace: "pre-wrap" }}>
                  {f.message}
                </p>

                {f.email && (
                  <a
                    href={`mailto:${f.email}`}
                    style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.accent, textDecoration: "none" }}
                  >
                    {f.email}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </Layout>
  );
};

export default MaintainerFeedbackPage;

export const Head = () => <title>Feedback | Maintainer tools</title>;

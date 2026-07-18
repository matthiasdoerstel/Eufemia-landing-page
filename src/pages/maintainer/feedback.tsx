import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@dnb/eufemia";
import Layout from "../../components/Layout";
import PageShell from "../../components/PageShell";
import EufemiaThemeScope from "../../components/EufemiaThemeScope";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { font, radius } from "../../theme/tokens";
import {
  listFeedback,
  listArchived,
  markRead,
  markAllRead,
  archive,
  unarchive,
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

const rowBtn = (colors: { text: string; strokeSubtle: string }): React.CSSProperties => ({
  padding: "4px 10px",
  borderRadius: `${radius.md}`,
  border: `1px solid ${colors.strokeSubtle}`,
  background: "transparent",
  color: colors.text,
  fontFamily: font.family,
  fontSize: `${font.size.small}px`,
  cursor: "pointer",
});

const MaintainerFeedbackPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, signingIn, signIn } = useAuth();
  const [view, setView] = useState<"inbox" | "archive">("inbox");
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [inboxUnread, setInboxUnread] = useState(0);
  const [counts, setCounts] = useState({ inbox: 0, archive: 0 });

  const refresh = (v: "inbox" | "archive" = view) => {
    const inbox = listFeedback();
    const arch = listArchived();
    setItems(v === "inbox" ? inbox : arch);
    setInboxUnread(inbox.filter((i) => !i.read).length);
    setCounts({ inbox: inbox.length, archive: arch.length });
  };

  useEffect(() => {
    if (isMaintainer) refresh(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaintainer, view]);

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
              borderRadius: `${radius.md}`,
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

  const onMarkRead = (id: string) => {
    markRead(id);
    refresh();
  };
  const onMarkAll = () => {
    markAllRead();
    refresh();
  };
  const onArchive = (id: string) => {
    archive(id);
    refresh();
  };
  const onRestore = (id: string) => {
    unarchive(id);
    refresh();
  };

  const breadcrumb = (
    <EufemiaThemeScope>
      <Breadcrumb
        variant="responsive"
        navText="Page hierarchy"
        data={[
          { text: "Maintainer tools", href: "/maintainer" },
          { text: "Feedback" },
        ]}
      />
    </EufemiaThemeScope>
  );

  return (
    <Layout currentPlatform="web" currentPath="/maintainer/feedback">
      <PageShell contentStyle={{ gap: "24px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {breadcrumb}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
            <h1 style={h1}>
              Feedback
              {inboxUnread > 0 && (
                <span style={{ marginLeft: "12px", fontFamily: font.family, fontSize: `${font.size.body}px`, fontWeight: 400, color: colors.textMuted }}>
                  {inboxUnread} unread
                </span>
              )}
            </h1>
            {view === "inbox" && inboxUnread > 0 && (
              <button
                onClick={onMarkAll}
                style={{
                  padding: "8px 14px",
                  borderRadius: `${radius.md}`,
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

          {/* Inbox / Archive tabs */}
          <div style={{ display: "flex", gap: "8px" }}>
            {([
              { key: "inbox", label: "Inbox", count: counts.inbox },
              { key: "archive", label: "Archive", count: counts.archive },
            ] as const).map((t) => {
              const on = view === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setView(t.key)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    cursor: "pointer",
                    fontFamily: font.family,
                    fontSize: `${font.size.small}px`,
                    fontWeight: on ? 500 : 400,
                    background: on ? colors.selectedSubtle : "transparent",
                    color: on ? colors.textSelected : colors.textMuted,
                    border: `1px solid ${on ? colors.strokeAction : colors.strokeSubtle}`,
                  }}
                >
                  {t.label} ({t.count})
                </button>
              );
            })}
          </div>
        </div>

        {items.length === 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              padding: "48px 24px",
              borderRadius: `${radius.lg}`,
              border: `1px dashed ${colors.strokeSubtle}`,
              background: colors.surface,
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
              {view === "inbox" ? "No feedback yet" : "Nothing archived"}
            </span>
            <span style={{ ...para, maxWidth: "420px" }}>
              {view === "inbox"
                ? "When visitors use the feedback button on the portal, their messages show up here."
                : "Feedback you archive from the inbox is kept here."}
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
                  borderRadius: `${radius.lg}`,
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
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    {view === "inbox" ? (
                      <>
                        {!f.read && (
                          <button onClick={() => onMarkRead(f.id)} style={rowBtn(colors)}>
                            Mark read
                          </button>
                        )}
                        <button onClick={() => onArchive(f.id)} style={rowBtn(colors)}>
                          Archive
                        </button>
                      </>
                    ) : (
                      <button onClick={() => onRestore(f.id)} style={rowBtn(colors)}>
                        Restore
                      </button>
                    )}
                  </div>
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

import React, { useEffect, useState } from "react";
import { Breadcrumb, Button, H1, P, Tabs } from "@dnb/eufemia";
import Layout from "../../components/Layout";
import PageShell from "../../components/PageShell";
import EufemiaThemeScope from "../../components/EufemiaThemeScope";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { radius } from "../../theme/tokens";
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
  const seconds = Math.round((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
};

type FeedbackView = "inbox" | "archive";

const MaintainerFeedbackPage: React.FC = () => {
  const { colors } = useTheme();
  const { isMaintainer, signingIn, signIn } = useAuth();
  const [view, setView] = useState<FeedbackView>("inbox");
  const [items, setItems] = useState<FeedbackEntry[]>([]);
  const [inboxUnread, setInboxUnread] = useState(0);
  const [counts, setCounts] = useState({ inbox: 0, archive: 0 });

  const refresh = (nextView: FeedbackView = view) => {
    const inbox = listFeedback();
    const archived = listArchived();
    setItems(nextView === "inbox" ? inbox : archived);
    setInboxUnread(inbox.filter((item) => !item.read).length);
    setCounts({ inbox: inbox.length, archive: archived.length });
  };

  useEffect(() => {
    if (isMaintainer) refresh(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaintainer, view]);

  if (!isMaintainer) {
    return (
      <Layout currentPath="/maintainer/feedback" currentPlatform="web">
        <PageShell contentStyle={{ gap: "20px" }}>
          <EufemiaThemeScope>
            <H1 style={{ margin: 0, color: colors.text }}>Feedback</H1>
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

  return (
    <Layout currentPlatform="web" currentPath="/maintainer/feedback">
      <PageShell contentStyle={{ gap: "24px" }}>
        <EufemiaThemeScope>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <Breadcrumb
              variant="responsive"
              navText="Page hierarchy"
              data={[
                { text: "Maintainer tools", href: "/maintainer" },
                { text: "Feedback" },
              ]}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <H1 style={{ margin: 0, color: colors.text }}>
                  Feedback
                  {inboxUnread > 0 && <small style={{ marginLeft: "12px", color: colors.textMuted }}>{inboxUnread} unread</small>}
                </H1>
                {view === "inbox" && inboxUnread > 0 && <Button text="Mark all read" variant="secondary" size="small" onClick={onMarkAll} />}
              </div>
              <P style={{ margin: 0, maxWidth: "720px", color: colors.textMuted }}>Feedback submitted from the portal&apos;s feedback button.</P>
              <Tabs
                id="feedback-view"
                selectedKey={view}
                data={[
                  { key: "inbox", title: `Inbox (${counts.inbox})` },
                  { key: "archive", title: `Archive (${counts.archive})` },
                ]}
                onChange={({ selectedKey }) => setView(selectedKey as FeedbackView)}
              />
            </div>

            <Tabs.Content id="feedback-view">
              {() => items.length === 0 ? (
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
                  <P size="medium" weight="medium" style={{ margin: 0, color: colors.text }}>{view === "inbox" ? "No feedback yet" : "Nothing archived"}</P>
                  <P style={{ margin: 0, maxWidth: "420px", color: colors.textMuted }}>
                    {view === "inbox" ? "When visitors use the feedback button on the portal, their messages show up here." : "Feedback you archive from the inbox is kept here."}
                  </P>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {items.map((item) => (
                    <article
                      key={item.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                        padding: "20px",
                        borderRadius: `${radius.lg}`,
                        border: `1px solid ${item.read ? colors.strokeSubtle : colors.strokeAction}`,
                        background: colors.surface,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        {!item.read && <span aria-label="unread" style={{ width: "8px", height: "8px", borderRadius: "999px", background: colors.accent, flexShrink: 0 }} />}
                        <P size="small" weight="medium" style={{ margin: 0, padding: "2px 10px", borderRadius: "999px", background: colors.selectedSubtle, color: colors.textSelected }}>{CATEGORY_LABELS[item.category]}</P>
                        <P size="small" style={{ margin: 0, color: colors.textMuted }}>
                          {timeAgo(item.createdAt)} · from <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>{item.page || "/"}</code>
                        </P>
                        <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                          {view === "inbox" ? (
                            <>
                              {!item.read && <Button text="Mark read" variant="secondary" size="small" onClick={() => onMarkRead(item.id)} />}
                              <Button text="Archive" variant="secondary" size="small" onClick={() => onArchive(item.id)} />
                            </>
                          ) : (
                            <Button text="Restore" variant="secondary" size="small" onClick={() => onRestore(item.id)} />
                          )}
                        </div>
                      </div>

                      <P style={{ margin: 0, color: colors.text, whiteSpace: "pre-wrap" }}>{item.message}</P>

                      {item.email && <a href={`mailto:${item.email}`} style={{ color: colors.accent }}>{item.email}</a>}
                    </article>
                  ))}
                </div>
              )}
            </Tabs.Content>
          </div>
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default MaintainerFeedbackPage;

export const Head = () => <title>Feedback | Maintainer tools</title>;

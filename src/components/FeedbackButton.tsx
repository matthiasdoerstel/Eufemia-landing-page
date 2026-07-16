import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { font, radius, shadow } from "../theme/tokens";
import { addFeedback, CATEGORY_LABELS, type FeedbackCategory } from "../lib/feedback";

const categories: FeedbackCategory[] = ["idea", "bug", "content", "other"];

const FeedbackButton: React.FC = () => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const reset = () => {
    setMessage("");
    setCategory("idea");
    setEmail("");
    setSent(false);
  };

  const close = () => {
    setOpen(false);
    // Reset after the panel is dismissed.
    setTimeout(reset, 200);
  };

  const submit = () => {
    if (!message.trim()) return;
    addFeedback({
      message,
      category,
      email,
      page: typeof window !== "undefined" ? window.location.pathname : "",
    });
    setSent(true);
  };

  const fieldLabel: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: `${font.size.small}px`,
    fontWeight: 500,
    color: colors.text,
  };

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Give feedback"
        style={{
          position: "fixed",
          right: "24px",
          bottom: "24px",
          zIndex: 300,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 18px",
          borderRadius: "999px",
          border: `1px solid ${colors.strokeSubtle}`,
          background: colors.accent,
          color: colors.pageBg,
          fontFamily: font.family,
          fontSize: `${font.size.body}px`,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: shadow.standard,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M3 4.5h14v9H8l-4 3v-3H3v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
        Feedback
      </button>

      {!open ? null : (
        <>
          <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 300, background: "transparent" }} />
          <div
            role="dialog"
            aria-label="Give feedback"
            style={{
              position: "fixed",
              right: "24px",
              bottom: "80px",
              zIndex: 301,
              width: "360px",
              maxWidth: "calc(100vw - 48px)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "24px",
              borderRadius: `${radius.xl}px`,
              background: colors.surface,
              border: `1px solid ${colors.strokeSubtle}`,
              boxShadow: shadow.standard,
            }}
          >
            {sent ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
                  Thanks for the feedback!
                </span>
                <span style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, color: colors.textMuted }}>
                  It's been sent to the Eufemia maintainers.
                </span>
                <button onClick={close} style={primaryBtn(colors)}>Done</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.lead}px`, color: colors.text }}>
                    Feedback about the portal
                  </span>
                  <button onClick={close} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer", color: colors.text, display: "flex" }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
                  Something broken on this site, or an idea to make it better? This is about the <strong style={{ color: colors.text, fontWeight: 500 }}>portal itself</strong> — not for reporting that a component isn't working.
                </p>

                {/* Category */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={fieldLabel}>Type</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {categories.map((c) => {
                      const on = category === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setCategory(c)}
                          style={{
                            padding: "5px 12px",
                            borderRadius: "999px",
                            cursor: "pointer",
                            fontFamily: font.family,
                            fontSize: `${font.size.small}px`,
                            background: on ? colors.selectedSubtle : "transparent",
                            color: on ? colors.textSelected : colors.textMuted,
                            border: `1px solid ${on ? colors.strokeAction : colors.strokeSubtle}`,
                          }}
                        >
                          {CATEGORY_LABELS[c]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Message */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={fieldLabel}>Your feedback</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Something broken on the portal, or a way to improve it…"
                    rows={4}
                    style={{
                      resize: "vertical",
                      padding: "10px 12px",
                      borderRadius: `${radius.md}px`,
                      border: `1px solid ${colors.strokeSubtle}`,
                      background: colors.pageBg,
                      color: colors.text,
                      fontFamily: font.family,
                      fontSize: `${font.size.body}px`,
                      outline: "none",
                    }}
                  />
                </div>

                {/* Email (optional) */}
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <span style={fieldLabel}>Email <span style={{ color: colors.textMuted, fontWeight: 400 }}>(optional)</span></span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@dnb.no"
                    style={{
                      padding: "10px 12px",
                      borderRadius: `${radius.md}px`,
                      border: `1px solid ${colors.strokeSubtle}`,
                      background: colors.pageBg,
                      color: colors.text,
                      fontFamily: font.family,
                      fontSize: `${font.size.body}px`,
                      outline: "none",
                    }}
                  />
                </div>

                <button onClick={submit} disabled={!message.trim()} style={{ ...primaryBtn(colors), opacity: message.trim() ? 1 : 0.5, cursor: message.trim() ? "pointer" : "default" }}>
                  Send feedback
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

function primaryBtn(colors: { accent: string; pageBg: string }): React.CSSProperties {
  return {
    alignSelf: "flex-start",
    padding: "10px 18px",
    borderRadius: `${radius.md}px`,
    border: "none",
    background: colors.accent,
    color: colors.pageBg,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    fontWeight: 500,
  };
}

export default FeedbackButton;

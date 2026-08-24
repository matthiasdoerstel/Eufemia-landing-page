import React, { useEffect, useRef, useState } from "react";
import { Button, H3, Input, P, Textarea, ToggleButton } from "@dnb/eufemia";
import { user_feedback as feedbackIcon } from "@dnb/eufemia/icons";
import EufemiaThemeScope from "./EufemiaThemeScope";
import { useTheme } from "../context/ThemeContext";
import { radius, shadow } from "../theme/tokens";
import { addFeedback, CATEGORY_LABELS, type FeedbackCategory } from "../lib/feedback";

const categories: FeedbackCategory[] = ["idea", "bug", "content", "other"];

const FeedbackButton: React.FC = () => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("idea");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [lift, setLift] = useState(0);
  const resetTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const update = () => {
      const footer = document.querySelector("footer");
      if (!footer) return setLift(0);
      const overlap = window.innerHeight - footer.getBoundingClientRect().top;
      setLift(overlap > 0 ? Math.ceil(overlap) + 16 : 0);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    schedule();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    ro?.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  const reset = () => {
    setMessage("");
    setCategory("idea");
    setEmail("");
    setSent(false);
  };

  const close = () => {
    setOpen(false);
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    resetTimeout.current = setTimeout(reset, 200);
  };

  const openPanel = () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
    setOpen(true);
  };

  useEffect(() => () => {
    if (resetTimeout.current) clearTimeout(resetTimeout.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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

  return (
    <EufemiaThemeScope>
      <>
        <Button
          text="Feedback"
          icon={feedbackIcon}
          iconPosition="right"
          onClick={() => (open ? close() : openPanel)}
          style={{
            position: "fixed",
            right: "24px",
            bottom: `calc(24px + env(safe-area-inset-bottom, 0px) + ${lift}px)`,
            zIndex: 300,
          }}
        />

        {!open ? null : (
          <>
            <div onClick={close} style={{ position: "fixed", inset: 0, zIndex: 300, background: "transparent" }} />
            <div
              role="dialog"
              aria-label="Give feedback"
              style={{
                position: "fixed",
                right: "24px",
                bottom: `calc(80px + env(safe-area-inset-bottom, 0px) + ${lift}px)`,
                zIndex: 301,
                width: "360px",
                maxWidth: "calc(100vw - 48px)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                padding: "24px",
                borderRadius: `${radius.xl}`,
                background: colors.surface,
                border: `1px solid ${colors.strokeSubtle}`,
                boxShadow: shadow.standard,
              }}
            >
              {sent ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
                  <H3 style={{ margin: 0, color: colors.text }}>Thanks for the feedback!</H3>
                  <P style={{ margin: 0, color: colors.textMuted }}>It&apos;s been sent to the Eufemia maintainers.</P>
                  <Button text="Done" onClick={close} />
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <H3 style={{ margin: 0, color: colors.text }}>Feedback about the portal</H3>
                    <Button title="Close" icon="close" size="small" onClick={close} />
                  </div>

                  <P size="small" style={{ margin: 0, color: colors.textMuted }}>
                    Something broken on this site, or an idea to make it better? This is about the <strong style={{ color: colors.text }}>portal itself</strong> — not for reporting that a component isn&apos;t working.
                  </P>

                  <ToggleButton.Group
                    label="Type"
                    value={category}
                    onChange={({ value }) => setCategory(value as FeedbackCategory)}
                  >
                    {categories.map((item) => (
                      <ToggleButton key={item} text={CATEGORY_LABELS[item]} value={item} />
                    ))}
                  </ToggleButton.Group>

                  <Textarea
                    label="Your feedback"
                    value={message}
                    onChange={({ value }) => setMessage(value)}
                    placeholder="Something broken on the portal, or a way to improve it…"
                    rows={4}
                    stretch
                    style={{ resize: "vertical" }}
                  />

                  <Input
                    label={<>Email <span style={{ color: colors.textMuted }}>(optional)</span></>}
                    type="email"
                    value={email}
                    onChange={({ value }) => setEmail(value)}
                    placeholder="you@dnb.no"
                    stretch
                  />

                  <Button text="Send feedback" onClick={submit} disabled={!message.trim()} />
                </>
              )}
            </div>
          </>
        )}
      </>
    </EufemiaThemeScope>
  );
};

export default FeedbackButton;

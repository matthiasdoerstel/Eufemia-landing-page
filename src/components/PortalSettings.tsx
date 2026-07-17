import React, { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { usePortalSettings, ALL_PLATFORMS } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { radius, font, shadow } from "../theme/tokens";
import { NAV_HEIGHT } from "./Header";

interface PortalSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.5 3.5L12.5 12.5M12.5 3.5L3.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Microsoft's four-square logo (brand colours, theme-independent).
const MicrosoftLogo = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7.2" height="7.2" fill="#F25022" />
    <rect x="8.8" y="0" width="7.2" height="7.2" fill="#7FBA00" />
    <rect x="0" y="8.8" width="7.2" height="7.2" fill="#00A4EF" />
    <rect x="8.8" y="8.8" width="7.2" height="7.2" fill="#FFB900" />
  </svg>
);

const CheckIcon = ({ color }: { color: string }) => (
  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ color }}>
    <path d="M2.5 6.5L5 9L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PortalSettings: React.FC<PortalSettingsProps> = ({ isOpen, onClose }) => {
  const { colors, mode, setMode, brand, setBrand } = useTheme();
  const { platforms, togglePlatform } = usePortalSettings();
  const { isMaintainer, user, signingIn, signIn, signOut } = useAuth();
  const [language, setLanguage] = React.useState("Norsk");
  const [skeletons, setSkeletons] = React.useState(true);
  const [showGrid, setShowGrid] = React.useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // --- Reusable pieces ------------------------------------------------------

  const ToggleButton: React.FC<{
    label: string;
    selected: boolean;
    onClick: () => void;
    checkbox?: boolean;
    disabled?: boolean;
    badge?: string;
  }> = ({ label, selected, onClick, checkbox, disabled, badge }) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabled && badge ? badge : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        gap: checkbox ? "8px" : 0,
        padding: checkbox ? "8px 24px 8px 16px" : "8px 24px",
        borderRadius: `${radius.md}`,
        border: selected
          ? `2px solid ${colors.buttonStrokeSelected}`
          : `1px solid ${colors.stroke}`,
        background: selected ? colors.selectedSubtle : colors.surface,
        color: selected ? colors.textSelected : colors.text,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        fontFamily: font.family,
        fontSize: `${font.size.body}px`,
        lineHeight: `${font.lineHeight.body}px`,
        whiteSpace: "nowrap",
      }}
    >
      {checkbox && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
            height: "16px",
            borderRadius: `${radius.sm}`,
            background: selected ? colors.selected : colors.surface,
            border: selected ? "none" : `1px solid ${colors.strokeActionAlt}`,
          }}
        >
          {selected && <CheckIcon color={colors.selectedSubtle} />}
        </span>
      )}
      {label}
      {badge && (
        <span
          style={{
            marginLeft: "8px",
            padding: "2px 8px",
            borderRadius: `${radius.sm}`,
            fontSize: `${font.size.small}px`,
            lineHeight: 1.4,
            fontWeight: 500,
            background: colors.surfaceAlt,
            color: colors.textMuted,
          }}
        >
          {badge}
        </span>
      )}
    </button>
  );

  const Switch: React.FC<{ on: boolean; onClick: () => void }> = ({ on, onClick }) => (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      style={{
        position: "relative",
        width: "40px",
        height: "24px",
        flexShrink: 0,
        borderRadius: `${radius.xl}`,
        border: on ? "none" : `1px solid ${colors.strokeActionAlt}`,
        background: on ? colors.selected : colors.surface,
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          left: on ? "auto" : "5px",
          right: on ? "3px" : "auto",
          width: on ? "18px" : "12px",
          height: on ? "18px" : "12px",
          borderRadius: `${radius.xl}`,
          background: on ? colors.selectedSubtle : colors.actionAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {on && <CheckIcon color={colors.selected} />}
      </span>
    </button>
  );

  const sectionLabel: React.CSSProperties = {
    fontFamily: font.family,
    fontSize: `${font.size.bodyMedium}px`,
    fontWeight: 500,
    lineHeight: `${font.lineHeight.body}px`,
    color: colors.text,
  };

  const helpText = (linkLabel: string, href: string) => (
    <span
      style={{
        fontFamily: font.family,
        fontSize: `${font.size.small}px`,
        lineHeight: `${font.lineHeight.small}px`,
        color: colors.textMuted,
      }}
    >
      Read more about{" "}
      <a href={href} target="_blank" rel="noreferrer" style={{ color: colors.accent, textDecoration: "underline" }}>
        {linkLabel}
      </a>
      .
    </span>
  );

  const chipRow: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px 16px",
    alignItems: "flex-start",
    width: "100%",
  };

  const labelBlock = (title: string, help?: React.ReactNode) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <span style={sectionLabel}>{title}</span>
      {help}
    </div>
  );

  const section: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  };

  const brands = ["DNB", "Sbanken (WIP)", "DNB Eiendom", "DNB Carnegie (WIP)"];
  const languages = ["Norsk", "Svenska", "Dansk", "English (GB)"];
  const themeModes: Array<{ label: string; value: "auto" | "light" | "dark" }> = [
    { label: "Auto", value: "auto" },
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
  ];

  return (
    <>
      {/* Click-away backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 200, background: "transparent" }}
      />
      <div
        role="dialog"
        aria-label="Portal settings"
        style={{
          position: "fixed",
          top: `${NAV_HEIGHT + 8}px`,
          right: "24px",
          zIndex: 201,
          width: "434px",
          maxWidth: "560px",
          minWidth: "340px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          padding: "40px",
          borderRadius: `${radius.xl}`,
          background: colors.surface,
          border: `1px solid ${colors.strokeSubtle}`,
          boxShadow: shadow.standard,
          maxHeight: `calc(100vh - ${NAV_HEIGHT + 32}px)`,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{
              fontFamily: font.family,
              fontSize: `${font.size.lead}px`,
              fontWeight: 500,
              lineHeight: `${font.lineHeight.lead}px`,
              color: colors.text,
            }}
          >
            Portal settings
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", color: colors.text, display: "flex" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Brand */}
        <div style={section}>
          {labelBlock("Brand", helpText("theming", "https://eufemia.dnb.no/uilib/usage/customisation/theming/"))}
          <div style={chipRow}>
            {brands.map((b) => {
              const brandOf = (label: string): typeof brand =>
                label.startsWith("Sbanken") ? "Sbanken" : label.includes("Carnegie") ? "Carnegie" : "DNB";
              return (
                <ToggleButton
                  key={b}
                  label={b}
                  selected={brand === brandOf(b) && (brand !== "DNB" || b === "DNB")}
                  onClick={() => {
                    const next = brandOf(b);
                    // Carnegie has no dark mode yet — fall back to light.
                    if (next === "Carnegie" && mode === "dark") setMode("light");
                    setBrand(next);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Component language */}
        <div style={section}>
          {labelBlock("Component language", helpText("localization", "https://eufemia.dnb.no/uilib/usage/customisation/localization/"))}
          <div style={chipRow}>
            {languages.map((l) => (
              <ToggleButton key={l} label={l} selected={language === l} onClick={() => setLanguage(l)} />
            ))}
          </div>
        </div>

        {/* Theming — wired to ThemeContext */}
        <div style={section}>
          {labelBlock("Theming", helpText("theming", "https://eufemia.dnb.no/uilib/usage/customisation/theming/"))}
          <div style={chipRow}>
            {themeModes.map((t) => {
              const darkDisabled = brand === "Carnegie" && t.value === "dark";
              return (
                <ToggleButton
                  key={t.value}
                  label={t.label}
                  selected={mode === t.value}
                  disabled={darkDisabled}
                  badge={darkDisabled ? "Coming soon" : undefined}
                  onClick={() => setMode(t.value)}
                />
              );
            })}
          </div>
        </div>

        {/* Preferred platform(s) */}
        <div style={section}>
          {labelBlock(
            "Preferred platform(s)",
            <span
              style={{
                fontFamily: font.family,
                fontSize: `${font.size.small}px`,
                lineHeight: `${font.lineHeight.small}px`,
                color: colors.textMuted,
              }}
            >
              This will filter search results based on your selection,
            </span>
          )}
          <div style={chipRow}>
            {ALL_PLATFORMS.map((p) => (
              <ToggleButton
                key={p}
                label={p}
                checkbox
                selected={platforms[p]}
                onClick={() => togglePlatform(p)}
              />
            ))}
          </div>
        </div>

        {/* Other */}
        <div style={section}>
          <span style={sectionLabel}>Other</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Switch on={skeletons} onClick={() => setSkeletons((v) => !v)} />
              <span
                style={{
                  fontFamily: font.family,
                  fontSize: `${font.size.body}px`,
                  lineHeight: `${font.lineHeight.body}px`,
                  color: colors.text,
                }}
              >
                Show everything behind skeletons
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Switch on={showGrid} onClick={() => setShowGrid((v) => !v)} />
              <span
                style={{
                  fontFamily: font.family,
                  fontSize: `${font.size.body}px`,
                  lineHeight: `${font.lineHeight.body}px`,
                  color: colors.text,
                }}
              >
                Show grid
              </span>
            </div>
          </div>
        </div>

        {/* Sign In — maintainer tools */}
        <div style={section}>
          {labelBlock(
            "Sign In",
            <span
              style={{
                fontFamily: font.family,
                fontSize: `${font.size.small}px`,
                lineHeight: `${font.lineHeight.small}px`,
                color: colors.textMuted,
              }}
            >
              Maintainer tools
            </span>
          )}

          {!isMaintainer ? (
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
                lineHeight: `${font.lineHeight.body}px`,
                cursor: signingIn ? "default" : "pointer",
                opacity: signingIn ? 0.6 : 1,
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = colors.surfaceAlt)}
              onMouseLeave={(e) => (e.currentTarget.style.background = colors.surface)}
            >
              <MicrosoftLogo />
              {signingIn ? "Signing in…" : "Maintainer sign-in"}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, fontWeight: 500, color: colors.text }}>
                  {user?.name}
                </span>
                <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
                  {user?.email}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  onClick={() => signOut()}
                  style={{
                    padding: "8px 16px",
                    borderRadius: `${radius.md}`,
                    border: `1px solid ${colors.stroke}`,
                    background: "transparent",
                    color: colors.text,
                    fontFamily: font.family,
                    fontSize: `${font.size.body}px`,
                    lineHeight: `${font.lineHeight.body}px`,
                    cursor: "pointer",
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PortalSettings;

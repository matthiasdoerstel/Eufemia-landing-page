import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { useTheme } from "../context/ThemeContext";
import { usePortalSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { unreadCount } from "../lib/feedback";
import { radius, font } from "../theme/tokens";
import { NAV_HEIGHT } from "./Header";

type Platform = "web" | "ios" | "android" | null;

type IconKind = "home" | "chevron" | "grid" | "arrow";

interface NavItem {
  label: string;
  path: string;
  icon: IconKind;
  indent?: boolean;
}

// Web nav mirrors the Figma "About Eufemia" frame sidebar.
const webNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/web", icon: "home" },
  { label: "Usage", path: "/docs/web/usage", icon: "chevron", indent: true },
  { label: "Typography", path: "/docs/web/typography", icon: "chevron", indent: true },
  { label: "Helper Classes", path: "/docs/web/helper-classes", icon: "chevron", indent: true },
  { label: "Patterns", path: "/docs/web/patterns", icon: "chevron", indent: true },
  { label: "Development", path: "/docs/web/development", icon: "chevron", indent: true },
  { label: "Performance", path: "/docs/web/performance", icon: "chevron", indent: true },
  { label: "Components", path: "/docs/web/components", icon: "grid" },
  { label: "Layout", path: "/docs/web/layout", icon: "grid" },
  { label: "HTML Elements", path: "/docs/web/html-elements", icon: "grid" },
  { label: "Extensions", path: "/docs/web/extensions", icon: "grid" },
  { label: "Design Tokens", path: "/docs/web/design-tokens", icon: "grid" },
];

const iosNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/ios", icon: "home" },
  { label: "Components", path: "/docs/ios/components", icon: "grid" },
  { label: "Design Tokens", path: "/docs/ios/design-tokens", icon: "grid" },
];

const androidNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/android", icon: "home" },
  { label: "Components", path: "/docs/android/components", icon: "grid" },
  { label: "Design Tokens", path: "/docs/android/design-tokens", icon: "grid" },
];

const Icon = ({ kind }: { kind: IconKind }) => {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", style: { flexShrink: 0 } } as const;
  switch (kind) {
    case "home":
      return (
        <svg {...common}>
          <path d="M2 6L8 1.5L14 6V13.5C14 14.05 13.55 14.5 13 14.5H3C2.45 14.5 2 14.05 2 13.5V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "grid":
      return (
        <svg {...common}>
          <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
};

// Leading icon slot. The 16px slot (+8px gap) is ALWAYS reserved so the label
// never shifts; the icon itself only fades in/out. `play` triggers a small
// in-and-out nudge (used on the active row after a click / navigation).
const Lead = ({ kind, show, play }: { kind: IconKind; show: boolean; play?: boolean }) => (
  <span style={{ width: "16px", marginRight: "8px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
    <span
      style={{
        display: "inline-flex",
        opacity: show ? 1 : 0,
        transition: "opacity 0.15s ease",
        animation: play ? "sbArrowNudge 0.38s ease" : undefined,
      }}
    >
      <Icon kind={kind} />
    </span>
  </span>
);

interface SidebarProps {
  currentPlatform?: Platform;
  currentPath?: string;
  isMobile?: boolean;
  open?: boolean;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentPlatform = null,
  currentPath = "",
  isMobile = false,
  open = false,
  onNavigate,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  // Bumps on every row click so the arrow nudge replays — even when the clicked
  // item is already the active one (same route, no remount from navigation).
  const [click, setClick] = useState<{ key: string; n: number }>({ key: "", n: 0 });
  const onRowClick = (k: string) => {
    setClick((c) => ({ key: k, n: c.n + 1 }));
    onNavigate?.();
  };
  const { colors } = useTheme();
  const { docPlatform, setDocPlatform } = usePortalSettings();
  const { isMaintainer } = useAuth();
  const [hasUnreadFeedback, setHasUnreadFeedback] = useState(false);

  useEffect(() => {
    if (isMaintainer) setHasUnreadFeedback(unreadCount() > 0);
  }, [isMaintainer]);

  // Sync the persisted selection from the URL only on actual docs pages, so
  // visiting About / Getting started doesn't reset the chosen platform.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const m = window.location.pathname.match(/\/docs\/(web|ios|android)\b/);
    if (m) setDocPlatform(m[1] as "web" | "ios" | "android");
  }, []);

  const navItems =
    docPlatform === "web"
      ? webNavItems
      : docPlatform === "ios"
      ? iosNavItems
      : docPlatform === "android"
      ? androidNavItems
      : [];

  const platformLabels: Record<string, string> = { web: "Web", ios: "iOS", android: "Android" };

  // Figma uses colour-only selection (no pill): active = #e4eed7 + arrow icon,
  // others = mint. Hover only nudges brightness.
  const rowStyle = (active: boolean, hover: boolean, indent?: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: 0,
    paddingLeft: indent ? "16px" : 0,
    textDecoration: "none",
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    fontWeight: active ? 500 : 400,
    color: active ? colors.textSelected : colors.accent,
    opacity: hover && !active ? 0.8 : 1,
    whiteSpace: "nowrap",
    transition: "opacity 0.15s ease",
  });

  // Notification dot for the Maintainer tools item — shown when there is unread
  // portal feedback waiting.
  const notificationDot = (
    <span
      aria-label="Unread feedback"
      title="Unread feedback"
      style={{
        marginLeft: "auto",
        alignSelf: "center",
        width: "9px",
        height: "9px",
        flexShrink: 0,
        borderRadius: "999px",
        background: colors.accent,
      }}
    />
  );

  const renderRow = (item: NavItem) => {
    const active = currentPath === item.path;
    const isChevron = item.icon === "chevron";
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={() => onRowClick(item.path)}
        onMouseEnter={() => setHovered(item.path)}
        onMouseLeave={() => setHovered(null)}
        style={rowStyle(active, hovered === item.path, item.indent)}
      >
        <Lead
          key={click.key === item.path ? `c-${item.path}-${click.n}` : active ? `a-${item.path}` : item.path}
          kind={isChevron ? "arrow" : active ? "arrow" : item.icon}
          show={isChevron ? active || hovered === item.path : true}
          play={active || click.key === item.path}
        />
        {item.label}
      </Link>
    );
  };

  const menuLink = (to: string, label: string, key: string, indent = false, badge = false, beta = false) => {
    const active = currentPath === to || currentPath.startsWith(`${to}/`);
    return (
      <Link
        to={to}
        onClick={() => onRowClick(key)}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        style={rowStyle(active, hovered === key, indent)}
      >
        <Lead
          key={click.key === key ? `c-${key}-${click.n}` : active ? `a-${to}` : key}
          kind="arrow"
          show={active || hovered === key}
          play={active || click.key === key}
        />
        {label}
        {beta && (
          <span style={{ marginLeft: "auto", padding: "2px 7px", borderRadius: radius.sm, background: colors.selectedSubtle, color: colors.textSelected, fontFamily: font.family, fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}>Beta</span>
        )}
        {badge && hasUnreadFeedback && notificationDot}
      </Link>
    );
  };

  return (
    <aside
      style={{
        width: "384px",
        maxWidth: isMobile ? "86vw" : undefined,
        height: `calc(100vh - ${NAV_HEIGHT}px)`,
        position: "fixed",
        top: `${NAV_HEIGHT}px`,
        left: 0,
        background: colors.pageBg,
        borderRight: `1px solid ${colors.strokeSubtle}`, // the vertical divider @ x=384
        overflowY: "auto",
        padding: "55px 24px 40px",
        boxSizing: "border-box",
        fontFamily: font.family,
        zIndex: isMobile ? 95 : 1,
        transform: isMobile && !open ? "translateX(-100%)" : "translateX(0)",
        transition: "transform 0.25s ease",
        boxShadow: isMobile && open ? "0 8px 32px rgba(0,0,0,0.35)" : "none",
      }}
      aria-hidden={isMobile && !open}
    >
      <style>{`@keyframes sbArrowNudge { 0% { transform: translateX(-6px); } 55% { transform: translateX(3px); } 100% { transform: translateX(0); } }`}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "27px", width: "336px" }}>
        {/* Menu */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {menuLink("/about", "About Eufemia", "about")}
          {menuLink("/docs/design", "Designer Guide", "designer-guide")}
          {menuLink("/getting-started", "Developer Guide", "developer-guide")}
          {menuLink("/eufemia-and-ai", "Eufemia and AI", "eufemia-and-ai", false, false, true)}
          {isMaintainer && menuLink("/maintainer", "Maintainer tools", "maintainer", false, true)}
        </nav>

        {/* Divider between the menu and the platform selector (full-width) */}
        <div style={{ height: "1px", background: colors.strokeSubtle, width: "calc(100% + 48px)", marginLeft: "-24px", marginTop: "20px", marginBottom: "20px" }} />

        {/* Platform selector — segmented pills */}
        <div style={{ display: "flex", gap: "8px", marginTop: "-9px" }}>
          {(["web", "ios", "android"] as ("web" | "ios" | "android")[]).map((p) => {
            const active = docPlatform === p;
            return (
              <button
                key={p}
                onClick={() => {
                  setDocPlatform(p);
                  onNavigate?.();
                  navigate(p === "web" ? "/docs/web" : p === "ios" ? "/docs/ios" : "/docs/android");
                }}
                onMouseEnter={() => setHovered(`platform-${p}`)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: "8px 20px",
                  borderRadius: `${radius.md}`,
                  border: `1px solid ${active ? colors.accent : colors.strokeSubtle}`,
                  background: active
                    ? colors.selectedSubtle
                    : hovered === `platform-${p}`
                    ? colors.surfaceAlt
                    : colors.surface,
                  cursor: "pointer",
                  fontFamily: font.family,
                  fontSize: `${font.size.body}px`,
                  lineHeight: `${font.lineHeight.body}px`,
                  fontWeight: active ? 500 : 400,
                  color: active ? colors.textSelected : colors.accent,
                  transition: "background 0.15s ease, border-color 0.15s ease",
                }}
              >
                {platformLabels[p]}
              </button>
            );
          })}
        </div>

        {/* Platform navigation */}
        {navItems.length > 0 && (
          <nav style={{ display: "flex", flexDirection: "column", gap: "32px", width: "142px" }}>
            {/* Overview (home) */}
            {renderRow(navItems[0])}
            {/* Indented section */}
            {navItems.some((i) => i.indent) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingLeft: "16px" }}>
                {navItems.filter((i) => i.indent).map((i) => renderRow({ ...i, indent: false }))}
              </div>
            )}
            {/* Remaining top-level (grid) items */}
            {navItems.slice(1).filter((i) => !i.indent).map((i) => renderRow(i))}
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

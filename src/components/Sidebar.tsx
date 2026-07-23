import React, { useState, useEffect } from "react";
import { Link, navigate } from "gatsby";
import { Icon as EufemiaIcon } from "@dnb/eufemia";
import { ai, arrow_right, brush, chevron_down, chevron_right, chip, cog, hierarchy, home, information, layout_grid, user_feedback } from "@dnb/eufemia/icons";
import { useTheme } from "../context/ThemeContext";
import { usePortalSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { unreadCount } from "../lib/feedback";
import { radius, font } from "../theme/tokens";
import { NAV_HEIGHT } from "./Header";

type Platform = "web" | "ios" | "android" | null;

type EufemiaIconDefinition = typeof home;

interface NavItem {
  label: string;
  path: string;
  icon?: EufemiaIconDefinition | "chevron";
}

const webNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/web", icon: home },
  { label: "Design Tokens", path: "/docs/web/design-tokens", icon: hierarchy },
];

interface ComponentNavGroup {
  label: string;
  items: NavItem[];
}

const webComponentNavGroups: ComponentNavGroup[] = [
  {
    label: "Basic UI",
    items: [
      { label: "Avatar", path: "/docs/web/components/avatar", icon: "chevron" },
      { label: "Anchor (TextLink)", path: "/docs/web/components/anchor", icon: "chevron" },
      { label: "Badge", path: "/docs/web/components/badge", icon: "chevron" },
      { label: "Card", path: "/docs/web/components/card", icon: "chevron" },
      { label: "Divider", path: "/docs/web/components/divider", icon: "chevron" },
      { label: "InfoCard", path: "/docs/web/components/info-card", icon: "chevron" },
      { label: "Pagination", path: "/docs/web/components/pagination", icon: "chevron" },
      { label: "Popover", path: "/docs/web/components/popover", icon: "chevron" },
      { label: "Menu", path: "/docs/web/components/menu", icon: "chevron" },
      { label: "ProgressBar", path: "/docs/web/components/progress-indicator", icon: "chevron" },
      { label: "ProgressIndicator", path: "/docs/web/components/progress-indicator", icon: "chevron" },
      { label: "Timeline", path: "/docs/web/components/timeline", icon: "chevron" },
      { label: "Tag", path: "/docs/web/components/tag", icon: "chevron" },
      { label: "Table", path: "/docs/web/components/table", icon: "chevron" },
      { label: "Skeleton", path: "/docs/web/components/skeleton", icon: "chevron" },
    ],
  },
  {
    label: "Form and Input",
    items: [
      { label: "Autocomplete", path: "/docs/web/components/autocomplete", icon: "chevron" },
      { label: "Buttons", path: "/docs/web/components/button", icon: "chevron" },
      { label: "Dropdown", path: "/docs/web/components/dropdown", icon: "chevron" },
      { label: "DateFormat", path: "/docs/web/components/date-format", icon: "chevron" },
      { label: "DatePicker", path: "/docs/web/components/date-picker", icon: "chevron" },
      { label: "Filter", path: "/docs/web/components/filter", icon: "chevron" },
      { label: "FormLabel", path: "/docs/web/components/form-label", icon: "chevron" },
      { label: "InputMasked", path: "/docs/web/components/input-masked", icon: "chevron" },
      { label: "ListFormat", path: "/docs/web/components/list-format", icon: "chevron" },
      { label: "MultiSelect", path: "/docs/web/components/multi-select", icon: "chevron" },
      { label: "NumberFormat", path: "/docs/web/components/number-format", icon: "chevron" },
      { label: "Slider", path: "/docs/web/components/slider", icon: "chevron" },
      { label: "StepIndicator", path: "/docs/web/components/step-indicator", icon: "chevron" },
      { label: "Switch", path: "/docs/web/components/switch", icon: "chevron" },
      { label: "Radio", path: "/docs/web/components/radio", icon: "chevron" },
      { label: "Checkbox", path: "/docs/web/components/checkbox", icon: "chevron" },
      { label: "TextInput", path: "/docs/web/components/text-input", icon: "chevron" },
      { label: "TextArea", path: "/docs/web/components/textarea", icon: "chevron" },
      { label: "ToggleButton", path: "/docs/web/components/toggle-button", icon: "chevron" },
      { label: "Upload", path: "/docs/web/components/upload", icon: "chevron" },
    ],
  },
  {
    label: "Navigation and Structure",
    items: [
      { label: "Accordion", path: "/docs/web/components/accordion", icon: "chevron" },
      { label: "Breadcrumbs", path: "/docs/web/components/breadcrumb", icon: "chevron" },
      { label: "Heading", path: "/docs/web/components/heading", icon: "chevron" },
      { label: "HeightAnimation", path: "/docs/web/components/height-animation", icon: "chevron" },
      { label: "List", path: "/docs/web/components/list", icon: "chevron" },
      { label: "Search", path: "/docs/web/components/search", icon: "chevron" },
      { label: "Tabs", path: "/docs/web/components/tabs", icon: "chevron" },
      { label: "Section", path: "/docs/web/components/section", icon: "chevron" },
      { label: "SkipContent", path: "/docs/web/components/skip-content", icon: "chevron" },
    ],
  },
  {
    label: "Feedback and Communication",
    items: [
      { label: "Chat", path: "/docs/web/components/chat", icon: "chevron" },
      { label: "Dialog", path: "/docs/web/components/dialog", icon: "chevron" },
      { label: "Drawer", path: "/docs/web/components/drawer", icon: "chevron" },
      { label: "GlobalStatus", path: "/docs/web/components/global-status", icon: "chevron" },
      { label: "FormStatus (MessageBox)", path: "/docs/web/components/form-status", icon: "chevron" },
      { label: "Modal", path: "/docs/web/components/modal", icon: "chevron" },
      { label: "TermDefinition", path: "/docs/web/components/term-definition", icon: "chevron" },
      { label: "Tooltip", path: "/docs/web/components/tooltip", icon: "chevron" },
      { label: "Stat", path: "/docs/web/components/stat", icon: "chevron" },
    ],
  },
  {
    label: "Other / Templates",
    items: [
      { label: "CopyOnClick", path: "/docs/web/components/copy-on-click", icon: "chevron" },
      { label: "CountryFlag", path: "/docs/web/components/country-flag", icon: "chevron" },
      { label: "Documentation template", path: "/docs/web/components/documentation-template", icon: "chevron" },
      { label: "Logo", path: "/docs/web/components/logo", icon: "chevron" },
      { label: "PortalRoot", path: "/docs/web/components/portal-root", icon: "chevron" },
      { label: "404/501 template", path: "/docs/web/components/404-501-template", icon: "chevron" },
      { label: "Fragments (DrawerList, ScrollView, TextCounter)", path: "/docs/web/components/fragments", icon: "chevron" },
    ],
  },
  {
    label: "Accessibility / Navigation",
    items: [
      { label: "AriaLive", path: "/docs/web/components/aria-live", icon: "chevron" },
      { label: "HelpButton", path: "/docs/web/components/help-button", icon: "chevron" },
      { label: "VisuallyHidden", path: "/docs/web/components/visually-hidden", icon: "chevron" },
    ],
  },
];

const componentGroupForPath = (path: string) =>
  webComponentNavGroups.find((group) =>
    group.items.some((item) => item.path === path)
  )?.label;

const availableWebComponentPaths = new Set([
  "/docs/web/components/button",
]);

const iosNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/ios", icon: home },
  { label: "Components", path: "/docs/ios/components", icon: layout_grid },
  { label: "Design Tokens", path: "/docs/ios/design-tokens", icon: layout_grid },
];

const androidNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/android", icon: home },
  { label: "Components", path: "/docs/android/components", icon: layout_grid },
  { label: "Design Tokens", path: "/docs/android/design-tokens", icon: layout_grid },
];

const navigationIcon = (icon?: EufemiaIconDefinition | "chevron"): EufemiaIconDefinition =>
  icon === "chevron" ? chevron_right : icon ?? chevron_right;

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
  const [componentsOpen, setComponentsOpen] = useState(currentPath.startsWith("/docs/web/components"));
  const [componentGroupsOpen, setComponentGroupsOpen] = useState<Record<string, boolean>>({});
  const onRowClick = () => onNavigate?.();
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

  const selectedComponentGroup = componentGroupForPath(currentPath);

  useEffect(() => {
    if (!selectedComponentGroup) return;
    setComponentsOpen(true);
    setComponentGroupsOpen((groups) => ({ ...groups, [selectedComponentGroup]: true }));
  }, [selectedComponentGroup]);

  const navItems =
    docPlatform === "web"
      ? webNavItems
      : docPlatform === "ios"
      ? iosNavItems
      : docPlatform === "android"
      ? androidNavItems
      : [];

  const platformLabels: Record<string, string> = { web: "Web", ios: "iOS", android: "Android" };

  const rowStyle = (active: boolean, hover: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    width: "100%",
    boxSizing: "border-box",
    minHeight: "40px",
    padding: "8px 12px",
    borderRadius: `${radius.md}`,
    textDecoration: "none",
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    fontWeight: active ? 500 : 400,
    color: active ? colors.textSelected : colors.accent,
    background: active ? colors.selectedSubtle : hover ? colors.surfaceAlt : "transparent",
    transition: "background 0.15s ease, color 0.15s ease",
  });

  const menuRowStyle = (active: boolean, hover: boolean): React.CSSProperties => ({
    ...rowStyle(active, hover),
    position: "relative",
    margin: "-8px -12px",
    padding: "8px 12px",
  });

  const nestedRowStyle = (active: boolean, hover: boolean, depth: number): React.CSSProperties => ({
    ...rowStyle(active, hover),
    width: `calc(100% - ${depth * 16}px)`,
    marginLeft: `${depth * 16}px`,
  });

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
    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onRowClick}
        onMouseEnter={() => setHovered(item.path)}
        onMouseLeave={() => setHovered(null)}
        style={rowStyle(active, hovered === item.path)}
      >
        <span style={{ width: "16px", marginRight: "8px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
          <EufemiaIcon icon={navigationIcon(item.icon)} aria-hidden />
        </span>
        {item.label}
      </Link>
    );
  };

  const renderComponentRow = (item: NavItem) => {
    const available = availableWebComponentPaths.has(item.path);
    const active = available && currentPath === item.path;
    const style = nestedRowStyle(active, available && hovered === item.path, 2);

    const content = (
      <>
        {active && (
          <span style={{ width: "16px", marginRight: "8px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
            <EufemiaIcon icon={arrow_right} aria-hidden />
          </span>
        )}
        {item.label}
      </>
    );

    if (!available) {
      return (
        <span
          key={item.path}
          aria-disabled="true"
          style={{ ...style, color: colors.textMuted, background: "transparent", cursor: "not-allowed", opacity: 0.55 }}
        >
          {content}
        </span>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        onClick={onRowClick}
        onMouseEnter={() => setHovered(item.path)}
        onMouseLeave={() => setHovered(null)}
        style={style}
      >
        {content}
      </Link>
    );
  };
  const renderComponentsToggle = () => {
    const key = "web-components";
    const active = currentPath.startsWith("/docs/web/components");
    return (
      <button
        type="button"
        aria-expanded={componentsOpen}
        onClick={() => setComponentsOpen((open) => !open)}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        style={{ ...rowStyle(active, hovered === key), border: 0, cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ width: "16px", marginRight: "8px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
          <EufemiaIcon icon={layout_grid} aria-hidden />
        </span>
        Components
        <span style={{ marginLeft: "auto", display: "inline-flex", color: colors.textMuted, transform: componentsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>
          <EufemiaIcon icon={chevron_down} aria-hidden />
        </span>
      </button>
    );
  };
  const menuLink = (to: string, label: string, key: string, icon: EufemiaIconDefinition, badge = false, beta = false) => {
    const active = currentPath === to || currentPath.startsWith(`${to}/`);
    return (
      <Link
        to={to}
        onClick={onRowClick}
        onMouseEnter={() => setHovered(key)}
        onMouseLeave={() => setHovered(null)}
        style={menuRowStyle(active, hovered === key)}
      >
        <span style={{ width: "16px", marginRight: "8px", flexShrink: 0, display: "inline-flex", alignItems: "center" }}>
          <EufemiaIcon icon={icon} aria-hidden />
        </span>
        {label}
        {beta && (
          <span style={{ marginLeft: "auto", padding: "2px 7px", border: `1px solid ${colors.accent}`, borderRadius: radius.sm, background: colors.surface, color: colors.textSelected, fontFamily: font.family, fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}>Beta</span>
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
          {menuLink("/about", "About Eufemia", "about", information)}
          {menuLink("/docs/design", "Designer Guide", "designer-guide", brush)}
          {menuLink("/getting-started", "Developer Guide", "developer-guide", chip)}
          {menuLink("/contribute", "Contribute", "contribute", user_feedback)}
          {menuLink("/eufemia-and-ai", "Eufemia and AI", "eufemia-and-ai", ai, false, true)}
          {isMaintainer && menuLink("/maintainer", "Maintainer tools", "maintainer", cog, true)}
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

        {navItems.length > 0 && (
          <nav style={{ display: "flex", flexDirection: "column", gap: "16px", width: "336px" }}>
            {docPlatform === "web" ? (
              <>
                {renderRow(webNavItems[0])}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {renderComponentsToggle()}
                  {componentsOpen && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {webComponentNavGroups.map((group) => {
                        const key = `component-group-${group.label}`;
                        const groupOpen = componentGroupsOpen[group.label] ?? false;
                        return (
                          <section key={group.label} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <button
                              type="button"
                              aria-expanded={groupOpen}
                              onClick={() => setComponentGroupsOpen((groups) => ({ ...groups, [group.label]: !groupOpen }))}
                              onMouseEnter={() => setHovered(key)}
                              onMouseLeave={() => setHovered(null)}
                              style={{ ...nestedRowStyle(groupOpen, hovered === key, 1), border: 0, cursor: "pointer", textAlign: "left" }}
                            >
                              {group.label}
                              <span style={{ marginLeft: "auto", display: "inline-flex", color: colors.textMuted, transform: groupOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>
                                <EufemiaIcon icon={chevron_down} aria-hidden />
                              </span>
                            </button>
                            {groupOpen && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "4px", paddingLeft: "16px" }}>
                                {group.items.map(renderComponentRow)}
                              </div>
                            )}
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
                {renderRow(webNavItems[1])}
              </>
            ) : (
              <>
                {renderRow(navItems[0])}
                {navItems.slice(1).map((item) => renderRow(item))}
              </>
            )}
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

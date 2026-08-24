import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import { ai_medium, brush_medium, chip_medium, cog_medium, hierarchy_medium, home_medium, information_medium, layout_grid_medium, user_feedback_medium } from "@dnb/eufemia/icons";
import { useTheme } from "../context/ThemeContext";
import { usePortalSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { unreadCount } from "../lib/feedback";
import { radius, font } from "../theme/tokens";
import MenuRow, { MENU_LIST_CLASS, MENU_ROW_CSS, MenuRowState } from "./MenuRow";
import { NAV_HEIGHT } from "./Header";

type Platform = "web" | "ios" | "android" | null;

type EufemiaIconDefinition = typeof home_medium;

export interface NavItem {
  label: string;
  path: string;
  icon?: EufemiaIconDefinition | "chevron";
}

export const webNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/web", icon: home_medium },
  { label: "Design Tokens", path: "/docs/web/design-tokens", icon: hierarchy_medium },
];

export interface ComponentNavGroup {
  label: string;
  items: NavItem[];
}

export const webComponentNavGroups: ComponentNavGroup[] = [
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

export const availableWebComponentPaths = new Set([
  "/docs/web/components/button",
]);

export const iosNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/ios", icon: home_medium },
  { label: "Components", path: "/docs/ios/components", icon: layout_grid_medium },
  { label: "Design Tokens", path: "/docs/ios/design-tokens", icon: layout_grid_medium },
];

export const androidNavItems: NavItem[] = [
  { label: "Overview", path: "/docs/android", icon: home_medium },
  { label: "Components", path: "/docs/android/components", icon: layout_grid_medium },
  { label: "Design Tokens", path: "/docs/android/design-tokens", icon: layout_grid_medium },
];

// Component leaves are marked `"chevron"` in the nav data but carry no icon in
// the Menu design — only real icon definitions reach the row.
const navigationIcon = (icon?: EufemiaIconDefinition | "chevron"): EufemiaIconDefinition | undefined =>
  icon === "chevron" ? undefined : icon;

// Platform pills. Hover lives in CSS for the same reason the Menu rows do —
// so the sidebar carries no hover state in React at all.
const PLATFORM_PILL_CSS = `
.eu-plat-pill {
  padding: 8px 20px;
  border: 1px solid var(--eu-strokeSubtle);
  border-radius: var(--eu-radius-md);
  background: var(--eu-surface);
  color: var(--eu-accent);
  font-family: DNB, sans-serif;
  font-size: ${font.size.body}px;
  line-height: ${font.lineHeight.body}px;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.eu-plat-pill:hover { background: var(--eu-surfaceAlt); }
.eu-plat-pill--active {
  border-color: var(--eu-accent);
  background: var(--eu-selectedSubtle);
  color: var(--eu-textSelected);
  font-weight: 500;
}
`;

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

  // Trailing-slot decorations. Both use `currentColor` so they stay legible on a
  // selected row, where the background flips to the accent fill.
  const notificationDot = (
    <span
      aria-label="Unread feedback"
      title="Unread feedback"
      style={{ width: "9px", height: "9px", flexShrink: 0, borderRadius: "999px", background: "currentColor" }}
    />
  );

  const betaTag = (
    <span
      style={{
        // 1px block padding + 20px line + 1px borders = 24px, so the tag fits the
        // row's 24px content band and doesn't stretch it past 56px.
        padding: "1px 7px",
        border: "1px solid currentColor",
        borderRadius: radius.sm,
        fontFamily: font.family,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "20px",
      }}
    >
      Beta
    </span>
  );

  const rowState = (active: boolean): MenuRowState => (active ? "selected" : "default");

  const renderRow = (item: NavItem) => (
    <MenuRow
      key={item.path}
      level={1}
      icon={navigationIcon(item.icon)}
      label={item.label}
      to={item.path}
      onClick={onRowClick}
      state={rowState(currentPath === item.path)}
    />
  );

  const renderComponentRow = (item: NavItem) => {
    if (!availableWebComponentPaths.has(item.path)) {
      return <MenuRow key={item.path} level={2} label={item.label} disabled />;
    }
    return (
      <MenuRow
        key={item.path}
        level={2}
        label={item.label}
        to={item.path}
        onClick={onRowClick}
        state={rowState(currentPath === item.path)}
      />
    );
  };

  const renderComponentsToggle = () => (
    <MenuRow
      level={1}
      icon={layout_grid_medium}
      label="Components"
      chevron={componentsOpen ? "up" : "down"}
      expanded={componentsOpen}
      onClick={() => setComponentsOpen((open) => !open)}
      // An open Components branch is an ancestor of the current page, not the page itself.
      state={currentPath.startsWith("/docs/web/components") ? "highlighted" : "default"}
    />
  );

  const menuLink = (to: string, label: string, key: string, icon: EufemiaIconDefinition, badge = false, beta = false) => {
    const active = currentPath === to || currentPath.startsWith(`${to}/`);
    const trailing = beta ? betaTag : badge && hasUnreadFeedback ? notificationDot : null;
    return (
      <MenuRow key={key} level={1} icon={icon} label={label} to={to} onClick={onRowClick} state={rowState(active)}>
        {trailing}
      </MenuRow>
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
      <style>{MENU_ROW_CSS + PLATFORM_PILL_CSS}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Menu — rows are contiguous inside a bounded container, separated by
            their own hairlines. */}
        <nav className={MENU_LIST_CLASS}>
          {menuLink("/about", "About Eufemia", "about", information_medium)}
          {menuLink("/docs/design", "Designer Guide", "designer-guide", brush_medium)}
          {menuLink("/getting-started", "Developer Guide", "developer-guide", chip_medium)}
          {menuLink("/contribute", "Contribute", "contribute", user_feedback_medium)}
          {menuLink("/eufemia-and-ai", "Eufemia and AI", "eufemia-and-ai", ai_medium, false, true)}
          {isMaintainer && menuLink("/maintainer", "Maintainer tools", "maintainer", cog_medium, true)}
        </nav>

        {/* Platform selector — segmented pills, between the two menu containers. */}
        <div style={{ display: "flex", gap: "8px" }}>
          {(["web", "ios", "android"] as ("web" | "ios" | "android")[]).map((p) => {
            const active = docPlatform === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={active}
                className={`eu-plat-pill${active ? " eu-plat-pill--active" : ""}`}
                onClick={() => {
                  setDocPlatform(p);
                  onNavigate?.();
                  navigate(p === "web" ? "/docs/web" : p === "ios" ? "/docs/ios" : "/docs/android");
                }}
              >
                {platformLabels[p]}
              </button>
            );
          })}
        </div>

        {navItems.length > 0 && (
          <nav className={MENU_LIST_CLASS}>
            {docPlatform === "web" ? (
              <>
                {renderRow(webNavItems[0])}
                {renderComponentsToggle()}
                {componentsOpen &&
                  webComponentNavGroups.map((group) => {
                    const groupOpen = componentGroupsOpen[group.label] ?? false;
                    // Flat fragment, not a wrapper element: every row must be a
                    // direct child of the container for the sibling separators
                    // and the corner clipping to line up.
                    return (
                      <React.Fragment key={group.label}>
                        <MenuRow
                          level={2}
                          label={group.label}
                          chevron={groupOpen ? "up" : "down"}
                          expanded={groupOpen}
                          onClick={() => setComponentGroupsOpen((groups) => ({ ...groups, [group.label]: !groupOpen }))}
                          state={selectedComponentGroup === group.label ? "highlighted" : "default"}
                        />
                        {groupOpen && group.items.map(renderComponentRow)}
                      </React.Fragment>
                    );
                  })}
                {renderRow(webNavItems[1])}
              </>
            ) : (
              navItems.map((item) => renderRow(item))
            )}
          </nav>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

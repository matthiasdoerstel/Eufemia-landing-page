import React, { createContext, useContext, useEffect, useState } from "react";
import { navigate } from "gatsby";
import OneLevelMenu, { PANEL_WIDTH } from "./OneLevelMenu";
import EufemiaWordmark from "./EufemiaWordmark";
import { useIsMobile } from "../hooks/useIsMobile";
import { usePortalSettings } from "../context/SettingsContext";
import { useAuth } from "../context/AuthContext";
import { unreadCount } from "../lib/feedback";
import { DocPlatform } from "../data/portal-nav";
import { NAV_HEIGHT } from "./Header";

/**
 * Persistent chrome for the portal side menu.
 *
 * Mounted from `wrapPageElement` (gatsby-browser.js / gatsby-ssr.js) rather than
 * from Layout. Each page renders its own Layout, so a menu living inside Layout
 * was destroyed and rebuilt on every navigation — which meant its open/closed
 * branch state and any CSS transition were lost on each page change. Rendered
 * here, the menu outlives page changes.
 *
 * Layout reads the resulting content offset and the mobile drawer controls back
 * out through context.
 *
 * This now mounts `OneLevelMenu` (the one-level sidebar from the Figma Sandbox
 * file). It replaced both the two-tier `SideMenu` and the 384px `Sidebar`, which
 * are no longer rendered anywhere — `Sidebar` is kept only because it still owns
 * the component-category nav data that `data/portal-nav.ts` reads.
 */

type SideMenuChromeValue = {
  /** Whether the menu is mounted for this route. */
  enabled: boolean;
  /** Left offset the page content should clear. */
  offset: number;
  /** Left inset for the fixed header, so it starts beside the panel. */
  headerInset: number;
  isMobile: boolean;
  drawerOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
};

const SideMenuContext = createContext<SideMenuChromeValue>({
  enabled: false,
  offset: 0,
  headerInset: 0,
  isMobile: false,
  drawerOpen: false,
  toggleDrawer: () => {},
  closeDrawer: () => {},
});

export const useSideMenuChrome = () => useContext(SideMenuContext);

const SideMenuChrome: React.FC<{ path: string; children: React.ReactNode }> = ({
  path,
  children,
}) => {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { docPlatform, setDocPlatform } = usePortalSettings();
  const { isMaintainer } = useAuth();
  const [hasUnreadFeedback, setHasUnreadFeedback] = useState(false);

  // The pre-existing /sandbox/ routes mount their own menus; two would fight
  // for the same screen edge.
  const enabled = !path.startsWith("/sandbox/");

  // A /docs/<platform> URL is authoritative for which platform the menu shows.
  // Derived during render, not in an effect, so the server already renders the
  // right branch — an effect would leave iOS/Android unselected until hydration.
  // Previously this lived in Sidebar, which no longer renders.
  const pathPlatform = path.match(/\/docs\/(web|ios|android)\b/)?.[1] as
    | DocPlatform
    | undefined;
  const platform: DocPlatform = pathPlatform ?? docPlatform ?? "web";

  useEffect(() => {
    if (isMaintainer) setHasUnreadFeedback(unreadCount() > 0);
  }, [isMaintainer]);

  // Persist the platform the URL implied, so it survives to non-docs pages.
  useEffect(() => {
    if (pathPlatform && pathPlatform !== docPlatform) setDocPlatform(pathPlatform);
  }, [pathPlatform, docPlatform, setDocPlatform]);

  // Switching platform also moves the user to that platform's overview — the
  // behaviour the old platform pills had.
  const handlePlatformChange = (p: DocPlatform) => {
    setDocPlatform(p);
    setDrawerOpen(false);
    navigate(`/docs/${p}`);
  };

  // Close the drawer on navigation and whenever we grow back to desktop.
  useEffect(() => {
    setDrawerOpen(false);
  }, [path]);

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  // Lock body scroll behind the open drawer.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const locked = isMobile && drawerOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, drawerOpen]);

  const showsPanel = enabled && !isMobile;
  const offset = showsPanel ? PANEL_WIDTH : 0;

  return (
    <SideMenuContext.Provider
      value={{
        enabled,
        offset,
        headerInset: offset,
        isMobile,
        drawerOpen,
        toggleDrawer: () => setDrawerOpen((o) => !o),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}

      {enabled && (
        <>
          <OneLevelMenu
            currentPath={path}
            platform={platform}
            onPlatformChange={handlePlatformChange}
            isMaintainer={isMaintainer}
            hasUnreadFeedback={hasUnreadFeedback}
            isMobile={isMobile}
            open={drawerOpen}
            onNavigate={() => setDrawerOpen(false)}
            wordmark={<EufemiaWordmark height={22} />}
          />

          {isMobile && drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              aria-hidden
              style={{
                position: "fixed",
                inset: `${NAV_HEIGHT}px 0 0 0`,
                background: "rgba(0,0,0,0.5)",
                zIndex: 90,
              }}
            />
          )}
        </>
      )}
    </SideMenuContext.Provider>
  );
};

export default SideMenuChrome;

import React, { createContext, useContext, useState } from "react";
import SideMenu, { RAIL_WIDTH, PANEL_WIDTH, hasPanelForPath } from "./SideMenu";
import { useIsMobile } from "../hooks/useIsMobile";

/**
 * Persistent chrome for the two-tier SideMenu.
 *
 * Mounted from `wrapPageElement` (gatsby-browser.js / gatsby-ssr.js) rather than
 * from Layout. Each page renders its own Layout, so a menu living inside Layout
 * was destroyed and rebuilt on every navigation — which meant a CSS transition
 * on the panel could never run to completion (it got `transitioncancel` the
 * moment its element was detached). Rendered here, the menu outlives page
 * changes and can animate in and out properly.
 *
 * Layout reads the resulting content offset back out through context.
 *
 * Set to false to go back to the 384px `Sidebar`.
 */
const USE_SIDE_MENU = true;

type SideMenuChromeValue = {
  /** Whether the rail is showing, so Layout knows which sidebar it has. */
  enabled: boolean;
  /** Left offset the page content should clear. */
  offset: number;
  railWidth: number;
};

const SideMenuContext = createContext<SideMenuChromeValue>({
  enabled: false,
  offset: 0,
  railWidth: RAIL_WIDTH,
});

export const useSideMenuChrome = () => useContext(SideMenuContext);

const SideMenuChrome: React.FC<{ path: string; children: React.ReactNode }> = ({
  path,
  children,
}) => {
  const isMobile = useIsMobile();

  // Seeded from the route so the first paint already has the right offset —
  // otherwise content would land at the rail width and jump once the menu
  // reported in.
  const [collapsed, setCollapsed] = useState(() => !hasPanelForPath(path));

  const enabled =
    USE_SIDE_MENU &&
    !isMobile &&
    // The sandbox route renders its own SideMenu; two would fight each other.
    !path.startsWith("/sandbox/");

  const offset = enabled ? (collapsed ? RAIL_WIDTH : RAIL_WIDTH + PANEL_WIDTH) : 0;

  return (
    <SideMenuContext.Provider value={{ enabled, offset, railWidth: RAIL_WIDTH }}>
      {children}
      {enabled && <SideMenu currentPath={path} onCollapsedChange={setCollapsed} />}
    </SideMenuContext.Provider>
  );
};

export default SideMenuChrome;

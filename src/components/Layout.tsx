import React from "react";
import { Agentation } from "agentation";
import { Logo } from "@dnb/eufemia";
import Header from "./Header";
import { useSideMenuChrome } from "./SideMenuChrome";
import FeedbackButton from "./FeedbackButton";
import { useTheme } from "../context/ThemeContext";
import { font } from "../theme/tokens";

interface LayoutProps {
  children: React.ReactNode;
  currentPlatform?: "web" | "ios" | "android" | null;
  currentPath?: string;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colors } = useTheme();

  // The side menu is persistent chrome mounted from wrapPageElement, not from
  // here — see SideMenuChrome. Layout only needs the offset it occupies and the
  // controls for its mobile drawer.
  const {
    enabled: hasMenu,
    offset: sidebarOffset,
    headerInset,
    isMobile,
    drawerOpen,
    toggleDrawer,
  } = useSideMenuChrome();

  const showMenuButton = hasMenu && isMobile;

  return (
    <div style={{ minHeight: "100vh", background: colors.pageBg, fontFamily: font.family }}>
      <Header
        showMenuButton={showMenuButton}
        onMenuClick={toggleDrawer}
        menuOpen={drawerOpen}
        insetLeft={headerInset}
        // The panel carries its own wordmark; two would be redundant.
        showWordmark={!hasMenu || isMobile}
      />

      <main
        style={{
          marginLeft: sidebarOffset,
          // No top offset: the header is transparent and floats its controls, so
          // there is no bar to clear. Content starts at the top of the viewport
          // and each page's own padding sets the breathing room.
          minHeight: "100vh",
          background: colors.pageBg,
          color: colors.text,
        }}
      >
        {children}
      </main>
      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
          padding: "24px",
          background: colors.pageBg,
          borderTop: `1px solid ${colors.strokeSubtle}`,
          marginLeft: sidebarOffset,
        }}
      >
        <span style={{ display: "inline-flex", color: colors.text }}>
          <Logo height="38px" inheritColor aria-label="DNB" />
        </span>
        <span
          style={{
            fontFamily: font.family,
            fontSize: `${font.size.body}px`,
            lineHeight: `${font.lineHeight.body}px`,
            color: colors.accent,
          }}
        >
          © <span style={{ textDecoration: "underline" }}>Copyright 2018-present DNB.no</span>
        </span>
      </footer>
      <FeedbackButton />
      {process.env.NODE_ENV === "development" && <Agentation />}
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from "react";
import { Logo } from "@dnb/eufemia";
import Header, { NAV_HEIGHT } from "./Header";
import Sidebar from "./Sidebar";
import { useTheme } from "../context/ThemeContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { font } from "../theme/tokens";

interface LayoutProps {
  children: React.ReactNode;
  currentPlatform?: "web" | "ios" | "android" | null;
  currentPath?: string;
  hideSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  currentPlatform = null,
  currentPath = "",
  hideSidebar = false,
}) => {
  const { colors } = useTheme();
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // On desktop the sidebar is a fixed 384px column; on mobile it's an
  // off-canvas drawer, so the main content spans the full width.
  const sidebarOffset = hideSidebar || isMobile ? 0 : 384;

  // Close the drawer whenever we grow back to desktop, and lock body scroll
  // while the drawer is open on mobile.
  useEffect(() => {
    if (!isMobile && drawerOpen) setDrawerOpen(false);
  }, [isMobile, drawerOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const showMenuButton = !hideSidebar && isMobile;

  return (
    <div style={{ minHeight: "100vh", background: colors.pageBg, fontFamily: font.family }}>
      <Header
        showMenuButton={showMenuButton}
        onMenuClick={() => setDrawerOpen((o) => !o)}
        menuOpen={drawerOpen}
      />

      {!hideSidebar && (
        <Sidebar
          currentPlatform={currentPlatform}
          currentPath={currentPath}
          isMobile={isMobile}
          open={drawerOpen}
          onNavigate={() => setDrawerOpen(false)}
        />
      )}

      {/* Backdrop behind the mobile drawer */}
      {showMenuButton && drawerOpen && (
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

      <main
        style={{
          marginLeft: sidebarOffset,
          marginTop: `${NAV_HEIGHT}px`,
          minHeight: `calc(100vh - ${NAV_HEIGHT}px)`,
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
        <Logo height={38} color={colors.text} aria-label="DNB" />
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
    </div>
  );
};

export default Layout;

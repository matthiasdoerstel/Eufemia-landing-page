import React, { useState, useEffect } from "react";
import { Link } from "gatsby";
import SearchModal from "./SearchModal";
import PortalSettings from "./PortalSettings";
import EufemiaWordmark from "./EufemiaWordmark";
import { useTheme } from "../context/ThemeContext";
import { useIsMobile } from "../hooks/useIsMobile";
import { radius, font } from "../theme/tokens";

export const NAV_HEIGHT = 64;

const SearchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="10" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M14.5 14.5L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MenuIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );

const settingsCogCSS = `
.settings-cog { display: flex; transition: transform 0.25s ease; }
.settings-cog-button:hover .settings-cog, .settings-cog-button:focus-visible .settings-cog { transform: rotate(18deg); }
@media (prefers-reduced-motion: reduce) { .settings-cog { transition: none; } }
`;

const searchMotionCSS = `
.search-control__icon { display: flex; transition: transform 0.15s cubic-bezier(.2,.8,.2,1); }
.search-control:hover .search-control__icon, .search-control:focus-visible .search-control__icon { transform: scale(1.08); }
@media (prefers-reduced-motion: reduce) { .search-control__icon { transition: none; } }
`;

const CogIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M19.4 13a7.8 7.8 0 0 0 0-2l2.06-1.6a.5.5 0 0 0 .12-.64l-1.95-3.38a.5.5 0 0 0-.6-.22l-2.43.98a7.6 7.6 0 0 0-1.73-1l-.37-2.58a.5.5 0 0 0-.5-.42h-3.9a.5.5 0 0 0-.5.42l-.37 2.58c-.62.25-1.2.59-1.73 1l-2.43-.98a.5.5 0 0 0-.6.22L2.42 8.76a.5.5 0 0 0 .12.64L4.6 11a7.8 7.8 0 0 0 0 2l-2.06 1.6a.5.5 0 0 0-.12.64l1.95 3.38a.5.5 0 0 0 .6.22l2.43-.98c.53.41 1.11.75 1.73 1l.37 2.58a.5.5 0 0 0 .5.42h3.9a.5.5 0 0 0 .5-.42l.37-2.58c.62-.25 1.2-.59 1.73-1l2.43.98a.5.5 0 0 0 .6-.22l1.95-3.38a.5.5 0 0 0-.12-.64L19.4 13Z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

const Header: React.FC<{
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  menuOpen?: boolean;
}> = ({ showMenuButton = false, onMenuClick, menuOpen = false }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchCompareMode, setSearchCompareMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchHovered, setSearchHovered] = useState(false);
  const [cogHovered, setCogHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { colors, theme, brand } = useTheme();
  const isMobile = useIsMobile();
  const displayBrand = brand === "Carnegie" ? "DNB Carnegie" : brand;
  const themeLabel = `${displayBrand} - ${theme === "dark" ? "Dark" : "Light"}`;
  const brandStatusStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: isMobile ? "0" : "16px",
    height: isMobile ? "36px" : "46px",
    padding: isMobile ? "0 8px" : "0 12px 0 20px",
    border: `1px solid ${cogHovered ? colors.strokeAction : colors.strokeSubtle}`,
    borderRadius: isMobile ? `${radius.md}` : `${radius.lg}`,
    background: colors.surface,
    color: colors.textMuted,
    cursor: "pointer",
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
    whiteSpace: "nowrap",
    transition: "border-color 0.15s ease",
  };

  // Translucent header once scrolled away from the very top.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // pageBg hex -> rgba with alpha, for the frosted-glass background.
  const toRgba = (hex: string, a: number) => {
    const m = hex.replace("#", "");
    const n = m.length === 3 ? m.split("").map((c) => c + c).join("") : m;
    const r = parseInt(n.slice(0, 2), 16);
    const g = parseInt(n.slice(2, 4), 16);
    const b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const handleCompareMode = () => {
      setSearchCompareMode(true);
      setSearchOpen(true);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("openSearchCompare", handleCompareMode);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("openSearchCompare", handleCompareMode);
    };
  }, []);

  const iconButton = (hovered: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "36px",
    height: "36px",
    border: "none",
    borderRadius: `${radius.md}`,
    background: hovered ? colors.surface : "transparent",
    cursor: "pointer",
    color: colors.text,
    transition: "background 0.15s ease",
  });

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: `${NAV_HEIGHT}px`,
          borderBottom: `1px solid ${colors.strokeSubtle}`,
          background: scrolled ? toRgba(colors.pageBg, 0.85) : colors.pageBg,
          backdropFilter: scrolled ? "saturate(140%) blur(8px)" : "none",
          WebkitBackdropFilter: scrolled ? "saturate(140%) blur(8px)" : "none",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          fontFamily: font.family,
          transition: "background 0.2s ease, border-color 0.2s ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {showMenuButton && (
            <button
              onClick={onMenuClick}
              style={iconButton(false)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              <MenuIcon open={menuOpen} />
            </button>
          )}
          <Link
            to="/"
            aria-label="Eufemia — home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              color: colors.text,
              textDecoration: "none",
              lineHeight: 0,
            }}
          >
            <EufemiaWordmark height={22} />
          </Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <style>{settingsCogCSS}{searchMotionCSS}</style>
          <button
            onClick={() => setSearchOpen(true)}
            onMouseEnter={() => setSearchHovered(true)}
            onMouseLeave={() => setSearchHovered(false)}
            style={
              isMobile
                ? { ...iconButton(searchHovered), "--search-accent": colors.accent } as React.CSSProperties
                : {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    width: "fit-content",
                    border: `1px solid ${searchHovered ? colors.strokeAction : colors.strokeSubtle}`,
                    borderRadius: `${radius.lg}`,
                    background: colors.surface,
                    cursor: "pointer",
                    fontSize: `${font.size.body}px`,
                    color: colors.textMuted,
                    transition: "border-color 0.15s ease",
                    fontFamily: font.family,
                    "--search-accent": colors.accent,
                  } as React.CSSProperties
            }
            className="search-control"
            aria-label={isMobile ? "Search" : undefined}
          >
            <span className="search-control__icon"><SearchIcon /></span>
            {!isMobile && <span className="search-control__shortcut">cmd + k</span>}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            onMouseEnter={() => setCogHovered(true)}
            onMouseLeave={() => setCogHovered(false)}
            style={{ ...brandStatusStyle, display: "inline-flex", cursor: "pointer" }}
            title={`Open portal settings — ${themeLabel}`}
            aria-label={`Open portal settings — viewing ${themeLabel}`}
            className="settings-cog-button"
          >
            <span>{themeLabel}</span>
            <span className="settings-cog"><CogIcon /></span>
          </button>
        </div>
      </header>

      <SearchModal
        isOpen={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          setSearchCompareMode(false);
        }}
        initialCompareMode={searchCompareMode}
      />

      <PortalSettings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

export default Header;

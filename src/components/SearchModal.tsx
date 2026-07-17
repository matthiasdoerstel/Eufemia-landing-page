import React, { useState, useEffect, useRef } from "react";
import { navigate } from "gatsby";
import { fetchComponentsForSearch, fetchTokensForSearch } from "../lib/sanity";
import { useTheme } from "../context/ThemeContext";
import { usePortalSettings, ALL_PLATFORMS, Platform } from "../context/SettingsContext";
import { font, radius } from "../theme/tokens";

interface SearchResult {
  title: string;
  description: string;
  path: string;
  category: string;
  external?: boolean;
  id?: string;
  isCurrentPage?: boolean;
}

const staticPages: SearchResult[] = [
  { title: "Web Overview", description: "Overview of web components", path: "https://eufemia.dnb.no/uilib/", category: "Pages", external: true },
  { title: "Getting Started", description: "Start building with Eufemia", path: "/getting-started", category: "Pages" },
  { title: "About Eufemia", description: "Learn about the design system", path: "/about", category: "Pages" },
  { title: "Changelog", description: "Latest updates and releases", path: "/changelog", category: "Pages" },
  { title: "Typography", description: "Typography guidelines and styles", path: "https://eufemia.dnb.no/uilib/typography/", category: "Guides", external: true },
  { title: "Colors", description: "Eufemia color palette", path: "https://eufemia.dnb.no/uilib/usage/layout/colors/", category: "Guides", external: true },
  { title: "Icons", description: "Icon library and usage", path: "https://eufemia.dnb.no/icons/", category: "Guides", external: true },
  { title: "Spacing", description: "Layout spacing system", path: "https://eufemia.dnb.no/uilib/usage/layout/spacing/", category: "Guides", external: true },
  { title: "Theming", description: "Customize the look and feel", path: "https://eufemia.dnb.no/uilib/usage/customisation/theming/", category: "Guides", external: true },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCompareMode?: boolean;
}

// Derive the platform of a result from its category / path (null = platform-agnostic).
const platformOf = (r: SearchResult): Platform | null => {
  const s = `${r.category || ""} ${r.path || ""}`;
  if (/\bios\b/i.test(s)) return "iOS";
  if (/android/i.test(s)) return "Android";
  if (/\bweb\b/i.test(s)) return "Web";
  return null;
};

// Group heading with the platform word removed ("Web Components" -> "Components").
const groupOf = (r: SearchResult): string =>
  (r.category || "Results").replace(/\b(Web|iOS|Android)\b/gi, "").replace(/\s+/g, " ").trim() || "Results";

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, initialCompareMode = false }) => {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cmsComponents, setCmsComponents] = useState<SearchResult[]>([]);
  const [cmsTokens, setCmsTokens] = useState<SearchResult[]>([]);
  const [currentComponent, setCurrentComponent] = useState<{ platform: string; slug: string } | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { colors, theme } = useTheme();
  const { platforms, togglePlatform, activePlatforms, isAllPlatforms } = usePortalSettings();
  const isDark = theme === "dark";

  const subtle = isDark ? "#2c2c2e" : "#f2f2f5"; // token-color-background-neutral-subtle
  const badgeColors: Record<Platform, { bg: string; fg: string }> = {
    Web: { bg: subtle, fg: colors.text },
    iOS: { bg: "#dff2ff", fg: "#333333" },
    Android: { bg: "#e0ffe7", fg: "#333333" },
  };

  const isCompareModeQuery = query.toLowerCase().startsWith("/compare");
  const searchQuery = isCompareModeQuery ? query.slice(8).trim() : query;

  useEffect(() => {
    setIsCompareMode((isCompareModeQuery || initialCompareMode) && currentComponent !== null);
  }, [isCompareModeQuery, currentComponent, initialCompareMode]);

  const searchableContent: SearchResult[] = [...cmsComponents, ...cmsTokens, ...staticPages];

  if (currentComponent) {
    const currentPath = `/docs/${currentComponent.platform}/components/${currentComponent.slug}`;
    searchableContent.forEach((item) => {
      if (item.path === currentPath) item.isCurrentPage = true;
    });
  }

  let filteredResults: SearchResult[];
  if (isCompareModeQuery && !searchQuery.trim()) {
    filteredResults = searchableContent;
  } else if (query.length > 0) {
    filteredResults = searchableContent.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    filteredResults = [];
  }

  if (isCompareMode) {
    filteredResults = filteredResults.filter((item) => {
      const isComponentType = item.category.includes("iOS Components") || item.category.includes("Android Components");
      return isComponentType && !item.isCurrentPage;
    });
  } else {
    // Filter by the platforms chosen in Portal Settings (platform-agnostic
    // results always pass). "All platforms" means no filtering.
    if (!isAllPlatforms) {
      filteredResults = filteredResults.filter((item) => {
        const p = platformOf(item);
        return !p || activePlatforms.includes(p);
      });
    }
  }

  const groupedResults = filteredResults.reduce((acc, item) => {
    const g = groupOf(item);
    (acc[g] = acc[g] || []).push(item);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  useEffect(() => {
    if (!isOpen) return;
    let detected: { platform: string; slug: string } | null = null;
    if (typeof window !== "undefined") {
      const m = window.location.pathname.match(/\/docs\/(ios|android)\/components\/([^/]+)/);
      if (m) detected = { platform: m[1], slug: m[2] };
    }
    (async () => {
      try {
        const [components, tokens] = await Promise.all([fetchComponentsForSearch(), fetchTokensForSearch()]);
        setCmsComponents(components);
        setCmsTokens(tokens);
        if (detected) {
          const expected = `/docs/${detected.platform}/components/${detected.slug}`;
          if (components.find((c) => c.path === expected || c.path === expected + "/")) setCurrentComponent(detected);
        }
      } catch (e) {
        console.error("Failed to load CMS components:", e);
      }
    })();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    } else {
      setIsAnimating(false);
      setPlatformMenuOpen(false);
    }
  }, [isOpen]);

  const goTo = (result: SearchResult) => {
    if (result.external) {
      window.open(result.path, "_blank");
    } else if (isCompareMode && currentComponent && result.category.includes("Components")) {
      const m = result.path.match(/\/docs\/(ios|android)\/components\/([^/]+)/);
      if (m) navigate(`/docs/comparison?first=${currentComponent.platform}/${currentComponent.slug}&second=${m[1]}/${m[2]}`);
    } else {
      navigate(result.path);
    }
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filteredResults[selectedIndex]) {
        goTo(filteredResults[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onClose]);

  useEffect(() => setSelectedIndex(0), [query]);

  if (!isOpen) return null;

  const platformLabel = isAllPlatforms ? "All platforms" : activePlatforms.join(", ");

  // Render a component title with the matched substring emphasised.
  const renderTitle = (title: string) => {
    const q = searchQuery.trim();
    const i = q ? title.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return <span style={{ fontWeight: 400 }}>{title}</span>;
    return (
      <>
        {title.slice(0, i) && <span style={{ fontWeight: 400 }}>{title.slice(0, i)}</span>}
        <span style={{ fontWeight: 500 }}>{title.slice(i, i + q.length)}</span>
        {title.slice(i + q.length) && <span style={{ fontWeight: 400 }}>{title.slice(i + q.length)}</span>}
      </>
    );
  };

  let flatIndex = -1;

  return (
    <>
      {/* Screen dimmer */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "#000", opacity: isAnimating ? 0.32 : 0, zIndex: 1000, transition: "opacity 0.2s ease" }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-label="Search"
        style={{
          position: "fixed",
          top: "10%",
          left: "50%",
          transform: `translateX(-50%) ${isAnimating ? "translateY(0)" : "translateY(-10px)"}`,
          width: "100%",
          maxWidth: "784px",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          padding: "48px",
          boxSizing: "border-box",
          background: colors.surface,
          border: `1px solid ${colors.strokeSubtle}`,
          borderRadius: `${radius.xl}`,
          boxShadow: "0px 8px 16px 0px rgba(51,51,51,0.24)",
          zIndex: 1001,
          overflowY: "auto",
          opacity: isAnimating ? 1 : 0,
          transition: "opacity 0.2s ease, transform 0.2s ease",
          fontFamily: font.family,
        }}
      >
        {/* Search field + platform filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            padding: "12px 24px",
            background: subtle,
            border: `1px solid ${colors.stroke}`,
            borderRadius: `${radius.lg}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: 1, minWidth: 0 }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ color: colors.accent, flexShrink: 0 }}>
              <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
              <path d="M13 13L17.5 17.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder={currentComponent ? "Type /compare to compare components…" : "Search Eufemia…"}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                fontFamily: font.family,
                fontSize: `${font.size.body}px`,
                lineHeight: `${font.lineHeight.body}px`,
                color: colors.text,
              }}
            />
          </div>

          {/* Platform dropdown (controlled by Portal Settings) */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setPlatformMenuOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: colors.surface,
                border: `1px solid ${colors.strokeSubtle}`,
                borderRadius: `${radius.md}`,
                cursor: "pointer",
                fontFamily: font.family,
                fontSize: `${font.size.body}px`,
                lineHeight: `${font.lineHeight.body}px`,
                color: colors.text,
                whiteSpace: "nowrap",
              }}
            >
              {platformLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: platformMenuOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {platformMenuOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  minWidth: "180px",
                  background: colors.surface,
                  border: `1px solid ${colors.strokeSubtle}`,
                  borderRadius: `${radius.md}`,
                  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.24)",
                  padding: "6px",
                  zIndex: 2,
                }}
              >
                {ALL_PLATFORMS.map((p) => (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      width: "100%",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      borderRadius: `${radius.sm}`,
                      cursor: "pointer",
                      fontFamily: font.family,
                      fontSize: `${font.size.body}px`,
                      color: colors.text,
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: `${radius.sm}`,
                        border: `1.5px solid ${platforms[p] ? colors.accent : colors.stroke}`,
                        background: platforms[p] ? colors.accent : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {platforms[p] && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2.5 6.5L5 9L9.5 3.5" stroke={isDark ? "#0a0a0a" : "#ffffff"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {filteredResults.length === 0 ? (
          <div style={{ padding: "8px 0", color: colors.textMuted, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
            {query.length === 0 ? "Start typing to search components, guides and more." : "No results found."}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {Object.entries(groupedResults).map(([group, items]) => (
              <div key={group} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.bodyMedium}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>
                  {group}
                </div>
                {items.map((result) => {
                  flatIndex++;
                  const isSelected = flatIndex === selectedIndex;
                  const idx = flatIndex;
                  const platform = platformOf(result);
                  return (
                    <div
                      key={result.id || result.path}
                      onClick={() => goTo(result)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "4px 8px 4px 16px",
                        marginLeft: "-8px",
                        borderRadius: `${radius.sm}`,
                        cursor: "pointer",
                        background: isSelected ? subtle : "transparent",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: font.family,
                          fontSize: `${font.size.body}px`,
                          lineHeight: `${font.lineHeight.body}px`,
                          color: colors.accent,
                          textDecoration: "underline",
                          textUnderlineOffset: "2px",
                        }}
                      >
                        {renderTitle(result.title)}
                      </span>
                      {platform && (
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: `${radius.md}`,
                            border: `1px solid ${colors.stroke}`,
                            background: badgeColors[platform].bg,
                            color: badgeColors[platform].fg,
                            fontFamily: font.family,
                            fontWeight: 500,
                            fontSize: "14px",
                            lineHeight: "20px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {platform}
                        </span>
                      )}
                      {result.isCurrentPage && (
                        <span style={{ fontSize: "12px", color: colors.textMuted }}>Current</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Footer hint */}
        <div style={{ fontFamily: font.family, fontWeight: 400, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
          use <span style={{ color: colors.accent }}>/compare</span> command to compare iOS and Android components.
        </div>
      </div>
    </>
  );
};

export default SearchModal;

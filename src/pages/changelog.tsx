import React from "react";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";

const changelog = [
  {
    version: "10.15.0",
    date: "January 10, 2025",
    changes: [
      { type: "feature", description: "Added new DatePicker component with range selection support" },
      { type: "improvement", description: "Improved Button component accessibility with better focus indicators" },
      { type: "fix", description: "Fixed Modal closing animation on Safari browsers" },
    ],
  },
  {
    version: "10.14.2",
    date: "December 18, 2024",
    changes: [
      { type: "fix", description: "Fixed Input validation state not updating correctly" },
      { type: "fix", description: "Fixed Dropdown z-index issues in nested contexts" },
    ],
  },
  {
    version: "10.14.0",
    date: "December 5, 2024",
    changes: [
      { type: "feature", description: "Added Skeleton component for loading states" },
      { type: "feature", description: "Added Toast notification component" },
      { type: "improvement", description: "Updated color tokens for better contrast ratios" },
      { type: "improvement", description: "Reduced bundle size by 15% through tree-shaking improvements" },
    ],
  },
  {
    version: "10.13.0",
    date: "November 22, 2024",
    changes: [
      { type: "feature", description: "Added Accordion component with animation support" },
      { type: "improvement", description: "Improved Table component performance for large datasets" },
      { type: "fix", description: "Fixed Card shadow not rendering correctly in dark mode" },
      { type: "breaking", description: "Removed deprecated `size` prop from Icon component, use `width` and `height` instead" },
    ],
  },
  {
    version: "10.12.1",
    date: "November 12, 2024",
    changes: [
      { type: "improvement", description: "Updated icon sizes for component Button variant tertiary (16px default, 24px for icon position top)" },
      { type: "improvement", description: "Updated icon sizes for component Button" },
    ],
  },
  {
    version: "10.12.0",
    date: "October 28, 2024",
    changes: [
      { type: "feature", description: "Added Tabs component with keyboard navigation" },
      { type: "feature", description: "Added Breadcrumb component" },
      { type: "improvement", description: "Improved form validation messages with better UX" },
    ],
  },
  {
    version: "10.11.0",
    date: "October 8, 2024",
    changes: [
      { type: "improvement", description: "Default shadow (defaultDropShadow() and .dnb-drop-shadow) was changed to 0.8pc 16px rgba(51,51,51, 0.08)" },
      { type: "fix", description: "Fixed Checkbox label alignment in RTL layouts" },
    ],
  },
];

// Semantic status colours — readable as a chip on both light and dark surfaces.
const typeMeta: Record<string, { color: string; label: string }> = {
  feature: { color: "#28B482", label: "New" },
  improvement: { color: "#2B7FFF", label: "Improved" },
  fix: { color: "#D98324", label: "Fixed" },
  breaking: { color: "#E2483D", label: "Breaking" },
};

const ChangelogPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Layout currentPath="/changelog">
      <PageShell>
        {/* Hero */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
          <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
            What's new in Eufemia
          </h1>
          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted, maxWidth: "640px" }}>
            Track all updates, new features, improvements, and bug fixes across Eufemia releases.
          </p>
        </div>

        {/* Entries */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {changelog.map((release) => (
            <div
              key={release.version}
              id={release.version.replace(/\./g, "-")}
              style={{
                padding: "28px",
                background: colors.surface,
                border: `1px solid ${colors.strokeSubtle}`,
                borderRadius: `${radius.xl}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>
                  v{release.version}
                </h2>
                <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted, padding: "4px 12px", background: colors.surfaceAlt, borderRadius: `${radius.md}` }}>
                  {release.date}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {release.changes.map((change, index) => {
                  const meta = typeMeta[change.type] || { color: colors.textMuted, label: change.type };
                  return (
                    <div key={index} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: colors.surfaceAlt, borderRadius: `${radius.md}` }}>
                      <span style={{ flexShrink: 0, padding: "2px 8px", background: colors.surface, color: meta.color, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.sm}`, fontFamily: font.family, fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                        {meta.label}
                      </span>
                      <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.text }}>
                        {change.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div style={{ marginTop: "48px", padding: "24px", background: colors.surface, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.lg}`, textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
            For the complete changelog history, check the{" "}
            <a href="https://github.com/dnbexperience/eufemia/releases" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, textDecoration: "underline" }}>
              GitHub releases page
            </a>
            .
          </p>
        </div>
      </PageShell>
    </Layout>
  );
};

export default ChangelogPage;

export const Head = () => <title>Changelog | Eufemia Design System</title>;

import React from "react";
import { Breadcrumb } from "@dnb/eufemia";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import ReleaseNotes from "../components/ReleaseNotes";
import EufemiaThemeScope from "../components/EufemiaThemeScope";
import { useTheme } from "../context/ThemeContext";
import { font, radius } from "../theme/tokens";
import {
  formatReleaseDate,
  releases,
  releasesSource,
  releaseKindLabel,
} from "../data/release-data";

const versionLine = (version: string) => version.split(".").slice(0, 2).join(".");

const releaseRailItems = releases
  .filter(
    (release, index) =>
      releases.findIndex(
        (item) => versionLine(item.version) === versionLine(release.version)
      ) === index
  )
  .map((release) => {
    const line = versionLine(release.version);

    return {
      id: release.tag,
      label: `v${line}.x`,
      sectionIds: releases
        .filter((item) => versionLine(item.version) === line)
        .map((item) => item.tag),
    };
  });

const releaseVersionLinkCSS = `
.release-version-link {
  text-decoration: none;
}
.release-version-link:hover,
.release-version-link:focus-visible {
  text-decoration: underline;
  text-underline-offset: 4px;
}
`;

const ChangelogPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Layout currentPath="/changelog">
      <style>{releaseVersionLinkCSS}</style>
      <PageShell rail={<InPageRail items={releaseRailItems} scrollable autoFollow />}>
        <EufemiaThemeScope>
          <Breadcrumb
            variant="responsive"
            navText="Page hierarchy"
            data={[
              { text: "About Eufemia", href: "/about" },
              { text: "What's new in Eufemia" },
            ]}
          />
        </EufemiaThemeScope>
        <header style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", marginBottom: "48px" }}>
          <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
            What&apos;s new in Eufemia
          </h1>
          <p style={{ margin: 0, maxWidth: "640px", fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
            Published Eufemia releases, grouped under their official release-note categories.
          </p>
        </header>

        <main aria-label="Eufemia release history" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          {releases.map((release, index) => (
            <article
              key={release.tag}
              id={release.tag}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingBottom: index === releases.length - 1 ? 0 : "40px",
                borderBottom: index === releases.length - 1 ? undefined : `1px solid ${colors.strokeSubtle}`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <a href={release.url} target="_blank" rel="noreferrer" className="release-version-link" style={{ width: "fit-content", fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.accent }}>
                  {release.tag}
                </a>
                <span style={{ fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
                  {formatReleaseDate(release.date)} · {releaseKindLabel[release.kind]}
                </span>
              </div>

              {release.intro && (
                <p style={{ margin: 0, maxWidth: "760px", fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.text }}>
                  {release.intro}
                </p>
              )}

              {release.categories.length > 0 ? (
                <ReleaseNotes release={release} colors={colors} />
              ) : (
                <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
                  No grouped release notes published for this release.
                </p>
              )}
            </article>
          ))}
        </main>

        <footer style={{ marginTop: "48px", padding: "24px", background: colors.surface, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.lg}`, textAlign: "center" }}>
          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
            For full history and release assets, visit the{" "}
            <a href={releasesSource} target="_blank" rel="noreferrer" style={{ color: colors.accent, textDecoration: "underline", textUnderlineOffset: "4px" }}>
              Eufemia release history on GitHub
            </a>
            .
          </p>
        </footer>
      </PageShell>
    </Layout>
  );
};

export default ChangelogPage;

export const Head = () => <title>Changelog | Eufemia Design System</title>;

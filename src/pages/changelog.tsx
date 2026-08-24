import React from "react";
import { Anchor, Breadcrumb, H1, H2, P } from "@dnb/eufemia";
import Layout from "../components/Layout";
import PageShell from "../components/PageShell";
import InPageRail from "../components/InPageRail";
import ReleaseNotes from "../components/ReleaseNotes";
import EufemiaThemeScope from "../components/EufemiaThemeScope";
import { useTheme } from "../context/ThemeContext";
import { radius } from "../theme/tokens";
import {
  formatReleaseDate,
  releases,
  releasesSource,
  releaseKindLabel,
} from "../data/release-data";

const versionLine = (version: string) => version.split(".").slice(0, 2).join(".");

const releaseRailItems = releases
  .filter((release) => releases.findIndex((item) => versionLine(item.version) === versionLine(release.version)) === releases.indexOf(release))
  .map((release) => {
    const line = versionLine(release.version);
    return {
      id: release.tag,
      label: `v${line}.x`,
      sectionIds: releases.filter((item) => versionLine(item.version) === line).map((item) => item.tag),
    };
  });

const ChangelogPage: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Layout currentPath="/changelog">
      <PageShell rail={<InPageRail items={releaseRailItems} scrollable autoFollow />}>
        <EufemiaThemeScope>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Breadcrumb
              variant="responsive"
              navText="Page hierarchy"
              data={[
                { text: "Home", href: "/" },
                { text: "What&apos;s new in Eufemia" },
              ]}
            />

            <header style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px", marginBottom: "48px" }}>
              <H1 style={{ margin: 0, color: colors.text }}>What&apos;s new in Eufemia</H1>
              <P style={{ margin: 0, maxWidth: "640px", color: colors.textMuted }}>
                Published Eufemia releases, grouped under their official release-note categories.
              </P>
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
                    <Anchor href={release.url} target="_blank" rel="noreferrer" style={{ width: "fit-content", color: colors.accent }}>
                      <H2 style={{ margin: 0, color: "inherit" }}>{release.tag}</H2>
                    </Anchor>
                    <P size="small" style={{ margin: 0, color: colors.textMuted }}>
                      {formatReleaseDate(release.date)} · {releaseKindLabel[release.kind]}
                    </P>
                  </div>

                  {release.intro ? <P size="small" style={{ margin: 0, maxWidth: "760px", color: colors.text }}>{release.intro}</P> : null}

                  {release.categories.length > 0 ? (
                    <ReleaseNotes release={release} colors={colors} />
                  ) : (
                    <P size="small" style={{ margin: 0, color: colors.textMuted }}>No grouped release notes published for this release.</P>
                  )}
                </article>
              ))}
            </main>

            <footer style={{ marginTop: "48px", padding: "24px", background: colors.surface, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.lg}`, textAlign: "center" }}>
              <P style={{ margin: 0, color: colors.textMuted }}>
                For full history and release assets, visit the <Anchor href={releasesSource} target="_blank" rel="noreferrer">Eufemia release history on GitHub</Anchor>.
              </P>
            </footer>
          </div>
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default ChangelogPage;

export const Head = () => <title>Changelog | Eufemia Design System</title>;

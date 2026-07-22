#!/usr/bin/env node

/**
 * Fetches published Eufemia GitHub releases and writes normalized release notes
 * for use by the portal at build time.
 *
 * Run with: node scripts/fetch-releases.js
 */

const fs = require("fs");
const path = require("path");

const RELEASES_API = "https://api.github.com/repos/dnbexperience/eufemia/releases?per_page=100";
const RELEASES_URL = "https://github.com/dnbexperience/eufemia/releases";
const OUTPUT_PATH = path.join(__dirname, "..", "src", "data", "releases.json");

const toText = (value) => value
  .replace(/\r\n/g, "\n")
  .replace(/!?(?:\[([^\]]*)\]\([^)]*\))/g, "$1")
  .replace(/\s*\((#\d+)\s+\(https?:[^)]+\)\)/g, " ($1)")
  .replace(/\s*\(([a-f0-9]{7,})\s+\(https?:[^)]+\)\)/gi, " ($1)")
  .replace(/\*{1,3}([^*]+)\*{1,3}/g, "$1")
  .replace(/`([^`]+)`/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/\s+/g, " ")
  .trim();

const categoryTitle = (heading) => heading
  .replace(/:[a-z0-9_+-]+:/gi, "")
  .replace(/[✨🐛📝⚡🐞💄✅🚀🔧♻️⚠️]/gu, "")
  .replace(/\s{2,}/g, " ")
  .trim();

const categorySlug = (title) => title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const parseVersion = (tag) => {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(tag);
  if (!match) return null;

  const [, major, minor, patch] = match;
  return {
    version: `${major}.${minor}.${patch}`,
    kind: Number(patch) > 0 ? "patch" : Number(minor) > 0 ? "minor" : "major",
  };
};

const parseCategories = (body) => {
  const sections = body.replace(/\r\n/g, "\n").split(/^###\s+(.+)$/m);
  const categories = [];

  for (let index = 1; index < sections.length; index += 2) {
    const title = categoryTitle(sections[index]);
    const items = sections[index + 1]
      .split("\n")
      .filter((line) => /^\s*[-*+]\s+/.test(line))
      .map((line) => toText(line.replace(/^\s*[-*+]\s+/, "")))
      .filter(Boolean);

    if (title && items.length > 0) {
      categories.push({ title, slug: categorySlug(title), items });
    }
  }

  return categories;
};

const parseIntro = (body) => {
  const intro = body.replace(/\r\n/g, "\n").split(/^###\s+/m)[0];
  return intro
    .split("\n")
    .filter((line) => line.trim() && !/^##\s/.test(line))
    .map(toText)
    .filter(Boolean)
    .join(" ");
};

const toRelease = (release) => {
  const semver = parseVersion(release.tag_name);
  if (!semver) return null;

  return {
    tag: release.tag_name,
    version: semver.version,
    date: release.published_at.slice(0, 10),
    url: release.html_url,
    kind: semver.kind,
    intro: parseIntro(release.body || ""),
    categories: parseCategories(release.body || ""),
  };
};

async function fetchReleases() {
  console.log("Fetching published Eufemia releases from GitHub...");

  try {
    const response = await fetch(RELEASES_API, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const releases = (await response.json())
      .filter((release) => !release.draft && !release.prerelease)
      .map(toRelease)
      .filter(Boolean);

    const output = {
      generated: new Date().toISOString(),
      source: RELEASES_URL,
      count: releases.length,
      releases,
    };

    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

    const latest = releases[0];
    const latestFeature = releases.find((release) =>
      release.categories.some((category) => category.slug === "features")
    );
    console.log(`Written ${releases.length} releases to ${OUTPUT_PATH}`);
    console.log(`Latest: ${latest?.tag} (${latest?.kind})`);
    console.log(`Latest feature release: ${latestFeature?.tag || "none"}`);

    return output;
  } catch (error) {
    if (fs.existsSync(OUTPUT_PATH)) {
      console.warn(`Could not refresh releases (${error.message}); using ${OUTPUT_PATH}`);
      return JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf8"));
    }

    console.error("Error fetching releases:", error.message);
    process.exit(1);
  }
}

fetchReleases();

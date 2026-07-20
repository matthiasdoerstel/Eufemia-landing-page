import releaseData from "./releases.json";

export type ReleaseKind = "major" | "minor" | "patch";

export interface ReleaseCategory {
  title: string;
  slug: string;
  items: string[];
}

export interface Release {
  tag: string;
  version: string;
  date: string;
  url: string;
  kind: ReleaseKind;
  intro: string;
  categories: ReleaseCategory[];
}

interface ReleaseData {
  generated: string;
  source: string;
  count: number;
  releases: Release[];
}

const data = releaseData as ReleaseData;

export const releases = data.releases;
export const releasesSource = data.source;
export const latestRelease = releases[0];
export const latestFeatureRelease = releases.find((release) =>
  release.categories.some((category) => category.slug === "features")
);
export const v11Release = releases.find(
  (release) => release.kind === "major" && release.version === "11.0.0"
);

export const isPrimaryCategory = (category: ReleaseCategory) =>
  category.slug === "features" || category.slug === "bug-fixes";

export const formatReleaseDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));

export const releaseKindLabel: Record<ReleaseKind, string> = {
  major: "Major release",
  minor: "Feature release",
  patch: "Patch release",
};

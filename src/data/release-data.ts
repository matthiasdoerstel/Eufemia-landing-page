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

const compareVersionLines = (left: string, right: string) => {
  const [leftMajor, leftMinor] = left.split(".").map(Number);
  const [rightMajor, rightMinor] = right.split(".").map(Number);

  return rightMajor - leftMajor || rightMinor - leftMinor;
};

const versionLine = (version: string) => version.split(".").slice(0, 2).join(".");

export interface FeatureReference {
  label: string;
  href: string;
}

export interface FeatureItem {
  component: string;
  description: string;
  references: FeatureReference[];
}

export interface CurrentFeatureRecap {
  version: string;
  features: FeatureItem[];
}

const eufemiaRepositoryUrl = "https://github.com/dnbexperience/eufemia";

const toFeatureItem = (feature: string): FeatureItem => {
  const componentMatch = /^([^:]+):\s*/.exec(feature);
  const referencePattern = /\s+\((#\d+|[a-f0-9]{7,})\)/gi;
  const component = componentMatch?.[1] ?? feature.replace(referencePattern, "").trim();
  const description = componentMatch
    ? feature.slice(componentMatch[0].length).replace(referencePattern, "").trim()
    : "";
  const references = [...feature.matchAll(referencePattern)].map((match) => {
    const label = match[1];

    return {
      label,
      href: label.startsWith("#")
        ? `${eufemiaRepositoryUrl}/issues/${label.slice(1)}`
        : `${eufemiaRepositoryUrl}/commit/${label}`,
    };
  });

  return { component, description, references };
};

export const getCurrentFeatureRecap = (
  releaseList: Release[]
): CurrentFeatureRecap | undefined => {
  const releasesByVersion = new Map<string, Release[]>();

  for (const release of releaseList) {
    const line = versionLine(release.version);
    const lineReleases = releasesByVersion.get(line) ?? [];
    lineReleases.push(release);
    releasesByVersion.set(line, lineReleases);
  }

  const [currentVersion] = [...releasesByVersion.keys()].sort(compareVersionLines);

  if (!currentVersion || !releaseList[0]) {
    return undefined;
  }

  const features = [
    ...new Map(
      (releasesByVersion
        .get(currentVersion)
        ?.flatMap((release) =>
          release.categories
            .filter((category) => category.slug === "features")
            .flatMap((category) => category.items)
        ) ?? [])
        .map((feature) => [feature, toFeatureItem(feature)])
    ).values(),
  ];

  return {
    version: currentVersion,
    features,
  };
};

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

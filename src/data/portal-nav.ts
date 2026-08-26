// Portal information architecture for the one-level sidebar
// (Figma Sandbox aD38asiLSTitzeMxy3RJCBWT, node 8934:14610 —
// "Final testing; One level sidebar").
//
// This is the IA only — no rendering. The design gives us five row types, and
// every portal destination is sorted into them:
//
//   link      a leaf that navigates
//   group     collapsible; may contain links, headings and further groups
//   heading   non-interactive label that sub-divides a group's children
//   divider   the hairline between blocks
//
// Ordering follows the user's journey rather than the file tree:
//   orient (Home, Getting started, What's new)
//     -> build (Foundations, Components, Forms)
//       -> learn (Guides)
//         -> meta (About, Contribute, AI, Maintainer)
//
// The contextual switcher at the top scopes only the *build* block, so the
// platform-agnostic pages sit below the second divider where the switcher
// visibly does not reach them.

// Icons are the 16px variants, not the `_medium` (24px) ones — the design's icon
// slot is 16x16.
import {
  ai,
  brush,
  cog,
  file_signing,
  hierarchy,
  home,
  information,
  layout_grid,
  list,
  news,
  star,
  user_feedback,
} from "@dnb/eufemia/icons";
import {
  webComponentNavGroups,
  availableWebComponentPaths,
} from "../components/Sidebar";

export type EufemiaIconDefinition = typeof home;

/** Trailing decoration on a row. */
export type NavBadge = "beta" | "unread";

export interface NavLink {
  kind: "link";
  label: string;
  /** Omitted for rows whose page does not exist yet — those render disabled. */
  to?: string;
  icon?: EufemiaIconDefinition;
  badge?: NavBadge;
}

export interface NavGroup {
  kind: "group";
  label: string;
  icon?: EufemiaIconDefinition;
  children: NavNode[];
  defaultOpen?: boolean;
}

export interface NavHeading {
  kind: "heading";
  label: string;
}

export interface NavDivider {
  kind: "divider";
}

export type NavNode = NavLink | NavGroup | NavHeading | NavDivider;

export type DocPlatform = "web" | "ios" | "android";

export const PLATFORM_LABELS: Record<DocPlatform, string> = {
  web: "Web",
  ios: "iOS",
  android: "Android",
};

// Helpers -------------------------------------------------------------------

const link = (
  label: string,
  to?: string,
  icon?: EufemiaIconDefinition,
  badge?: NavBadge
): NavLink => ({ kind: "link", label, to, icon, badge });

const group = (
  label: string,
  children: NavNode[],
  icon?: EufemiaIconDefinition
): NavGroup => ({ kind: "group", label, icon, children });

const heading = (label: string): NavHeading => ({ kind: "heading", label });

const divider: NavDivider = { kind: "divider" };

// Components ----------------------------------------------------------------
// Reuses the live Sidebar's category data so there is one source of truth for
// the 63 component leaves. Anything not in `availableWebComponentPaths` has no
// page yet, so it comes through without a `to` and renders disabled.

const componentsGroup = (): NavGroup =>
  group(
    "Components",
    [
      link("Overview", "/docs/web"),
      ...webComponentNavGroups.map((g) =>
        group(
          g.label,
          g.items.map((item) =>
            link(
              item.label,
              availableWebComponentPaths.has(item.path) ? item.path : undefined
            )
          )
        )
      ),
    ],
    layout_grid
  );

// Forms ---------------------------------------------------------------------
// The Forms extension is absent from the portal today. It is the one branch
// deep enough to exercise the design's Heading row, so the field taxonomy is
// modelled in full even though none of the pages exist yet.

const formsGroup = (): NavGroup =>
  group(
    "Forms",
    [
      link("Getting started"),
      link("What are fields?"),
      group("Fields", [
        heading("Base fields"),
        link("Field.String"),
        link("Field.Number"),
        link("Field.Boolean"),
        link("Field.Selection"),
        link("Field.ArraySelection"),
        link("Field.Toggle"),
        link("Field.Composition"),
        heading("Feature fields"),
        link("Field.Address"),
        link("Field.BankAccountNumber"),
        link("Field.Currency"),
        link("Field.Date"),
        link("Field.Email"),
        link("Field.Name"),
        link("Field.NationalIdentityNumber"),
        link("Field.OrganizationNumber"),
        link("Field.PhoneNumber"),
        link("Field.PostalCodeAndCity"),
        link("Field.SelectCountry"),
        heading("More fields"),
        link("Field.Password"),
        link("Field.Slider"),
        link("Field.Upload"),
      ]),
      group("Values", [
        link("Value.String"),
        link("Value.Number"),
        link("Value.Currency"),
        link("Value.Date"),
        link("Value.SummaryList"),
        link("Value.Composition"),
      ]),
      group("Form", [
        link("Form.Handler"),
        link("Form.Section"),
        link("Form.Card"),
        link("Form.Visibility"),
        link("Form.SubmitButton"),
        link("Schema validation"),
        link("Error messages"),
      ]),
      group("Iterate", [
        link("Iterate.Array"),
        link("Iterate.PushContainer"),
        link("Iterate.EditContainer"),
        link("Iterate.Toolbar"),
      ]),
      group("Wizard", [
        link("Wizard.Container"),
        link("Wizard.Step"),
        link("Wizard.Buttons"),
        link("Wizard.useStep"),
      ]),
      link("Connectors"),
      link("Best practices on forms"),
    ],
    file_signing
  );

// Foundations ---------------------------------------------------------------

const foundationsGroup = (platform: DocPlatform): NavGroup =>
  group(
    "Foundations",
    [
      link(
        "Design tokens",
        platform === "web" ? "/docs/web/design-tokens" : undefined
      ),
      link("Colours"),
      link("Typography"),
      link("Icons", "/icons"),
      link("Theming & brands", "/theming"),
      link("Layout & spacing"),
    ],
    hierarchy
  );

// Platform-scoped build block ----------------------------------------------

const buildBlock = (platform: DocPlatform): NavNode[] => {
  if (platform === "web") {
    return [foundationsGroup(platform), componentsGroup(), formsGroup()];
  }

  // iOS and Android have an Overview page but no component or token pages yet.
  const overview = platform === "ios" ? "/docs/ios" : "/docs/android";
  return [
    foundationsGroup(platform),
    group(
      "Components",
      [link("Overview", overview), link("All components")],
      layout_grid
    ),
  ];
};

// The full tree -------------------------------------------------------------

export interface NavOptions {
  platform: DocPlatform;
  /** Maintainer-only rows are omitted entirely when false. */
  isMaintainer?: boolean;
  /** Drives the unread dot on Maintainer tools. */
  hasUnreadFeedback?: boolean;
}

export const navFor = ({
  platform,
  isMaintainer = false,
}: NavOptions): NavNode[] => [
  // Orient — flat, always relevant, no children.
  link("Home", "/", home),
  link("Getting started", "/getting-started", star),
  link("What's new", "/changelog", news),

  divider,

  // Build — everything the contextual switcher scopes.
  ...buildBlock(platform),

  // Learn.
  group(
    "Guides",
    [
      link("Designer guide", "/docs/design"),
      link("Accessibility"),
      link("Best practices"),
      link("Platform comparison", "/docs/comparison"),
    ],
    list
  ),

  divider,

  // Meta — platform-agnostic, deliberately below the switcher's reach.
  link("About Eufemia", "/about", information),
  link("Contribute", "/contribute", user_feedback),
  link("Eufemia and AI", "/eufemia-and-ai", ai, "beta"),
  ...(isMaintainer
    ? [link("Maintainer tools", "/maintainer", cog, "unread")]
    : []),
];

/** Unused today, but keeps `brush` reachable for a future Design platform. */
export const DESIGN_ICON = brush;

// Counts, for the sandbox's testing notes.
export const componentLeafCount = webComponentNavGroups.reduce(
  (n, g) => n + g.items.length,
  0
);
export const componentAvailableCount = availableWebComponentPaths.size;

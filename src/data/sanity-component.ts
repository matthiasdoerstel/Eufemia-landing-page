// Shared Sanity component types used by the docs pages and the Compare feature.

// A single portable-text block (or inline image) from Sanity's `_rawDocumentation`.
export interface Block {
  _key: string;
  _type: string;
  style?: string;
  children?: Array<{
    _key: string;
    _type: string;
    text?: string;
    marks?: string[];
  }>;
  asset?: {
    _ref?: string;
    url?: string;
  };
}

// A Sanity image field with light/dark variants.
interface PreviewImage {
  light?: { asset?: { _ref?: string; url?: string } };
  dark?: { asset?: { _ref?: string; url?: string } };
}

// Full component document as consumed by the Compare feature.
export interface ComponentData {
  id: string;
  name: string;
  platform: string;
  shortDescription: string | null;
  _rawDocumentation: Block[] | null;
  _rawPreviewImage?: PreviewImage | null;
  guidelines?: string;
  usage?: string;
  dosAndDonts?: string;
  accessibilityInfo?: string;
  figmaLink: string | null;
  githubLink: string | null;
  status?: string;
  slug: {
    current: string;
  };
}

// Raw Sanity node shape used by the platform overview pages (ios/android).
export interface CmsComponent {
  id: string;
  name: string;
  shortDescription: string | null;
  slug: { current: string } | null;
}

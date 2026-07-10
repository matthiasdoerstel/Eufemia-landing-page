import React, { useState, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../../components/Layout";
import ComparisonView from "../../components/ComparisonView";
import { useTheme } from "../../context/ThemeContext";
import { font, radius } from "../../theme/tokens";

interface ComponentData {
  id: string;
  name: string;
  platform: string;
  shortDescription: string | null;
  _rawDocumentation: any[] | null;
  _rawPreviewImage?: {
    light?: {
      asset?: {
        _ref?: string;
        url?: string;
      };
    };
    dark?: {
      asset?: {
        _ref?: string;
        url?: string;
      };
    };
  } | null;
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

// Note: Static components removed - only CMS components are compared now
// The static iOS/Android components in SearchModal are just for search/navigation,
// not for comparison which requires real documentation

const ComparisonPage: React.FC = () => {
  const { colors } = useTheme();
  const [first, setFirst] = useState<ComponentData | null>(null);
  const [second, setSecond] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        const firstParam = params.get("first");
        const secondParam = params.get("second");

        if (!firstParam || !secondParam) {
          setError("Please provide both components using: ?first=platform/slug&second=platform/slug");
          setLoading(false);
          return;
        }

        // Parse the params (format: platform/slug)
        const [firstPlatform, firstSlug] = firstParam.split("/");
        const [secondPlatform, secondSlug] = secondParam.split("/");

        if (!firstPlatform || !firstSlug || !secondPlatform || !secondSlug) {
          setError("Invalid URL format. Use: ?first=platform/slug&second=platform/slug");
          setLoading(false);
          return;
        }

        // Query Gatsby's GraphQL API for all components
        const response = await fetch(`/___graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              {
                allSanityComponent {
                  nodes {
                    id
                    name
                    platform
                    shortDescription
                    _rawDocumentation
                    _rawPreviewImage
                    guidelines
                    usage
                    dosAndDonts
                    accessibilityInfo
                    status
                    figmaLink
                    githubLink
                    slug {
                      current
                    }
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();

        if (data.errors) {
          console.error("GraphQL errors:", data.errors);
          setError(`Failed to fetch components: ${data.errors[0]?.message || "Unknown error"}`);
          setLoading(false);
          return;
        }

        // Filter components client-side (CMS only)
        const allComponents = data.data?.allSanityComponent?.nodes || [];
        console.log("All components:", allComponents);
        console.log("Looking for:", { firstPlatform, firstSlug, secondPlatform, secondSlug });

        const firstComponent = allComponents.find(
          (c: any) => c.platform === firstPlatform && c.slug.current === firstSlug
        );
        const secondComponent = allComponents.find(
          (c: any) => c.platform === secondPlatform && c.slug.current === secondSlug
        );

        console.log("Found components:", { firstComponent, secondComponent });

        if (!firstComponent || !secondComponent) {
          setError(`One or both components not found. Looking for: ${firstPlatform}/${firstSlug} and ${secondPlatform}/${secondSlug}. Only CMS components can be compared.`);
          setLoading(false);
          return;
        }

        setFirst(firstComponent);
        setSecond(secondComponent);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching comparison data:", err);
        setError("Failed to load comparison");
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: "72px 56px", maxWidth: "992px", textAlign: "center", fontFamily: font.family, color: colors.textMuted }}>
          <p>Loading comparison...</p>
        </div>
      </Layout>
    );
  }

  if (error || !first || !second) {
    return (
      <Layout>
        <div style={{ padding: "72px 56px", maxWidth: "992px", textAlign: "center", fontFamily: font.family, color: colors.text }}>
          <h2 style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>Comparison not available</h2>
          <p style={{ color: colors.textMuted, marginBottom: "20px", fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>{error || "Components not found"}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 24px",
              background: colors.surface,
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
              borderRadius: `${radius.xl}px`,
              fontFamily: font.family,
              fontSize: `${font.size.body}px`,
              cursor: "pointer",
            }}
          >
            Go back
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ padding: "72px 56px", maxWidth: "992px", fontFamily: font.family, color: colors.text }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
              {first.name} vs {second.name}
            </h1>
            <button
              onClick={() => navigate(-1)}
              onMouseEnter={(e) => (e.currentTarget.style.background = colors.surfaceAlt)}
              onMouseLeave={(e) => (e.currentTarget.style.background = colors.surface)}
              style={{
                padding: "8px 24px",
                background: colors.surface,
                border: `1px solid ${colors.stroke}`,
                borderRadius: `${radius.xl}px`,
                fontFamily: font.family,
                fontSize: `${font.size.body}px`,
                color: colors.text,
                cursor: "pointer",
                transition: "background 0.15s ease",
              }}
            >
              Back
            </button>
          </div>
          <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted }}>
            {first.platform === second.platform
              ? `${first.platform.charAt(0).toUpperCase() + first.platform.slice(1)} Components`
              : `${first.platform.charAt(0).toUpperCase() + first.platform.slice(1)} vs ${second.platform.charAt(0).toUpperCase() + second.platform.slice(1)}`}
          </p>
        </div>

        {/* Comparison View */}
        <ComparisonView first={first} second={second} />
      </div>
    </Layout>
  );
};

export default ComparisonPage;

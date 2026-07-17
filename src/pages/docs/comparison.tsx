import React, { useState, useEffect } from "react";
import { graphql, navigate, useStaticQuery } from "gatsby";
import Layout from "../../components/Layout";
import ComparisonView from "../../components/ComparisonView";
import { useTheme } from "../../context/ThemeContext";
import { font, radius } from "../../theme/tokens";
import PageShell from "../../components/PageShell";
import { ComponentData } from "../../data/sanity-component";

// Note: Static components removed - only CMS components are compared now
// The static iOS/Android components in SearchModal are just for search/navigation,
// not for comparison which requires real documentation

const ComparisonPage: React.FC = () => {
  const { colors } = useTheme();
  const [first, setFirst] = useState<ComponentData | null>(null);
  const [second, setSecond] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All Sanity components are baked in at build time; the ?first=/?second=
  // params select which two to compare on the client.
  const data = useStaticQuery(graphql`
    query ComparisonComponentsQuery {
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
  `);

  useEffect(() => {
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

    // Match against the build-time component set (CMS only).
    const allComponents: ComponentData[] = data?.allSanityComponent?.nodes || [];

    const firstComponent = allComponents.find(
      (c) => c.platform === firstPlatform && c.slug.current === firstSlug
    );
    const secondComponent = allComponents.find(
      (c) => c.platform === secondPlatform && c.slug.current === secondSlug
    );

    if (!firstComponent || !secondComponent) {
      setError(`One or both components not found. Looking for: ${firstPlatform}/${firstSlug} and ${secondPlatform}/${secondSlug}. Only CMS components can be compared.`);
      setLoading(false);
      return;
    }

    setFirst(firstComponent);
    setSecond(secondComponent);
    setLoading(false);
  }, [data]);

  if (loading) {
    return (
      <Layout>
        <PageShell contentStyle={{ textAlign: "center", color: colors.textMuted }}>
          <p>Loading comparison...</p>
        </PageShell>
      </Layout>
    );
  }

  if (error || !first || !second) {
    return (
      <Layout>
        <PageShell contentStyle={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.headingLg}px`, lineHeight: `${font.lineHeight.headingLg}px`, color: colors.text }}>Comparison not available</h2>
          <p style={{ color: colors.textMuted, marginBottom: "20px", fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>{error || "Components not found"}</p>
          <button
            onClick={() => navigate(-1)}
            style={{
              padding: "8px 24px",
              background: colors.surface,
              color: colors.accent,
              border: `1px solid ${colors.accent}`,
              borderRadius: `${radius.xl}`,
              fontFamily: font.family,
              fontSize: `${font.size.body}px`,
              cursor: "pointer",
            }}
          >
            Go back
          </button>
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageShell>
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
                borderRadius: `${radius.xl}`,
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
      </PageShell>
    </Layout>
  );
};

export default ComparisonPage;

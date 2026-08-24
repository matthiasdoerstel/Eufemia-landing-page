import React, { useEffect, useState } from "react";
import { graphql, navigate, useStaticQuery } from "gatsby";
import { Button, H1, H2, P } from "@dnb/eufemia";
import Layout from "../../components/Layout";
import ComparisonView from "../../components/ComparisonView";
import EufemiaThemeScope from "../../components/EufemiaThemeScope";
import { useTheme } from "../../context/ThemeContext";
import PageShell from "../../components/PageShell";
import { ComponentData } from "../../data/sanity-component";

const ComparisonPage: React.FC = () => {
  const { colors } = useTheme();
  const [first, setFirst] = useState<ComponentData | null>(null);
  const [second, setSecond] = useState<ComponentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

    const [firstPlatform, firstSlug] = firstParam.split("/");
    const [secondPlatform, secondSlug] = secondParam.split("/");

    if (!firstPlatform || !firstSlug || !secondPlatform || !secondSlug) {
      setError("Invalid URL format. Use: ?first=platform/slug&second=platform/slug");
      setLoading(false);
      return;
    }

    const allComponents: ComponentData[] = data?.allSanityComponent?.nodes || [];
    const firstComponent = allComponents.find((component) => component.platform === firstPlatform && component.slug.current === firstSlug);
    const secondComponent = allComponents.find((component) => component.platform === secondPlatform && component.slug.current === secondSlug);

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
        <PageShell contentStyle={{ textAlign: "center" }}>
          <EufemiaThemeScope><P style={{ margin: 0, color: colors.textMuted }}>Loading comparison...</P></EufemiaThemeScope>
        </PageShell>
      </Layout>
    );
  }

  if (error || !first || !second) {
    return (
      <Layout>
        <PageShell contentStyle={{ textAlign: "center" }}>
          <EufemiaThemeScope>
            <H2 style={{ margin: 0, color: colors.text }}>Comparison not available</H2>
            <P style={{ margin: "20px 0", color: colors.textMuted }}>{error || "Components not found"}</P>
            <Button text="Go back" variant="secondary" icon="chevron_left" iconPosition="left" onClick={() => navigate(-1)} />
          </EufemiaThemeScope>
        </PageShell>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageShell>
        <EufemiaThemeScope>
          <div style={{ marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", marginBottom: "16px" }}>
              <H1 style={{ margin: 0, color: colors.text }}>{first.name} vs {second.name}</H1>
              <Button text="Back" variant="secondary" icon="chevron_left" iconPosition="left" onClick={() => navigate(-1)} />
            </div>
            <P style={{ margin: 0, color: colors.textMuted }}>
              {first.platform === second.platform
                ? `${first.platform.charAt(0).toUpperCase() + first.platform.slice(1)} Components`
                : `${first.platform.charAt(0).toUpperCase() + first.platform.slice(1)} vs ${second.platform.charAt(0).toUpperCase() + second.platform.slice(1)}`}
            </P>
          </div>
          <ComparisonView first={first} second={second} />
        </EufemiaThemeScope>
      </PageShell>
    </Layout>
  );
};

export default ComparisonPage;

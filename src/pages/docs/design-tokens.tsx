import React from 'react';
import { Link } from 'gatsby';
import Layout from '../../components/Layout';
import TokensViewer from '../../components/TokensViewer';
import { useTheme } from '../../context/ThemeContext';
import { font, radius } from '../../theme/tokens';
import PageShell from '../../components/PageShell';

interface Token {
  id: string;
  name: string;
  type: string;
  description: string;
  collection: string;
  colorValues: Array<{
    modeName: string;
    hex: string;
    rgb: { r: number; g: number; b: number; a: number };
  }>;
}

interface PageProps {
  pageContext: {
    platform: 'ios' | 'android';
    designTokens: Token[];
    lastUpdated: string | null;
  };
}

const DesignTokensPage: React.FC<PageProps> = ({ pageContext }) => {
  const { platform, designTokens, lastUpdated } = pageContext;
  const { colors } = useTheme();
  const platformLabel = platform === 'ios' ? 'iOS' : 'Android';
  const platformPath = `/docs/${platform}`;

  return (
    <Layout currentPlatform={platform} currentPath={platformPath}>
      <PageShell contentStyle={{ gap: '24px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: font.family, fontSize: `${font.size.small}px`, color: colors.textMuted }}>
            <Link to={platformPath} style={{ color: colors.accent, textDecoration: 'none' }}>{platformLabel}</Link>
            <span>/</span>
            <span style={{ color: colors.text }}>Design Tokens</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h1 style={{ margin: 0, fontFamily: font.family, fontWeight: 500, fontSize: `${font.size.h1}px`, lineHeight: `${font.lineHeight.h1}px`, color: colors.text }}>
              Design tokens
            </h1>
            <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px`, color: colors.textMuted, maxWidth: '640px' }}>
              Browse and copy color tokens for your {platformLabel} designs. Select a brand mode to view tokens in different styles.
            </p>
            {lastUpdated && (
              <p style={{ margin: 0, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, color: colors.textMuted }}>
                Last updated: {new Date(lastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Tokens viewer */}
          {designTokens && designTokens.length > 0 ? (
            <TokensViewer tokens={designTokens} />
          ) : (
            <div style={{ padding: '48px 40px', background: colors.surface, border: `1px solid ${colors.strokeSubtle}`, borderRadius: `${radius.lg}`, textAlign: 'center', color: colors.textMuted }}>
              <p style={{ margin: 0 }}>No design tokens available yet.</p>
              <p style={{ margin: '8px 0 0 0', fontSize: `${font.size.small}px` }}>Run the import script to populate design tokens from your Figma file.</p>
            </div>
          )}

          {/* Back link */}
          <div style={{ paddingTop: '24px', borderTop: `1px solid ${colors.strokeSubtle}` }}>
            <Link to={platformPath} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: font.family, fontSize: `${font.size.body}px`, color: colors.accent, textDecoration: 'none' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to {platformLabel}
            </Link>
          </div>
      </PageShell>
    </Layout>
  );
};

export default DesignTokensPage;

export const Head: React.FC<PageProps> = () => <title>Design Tokens | Eufemia Design System</title>;

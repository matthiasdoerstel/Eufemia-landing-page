import React, { useContext, useRef, useState } from "react";
import { Breadcrumb, Button, Icon } from "@dnb/eufemia";
import { copy as copyIcon } from "@dnb/eufemia/icons";
import { IsolatedStyleScope, Theme } from "@dnb/eufemia/shared";
import { Highlight, themes } from "prism-react-renderer";
import { LiveContext, LiveEditor, LiveError, LivePreview, LiveProvider } from "react-live";
import Layout from "../../../../components/Layout";
import PageShell from "../../../../components/PageShell";
import InPageRail from "../../../../components/InPageRail";
import EufemiaThemeScope from "../../../../components/EufemiaThemeScope";
import { useTheme } from "../../../../context/ThemeContext";
import { usePreviewStyles } from "../../../../hooks/usePreviewStyles";
import { font, radius } from "../../../../theme/tokens";

const railItems = [
  { id: "overview", label: "Overview" },
  { id: "examples", label: "Examples" },
  { id: "variants-and-sizes", label: "Variants and sizes" },
  { id: "usage-guidance", label: "Usage guidance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "related-components", label: "Related components" },
  { id: "properties", label: "Properties" },
];

const importCode = `import { Button } from '@dnb/eufemia'`;
const primaryCode = `<Button
  text="Continue"
  icon="chevron_right"
  onClick={() => {
    handleDemoAction('Continue selected.')
  }}
/>`;
const variantsCode = `<>
  <Button
    text="Primary action"
    onClick={() => {
      handleDemoAction('Primary action selected.')
    }}
  />
  <Button
    text="Secondary action"
    variant="secondary"
    onClick={() => {
      handleDemoAction('Secondary action selected.')
    }}
  />
  <Button
    text="Back"
    variant="tertiary"
    icon="chevron_left"
    iconPosition="left"
    onClick={() => {
      handleDemoAction('Back selected.')
    }}
  />
</>`;
const linkCode = `<Button
  text="Primary with href"
  href="/docs/web/components/button"
  icon="chevron_right"
  onClick={({ event }) => {
    event.preventDefault()
    handleDemoAction('Link button selected.')
  }}
/>`;
const sizesCode = `<>
  <Button
    title="Add item"
    icon="add"
    size="small"
    onClick={() => {
      handleDemoAction('Small add button selected.')
    }}
  />
  <Button
    title="Add item"
    icon="add"
    size="medium"
    onClick={() => {
      handleDemoAction('Medium add button selected.')
    }}
  />
  <Button
    title="Add item"
    icon="add"
    size="large"
    onClick={() => {
      handleDemoAction('Large add button selected.')
    }}
  />
</>`;
const advancedPropsCode = `<>
  <Button
    text="Continue"
    icon="chevron_right"
    iconSize="small"
    onClick={() => {
      handleDemoAction('Continue with smaller icon selected.')
    }}
  />
  <Button
    text="Need help?"
    icon="question"
    status="More information is available."
    statusState="information"
    onClick={() => {
      handleDemoAction('Help selected.')
    }}
  />
  <Button
    text="Custom content"
    icon="chevron_right"
    customContent={<span aria-hidden>✓</span>}
    onClick={() => {
      handleDemoAction('Custom content button selected.')
    }}
  />
</>`;
const disabledCode = `<>
  <Button text="Disabled primary button" disabled />
  <Button text="Disabled secondary button" variant="secondary" disabled />
  <Button
    text="Disabled tertiary button"
    variant="tertiary"
    icon="chevron_right"
    disabled
  />
</>`;

const FigmaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path d="M8 24c2.208 0 4-1.792 4-4v-4H8c-2.208 0-4 1.792-4 4s1.792 4 4 4Z" fill="#0ACF83" />
    <path d="M4 12c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4Z" fill="#A259FF" />
    <path d="M4 4c0-2.208 1.792-4 4-4h4v8H8c-2.208 0-4-1.792-4-4Z" fill="#F24E1E" />
    <path d="M12 0h4c2.208 0 4 1.792 4 4s-1.792 4-4 4h-4V0Z" fill="#FF7262" />
    <path d="M20 12c0 2.208-1.792 4-4 4s-4-1.792-4-4 1.792-4 4-4 4 1.792 4 4Z" fill="#1ABCFE" />
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-4.18 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.72.23 3.89.11 4.18.74.84 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12 0 1.53-.01 2.77-.01 3.14 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M12 8.667v4C12 13.404 11.404 14 10.667 14H3.333A1.333 1.333 0 0 1 2 12.667V5.333C2 4.596 2.596 4 3.333 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 2h4v4M6.667 9.333 14 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ResourceCards: React.FC = () => {
  const { colors } = useTheme();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const cards = [
    { key: "figma", label: "Open in Figma", icon: <FigmaIcon />, href: "https://www.figma.com/design/cdtwQD8IJ7pTeE45U148r1/%F0%9F%92%BB-Eufemia---Web?node-id=339-154" },
    { key: "github", label: "View source", icon: <GitHubIcon />, href: "https://github.com/dnbexperience/eufemia/tree/main/packages/dnb-eufemia/src/components/button" },
  ];

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {cards.map((card) => (
        <a
          key={card.key}
          href={card.href}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => setHoveredCard(card.key)}
          onMouseLeave={() => setHoveredCard(null)}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "44px", padding: "10px 16px", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.md, background: hoveredCard === card.key ? colors.surfaceAlt : colors.surface, color: colors.text, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px`, fontWeight: 500, textDecoration: "none", transition: "background 0.15s ease, border-color 0.15s ease" }}
        >
          {card.icon}
          <span>{card.label}</span>
          <ExternalLinkIcon />
        </a>
      ))}
    </div>
  );
};

const externalLink = (href: string, label: string) => (
  <a href={href} target="_blank" rel="noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
    <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{label}</span>
    <span aria-hidden style={{ marginLeft: "6px" }}>↗</span>
  </a>
);


type PrismThemeName = "vsDark" | "vsLight";

const defaultPrismTheme = (theme: "light" | "dark"): PrismThemeName =>
  theme === "dark" ? "vsDark" : "vsLight";

const prismThemeMode = (name: PrismThemeName) => name === "vsDark" ? "dark" : "light";

const codeTheme = (name: PrismThemeName) => {
  const theme = name === "vsDark" ? themes.vsDark : themes.vsLight;
  return {
    ...theme,
    plain: { ...theme.plain, backgroundColor: prismThemeMode(name) === "dark" ? "#1c1c1e" : "#f2f2f5" },
  };
};

const codeBackground = (name: PrismThemeName) =>
  prismThemeMode(name) === "dark" ? "#1c1c1e" : "#f2f2f5";

interface CodeBlockProps {
  code: string;
  prismThemeName: PrismThemeName;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, prismThemeName }) => {
  const { colors } = useTheme();
  const [copyLabel, setCopyLabel] = useState("Copy");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1600);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy"), 1600);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden", padding: "10px 12px 10px 24px", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.md, background: codeBackground(prismThemeName) }}>
      <Highlight code={code} language="tsx" theme={codeTheme(prismThemeName)}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, flex: "1 1 auto", minWidth: 0, overflowX: "auto", margin: 0, padding: 0, fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace", fontSize: "14px", lineHeight: "24px", whiteSpace: "pre" }}>
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => <span key={tokenIndex} {...getTokenProps({ token })} />)}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <button
        type="button"
        onClick={copyCode}
        aria-label={copyLabel === "Copied" ? "Code copied" : "Copy code"}
        title={copyLabel === "Copied" ? "Copied" : "Copy code"}
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", width: "32px", height: "32px", padding: 0, border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.sm, background: colors.surfaceAlt, color: colors.text, cursor: "pointer" }}
      >
        <Icon icon={copyIcon} aria-hidden />
      </button>
    </div>
  );
};

const Section: React.FC<{ id: string; title: string; intro: string; children: React.ReactNode }> = ({ id, title, intro, children }) => {
  const { colors } = useTheme();
  return (
    <section
      id={id}
      style={{ display: "flex", flexDirection: "column", gap: "20px", paddingTop: "8px", scrollMarginTop: "104px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <h2 style={{ margin: 0, color: colors.text, fontFamily: font.family, fontSize: `${font.size.headingLg}px`, fontWeight: 500, lineHeight: `${font.lineHeight.headingLg}px` }}>
          {title}
        </h2>
        <p style={{ maxWidth: "680px", margin: 0, color: colors.textMuted, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
          {intro}
        </p>
      </div>
      {children}
    </section>
  );
};

const LiveCodeEditor: React.FC<{ prismThemeName: PrismThemeName; onCodeChange: (code: string) => void }> = ({ prismThemeName, onCodeChange }) => {
  const live = useContext(LiveContext);
  return (
    <LiveEditor
      onChange={(value) => {
        live.onChange(value);
        onCodeChange(value);
      }}
      theme={codeTheme(prismThemeName)}
      style={{ maxWidth: "100%", overflowX: "auto", fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace", fontSize: "14px", lineHeight: "22px" }}
    />
  );
};

const LiveDemoPanel: React.FC<{ label: string; source: string; prismThemeName: PrismThemeName; onAction: (message: string) => void }> = ({ label, source, prismThemeName, onAction }) => {
  const { colors, theme, brand } = useTheme();
  const previewStylesReady = usePreviewStyles(brand);
  const eufemiaThemeName = brand === "DNB" ? "ui" : brand.toLowerCase() as "sbanken" | "carnegie";
  const codeRef = useRef(source);
  const [editorVersion, setEditorVersion] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [modeOverride, setModeOverride] = useState<"light" | "dark" | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy");
  const previewMode = modeOverride ?? theme;
  const isDarkPreview = previewMode === "dark";

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(codeRef.current);
      setCopyLabel("Copied");
      window.setTimeout(() => setCopyLabel("Copy"), 1600);
    } catch {
      setCopyLabel("Copy failed");
      window.setTimeout(() => setCopyLabel("Copy"), 1600);
    }
  };

  const resetCode = () => {
    codeRef.current = source;
    setIsDirty(false);
    setEditorVersion((value) => value + 1);
  };

  const controlStyle: React.CSSProperties = {
    padding: "6px 10px",
    border: `1px solid ${colors.strokeSubtle}`,
    borderRadius: radius.md,
    background: "transparent",
    color: colors.text,
    fontFamily: font.family,
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "20px",
    cursor: "pointer",
  };

  return (
    <div style={{ overflow: "hidden", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.lg }}>
      <IsolatedStyleScope>
        <LiveProvider key={editorVersion} code={codeRef.current} language="tsx" scope={{ React, Button, handleDemoAction: onAction }}>
          <Theme
            name={eufemiaThemeName}
            colorScheme={previewMode}
            surface={isDarkPreview ? "dark" : "light"}
            style={{ minHeight: "132px", padding: "20px 24px", background: isDarkPreview ? "#1c1c1e" : colors.surface, visibility: previewStylesReady ? "visible" : "hidden" }}
          >
            <p style={{ margin: 0, color: isDarkPreview ? "#b2b2b8" : colors.textMuted, fontFamily: font.family, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px` }}>
              {label}
            </p>
            <LivePreview style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", paddingTop: "20px" }} />
          </Theme>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "12px", padding: "12px 16px", background: colors.pageBg, borderTop: `1px solid ${colors.strokeSubtle}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <button type="button" onClick={() => setShowCode((value) => !value)} aria-expanded={showCode} style={controlStyle}>{showCode ? "Hide code" : "Show code"}</button>
              <button type="button" onClick={copyCode} style={controlStyle}>{copyLabel}</button>
              <button type="button" onClick={resetCode} disabled={!isDirty} style={{ ...controlStyle, cursor: isDirty ? "pointer" : "default", opacity: isDirty ? 1 : 0.55 }}>Reset</button>
            </div>
            <button type="button" onClick={() => setModeOverride((value) => value === null ? (isDarkPreview ? "light" : "dark") : null)} aria-pressed={modeOverride !== null} style={{ ...controlStyle, borderColor: modeOverride !== null ? colors.strokeAction : colors.strokeSubtle }}>{modeOverride === null ? "Override mode" : "Use portal mode"}</button>
          </div>
          {showCode && (
            <div style={{ background: codeBackground(prismThemeName), borderTop: `1px solid ${colors.strokeSubtle}`, maxWidth: "100%" }}>
              <LiveCodeEditor
                prismThemeName={prismThemeName}
                onCodeChange={(value) => {
                  codeRef.current = value;
                  setIsDirty(value !== source);
                }}
              />
              <LiveError style={{ margin: 0, padding: "12px 16px", borderTop: "1px solid #7f1d1d", background: "#450a0a", color: "#fecaca", fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace", fontSize: "13px", lineHeight: "20px", whiteSpace: "pre-wrap" }} />
            </div>
          )}
        </LiveProvider>
      </IsolatedStyleScope>
    </div>
  );
};

const ButtonDocsPage: React.FC = () => {
  const { colors, theme } = useTheme();
  const [lastAction, setLastAction] = useState("No action selected yet.");
  const prismThemeName = defaultPrismTheme(theme);
  const textStyle: React.CSSProperties = {
    margin: 0,
    color: colors.textMuted,
    fontFamily: font.family,
    fontSize: `${font.size.body}px`,
    lineHeight: `${font.lineHeight.body}px`,
  };
  const codeStyle: React.CSSProperties = {
    padding: "2px 5px",
    color: colors.text,
    background: colors.surfaceAlt,
    borderRadius: radius.sm,
    fontFamily: "'SF Mono', ui-monospace, Menlo, Consolas, monospace",
    fontSize: "0.88em",
  };

  return (
    <Layout currentPlatform="web" currentPath="/docs/web/components/button">
      <PageShell contentStyle={{ gap: "56px" }} rail={<InPageRail items={railItems} />}>
        <EufemiaThemeScope>
          <Breadcrumb
            variant="responsive"
            navText="Page hierarchy"
            data={[
              { text: "Web", href: "/docs/web" },
              { text: "Components", href: "/docs/web" },
              { text: "Button" },
            ]}
          />
        </EufemiaThemeScope>

        <header id="overview" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px", scrollMarginTop: "104px" }}>
          <span style={{ padding: "4px 10px", borderRadius: radius.sm, background: colors.selectedSubtle, color: colors.textSelected, fontFamily: font.family, fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}>
            Web
          </span>
          <h1 style={{ margin: 0, color: colors.text, fontFamily: font.family, fontSize: `${font.size.h1}px`, fontWeight: 500, lineHeight: `${font.lineHeight.h1}px` }}>Button</h1>
          <p style={{ ...textStyle, maxWidth: "680px", color: colors.text }}>
            Use Button when people need to start, confirm, or submit an action.
          </p>
          <div style={{ width: "100%", maxWidth: "560px" }}><CodeBlock code={importCode} prismThemeName={defaultPrismTheme(theme)} /></div>
          <ResourceCards />
        </header>

        <Section id="examples" title="Examples" intro="Use clear, specific labels that describe what happens after activation.">
          <LiveDemoPanel label="Primary action" source={primaryCode} prismThemeName={prismThemeName} onAction={setLastAction} />
          <LiveDemoPanel label="Variants" source={variantsCode} prismThemeName={prismThemeName} onAction={setLastAction} />
          <LiveDemoPanel label="Button as link" source={linkCode} prismThemeName={prismThemeName} onAction={setLastAction} />
          <p aria-live="polite" style={{ ...textStyle, color: colors.accent }}>{lastAction}</p>
        </Section>

        <Section id="variants-and-sizes" title="Variants and sizes" intro="Match visual emphasis to importance of action.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
            {[
              ["Primary", "Main action in a context. Recommended sizes: default and large."],
              ["Secondary", "Supporting actions. Recommended sizes: default and large."],
              ["Tertiary", "Use with an icon. Default and large sizes are supported."],
            ].map(([title, description]) => (
              <article key={title} style={{ minHeight: "128px", padding: "20px", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.md, background: colors.surface }}>
                <h3 style={{ margin: "0 0 8px", color: colors.text, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px` }}>{title}</h3>
                <p style={{ ...textStyle, fontSize: `${font.size.small}px` }}>{description}</p>
              </article>
            ))}
          </div>
          <LiveDemoPanel label="Icon-only buttons" source={sizesCode} prismThemeName={prismThemeName} onAction={setLastAction} />
          <LiveDemoPanel label="Button properties" source={advancedPropsCode} prismThemeName={prismThemeName} onAction={setLastAction} />
        </Section>

        <Section id="usage-guidance" title="Usage guidance" intro="Buttons trigger actions. Links navigate to a destination.">
          <div style={{ padding: "20px 24px", borderLeft: `4px solid ${colors.accent}`, background: colors.selectedSubtle }}>
            <h3 style={{ margin: "0 0 8px", color: colors.text, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px` }}>One primary action per context</h3>
            <p style={{ ...textStyle, color: colors.text }}>Keep focus on most important next step. Secondary and tertiary buttons can support it without competing for attention.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "12px" }}>
            {[
              ["Use a button", "To save, submit, confirm, open, remove, or otherwise change something."],
              ["Use a link", "To take someone to another page, section, document, or website."],
              ["Disabled states", "Prefer explaining what needs to happen before an action becomes available."],
            ].map(([title, description]) => (
              <div key={title} style={{ padding: "20px", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.md }}>
                <h3 style={{ margin: "0 0 8px", color: colors.text, fontFamily: font.family, fontSize: `${font.size.bodyMedium}px`, fontWeight: 500, lineHeight: `${font.lineHeight.body}px` }}>{title}</h3>
                <p style={{ ...textStyle, fontSize: `${font.size.small}px` }}>{description}</p>
              </div>
            ))}
          </div>
          <LiveDemoPanel label="Disabled states" source={disabledCode} prismThemeName={prismThemeName} onAction={setLastAction} />
        </Section>

        <Section id="accessibility" title="Accessibility" intro="Buttons support standard keyboard interaction patterns.">
          <ul style={{ display: "grid", gap: "12px", margin: 0, paddingLeft: "24px", color: colors.text, fontFamily: font.family, fontSize: `${font.size.body}px`, lineHeight: `${font.lineHeight.body}px` }}>
            <li>Use meaningful visible text wherever possible.</li>
            <li>Give icon-only buttons a meaningful <code style={codeStyle}>title</code> or <code style={codeStyle}>aria-label</code>.</li>
            <li>Avoid disabled buttons when possible: they do not explain why an action is unavailable.</li>
            <li>Use the native <code style={codeStyle}>submit</code> type only when action submits a form.</li>
          </ul>
        </Section>

        <Section id="related-components" title="Related components" intro="Choose component that matches intended interaction.">
          <div style={{ display: "flex", flexDirection: "column", borderTop: `1px solid ${colors.strokeSubtle}` }}>
            {[
              ["Anchor", "Navigate to another place", "https://eufemia.dnb.no/uilib/components/anchor"],
              ["HelpButton", "Offer brief contextual explanation", "https://eufemia.dnb.no/uilib/components/help-button"],
              ["Menu", "Choose from several actions", "https://eufemia.dnb.no/uilib/components/menu"],
            ].map(([name, description, href]) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" style={{ display: "grid", gridTemplateColumns: "minmax(140px, 1fr) 2fr auto", gap: "16px", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${colors.strokeSubtle}`, color: colors.text, fontFamily: font.family, textDecoration: "none" }}>
                <strong style={{ fontWeight: 500 }}>{name}</strong>
                <span style={{ color: colors.textMuted, fontSize: `${font.size.small}px`, lineHeight: `${font.lineHeight.small}px` }}>{description}</span>
                <span aria-hidden style={{ color: colors.accent }}>→</span>
              </a>
            ))}
          </div>
        </Section>

        <Section id="properties" title="Properties" intro="Most-used Button props. See canonical documentation for full API and events.">
          <div style={{ overflowX: "auto", border: `1px solid ${colors.strokeSubtle}`, borderRadius: radius.md }}>
            <table style={{ width: "100%", minWidth: "680px", borderCollapse: "collapse", color: colors.text, fontFamily: font.family, textAlign: "left" }}>
              <thead style={{ background: colors.surfaceAlt }}>
                <tr>{["Property", "Type", "Description"].map((heading) => <th key={heading} scope="col" style={{ padding: "12px 16px", color: colors.textMuted, fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}>{heading}</th>)}</tr>
              </thead>
              <tbody>
                {[
                  ["variant", "primary | secondary | tertiary", "Visual importance. Defaults to primary."],
                  ["size", "default | small | medium | large", "Controls button spacing and scale."],
                  ["text", "string | ReactNode", "Button label or content."],
                  ["icon", "string | ReactNode", "Icon shown inside button."],
                  ["iconPosition", "left | right | top", "Places icon inside button. Tertiary buttons also support top."],
                  ["iconSize", "small | medium | large | number", "Sets icon dimensions. Defaults to the Button icon size."],
                  ["customContent", "ReactNode", "Injects custom markup; alignment and styling remain your responsibility."],
                  ["onClick", "({ event }) => void", "Runs for click events and receives native event in an object."],
                  ["href", "string", "Makes button behave as a link. Use with care."],
                  ["disabled", "boolean", "Prevents interaction."],
                  ["wrap", "boolean", "Allows text to wrap over multiple lines."],
                  ["stretch", "boolean", "Expands button to available width."],
                  ["status", "string | boolean", "Adds inline status text or status color."],
                  ["statusState", "error | warning | information | success | marketing", "Sets status appearance. Defaults to error."],
                ].map(([name, type, description]) => (
                  <tr key={name} style={{ borderTop: `1px solid ${colors.strokeSubtle}` }}>
                    <th scope="row" style={{ padding: "14px 16px", fontSize: "14px", fontWeight: 500, lineHeight: "20px" }}><code style={codeStyle}>{name}</code></th>
                    <td style={{ padding: "14px 16px", color: colors.textMuted, fontSize: "14px", lineHeight: "20px" }}><code style={codeStyle}>{type}</code></td>
                    <td style={{ padding: "14px 16px", color: colors.textMuted, fontSize: "14px", lineHeight: "20px" }}>{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ ...textStyle, color: colors.accent }}>
            {externalLink("https://eufemia.dnb.no/uilib/components/button", "View full Button API and events")}
          </p>
        </Section>
      </PageShell>
    </Layout>
  );
};

export default ButtonDocsPage;

export const Head = () => <title>Button | Eufemia Design System</title>;

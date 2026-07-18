const path = require("path");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = `
    type SanityDesignTokens implements Node {
      title: String
      tokens: [SanityToken]
      lastUpdated: String
      sourceFile: String
    }

    type SanityToken {
      id: String
      name: String
      type: String
      description: String
      collection: String
      colorValues: [SanityColorValue]
    }

    type SanityColorValue {
      modeName: String
      hex: String
      rgb: SanityRGB
    }

    type SanityRGB {
      r: Float
      g: Float
      b: Float
      a: Float
    }
  `;

  createTypes(typeDefs);
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    query {
      allSanityComponent {
        nodes {
          id
          name
          platform
          slug {
            current
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error loading components", result.errors);
    return;
  }

  const componentTemplate = path.resolve("./src/templates/component.tsx");
  const designTokensTemplate = path.resolve("./src/pages/docs/design-tokens.tsx");
  const components = result.data.allSanityComponent.nodes;

  components.forEach((component) => {
    // Button has a portal-native static page at src/pages/docs/web/components/button.tsx.
    // Do not let the generic CMS template overwrite it during Gatsby page creation.
    if (component.platform === "web" && component.slug?.current === "button") {
      reporter.info("Using static Button page: /docs/web/components/button");
      return;
    }

    if (!component.slug?.current) {
      reporter.warn(`Component "${component.name}" has no slug - skipping`);
      return;
    }

    const pagePath = `/docs/${component.platform}/components/${component.slug.current}`;

    createPage({
      path: pagePath,
      component: componentTemplate,
      context: {
        id: component.id,
      },
    });

    reporter.info(`Created component page: ${pagePath}`);
  });

  // Fetch design tokens from Sanity API
  let designTokensData = [];
  let lastUpdated = null;
  try {
    const query = '*[_type == "designTokens"][0]';
    const url = `https://sy4b7kpu.api.sanity.io/v2023-11-21/data/query/production?query=${encodeURIComponent(query)}`;

    reporter.info("Fetching design tokens from Sanity...");
    const response = await fetch(url);

    if (response.ok) {
      const result = await response.json();
      if (result.result && result.result.tokens) {
        designTokensData = result.result.tokens;
        lastUpdated = result.result.lastUpdated;
        reporter.info(`Fetched ${designTokensData.length} design tokens`);
      }
    }
  } catch (error) {
    reporter.warn(`Failed to fetch design tokens: ${error.message}`);
  }

  // Create design tokens pages for each platform
  const platforms = ["ios", "android"];
  platforms.forEach((platform) => {
    const tokensPath = `/docs/${platform}/design-tokens`;
    createPage({
      path: tokensPath,
      component: designTokensTemplate,
      context: {
        platform,
        designTokens: designTokensData,
        lastUpdated,
      },
    });
    reporter.info(`Created design tokens page: ${tokensPath}`);
  });
};

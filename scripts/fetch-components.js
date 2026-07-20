#!/usr/bin/env node

/**
 * Fetches component data from the Eufemia GitHub repository
 * and generates a components.json file for use in the landing page.
 *
 * Run with: node scripts/fetch-components.js
 */

const fs = require('fs');
const path = require('path');

const GITHUB_API = 'https://api.github.com/repos/dnbexperience/eufemia/contents';
const EUFEMIA_BASE_URL = 'https://eufemia.dnb.no/uilib/components';

// Components to exclude (internal/utility components)
const EXCLUDED = ['__tests__', 'style', 'space', 'flex', 'grid', 'form-row', 'form-set', 'icon-primary', 'popover'];

// Human-readable names and descriptions for components
const COMPONENT_META = {
  'accordion': { name: 'Accordion', description: 'Expandable content sections' },
  'anchor': { name: 'Anchor', description: 'Styled link component' },
  'aria-live': { name: 'Aria Live', description: 'Announce dynamic content to screen readers' },
  'autocomplete': { name: 'Autocomplete', description: 'Input with suggestions and filtering' },
  'avatar': { name: 'Avatar', description: 'Display user profile images or initials' },
  'badge': { name: 'Badge', description: 'Small status indicator or counter' },
  'breadcrumb': { name: 'Breadcrumb', description: 'Navigation trail showing page hierarchy' },
  'button': { name: 'Button', description: 'Trigger actions or navigate to new pages' },
  'card': { name: 'Card', description: 'Container for grouping related content' },
  'checkbox': { name: 'Checkbox', description: 'Select one or more options' },
  'copy-on-click': { name: 'Copy on Click', description: 'Copy text to clipboard on interaction' },
  'country-flag': { name: 'Country Flag', description: 'Display country flag icons' },
  'date-format': { name: 'Date Format', description: 'Format dates according to locale' },
  'date-picker': { name: 'DatePicker', description: 'Select dates from a calendar interface' },
  'dialog': { name: 'Dialog', description: 'Modal dialog for confirmations and alerts' },
  'drawer': { name: 'Drawer', description: 'Slide-out panel for additional content' },
  'dropdown': { name: 'Dropdown', description: 'Select an option from a list' },
  'form-label': { name: 'Form Label', description: 'Accessible labels for form inputs' },
  'form-status': { name: 'Form Status', description: 'Display validation messages and status' },
  'global-error': { name: 'Global Error', description: 'Full-page error display' },
  'global-status': { name: 'Global Status', description: 'Application-wide status messages' },
  'heading': { name: 'Heading', description: 'Semantic heading with consistent styling' },
  'height-animation': { name: 'Height Animation', description: 'Animate height changes smoothly' },
  'help-button': { name: 'Help Button', description: 'Contextual help trigger with tooltip' },
  'icon': { name: 'Icon', description: 'SVG icons from the Eufemia icon library' },
  'info-card': { name: 'Info Card', description: 'Highlighted information display' },
  'input': { name: 'Input', description: 'Text input field for data entry' },
  'input-masked': { name: 'Input Masked', description: 'Input with format masking (phone, date, etc.)' },
  'list-format': { name: 'List Format', description: 'Format lists with proper separators' },
  'logo': { name: 'Logo', description: 'DNB logo component' },
  'modal': { name: 'Modal', description: 'Overlay dialog for focused interactions' },
  'number-format': { name: 'Number Format', description: 'Format numbers according to locale' },
  'pagination': { name: 'Pagination', description: 'Navigate through pages of content' },
  'portal-root': { name: 'Portal Root', description: 'Render content outside DOM hierarchy' },
  'progress-indicator': { name: 'Progress Indicator', description: 'Show loading or progress state' },
  'radio': { name: 'Radio', description: 'Select one option from a group' },
  'section': { name: 'Section', description: 'Content section with background variants' },
  'skeleton': { name: 'Skeleton', description: 'Loading placeholder for content' },
  'skip-content': { name: 'Skip Content', description: 'Accessibility skip link for navigation' },
  'slider': { name: 'Slider', description: 'Select a value from a range' },
  'step-indicator': { name: 'Step Indicator', description: 'Show progress through a multi-step process' },
  'switch': { name: 'Switch', description: 'Toggle between two states' },
  'table': { name: 'Table', description: 'Display data in rows and columns' },
  'tabs': { name: 'Tabs', description: 'Organize content into tabbed sections' },
  'tag': { name: 'Tag', description: 'Label or categorize content' },
  'term-definition': { name: 'Term Definition', description: 'Definition lists with terms' },
  'textarea': { name: 'Textarea', description: 'Multi-line text input' },
  'timeline': { name: 'Timeline', description: 'Display chronological events' },
  'toggle-button': { name: 'Toggle Button', description: 'Button that toggles between states' },
  'tooltip': { name: 'Tooltip', description: 'Show additional info on hover' },
  'upload': { name: 'Upload', description: 'File upload with drag and drop' },
  'visually-hidden': { name: 'Visually Hidden', description: 'Hide content visually but keep accessible' },
};

async function fetchComponents() {
  console.log('Fetching components from Eufemia GitHub...');

  try {
    const response = await fetch(`${GITHUB_API}/packages/dnb-eufemia/src/components`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Filter to only directories, excluding internal components
    const componentDirs = data
      .filter(item => item.type === 'dir' && !EXCLUDED.includes(item.name))
      .map(item => item.name);

    console.log(`Found ${componentDirs.length} components`);

    // Build component data
    const components = componentDirs.map(slug => {
      const meta = COMPONENT_META[slug] || {
        name: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: `${slug} component`
      };

      return {
        slug,
        name: meta.name,
        description: meta.description,
        path: `${EUFEMIA_BASE_URL}/${slug}/`,
        category: 'Web Components',
        external: true
      };
    });

    // Sort alphabetically by name
    components.sort((a, b) => a.name.localeCompare(b.name));

    // Add metadata
    const output = {
      generated: new Date().toISOString(),
      source: 'https://github.com/dnbexperience/eufemia',
      baseUrl: EUFEMIA_BASE_URL,
      count: components.length,
      components
    };

    // Write to file
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'web-components.json');

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`Written ${components.length} components to ${outputPath}`);

    return output;

  } catch (error) {
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'web-components.json');
    if (fs.existsSync(outputPath)) {
      console.warn(`Could not refresh components (${error.message}); using ${outputPath}`);
      return JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    }

    console.error('Error fetching components:', error.message);
    process.exit(1);
  }
}

fetchComponents();

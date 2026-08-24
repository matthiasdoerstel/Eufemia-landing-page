import React from "react";
import componentData from "../../data/web-components.json";
import PlatformOverview, { OverviewComponent, WebComponentCategory } from "../../components/PlatformOverview";

const categoryBySlug: Record<string, WebComponentCategory> = {
  avatar: "Basic UI",
  anchor: "Basic UI",
  badge: "Basic UI",
  card: "Basic UI",
  "info-card": "Basic UI",
  pagination: "Basic UI",
  "progress-indicator": "Basic UI",
  timeline: "Basic UI",
  tag: "Basic UI",
  table: "Basic UI",
  skeleton: "Basic UI",
  autocomplete: "Form and Input",
  button: "Form and Input",
  dropdown: "Form and Input",
  "date-format": "Form and Input",
  "date-picker": "Form and Input",
  filter: "Form and Input",
  "form-label": "Form and Input",
  "input-masked": "Form and Input",
  "list-format": "Form and Input",
  "number-format": "Form and Input",
  slider: "Form and Input",
  "step-indicator": "Form and Input",
  switch: "Form and Input",
  radio: "Form and Input",
  checkbox: "Form and Input",
  input: "Form and Input",
  textarea: "Form and Input",
  "toggle-button": "Form and Input",
  upload: "Form and Input",
  accordion: "Navigation and Structure",
  breadcrumb: "Navigation and Structure",
  heading: "Navigation and Structure",
  "height-animation": "Navigation and Structure",
  list: "Navigation and Structure",
  tabs: "Navigation and Structure",
  section: "Navigation and Structure",
  "skip-content": "Navigation and Structure",
  dialog: "Feedback and Communication",
  drawer: "Feedback and Communication",
  "global-status": "Feedback and Communication",
  "form-status": "Feedback and Communication",
  modal: "Feedback and Communication",
  "term-definition": "Feedback and Communication",
  tooltip: "Feedback and Communication",
  stat: "Feedback and Communication",
  "copy-on-click": "Other / Templates",
  "country-flag": "Other / Templates",
  logo: "Other / Templates",
  "portal-root": "Other / Templates",
  "aria-live": "Accessibility / Navigation",
  "help-button": "Accessibility / Navigation",
  "visually-hidden": "Accessibility / Navigation",
};

const components: OverviewComponent[] = componentData.components.map((component) => ({
  id: component.slug,
  name: component.name,
  slug: component.slug,
  description: component.description,
  category: categoryBySlug[component.slug] ?? "Other / Templates",
  href: component.slug === "button" ? "/docs/web/components/button" : undefined,
}));

const WebPage: React.FC = () => (
  <PlatformOverview platform="web" components={components} />
);

export default WebPage;

export const Head = () => <title>Web Overview | Eufemia Design System</title>;

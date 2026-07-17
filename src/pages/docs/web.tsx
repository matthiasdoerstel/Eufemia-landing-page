import React from "react";
import PlatformOverview, { OverviewComponent } from "../../components/PlatformOverview";

const components: OverviewComponent[] = [
  { id: "button", name: "Button", slug: "button", description: "Buttons are used to trigger actions or navigate to new pages. They come in different variants and sizes." },
  { id: "input", name: "Input", slug: "input", description: "Input fields allow users to enter and edit text. They support various types and validation states." },
  { id: "dropdown", name: "Dropdown", slug: "dropdown", description: "Dropdowns allow users to select an option from a list of choices." },
  { id: "card", name: "Card", slug: "card", description: "Cards are used to group related content and actions about a single subject." },
  { id: "modal", name: "Modal", slug: "modal", description: "Modals are dialog windows that appear on top of the main content to capture user attention." },
  { id: "table", name: "Table", slug: "table", description: "Tables display data in rows and columns for easy scanning and comparison." },
];

const WebPage: React.FC = () => (
  <PlatformOverview platform="web" components={components} />
);

export default WebPage;

export const Head = () => <title>Web Components | Eufemia Design System</title>;

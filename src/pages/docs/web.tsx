import React from "react";
import PlatformOverview, { OverviewComponent } from "../../components/PlatformOverview";

const components: OverviewComponent[] = [
  { id: "button", name: "Button", slug: "button", description: "Triggers an action or navigation." },
  { id: "avatar-group", name: "Avatar Group", slug: "avatar-group", description: "Groups related people or entities." },
  { id: "dropdown", name: "Dropdown", slug: "dropdown", description: "Lets users choose from a list of options." },
  { id: "card", name: "Card", slug: "card", description: "Groups related content and actions." },
  { id: "dialog", name: "Dialog", slug: "dialog", description: "Focuses attention on an important decision or message." },
  { id: "badge", name: "Badge", slug: "badge", description: "Highlights a status, count, or label." },
];

const WebPage: React.FC = () => (
  <PlatformOverview platform="web" components={components} />
);

export default WebPage;

export const Head = () => <title>Web Overview | Eufemia Design System</title>;

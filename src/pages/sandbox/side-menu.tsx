import React, { useState } from "react";
import SideMenu, { RAIL_WIDTH, PANEL_WIDTH } from "../../components/SideMenu";

/**
 * Sandbox for the two-tier side menu from the Figma Sandbox file
 * (aD38asiLSTitzeMxy3RJCBWT), frames "Menu extended" and "Menu".
 *
 * Deliberately standalone:
 *  - No Layout — that pulls in Header and the current 384px Sidebar, which
 *    would fight this for the same screen edge.
 *  - Values are hardcoded to the Sandbox design rather than mapped onto the
 *    --eu-* token layer, so this reproduces the frame exactly. That means it
 *    is dark-only and does not follow the brand/theme switcher.
 *
 * Eufemia fonts and base styles come in globally via gatsby-browser.js.
 */
const SideMenuSandbox: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const offset = collapsed ? RAIL_WIDTH : RAIL_WIDTH + PANEL_WIDTH;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000000",
        color: "#ffffff",
        fontFamily: "DNB, sans-serif",
      }}
    >
      <SideMenu onCollapsedChange={setCollapsed} />

      <main
        style={{
          marginLeft: offset,
          padding: "99px 64px 64px 91px",
          maxWidth: 761,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 48, lineHeight: "56px", fontWeight: 500 }}>
          iOS Components
        </h1>
        <p style={{ marginTop: 16, fontSize: 18, lineHeight: "24px" }}>
          Components are the core of any design system, crafted to tackle
          specific UI challenges. Eufemia Native iOS is a tailored set of
          components that blends with Apple&rsquo;s native elements, allowing
          you to create one-of-a-kind DNB experiences that feel right at home on
          the platform.
        </p>

        <hr style={{ border: 0, borderTop: "1px solid #48484a", margin: "32px 0" }} />

        <h2 style={{ fontSize: 26, lineHeight: "32px", fontWeight: 500 }}>
          Testing notes
        </h2>
        <ul style={{ fontSize: 18, lineHeight: "28px", color: "#8e8e93", paddingLeft: 20 }}>
          <li>
            Click a rail item to switch section. Click the{" "}
            <strong style={{ color: "#fff" }}>active</strong> one again to
            collapse the second tier &mdash; that toggle is the difference
            between the two Figma frames.
          </li>
          <li>
            Chevron rows expand and collapse. The selected leaf gets the mint
            arrow and stretches full width; unselected leaves hug their label.
          </li>
          <li>
            Panel labels are the placeholders from the Figma frame, so this can
            be compared against the design directly. Real IA is a one-line swap
            in <code>SideMenu.tsx</code>.
          </li>
          <li>
            Hardcoded to the Sandbox design, so this is dark-only and ignores
            the theme/brand switcher.
          </li>
        </ul>
      </main>
    </div>
  );
};

export default SideMenuSandbox;

import React from "react";
import { IsolatedStyleScope, Theme } from "@dnb/eufemia/shared";
import { useTheme } from "../context/ThemeContext";
import { usePreviewStyles } from "../hooks/usePreviewStyles";

const EufemiaThemeScope: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { brand, theme } = useTheme();
  const stylesReady = usePreviewStyles(brand);
  const name = brand === "DNB" ? "ui" : brand.toLowerCase() as "sbanken" | "carnegie";
  const colorScheme = brand === "Carnegie" ? "light" : theme;

  return (
    <IsolatedStyleScope>
      <Theme name={name} colorScheme={colorScheme} style={{ visibility: stylesReady ? "visible" : "hidden" }}>
        {children}
      </Theme>
    </IsolatedStyleScope>
  );
};

export default EufemiaThemeScope;

import { useEffect, useState } from "react";
import type { BrandName } from "../theme/tokens";

const PREVIEW_STYLES = [
  "dnb-ui-core.css",
  "ui-theme-basis.css",
  "ui-theme-components.css",
  "ui-theme-dark-mode.css",
  "sbanken-theme-basis.css",
  "sbanken-theme-components.css",
  "sbanken-theme-dark-mode.css",
  "carnegie-theme-basis.css",
  "carnegie-theme-components.css",
];

const requests = new Map<string, Promise<void>>();

const stylesForBrand = (brand: BrandName) => {
  const brandStyles = brand === "Sbanken"
    ? ["sbanken-theme-basis.css", "sbanken-theme-components.css", "sbanken-theme-dark-mode.css"]
    : brand === "Carnegie"
      ? ["carnegie-theme-basis.css", "carnegie-theme-components.css"]
      : ["ui-theme-basis.css", "ui-theme-components.css", "ui-theme-dark-mode.css"];

  return ["dnb-ui-core.css", ...brandStyles];
};

const styleId = (file: string) => `eufemia-preview-${file}`;

const loadStyle = (file: string) => {
  const existingRequest = requests.get(file);
  if (existingRequest) return existingRequest;

  const request = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(styleId(file)) as HTMLLinkElement | null;
    if (existing) {
      if (existing.sheet) resolve();
      else {
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`Could not load ${file}`)), { once: true });
      }
      return;
    }

    const link = document.createElement("link");
    link.id = styleId(file);
    link.rel = "stylesheet";
    link.media = "not all";
    link.href = `/eufemia-preview/${file}`;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Could not load ${file}`));
    document.head.appendChild(link);
  });

  requests.set(file, request);
  return request;
};

export const usePreviewStyles = (brand: BrandName) => {
  const [loadedBrand, setLoadedBrand] = useState<BrandName | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const requiredStyles = stylesForBrand(brand);
    let active = true;
    setLoadedBrand(null);

    Promise.all(requiredStyles.map(loadStyle)).then(() => {
      if (!active) return;

      const required = new Set(requiredStyles);
      PREVIEW_STYLES.forEach((file) => {
        const link = document.getElementById(styleId(file)) as HTMLLinkElement | null;
        if (link) link.media = required.has(file) ? "all" : "not all";
      });
      setLoadedBrand(brand);
    }).catch(() => {});

    return () => {
      active = false;
    };
  }, [brand]);

  return loadedBrand === brand;
};

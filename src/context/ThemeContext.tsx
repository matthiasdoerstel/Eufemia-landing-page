import React, { createContext, useContext, useState, useEffect } from 'react';
import { createShader, playSweep, accentPair, type Palette } from 'glimm';
import { colorsFor, cssVarColors, ThemeName, BrandName, ColorTokens } from '../theme/tokens';

type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeName; // resolved theme actually applied
  mode: ThemeMode; // user preference (auto follows the OS)
  brand: BrandName; // active brand (DNB / Sbanken)
  colors: ColorTokens; // resolved token set for the active theme + brand
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: BrandName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const prefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const resolve = (mode: ThemeMode): ThemeName =>
  mode === 'auto' ? (prefersDark() ? 'dark' : 'light') : mode;

// Eufemia mark paths (from static/favicon.svg). Rendered as a data-URI favicon
// so it follows the in-app theme + brand rather than only the OS colour scheme.
const FAVICON_PATHS = [
  'M77.1186 36.1343C68.3071 36.1343 61 28.8988 61 20.1736C61 11.4484 68.3071 4 77.1186 4C85.9301 4 93.4522 11.4484 93.4522 20.1736C93.4522 28.8988 85.9301 36.1343 77.1186 36.1343Z',
  'M64.4989 44.9547L88.784 44.9547V99.9773C75.3717 99.9773 64.4989 88.4484 64.4989 74.2267V44.9547Z',
  'M88.7149 155V99.9773C102.127 99.9773 113 111.506 113 125.728V155H88.7149Z',
];

const faviconColor = (theme: ThemeName, brand: BrandName): string =>
  brand === 'Sbanken'
    ? theme === 'dark' ? '#C77DFF' : '#7A1FA2'
    : theme === 'dark' ? '#32FF77' : '#00CC89';

const applyFavicon = (theme: ThemeName, brand: BrandName) => {
  if (typeof document === 'undefined') return;
  const fill = faviconColor(theme, brand);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160" fill="${fill}">` +
    FAVICON_PATHS.map((d) => `<path d="${d}"/>`).join('') +
    `</svg>`;
  const href = 'data:image/svg+xml,' + encodeURIComponent(svg);
  const link = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
  if (link) link.href = href;
};

interface SweepLook {
  palette: Palette;
  direction: 'ltr' | 'rtl' | 'ttb' | 'btt';
  brightness: number;
}

// Tracks an in-flight sweep so a new theme/brand change can flush the previous
// one instantly (apply its pending swap + remove its canvas) instead of leaving
// the UI half-swapped or a frozen band on screen.
let sweepPending: (() => void) | null = null;
let sweepCleanup: (() => void) | null = null;

// Play a glimm WebGL "sweep" across the viewport and run `apply` (the visual
// theme/brand swap) at the band's midpoint, so the change happens hidden behind
// it. Persistence is handled by the caller BEFORE this runs, so a refresh or
// navigation mid-sweep still restores the intended theme. Falls back to an
// instant apply on SSR / reduced-motion / no WebGL.
const runThemeSweep = (apply: () => void, look: SweepLook) => {
  // Finish + tear down any still-running swap before starting a new one.
  sweepPending?.();
  sweepCleanup?.();
  sweepPending = null;
  sweepCleanup = null;

  if (typeof window === 'undefined') return apply();
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

  const canvas = document.createElement('canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '2147483647',
    pointerEvents: 'none',
  });
  document.body.appendChild(canvas);

  const ctrl = createShader({ canvas });
  if (reduced || !ctrl) {
    apply();
    ctrl?.destroy();
    canvas.remove();
    return;
  }

  let applied = false;
  const doApply = () => {
    if (applied) return;
    applied = true;
    apply();
  };
  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    try {
      ctrl.destroy();
    } catch {
      /* already destroyed */
    }
    canvas.remove();
    if (sweepPending === doApply) sweepPending = null;
    if (sweepCleanup === cleanup) sweepCleanup = null;
  };
  sweepPending = doApply;
  sweepCleanup = cleanup;

  playSweep(ctrl, {
    palette: look.palette,
    direction: look.direction,
    brightness: look.brightness,
    onMidpoint: doApply,
    onComplete: () => {
      doApply(); // safety net if the midpoint callback was skipped
      cleanup();
    },
  });
};

// Build the sweep look from the TARGET theme's own tokens, so the band
// previews the colours you're switching into (teal for DNB, purple for
// Sbanken; brighter in light, dimmed in dark).
const themeLook = (target: ThemeName, brand: BrandName): SweepLook => {
  // Carnegie's accent is black; use its card colours (maroon + teal) for the band.
  if (brand === 'Carnegie') {
    return { palette: accentPair('#390015', '#041318'), direction: 'rtl', brightness: 1 };
  }
  const c = colorsFor(target, brand);
  return {
    palette: accentPair(c.selectedSubtle, c.accent),
    direction: target === 'dark' ? 'ltr' : 'rtl',
    brightness: target === 'dark' ? 0.9 : 1,
  };
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark is the default for the redesigned portal.
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [brand, setBrandState] = useState<BrandName>('DNB');

  const applyTheme = (t: ThemeName, b: BrandName) => {
    if (typeof window === 'undefined') return; // SSR safety
    // Colours are driven by CSS variables selected via these attributes, so
    // flipping them re-themes the whole page (including static markup).
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
    root.setAttribute('data-brand', b);
    applyFavicon(t, b);
  };

  // Load saved preferences on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = (localStorage.getItem('theme-mode') as ThemeMode | null) ?? 'dark';
    const savedBrand = (localStorage.getItem('theme-brand') as BrandName | null) ?? 'DNB';
    const resolved = resolve(saved);
    setModeState(saved);
    setTheme(resolved);
    setBrandState(savedBrand);
    applyTheme(resolved, savedBrand);
  }, []);

  // When in auto mode, follow OS changes live.
  useEffect(() => {
    if (typeof window === 'undefined' || mode !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const resolved = resolve('auto');
      setTheme(resolved);
      applyTheme(resolved, brand);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode, brand]);

  const setMode = (m: ThemeMode) => {
    const resolved = resolve(m);
    // Persist immediately so a refresh/navigation mid-sweep keeps the choice.
    if (typeof window !== 'undefined') localStorage.setItem('theme-mode', m);
    runThemeSweep(() => {
      setModeState(m);
      setTheme(resolved);
      applyTheme(resolved, brand);
    }, themeLook(resolved, brand));
  };

  const setBrand = (b: BrandName) => {
    if (typeof window !== 'undefined') localStorage.setItem('theme-brand', b);
    runThemeSweep(() => {
      setBrandState(b);
      applyTheme(theme, b);
    }, themeLook(theme, b));
  };

  const toggleTheme = () => setMode(theme === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider
      value={{ theme, mode, brand, colors: cssVarColors, toggleTheme, setMode, setBrand }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    // Safe defaults when used outside the provider (SSR / tests).
    return {
      theme: 'dark' as ThemeName,
      mode: 'dark' as ThemeMode,
      brand: 'DNB' as BrandName,
      colors: cssVarColors,
      toggleTheme: () => {},
      setMode: (_: ThemeMode) => {},
      setBrand: (_: BrandName) => {},
    };
  }
  return context;
};

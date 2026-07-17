import React from 'react'
import '@dnb/eufemia/style/core'
import '@dnb/eufemia/style/themes/theme-ui/ui-theme-fonts.min.css'
import '@dnb/eufemia/style/themes/theme-ui/ui-theme-basis.min.css'
import { ThemeProvider } from './src/context/ThemeContext'
import { SettingsProvider } from './src/context/SettingsContext'
import { AuthProvider } from './src/context/AuthContext'
import { THEME_VARS_CSS } from './src/theme/tokens'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <SettingsProvider>
      <AuthProvider>
        {element}
      </AuthProvider>
    </SettingsProvider>
  </ThemeProvider>
)

// Single adaptive favicon: the SVG carries its own
// @media (prefers-color-scheme: dark) rule to swap fill color.
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link key="favicon-ico" rel="icon" href="/favicon.ico" sizes="any" />,
    <link
      key="favicon"
      rel="icon"
      type="image/svg+xml"
      href="/favicon.svg"
    />,
    // PNG fallbacks for browsers that don't render SVG favicons (e.g. Safari).
    <link key="favicon-32" rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />,
    <link key="favicon-48" rel="icon" type="image/png" sizes="48x48" href="/favicon-48.png" />,
    <link key="favicon-apple" rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />,
    // Theme colours as CSS variables, selected by the data-theme/data-brand
    // attributes set below. Keeps the static HTML theme-agnostic so there is no
    // flash of the wrong theme on a hard load.
    <style key="theme-vars" dangerouslySetInnerHTML={{ __html: THEME_VARS_CSS }} />,
    // Set the theme + brand attributes from the saved preference before first
    // paint, so a hard refresh renders the correct theme immediately.
    <script
      key="theme-init"
      dangerouslySetInnerHTML={{
        __html:
          "(function(){try{var m=localStorage.getItem('theme-mode')||'dark';" +
          "var b=localStorage.getItem('theme-brand')||'DNB';" +
          "var t=m==='auto'?(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):m;" +
          "var r=document.documentElement;r.setAttribute('data-theme',t);r.setAttribute('data-brand',b);}catch(e){}})()",
      }}
    />,
  ])
}

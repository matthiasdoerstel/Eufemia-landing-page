import React from 'react'
// DNB design-system styles + the theme's @font-face (DNB typeface).
// style/core alone does NOT register the DNB font — the @font-face lives
// in the theme bundle, so it must be imported explicitly.
import '@dnb/eufemia/style/core'
import '@dnb/eufemia/style/themes/theme-ui/ui-theme-fonts.min.css'
import '@dnb/eufemia/style/themes/theme-ui/ui-theme-basis.min.css'
import { ThemeProvider } from './src/context/ThemeContext'
import { SettingsProvider } from './src/context/SettingsContext'
import { AuthProvider } from './src/context/AuthContext'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <SettingsProvider>
      <AuthProvider>
        {element}
      </AuthProvider>
    </SettingsProvider>
  </ThemeProvider>
)

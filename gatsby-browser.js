import React from 'react'
import '@dnb/eufemia/style'
import '@dnb/eufemia/style/themes/ui/ui-theme-dark-mode.css'
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

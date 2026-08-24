import React from 'react'
import '@dnb/eufemia/style'
import '@dnb/eufemia/style/themes/ui/ui-theme-dark-mode.css'
import { ThemeProvider } from './src/context/ThemeContext'
import { SettingsProvider } from './src/context/SettingsContext'
import { AuthProvider } from './src/context/AuthContext'
import SideMenuChrome from './src/components/SideMenuChrome'

export const wrapRootElement = ({ element }) => (
  <ThemeProvider>
    <SettingsProvider>
      <AuthProvider>
        {element}
      </AuthProvider>
    </SettingsProvider>
  </ThemeProvider>
)

// The SideMenu lives here, not inside Layout: this wrapper persists across
// navigations while `element` swaps, so the menu is not destroyed and rebuilt on
// every page change. That is what lets its panel animate in and out.
export const wrapPageElement = ({ element, props }) => (
  <SideMenuChrome path={(props && props.location && props.location.pathname) || (props && props.path) || '/'}>
    {element}
  </SideMenuChrome>
)

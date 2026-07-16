import React, { createContext, useContext, useEffect, useState } from "react";

// Maintainer authentication.
//
// This is a MOCK implementation for building the UX. `signIn()` fakes a DNB
// Microsoft SSO round-trip and stores a maintainer session in localStorage.
//
// To swap in real DNB SSO later, replace the body of `signIn`/`signOut` with
// MSAL.js (Authorization Code + PKCE) calls — e.g. `msalInstance.loginPopup()`
// and `logoutPopup()` — and map the returned account into `MaintainerUser`.
// The rest of the app (this context's shape, the settings UI, the gated
// route) stays the same.

export interface MaintainerUser {
  name: string;
  email: string;
}

interface AuthContextType {
  isMaintainer: boolean;
  user: MaintainerUser | null;
  signingIn: boolean;
  signIn: () => Promise<void>;
  signOut: () => void;
}

const STORAGE_KEY = "maintainer-session";

// Stand-in account until a real Entra app registration is wired up.
const MOCK_USER: MaintainerUser = { name: "Maintainer", email: "maintainer@dnb.no" };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MaintainerUser | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  // Restore a persisted session on mount (SSR-safe).
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore malformed session */
    }
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    // Simulate the SSO redirect/popup latency.
    await new Promise((r) => setTimeout(r, 600));
    setUser(MOCK_USER);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USER));
    setSigningIn(false);
  };

  const signOut = () => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ isMaintainer: !!user, user, signingIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Safe defaults outside the provider (SSR / tests).
    return {
      isMaintainer: false,
      user: null,
      signingIn: false,
      signIn: async () => {},
      signOut: () => {},
    };
  }
  return ctx;
};

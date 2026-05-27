import { createContext, useContext, useState, useCallback } from "react";

// ─── Mock users DB ────────────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    name: "User X",
    email: "user@equator.com",
    password: "password123",
    phone: "(234) 342-9831",
    avatar: null,
    joinedAt: "2023-01-12",
    orders: [
      { id: "#92834", date: "12 Oct 2023", store: "Maison Atelier", status: "Livré", total: 320 },
      { id: "#92711", date: "05 Oct 2023", store: "Lumina Lab", status: "En cours", total: 155 },
      { id: "#92550", date: "22 Sep 2023", store: "Maison Atelier", status: "Livré", total: 249 },
    ],
    storeAccounts: [
      { initials: "MA", name: "Maison Atelier", since: "12/01/2023" },
      { initials: "LL", name: "Lumina Lab", since: "20/03/2023" },
    ],
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null); // for email verification flow

  const isAuthenticated = !!user;

  // ── Login ────────────────────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 800)); // simulate API
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      setAuthLoading(false);
      return { success: true };
    }
    setAuthError("Email ou mot de passe incorrect.");
    setAuthLoading(false);
    return { success: false, error: "Email ou mot de passe incorrect." };
  }, []);

  // ── Register ─────────────────────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 800));
    const exists = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      setAuthError("Un compte avec cet email existe déjà.");
      setAuthLoading(false);
      return { success: false, error: "Un compte avec cet email existe déjà." };
    }
    // In real app: API call. Here we simulate a verification step.
    setPendingEmail(email);
    setAuthLoading(false);
    return { success: true, needsVerification: true };
  }, []);

  // ── Verify email ─────────────────────────────────────────────────────────
  const verifyEmail = useCallback(async (email, code) => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    // Mock: any 6-digit code works
    if (code.length === 6) {
      const newUser = {
        id: Date.now(),
        name: "Nouvel Utilisateur",
        email,
        phone: "",
        avatar: null,
        joinedAt: new Date().toISOString().split("T")[0],
        orders: [],
        storeAccounts: [],
      };
      setUser(newUser);
      setPendingEmail(null);
      setAuthLoading(false);
      return { success: true };
    }
    setAuthLoading(false);
    return { success: false, error: "Code invalide." };
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
  }, []);

  // ── Update profile ───────────────────────────────────────────────────────
  const updateProfile = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  // ── requireAuth helper ───────────────────────────────────────────────────
  // Returns true if authenticated, false otherwise (caller can show modal)
  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) {
        action?.();
        return true;
      }
      return false;
    },
    [isAuthenticated]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        authError,
        pendingEmail,
        login,
        register,
        verifyEmail,
        logout,
        updateProfile,
        requireAuth,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
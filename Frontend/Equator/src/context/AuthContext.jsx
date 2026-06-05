import { createContext, useContext, useState, useCallback } from "react";
import { MOCK_USERS } from "../data/users";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  const isAuthenticated = !!user;

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    await new Promise((r) => setTimeout(r, 800));
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
    setPendingEmail(email);
    setAuthLoading(false);
    return { success: true, needsVerification: true };
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    setAuthLoading(true);
    await new Promise((r) => setTimeout(r, 600));
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

  const logout = useCallback(() => {
    setUser(null);
    setAuthError(null);
  }, []);

  const updateProfile = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  const requireAuth = useCallback(
    (action) => {
      if (isAuthenticated) { action?.(); return true; }
      return false;
    },
    [isAuthenticated]
  );

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated, authLoading, authError, pendingEmail,
      login, register, verifyEmail, logout, updateProfile, requireAuth, setAuthError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

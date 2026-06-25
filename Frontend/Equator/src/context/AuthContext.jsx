import { createContext, useContext, useState, useCallback, useEffect } from "react";
import authApi, { AUTH_STATUS } from "../api/authApi";
import { mapUserFromApi } from "../api/mappers/customerMapper";
import { tokenStorage, ApiError } from "../api/httpClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => tokenStorage.get());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [pendingEmail, setPendingEmail] = useState(null);

  const isAuthenticated = !!user && !!token;

  // ── Auto-login on mount if a token is already stored ─────────────────────
  const verifyToken = useCallback(async () => {
    const stored = tokenStorage.get();
    if (!stored) return false;
    setAuthLoading(true);
    try {
      const response = await authApi.verifyToken();
      if (response?.user) setUser(mapUserFromApi(response.user));
      setToken(stored);
      setAuthLoading(false);
      return true;
    } catch (err) {
      // Token expired/invalid — log out cleanly, no error shown to the user
      tokenStorage.remove();
      setToken(null);
      setUser(null);
      setAuthLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Login — keeps the original call signature ────────────────────────
  const login = useCallback(async (loginValue, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await authApi.login({
        login: loginValue,
        password,
      });

      if (response?.authStatus === AUTH_STATUS.INCOMPLETE && !response?.token) {
        setPendingEmail(loginValue);
        setAuthLoading(false);
        setAuthError("Une vérification supplémentaire est requise pour ce compte.");
        return { success: false, needsVerification: true };
      }

      if (!response?.token) {
        setAuthLoading(false);
        setAuthError("Connexion impossible : aucun token reçu du serveur.");
        return { success: false, error: "NO_TOKEN" };
      }

      tokenStorage.set(response.token);
      setToken(response.token);
      setUser(mapUserFromApi(response.user));
      setAuthLoading(false);

      return { success: true };
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Impossible de contacter le serveur.";

      console.error("[AuthContext] login failed:", err);
      setAuthError(message);
      setAuthLoading(false);

      return { success: false, error: message };
    }
  }, []);

  // ── Register — username + email + mobileNumber + password ─────────────
const register = useCallback(async (usernameOrPayload, emailArg, passwordArg) => {
  setAuthLoading(true);
  setAuthError(null);

  try {
    const payload =
      typeof usernameOrPayload === "object"
        ? usernameOrPayload
        : {
            username: usernameOrPayload,
            email: emailArg,
            password: passwordArg,
          };

    const username = String(payload.username || payload.login || "").trim();
    const email = String(payload.email || "").trim();
    const password = String(payload.password || "");
    const mobileNumber = String(payload.mobileNumber || "").trim();

    console.log("[AuthContext] register values", {
      username,
      email,
      mobileNumber,
      password: password ? "***" : "",
    });

    await authApi.register({
      username,
      email,
      mobileNumber,
      password,
    });

    setPendingEmail(email);
    setAuthLoading(false);

    return {
      success: true,
      needsVerification: true,
    };
  } catch (err) {
    const message =
      err instanceof ApiError
        ? err.message
        : "Impossible de créer le compte.";

    console.error("[AuthContext] register failed:", err);
    setAuthError(message);
    setAuthLoading(false);

    return {
      success: false,
      error: message,
    };
  }
}, []);

  // ── Verify email — keeps the original (email, code) call signature ───────
  const verifyEmail = useCallback(async (email, code) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await authApi.activateAuth({ login: email, code });

      if (response?.token) {
        tokenStorage.set(response.token);
        setToken(response.token);
        setUser(mapUserFromApi(response.user));
      }
      setPendingEmail(null);
      setAuthLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Code invalide.";
      console.error("[AuthContext] verifyEmail failed:", err);
      setAuthLoading(false);
      return { success: false, error: message };
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    tokenStorage.remove();
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  // ── Update profile — local merge, kept for AccountPage compatibility ─────
  // NOTE: this still only updates local state. To persist changes, call
  // customerApi.updateCustomer(...) from the page before/after this, or
  // wire it in here once the exact field mapping is confirmed.
  const updateProfile = useCallback((data) => {
    setUser((prev) => ({ ...prev, ...data }));
  }, []);

  // ── requireAuth — unchanged behavior ──────────────────────────────────────
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
        token,
        isAuthenticated,
        authLoading,
        authError,
        pendingEmail,
        login,
        register,
        verifyEmail,
        verifyToken,
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
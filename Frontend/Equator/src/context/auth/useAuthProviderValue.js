import { useCallback, useEffect, useMemo, useState } from "react";
import authApi, { AUTH_STATUS } from "../../api/authApi";
import { mapUserFromApi } from "../../api/mappers/customerMapper";
import { tokenStorage, ApiError } from "../../api/httpClient";
import { authUserStorage, pendingEmailStorage } from "./authStorage";

// Prépare le payload d'inscription quel que soit le format reçu par la page.
const buildRegisterPayload = (usernameOrPayload, emailArg, passwordArg) => {
  const payload =
    typeof usernameOrPayload === "object"
      ? usernameOrPayload
      : {
          username: usernameOrPayload,
          email: emailArg,
          password: passwordArg,
        };

  return {
    username: String(payload.username || payload.login || "").trim(),
    email: String(payload.email || "").trim(),
    password: String(payload.password || ""),
    mobileNumber: String(payload.mobileNumber || "").trim(),
  };
};

// Hook qui regroupe toute la logique métier du AuthContext.
export function useAuthProviderValue() {
  const [user, setUser] = useState(() => authUserStorage.get());
  const [pendingEmail, setPendingEmail] = useState(() => pendingEmailStorage.get());
  const [token, setToken] = useState(() => tokenStorage.get());
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const isAuthenticated = Boolean(user && token);

  const clearSession = useCallback(() => {
    tokenStorage.remove();
    authUserStorage.remove();
    pendingEmailStorage.remove();
    setToken(null);
    setUser(null);
    setPendingEmail(null);
  }, []);

  const verifyToken = useCallback(async () => {
    const stored = tokenStorage.get();

    if (!stored) {
      authUserStorage.remove();
      setToken(null);
      setUser(null);
      setAuthLoading(false);
      return false;
    }

    setAuthLoading(true);

    try {
      const response = await authApi.verifyToken();
      setToken(stored);

      if (response?.user) {
        const mappedUser = mapUserFromApi(response.user);
        setUser(mappedUser);
        authUserStorage.set(mappedUser);
      } else {
        const cachedUser = authUserStorage.get();
        if (cachedUser) setUser(cachedUser);
      }

      setAuthLoading(false);
      return true;
    } catch {
      tokenStorage.remove();
      authUserStorage.remove();
      setToken(null);
      setUser(null);
      setAuthLoading(false);
      return false;
    }
  }, []);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = useCallback(async (loginValue, password) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await authApi.login({ login: loginValue, password });

      if (response?.authStatus === AUTH_STATUS.INCOMPLETE && !response?.token) {
        setPendingEmail(loginValue);
        pendingEmailStorage.set(loginValue);
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

      const mappedUser = mapUserFromApi(response.user);
      setUser(mappedUser);
      authUserStorage.set(mappedUser);
      pendingEmailStorage.remove();
      setPendingEmail(null);
      setAuthLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de contacter le serveur.";
      console.error("[AuthContext] login failed:", err);
      setAuthError(message);
      setAuthLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (...args) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const payload = buildRegisterPayload(...args);
      console.log("[AuthContext] register values", { ...payload, password: payload.password ? "***" : "" });
      await authApi.register(payload);
      setPendingEmail(payload.email);
      pendingEmailStorage.set(payload.email);
      setAuthLoading(false);
      return { success: true, needsVerification: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de créer le compte.";
      console.error("[AuthContext] register failed:", err);
      setAuthError(message);
      setAuthLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const verifyEmail = useCallback(async (email, code) => {
    setAuthLoading(true);
    setAuthError(null);

    try {
      const response = await authApi.activateAuth({ login: email, code });
      if (response?.token) {
        tokenStorage.set(response.token);
        setToken(response.token);
        if (response?.user) {
          const mappedUser = mapUserFromApi(response.user);
          setUser(mappedUser);
          authUserStorage.set(mappedUser);
        }
      }
      setPendingEmail(null);
      pendingEmailStorage.remove();
      setAuthLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Code invalide.";
      console.error("[AuthContext] verifyEmail failed:", err);
      setAuthError(message);
      setAuthLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuthError(null);
  }, [clearSession]);

  const updateProfile = useCallback((data) => {
    setUser((previous) => {
      const nextUser = { ...previous, ...data };
      authUserStorage.set(nextUser);
      return nextUser;
    });
  }, []);

  const requireAuth = useCallback((action) => {
    if (isAuthenticated) {
      action?.();
      return true;
    }
    return false;
  }, [isAuthenticated]);

  return useMemo(() => ({
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
  }), [user, token, isAuthenticated, authLoading, authError, pendingEmail, login, register, verifyEmail, verifyToken, logout, updateProfile, requireAuth]);
}

/**

* authApi.js
* Services d’authentification et de gestion de compte.
*
* Couvre :
* POST /api/auth/login
* GET  /api/auth/verify-token
* POST /api/auth/activate-auth
* POST /api/auth/verify-code
* POST /api/auth/verify-twofactor
* POST /api/auth/resend-twofactor-code
* POST /api/accounts/register
* GET  /api/accounts/get-account
* POST /api/accounts/save-account
* POST /api/accounts/change-password
* POST /api/accounts/reset-password/init
* POST /api/accounts/reset-password/send-code
* POST /api/accounts/reset-password/enter-password
* POST /api/accounts/reset-password/finish
  */

import http from "./httpClient";

// ─── Constantes de statut d’authentification (retournées par login) ───────────
export const AUTH_STATUS = {
  AUTHENTICATED: "AUTHENTICATED",
  TWO_FACTOR_REQUIRED: "TWO_FACTOR_REQUIRED",
  ACTIVATION_REQUIRED: "ACTIVATION_REQUIRED",
};

// ─── Connexion ────────────────────────────────────────────────────────────────
/**
 * Authentifie l’utilisateur avec son login + mot de passe.
 * @returns {Promise<{ token: string, authStatus: string, user: object }>}
 */
export async function login({ login, password, rememberMe = false }) {
  return http.post("/api/auth/login", {
    login,
    password,
    rememberMe,
    loginMethod: "LOGIN",
  });
}

// ─── Vérification du token ────────────────────────────────────────────────────
/**
 * Vérifie si le token stocké est toujours valide.
 * Retourne 200 s’il est valide, lance une ApiError 401 s’il a expiré.
 */
export async function verifyToken() {
  return http.get("/api/auth/verify-token");
}

// ─── Two-factor authentication ────────────────────────────────────────────────
/**
 * Verify the SMS/OTP code sent after login.
 * @param {{ login: string, code: string, rememberMe?: boolean }} payload
 */
export async function verifyTwoFactor({ login, code, rememberMe = false }) {
  return http.post("/api/auth/verify-twofactor", { login, code, rememberMe });
}

/**
 * Resend the two-factor OTP code.
 * @param {{ login: string }} payload
 */
export async function resendTwoFactorCode({ login }) {
  return http.post("/api/auth/resend-twofactor-code", { login });
}

// ─── Account activation ───────────────────────────────────────────────────────
/**
 * Activate a newly registered account using the activation code.
 * @param {{ login: string, code: string }} payload
 */
export async function activateAuth({ login, code }) {
  return http.post("/api/auth/activate-auth", { login, code });
}

/**
 * Verify an activation code (used separately from activateAuth).
 * @param {{ login: string, code: string }} payload
 */
export async function verifyCode({ login, code }) {
  return http.post("/api/auth/verify-code", { login, code });
}

// ─── Account registration ─────────────────────────────────────────────────────
/**
 * Register a new user.
 * @param {{ login: string, password: string, mobileNumber: string, countryId: number, personalInfo: object }} payload
 */
export async function register({
  login,
  password,
  mobileNumber,
  countryId = 1,
  personalInfo = {},
  platformContext = import.meta.env.VITE_PLATFORM_CONTEXT ?? "",
}) {
  return http.post("/api/accounts/register", {
    login,
    password,
    mobileNumber,
    countryId,
    platformContext,
    loginMethod: "LOGIN",
    personalInfo,
  });
}

// ─── Current account ──────────────────────────────────────────────────────────
/**
 * Get the currently authenticated user account.
 * @returns {Promise<object>} UserSummaryDto
 */
export async function getCurrentAccount() {
  return http.get("/api/accounts/get-account");
}

/**
 * Save / update account information.
 * @param {object} accountData
 */
export async function saveAccount(accountData) {
  return http.post("/api/accounts/save-account", accountData);
}

/**
 * Change the current user's password.
 * @param {{ currentPassword: string, newPassword: string }} payload
 */
export async function changePassword({ currentPassword, newPassword }) {
  return http.post("/api/accounts/change-password", {
    currentPassword,
    newPassword,
  });
}

// ─── Password reset flow ──────────────────────────────────────────────────────
/**
 * Step 1 — Initiate password reset (send reset link / OTP).
 * @param {{ login: string }} payload
 */
export async function resetPasswordInit({ login }) {
  return http.post("/api/accounts/reset-password/init", { login });
}


/**
 * Étape 2 — Envoyer le code OTP.
 * @param {{ login: string }} payload
 */


export async function resetPasswordSendCode({ login }) {
  return http.post("/api/accounts/reset-password/send-code", { login });
}


/**
 * Étape 3 — Saisir le nouveau mot de passe avec le code reçu.
 * @param {{ login: string, code: string, newPassword: string }} payload
 */


export async function resetPasswordEnterPassword({ login, code, newPassword }) {
  return http.post("/api/accounts/reset-password/enter-password", {
    login,
    code,
    newPassword,
  });
}


/**
 * Étape 4 — Finaliser la réinitialisation.
 * @param {object} payload
 */


export async function resetPasswordFinish(payload) {
  return http.post("/api/accounts/reset-password/finish", payload);
}

const authApi = {
  login,
  verifyToken,
  verifyTwoFactor,
  resendTwoFactorCode,
  activateAuth,
  verifyCode,
  register,
  getCurrentAccount,
  saveAccount,
  changePassword,
  resetPasswordInit,
  resetPasswordSendCode,
  resetPasswordEnterPassword,
  resetPasswordFinish,
  AUTH_STATUS,
};

export default authApi;
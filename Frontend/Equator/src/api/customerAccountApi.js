import http from "./httpClient";
import { createCustomerAccountForStore } from "./customerAccount/customerAccountCreate";
import {
  filterAccountsByStore,
  normalizeAccountList,
  normalizeMobileNumber,
  toNumberOrUndefined,
} from "./customerAccount/customerAccountUtils";

/**
 * Retourne tous les comptes client du client connecté.
 * Endpoint Swagger : GET /api/client/customer-accounts/fetch-list-of-accounts
 */
export async function fetchCustomerAccounts() {
  const response = await http.get("/api/client/customer-accounts/fetch-list-of-accounts");
  return normalizeAccountList(response);
}

/**
 * Liste les comptes client d'un client pour une boutique/enseigne.
 * Endpoint Swagger : GET /api/client/customer-accounts/get-list-account/{customerId}/{storeId}
 */
export async function getCustomerAccountsByStore(customerId, storeId) {
  if (!customerId || !storeId) return [];

  try {
    const response = await http.get(
      `/api/client/customer-accounts/get-list-account/${customerId}/${storeId}`
    );
    const accounts = normalizeAccountList(response);
    if (accounts.length > 0) return filterAccountsByStore(accounts, storeId);
  } catch (err) {
    console.warn("[customerAccountApi] get-list-account failed:", err);
  }

  try {
    const allAccounts = await fetchCustomerAccounts();
    return filterAccountsByStore(allAccounts, storeId);
  } catch (err) {
    console.warn("[customerAccountApi] fetch-list-of-accounts failed:", err);
    return [];
  }
}

/** Détail d'un compte client. */
export async function getCustomerAccount(accountId) {
  if (!accountId) return null;
  return http.get(`/api/client/customer-accounts/get-account/${accountId}`);
}

/** Solde d'un compte client. */
export async function getCustomerAccountBalance(customerAccountId) {
  if (!customerAccountId) return null;
  return http.get(`/api/client/customer-accounts/balance/${customerAccountId}`);
}

/** Liaison par téléphone avec code optionnel. */
export async function linkCardsByPhoneNumber({ phoneNumber, code } = {}) {
  const normalizedPhoneNumber = normalizeMobileNumber(phoneNumber);
  const safeCode = String(code || "").trim();
  if (!normalizedPhoneNumber) return 0;

  return http.post("/api/client/cards/link-cards-by-phone-number", {
    phoneNumber: normalizedPhoneNumber,
    ...(safeCode ? { code: safeCode } : {}),
  });
}

/** Demande d'envoi du code SMS. */
export async function verifyPhoneNumber(phoneNumber) {
  const normalizedPhoneNumber = normalizeMobileNumber(phoneNumber);
  if (!normalizedPhoneNumber) return null;

  return http.post(
    `/api/client/cards/verify-phone-number/${encodeURIComponent(normalizedPhoneNumber)}`
  );
}

/** Validation d'une carte par code. */
export async function validateLinkByCode({ cardId, code } = {}) {
  const normalizedCardId = toNumberOrUndefined(cardId);
  const safeCode = String(code || "").trim();
  if (!normalizedCardId || !safeCode) return null;

  return http.post("/api/client/cards/validate-link-by-code", {
    cardId: normalizedCardId,
    code: safeCode,
  });
}

const customerAccountApi = {
  fetchCustomerAccounts,
  getCustomerAccountsByStore,
  getCustomerAccount,
  getCustomerAccountBalance,
  linkCardsByPhoneNumber,
  verifyPhoneNumber,
  validateLinkByCode,
  createCustomerAccountForStore,
};

export { createCustomerAccountForStore };
export default customerAccountApi;

/**
 * customerApi.js
 * Customer profile services.
 *
 * Covers:
 *   POST /api/customers/create
 *   PUT  /api/customers/edit
 *   PUT  /api/customers/update
 *   POST /api/customers/search
 *   POST /api/customers/search-all
 *   POST /api/customers/count
 *   PUT  /api/customers/configure-secret-pin
 *   PUT  /api/customers/complete-mandatory-info
 *   GET  /api/customers/current
 *   GET  /api/customers/check-whether-current-customer-info-are-ok
 *   GET  /api/customers/detail/{id}
 *
 * NOTE: /api/customers/create and /api/customers/edit both use
 * StorecardCustomerDto (nested personalInfo + user + address), while
 * /api/customers/update uses the lighter StorecardCustomerEditDto
 * (personalInfo + address only, no nested user object). Two distinct
 * functions are exposed (createCustomer/editCustomer vs updateCustomer)
 * to avoid silently sending the wrong shape.
 */

import http, { buildSearchQuery, normalizePaginatedResponse } from "./httpClient";
import { mapCustomerFromApi } from "./mappers/mappers";

// ─── Current customer ──────────────────────────────────────────────────────────
/**
 * Get the currently logged-in customer profile.
 * Used by AuthContext / ProfilePage to hydrate user data after login.
 */
export async function getCurrentCustomer() {
  const response = await http.get("/api/customers/current");
  return mapCustomerFromApi(response);
}

/**
 * Check whether the current customer's mandatory info (phone, etc.) is complete.
 * Used to decide whether to redirect to a "complete your profile" step.
 */
export async function checkCurrentCustomerInfoOk() {
  return http.get("/api/customers/check-whether-current-customer-info-are-ok");
}

/**
 * Get a customer's detail by id (admin / salesman context).
 * @param {number|string} id
 */
export async function getCustomerDetail(id) {
  const response = await http.get(`/api/customers/detail/${id}`);
  return mapCustomerFromApi(response);
}

// ─── Create / Edit / Update ────────────────────────────────────────────────────
/**
 * Create a new customer (full StorecardCustomerDto shape, including nested user).
 * @param {{ personalInfo: object, user: object, address?: object, activationCodeDoesNotNeedToBeSent?: boolean }} payload
 */
export async function createCustomer(payload) {
  const response = await http.post("/api/customers/create", payload);
  return response; // EntitySummaryDto — { id }
}

/**
 * Edit an existing customer (full StorecardCustomerDto shape).
 * @param {object} payload — must include `id`
 */
export async function editCustomer(payload) {
  const response = await http.put("/api/customers/edit", payload);
  return response; // EntitySummaryDto — { id }
}

/**
 * Update customer info using the lighter "edit" DTO
 * (personalInfo + address + countryShortName, no nested user object).
 * @param {{ id: number, personalInfo: object, address?: object, countryShortName?: string }} payload
 */
export async function updateCustomer(payload) {
  const response = await http.put("/api/customers/update", payload);
  return mapCustomerFromApi(response);
}

/**
 * Complete mandatory info (mobile number + country) — typically prompted
 * right after registration if the profile is incomplete.
 * @param {{ mobileNumber: string, countryShortName: string }} payload
 */
export async function completeMandatoryInfo(payload) {
  const response = await http.put("/api/customers/complete-mandatory-info", payload);
  return mapCustomerFromApi(response);
}

/**
 * Configure the customer's secret PIN (used for POS / in-store payments).
 * @param {{ id: number, password: string, secretPin: string }} payload
 */
export async function configureSecretPin(payload) {
  const response = await http.put("/api/customers/configure-secret-pin", payload);
  return mapCustomerFromApi(response);
}

// ─── Search ───────────────────────────────────────────────────────────────────
/**
 * Paginated customer search (admin / salesman context).
 */
export async function searchCustomers(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/customers/search", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapCustomerFromApi) };
}

/**
 * Search all customers without pagination.
 */
export async function searchAllCustomers(params = {}) {
  const body = buildSearchQuery({ ...params, readAll: true });
  const response = await http.post("/api/customers/search-all", body);
  const normalized = normalizePaginatedResponse(response);
  return normalized.items.map(mapCustomerFromApi);
}

/**
 * Count customers matching the given criteria.
 * @returns {Promise<number>}
 */
export async function countCustomers(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/customers/count", body);
  return typeof response === "number" ? response : response?.count ?? 0;
}

const customerApi = {
  getCurrentCustomer,
  checkCurrentCustomerInfoOk,
  getCustomerDetail,
  createCustomer,
  editCustomer,
  updateCustomer,
  completeMandatoryInfo,
  configureSecretPin,
  searchCustomers,
  searchAllCustomers,
  countCustomers,
};

export default customerApi;
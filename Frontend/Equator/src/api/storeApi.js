/**
 * storeApi.js
 * Store / boutique services.
 *
 * Covers:
 *   POST /api/client/stores/top-stores
 *   POST /api/client/stores/headlines-stores
 *   POST /api/client/stores/search
 *   POST /api/client/stores/search-all
 *   POST /api/client/stores/full-text-search
 *   POST /api/client/stores/all-stores
 *   POST /api/client/stores/count
 *   GET  /api/client/stores/details/{storeId}
 *
 * All POST search endpoints share the same request body shape
 * (StoreSearchQueryDto) — built via buildSearchQuery() from httpClient.js.
 *
 * Every response is normalized via normalizePaginatedResponse() and mapped
 * with mapStoreFromApi() so pages never touch raw backend DTOs.
 */

import http, { buildSearchQuery, normalizePaginatedResponse } from "./httpClient";
import { mapStoreFromApi } from "./mappers/mappers";

// ─── Top / Headline stores (homepage carousels) ───────────────────────────────
/**
 * List the top stores of the application (used on HomePage).
 * @param {object} params — optional pagination overrides
 */
export async function getTopStores(params = {}) {
  const body = buildSearchQuery({ pageSize: 8, ...params });
  const response = await http.post("/api/client/stores/top-stores", body);
  const { items } = normalizePaginatedResponse(response);
  return items.map(mapStoreFromApi);
}

/**
 * List the headline (featured) stores of the application (used on HomePage).
 */
export async function getHeadlineStores(params = {}) {
  const body = buildSearchQuery({ pageSize: 4, ...params });
  const response = await http.post("/api/client/stores/headlines-stores", body);
  const { items } = normalizePaginatedResponse(response);
  return items.map(mapStoreFromApi);
}

// ─── Search ───────────────────────────────────────────────────────────────────
/**
 * Generic paginated store search.
 * @param {{ page?: number, pageSize?: number, searchString?: string, sortBy?: string, sortDirection?: string, fieldFilters?: object }} params
 * @returns {Promise<{ items: object[], totalItems: number, totalPages: number, page: number }>}
 */
export async function searchStores(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/client/stores/search", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapStoreFromApi) };
}

/**
 * Search all stores without pagination (readAll: true).
 */
export async function searchAllStores(params = {}) {
  const body = buildSearchQuery({ ...params, readAll: true });
  const response = await http.post("/api/client/stores/search-all", body);
  const normalized = normalizePaginatedResponse(response);
  return normalized.items.map(mapStoreFromApi);
}

/**
 * Full-text search across store names/descriptions.
 * Used by SearchResultsPage.
 * @param {string} query
 * @param {object} extraParams
 */
function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function storeMatchesQuery(store, query) {
  const search = normalizeSearchText(query);

  if (!search) return true;

  const text = normalizeSearchText(
    [
      store.name,
      store.storeName,
      store.description,
      store.tagline,
      store.category,
      store.location,
      store.address,
    ]
      .filter(Boolean)
      .join(" ")
  );

  return text.includes(search);
}

export async function fullTextSearchStores(query, extraParams = {}) {
  const page = Number(extraParams.page || 0);
  const pageSize = Number(extraParams.pageSize || 12);

  const response = await getAllStores({
    pageSize: 100,
  });

  const allStores = response.items || [];

  const filteredStores = allStores.filter((store) =>
    storeMatchesQuery(store, query)
  );

  const start = page * pageSize;
  const end = start + pageSize;

  return {
    items: filteredStores.slice(start, end),
    totalItems: filteredStores.length,
    totalPages: Math.max(1, Math.ceil(filteredStores.length / pageSize)),
    page,
  };
}

/**
 * Retrieve every store, no filters (used on StoresPage when no search active).
 */
export async function getAllStores(params = {}) {
  const body = buildSearchQuery({ pageSize: 50, ...params });
  const response = await http.post("/api/client/stores/all-stores", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapStoreFromApi) };
}

/**
 * Count stores matching the given criteria.
 * @returns {Promise<number>}
 */
export async function countStores(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/client/stores/count", body);
  return typeof response === "number" ? response : response?.count ?? 0;
}

// ─── Store details ────────────────────────────────────────────────────────────
/**
 * Get full details for a single store (used on StoreDetailPage).
 * @param {number|string} storeId
 */
export async function getStoreDetails(storeId) {
  const response = await http.get(`/api/client/stores/details/${storeId}`);
  return mapStoreFromApi(response);
}

const storeApi = {
  getTopStores,
  getHeadlineStores,
  searchStores,
  searchAllStores,
  fullTextSearchStores,
  getAllStores,
  countStores,
  getStoreDetails,
};

export default storeApi;
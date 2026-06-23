/**
 * productApi.js
 * Product / catalog services.
 *
 * Covers:
 *   POST /api/client/catalog/products/search
 *   POST /api/client/catalog/products/search-all
 *   POST /api/client/catalog/products/all-products
 *   POST /api/client/catalog/products/full-text-search
 *   POST /api/client/catalog/products/search-by-criteria/{storeId}
 *   POST /api/client/catalog/products/get-products-of-the-same-categories
 *   POST /api/client/catalog/products/count
 *   GET  /api/client/catalog/products/details/{productId}
 *   GET  /api/client/catalog/products/headline-products
 *
 * All POST search endpoints share the same request body shape
 * (ProductPromoSearchQueryDto) — built via buildSearchQuery().
 */

import http, { buildSearchQuery, normalizePaginatedResponse } from "./httpClient";
import { mapProductFromApi } from "./mappers/mappers";

// ─── Generic search ───────────────────────────────────────────────────────────
/**
 * Paginated product search with filters (category, price range, etc.)
 * via fieldFilters. Used by MarketplacePage.
 *
 * @param {{ page?: number, pageSize?: number, searchString?: string, sortBy?: string, sortDirection?: string, fieldFilters?: object }} params
 * @returns {Promise<{ items: object[], totalItems: number, totalPages: number, page: number }>}
 */
export async function searchProducts(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/client/catalog/products/search", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapProductFromApi) };
}

/**
 * Search all products without pagination (readAll: true).
 */
export async function searchAllProducts(params = {}) {
  const body = buildSearchQuery({ ...params, readAll: true });
  const response = await http.post("/api/client/catalog/products/search-all", body);
  const normalized = normalizePaginatedResponse(response);
  return normalized.items.map(mapProductFromApi);
}

/**
 * Retrieve all products, paginated (used on HomePage "Sélection du moment").
 */
export async function getAllProducts(params = {}) {
  const body = buildSearchQuery({ pageSize: 8, ...params });
  const response = await http.post("/api/client/catalog/products/all-products", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapProductFromApi) };
}

/**
 * Full-text search across product names/descriptions.
 * Used by SearchResultsPage.
 * @param {string} query
 * @param {object} extraParams
 */
export async function fullTextSearchProducts(query, extraParams = {}) {
  const body = buildSearchQuery({ searchString: query, ...extraParams });
  const response = await http.post("/api/client/catalog/products/full-text-search", body);
  const normalized = normalizePaginatedResponse(response, extraParams.pageSize);
  return { ...normalized, items: normalized.items.map(mapProductFromApi) };
}

/**
 * Retrieve products belonging to a specific store.
 * Used by StoreDetailPage.
 * @param {number|string} storeId
 * @param {object} params
 */
export async function getProductsByStore(storeId, params = {}) {
  const body = buildSearchQuery({ pageSize: 24, ...params });
  const response = await http.post(
    `/api/client/catalog/products/search-by-criteria/${storeId}`,
    body
  );
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapProductFromApi) };
}

/**
 * Retrieve products in the same category as a given product.
 * Used for "Produits similaires" section on ProductPage.
 *
 * NOTE: the OpenAPI spec defines this as a generic search endpoint
 * (ProductPromoSearchQueryDto body) — the actual category/product
 * reference must be passed via fieldFilters since no dedicated
 * productId param is documented. Adjust fieldFilters keys once the
 * backend team confirms the exact filter key (likely "categoryIds"
 * or "productId").
 *
 * @param {{ productId?: number, categoryIds?: number[] }} criteria
 * @param {object} params
 */
export async function getSimilarProducts(criteria = {}, params = {}) {
  const fieldFilters = {};
  if (criteria.productId) fieldFilters.productId = criteria.productId;
  if (criteria.categoryIds) fieldFilters.categoryIds = criteria.categoryIds;

  const body = buildSearchQuery({ pageSize: 4, fieldFilters, ...params });
  const response = await http.post(
    "/api/client/catalog/products/get-products-of-the-same-categories",
    body
  );
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return normalized.items.map(mapProductFromApi);
}

/**
 * Count products matching the given criteria.
 * @returns {Promise<number>}
 */
export async function countProducts(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/client/catalog/products/count", body);
  return typeof response === "number" ? response : response?.count ?? 0;
}

// ─── Product details ──────────────────────────────────────────────────────────
/**
 * Get full details for a single product (used on ProductPage).
 * @param {number|string} productId
 */
export async function getProductDetails(productId) {
  const response = await http.get(`/api/client/catalog/products/details/${productId}`);
  return mapProductFromApi(response);
}

/**
 * Get the headline (featured/promoted) products — useful for homepage banners.
 */
export async function getHeadlineProducts() {
  const response = await http.get("/api/client/catalog/products/headline-products");
  const items = Array.isArray(response) ? response : response?.summaryDtos ?? [];
  return items.map(mapProductFromApi);
}

const productApi = {
  searchProducts,
  searchAllProducts,
  getAllProducts,
  fullTextSearchProducts,
  getProductsByStore,
  getSimilarProducts,
  countProducts,
  getProductDetails,
  getHeadlineProducts,
};

export default productApi;
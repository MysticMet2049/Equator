/**
 * httpClient.js
 * Centralized HTTP client for all API calls.
 *
 * Reads from environment variables:
 *   VITE_API_BASE_URL      — backend base URL (e.g. https://localhost:8443)
 *   VITE_API_KEY           — x-api-key header value
 *   VITE_PLATFORM_CONTEXT  — PlatformContext header value
 *
 * Auth token is stored in localStorage under the key "equator_token"
 * and injected automatically into every request.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:8443";
const API_KEY = import.meta.env.VITE_API_KEY ?? "";
const PLATFORM_CONTEXT = import.meta.env.VITE_PLATFORM_CONTEXT ?? "";

// ─── Token helpers ────────────────────────────────────────────────────────────
const TOKEN_KEY = "equator_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// ─── Build common headers ─────────────────────────────────────────────────────
function buildHeaders(extra = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };

  if (API_KEY) headers["x-api-key"] = API_KEY;
  if (PLATFORM_CONTEXT) headers["PlatformContext"] = PLATFORM_CONTEXT;

  const token = tokenStorage.get();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

// ─── Error class ─────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ─── Response handler ─────────────────────────────────────────────────────────
async function handleResponse(response) {
  // 204 No Content — return null
  if (response.status === 204) return null;

  // Try to parse JSON regardless of status
  let data = null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") || contentType.includes("*/*")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    // For non-JSON responses (blobs, plain text) return raw response
    return response;
  }

  if (!response.ok) {
    const message =
      data?.message ??
      data?.error ??
      data?.title ??
      `HTTP ${response.status}`;

    // Token expired or invalid — caller should handle logout
    if (response.status === 401) {
      tokenStorage.remove();
      throw new ApiError(401, "Session expirée. Veuillez vous reconnecter.", data);
    }

    if (response.status === 403) {
      throw new ApiError(403, "Accès refusé.", data);
    }

    if (response.status === 404) {
      throw new ApiError(404, "Ressource introuvable.", data);
    }

    throw new ApiError(response.status, message, data);
  }

  return data;
}

// ─── Core request function ────────────────────────────────────────────────────
async function request(method, path, { body, headers: extraHeaders, signal } = {}) {
  const url = `${BASE_URL}${path}`;

  const options = {
    method,
    headers: buildHeaders(extraHeaders),
    signal,
  };

  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (err) {
    if (err instanceof ApiError) throw err;

    // Network error (no connection, CORS, SSL issue etc.)
    if (err.name === "TypeError" || err.name === "NetworkError") {
      throw new ApiError(0, "Impossible de contacter le serveur. Vérifiez votre connexion.", null);
    }

    // AbortError (request cancelled)
    if (err.name === "AbortError") {
      throw new ApiError(0, "Requête annulée.", null);
    }

    // Unknown error — rethrow with context
    console.error("[httpClient] Unexpected error:", err);
    throw new ApiError(0, "Une erreur inattendue est survenue.", null);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────
const http = {
  get: (path, options = {}) => request("GET", path, options),

  post: (path, body, options = {}) => request("POST", path, { ...options, body }),

  put: (path, body, options = {}) => request("PUT", path, { ...options, body }),

  delete: (path, options = {}) => request("DELETE", path, options),

  // Multipart form upload (overrides Content-Type so browser sets boundary)
  upload: async (path, formData, options = {}) => {
    const url = `${BASE_URL}${path}`;
    const headers = buildHeaders(options.headers ?? {});
    // Remove Content-Type — fetch will set it with the correct boundary for FormData
    delete headers["Content-Type"];

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
        signal: options.signal,
      });
      return await handleResponse(response);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(0, "Impossible de contacter le serveur.", null);
    }
  },
};

export default http;

// ─── Pagination helper ────────────────────────────────────────────────────────
/**
 * Build the standard search query body used by most POST search endpoints.
 * @param {object} params
 * @param {number} params.page         — 0-based page index
 * @param {number} params.pageSize     — items per page
 * @param {string} params.searchString — optional text filter
 * @param {string} params.sortBy
 * @param {string} params.sortDirection — ASC | DESC
 * @param {boolean} params.readAll     — skip pagination and return everything
 * @param {object} params.fieldFilters — key/value pairs for field-level filtering
 */
export function buildSearchQuery({
  page = 0,
  pageSize = 12,
  searchString = "",
  sortBy = "",
  sortDirection = "DESC",
  readAll = false,
  fieldFilters = {},
  definedFilters = [],
} = {}) {
  return {
    pageIndex: page,
    startIndex: page * pageSize,
    numberOfItemsPerPage: pageSize,
    searchString,
    sortBy,
    sortDirection,
    readAll,
    fieldFilters,
    definedFilters,
  };
}

/**
 * Normalize the paginated response returned by all search endpoints.
 * Returns { items, totalItems, totalPages, page }
 */
export function normalizePaginatedResponse(response, pageSize = 12) {
  if (!response) return { items: [], totalItems: 0, totalPages: 0, page: 0 };
  return {
    items: response.summaryDtos ?? [],
    totalItems: response.totalNumberOfItems ?? 0,
    totalPages: response.numberOfPages ?? 0,
    page: response.pageIndex ?? 0,
  };
}
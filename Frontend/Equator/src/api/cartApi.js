/**
 * cartApi.js
 * Shopping cart and cart items services.
 *
 * Covers:
 *   POST   /api/client/shopping-cart/create
 *   POST   /api/client/shopping-cart/{storeId}/add-product/{productId}
 *   POST   /api/client/shopping-cart/submit
 *   POST   /api/client/shopping-cart/empty/{shoppingCartId}
 *   POST   /api/client/shopping-cart/search
 *   POST   /api/client/shopping-cart/search-all
 *   PUT    /api/client/shopping-cart/edit
 *   GET    /api/client/shopping-cart/find-by-store-and-customer/{storeId}/{customerId}
 *   POST   /api/client/shopping-cart/items/create
 *   PUT    /api/client/shopping-cart/items/edit
 *   POST   /api/client/shopping-cart/items/add-shopping-cart-item
 *   POST   /api/client/shopping-cart/items/add-product/{productId}/to/{storeId}
 *   DELETE /api/client/shopping-cart/items/delete/{id}
 *
 * NOTE on customerId / customerAccountId:
 * The cart DTOs require customerId / customerAccountId fields, but no
 * endpoint in this file exposes "current customer account id" directly —
 * /api/customers/current returns the customer profile (see customerApi.js),
 * which should be used by CartContext to resolve these IDs before calling
 * cart endpoints. Until that wiring is confirmed end-to-end, callers must
 * pass customerId explicitly.
 */

import http, { buildSearchQuery, normalizePaginatedResponse } from "./httpClient";
import { mapCartFromApi, mapCartItemFromApi } from "./mappers/mappers";

// ─── Cart creation & retrieval ────────────────────────────────────────────────
/**
 * Create a new shopping cart for a customer at a given store.
 * @param {{ customerId: number, customerAccountId?: number, storeId: number, note?: string }} payload
 */
export async function createCart({ customerId, customerAccountId, storeId, note = "" }) {
  const response = await http.post("/api/client/shopping-cart/create", {
    customerId,
    customerAccountId,
    storeId,
    note,
    cartItems: [],
  });
  return mapCartFromApi(response);
}

/**
 * Find the active cart for a given store + customer combination.
 * Returns null if no cart exists yet (caller should then call createCart).
 * @param {number|string} storeId
 * @param {number|string} customerId
 */
export async function findCartByStoreAndCustomer(storeId, customerId) {
  try {
    const response = await http.get(
      `/api/client/shopping-cart/find-by-store-and-customer/${storeId}/${customerId}`
    );
    return mapCartFromApi(response);
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

/**
 * Update an existing cart (e.g. note, or full cartItems replace).
 * @param {object} cartDto — full ShoppingCartDto shape
 */
export async function editCart(cartDto) {
  const response = await http.put("/api/client/shopping-cart/edit", cartDto);
  return mapCartFromApi(response);
}

/**
 * Empty all items from a cart without deleting the cart itself.
 * @param {number|string} shoppingCartId
 */
export async function emptyCart(shoppingCartId) {
  const response = await http.post(`/api/client/shopping-cart/empty/${shoppingCartId}`);
  return mapCartFromApi(response);
}

/**
 * Submit (checkout) the cart — converts it into a purchase/order.
 * @param {object} cartDto — full ShoppingCartDto shape
 */
export async function submitCart(cartDto) {
  return http.post("/api/client/shopping-cart/submit", cartDto);
}

// ─── Add product shortcuts (no need to manage cart ID manually) ──────────────
/**
 * Quick "add to cart" shortcut — backend resolves or creates the cart
 * for the given store automatically.
 * @param {number|string} storeId
 * @param {number|string} productId
 */
export async function addProductToCart(storeId, productId) {
  const response = await http.post(
    `/api/client/shopping-cart/${storeId}/add-product/${productId}`
  );
  return mapCartFromApi(response);
}

/**
 * Alternative add-product endpoint scoped under /items.
 * @param {number|string} productId
 * @param {number|string} storeId
 */
export async function addProductToCartItems(productId, storeId) {
  const response = await http.post(
    `/api/client/shopping-cart/items/add-product/${productId}/to/${storeId}`
  );
  return mapCartItemFromApi(response);
}

// ─── Cart items CRUD ──────────────────────────────────────────────────────────
/**
 * Create a new cart item directly (when you already know the cart/product IDs).
 * @param {{ productId: number, customerId: number, storeId: number, quantity: number, salesPrice: number, note?: string }} payload
 */
export async function createCartItem(payload) {
  const response = await http.post("/api/client/shopping-cart/items/create", payload);
  return mapCartItemFromApi(response);
}

/**
 * Generic "add shopping cart item" — accepts a full ShoppingCartItemDto.
 * @param {object} itemDto
 */
export async function addShoppingCartItem(itemDto) {
  const response = await http.post(
    "/api/client/shopping-cart/items/add-shopping-cart-item",
    itemDto
  );
  return mapCartItemFromApi(response);
}

/**
 * Edit an existing cart item (e.g. update quantity).
 * @param {{ id: number, productId: number, customerId: number, storeId: number, quantity: number, salesPrice: number, note?: string }} payload
 */
export async function editCartItem(payload) {
  const response = await http.put("/api/client/shopping-cart/items/edit", payload);
  return mapCartItemFromApi(response);
}

/**
 * Delete a single cart item.
 * @param {number|string} itemId
 */
export async function deleteCartItem(itemId) {
  return http.delete(`/api/client/shopping-cart/items/delete/${itemId}`);
}

// ─── Cart search (admin / history use cases) ──────────────────────────────────
/**
 * Paginated cart search.
 */
export async function searchCarts(params = {}) {
  const body = buildSearchQuery(params);
  const response = await http.post("/api/client/shopping-cart/search", body);
  const normalized = normalizePaginatedResponse(response, params.pageSize);
  return { ...normalized, items: normalized.items.map(mapCartFromApi) };
}

/**
 * Search all carts without pagination.
 */
export async function searchAllCarts(params = {}) {
  const body = buildSearchQuery({ ...params, readAll: true });
  const response = await http.post("/api/client/shopping-cart/search-all", body);
  const normalized = normalizePaginatedResponse(response);
  return normalized.items.map(mapCartFromApi);
}

const cartApi = {
  createCart,
  findCartByStoreAndCustomer,
  editCart,
  emptyCart,
  submitCart,
  addProductToCart,
  addProductToCartItems,
  createCartItem,
  addShoppingCartItem,
  editCartItem,
  deleteCartItem,
  searchCarts,
  searchAllCarts,
};

export default cartApi;
/**
 * cartMapper.js
 * Transforms shopping cart backend DTOs into clean frontend objects.
 */

// ─── Cart ─────────────────────────────────────────────────────────────────────
/**
 * Map ShoppingCartDto → clean cart object.
 *
 * Backend shape:
 *   id, customerId, customerAccountId, storeId, note,
 *   cartItems: ShoppingCartItemDto[]
 */
export function mapCartFromApi(apiCart) {
  if (!apiCart) return null;
  return {
    id: apiCart.id,
    customerId: apiCart.customerId,
    customerAccountId: apiCart.customerAccountId,
    storeId: apiCart.storeId,
    note: apiCart.note ?? "",
    items: (apiCart.cartItems ?? []).map(mapCartItemFromApi),
    _raw: apiCart,
  };
}

/**
 * Map ShoppingCartItemDto → clean cart item.
 *
 * Backend shape:
 *   id, productId, customerId, storeId, quantity, salesPrice, note
 *
 * NOTE: product details (name/image) are NOT nested in this DTO — callers
 * (CartContext / hooks) should enrich items by joining with product data
 * fetched via productApi.getProductDetails(productId) if a richer cart
 * UI (with images/names) is required.
 */
export function mapCartItemFromApi(apiItem) {
  if (!apiItem) return null;
  return {
    id: apiItem.id,
    productId: apiItem.productId,
    storeId: apiItem.storeId,
    customerId: apiItem.customerId,
    quantity: apiItem.quantity ?? 1,
    price: apiItem.salesPrice ?? 0,
    note: apiItem.note ?? "",
    // Populated separately when enriched with product data — null by default
    product: null,
    _raw: apiItem,
  };
}

export default mapCartFromApi;

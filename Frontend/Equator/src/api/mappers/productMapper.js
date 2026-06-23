/**
 * productMapper.js
 * Transforms product-related backend DTOs into clean frontend objects.
 */

import { assetUrl, deriveBadge } from "./shared";

// ─── Product ──────────────────────────────────────────────────────────────────
/**
 * Map ClientProductSummaryDtoPromoHeaderSummaryDto → clean product object.
 *
 * Backend shape:
 *   id,
 *   currency: { symbol, code },
 *   productPromoSummaryDto: {
 *     id, name, listPrice, promoPrice, newPrice, discountPercentage,
 *     coverAssetId, assetIds, storeId, categories,
 *     averageRating, ratingCount, description,
 *     productType, nature, stockStatus, availableQuantity, manageStock
 *   }
 *
 * Frontend shape (matches ProductCard expectations):
 *   { id, name, price, oldPrice, image, storeName, rating, category, description, ... }
 */
export function mapProductFromApi(apiProduct) {
  if (!apiProduct) return null;
  const promo = apiProduct.productPromoSummaryDto ?? {};
  const currency = apiProduct.currency ?? {};

  const listPrice = promo.listPrice ?? 0;
  const salePrice = promo.newPrice ?? promo.promoPrice ?? listPrice;
  const hasDiscount = salePrice < listPrice;

  return {
    id: apiProduct.id ?? promo.productId ?? promo.id,
    promoId: promo.id,
    name: promo.name ?? "",
    description: promo.description ?? "",
    price: salePrice,
    oldPrice: hasDiscount ? listPrice : null,
    // Kept for backward compatibility with earlier code that used originalPrice
    originalPrice: hasDiscount ? listPrice : null,
    discountPercentage: promo.discountPercentage ?? null,
    image: assetUrl(promo.coverAssetId),
    images: (promo.assetIds ?? []).map((id) => assetUrl(id)).filter(Boolean),
    storeId: promo.storeId,
    storeName: promo.storeName ?? null,
    category: (promo.categories ?? [])[0] ?? null,
    categories: promo.categories ?? [],
    rating: promo.averageRating ?? 0,
    reviewCount: promo.ratingCount ?? 0,
    currency: currency.symbol ?? currency.code ?? "€",
    badge: deriveBadge(promo),
    isTopProduct: promo.isTopProduct ?? false,
    stockStatus: promo.stockStatus ?? null,
    availableQuantity: promo.availableQuantity ?? null,
    manageStock: promo.manageStock ?? false,
    type: promo.productType ?? "PRODUCT",
    nature: promo.nature ?? null,
    // Keep raw for detail pages that need fields not covered above
    _raw: apiProduct,
  };
}

export default mapProductFromApi;

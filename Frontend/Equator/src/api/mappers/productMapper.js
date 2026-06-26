/**
 * productMapper.js
 * Transforms product-related backend DTOs into clean frontend objects.
 */

import { deriveBadge } from "./shared";

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function normalizeAssetIds(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") {
        return item;
      }

      return item?.id || item?.assetId || null;
    })
    .filter(Boolean);
}

export function mapProductFromApi(apiProduct) {
  if (!apiProduct) return null;

  const promo = apiProduct.productPromoSummaryDto ?? apiProduct;
  const currency = apiProduct.currency ?? promo.currency ?? {};

  /**
   * IMPORTANT :
   * L'id utilisé par le frontend doit être le vrai productId,
   * pas forcément apiProduct.id.
   */
  const productId = normalizeId(
    promo.productId ??
      apiProduct.productId ??
      promo.id ??
      apiProduct.id
  );

  const promoId = normalizeId(promo.id);
  const summaryId = normalizeId(apiProduct.id);

  const listPrice = Number(
    promo.listPrice ??
      promo.oldPrice ??
      promo.price ??
      0
  );

  const salePrice = Number(
    promo.newPrice ??
      promo.promoPrice ??
      promo.salePrice ??
      promo.price ??
      listPrice
  );

  const hasDiscount = listPrice > 0 && salePrice < listPrice;

  const coverAssetId = normalizeId(
    promo.coverAssetId ??
      promo.assetId ??
      promo.imageAssetId ??
      promo.mainAssetId ??
      apiProduct.coverAssetId ??
      apiProduct.assetId ??
      apiProduct.imageAssetId ??
      null
  );

  const assetIds = normalizeAssetIds(
    promo.assetIds ??
      promo.assets ??
      promo.images ??
      apiProduct.assetIds ??
      apiProduct.assets ??
      apiProduct.images ??
      []
  );

  const finalAssetIds = coverAssetId
    ? [
        coverAssetId,
        ...assetIds.filter(
          (assetId) => String(assetId) !== String(coverAssetId)
        ),
      ]
    : assetIds;

  const storeId = normalizeId(
    promo.storeId ??
      promo.store?.id ??
      promo.store?.storeId ??
      apiProduct.storeId ??
      apiProduct.store?.id ??
      apiProduct.store?.storeId ??
      null
  );

  return {
    id: productId,
    productId,
    promoId,
    summaryId,

    name: promo.name ?? apiProduct.name ?? "Produit",
    description: promo.description ?? apiProduct.description ?? "",

    price: salePrice,
    oldPrice: hasDiscount ? listPrice : null,
    originalPrice: hasDiscount ? listPrice : null,
    discountPercentage:
      promo.discountPercentage ?? apiProduct.discountPercentage ?? null,

    coverAssetId,
    assetIds: finalAssetIds,

    image: promo.image || apiProduct.image || null,
    images: Array.isArray(promo.images)
      ? promo.images.filter((img) => typeof img === "string")
      : [],

    storeId,
    storeName:
      promo.storeName ??
      promo.store?.name ??
      apiProduct.storeName ??
      apiProduct.store?.name ??
      null,

    category: (promo.categories ?? apiProduct.categories ?? [])[0] ?? null,
    categories: promo.categories ?? apiProduct.categories ?? [],

    rating: Number(
      promo.averageRating ??
        apiProduct.averageRating ??
        promo.rating ??
        0
    ),
    reviewCount: Number(
      promo.ratingCount ??
        apiProduct.ratingCount ??
        promo.reviewCount ??
        0
    ),

    currency: currency.symbol ?? currency.code ?? "€",

    badge: deriveBadge(promo),
    isTopProduct: promo.isTopProduct ?? apiProduct.isTopProduct ?? false,

    stockStatus: promo.stockStatus ?? apiProduct.stockStatus ?? null,
    availableQuantity:
      promo.availableQuantity ?? apiProduct.availableQuantity ?? null,
    manageStock: promo.manageStock ?? apiProduct.manageStock ?? false,

    type: promo.productType ?? apiProduct.productType ?? "PRODUCT",
    nature: promo.nature ?? apiProduct.nature ?? null,

    specs: promo.specs ?? apiProduct.specs ?? {},
    reviews: promo.reviews ?? apiProduct.reviews ?? [],
    ratingBreakdown:
      promo.ratingBreakdown ?? apiProduct.ratingBreakdown ?? null,

    _raw: apiProduct,
  };
}

export default mapProductFromApi;
import { STORE_CATEGORIES } from "./storeListConfig";

export function normalizeText(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function isRenderableImageUrl(value) {
  if (!value || typeof value !== "string") return false;
  return value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:") || value.startsWith("blob:");
}

export function extractAssetId(value) {
  if (!value) return null;
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && !isRenderableImageUrl(trimmed) ? trimmed : null;
  }

  if (typeof value === "object") {
    return value.assetId || value.id || value.coverAssetId || value.bannerAssetId || value.logoId || value.imageAssetId || null;
  }

  return null;
}

export function getStoreImage(store) {
  return [store.image, store.logo, store.cover, store.coverImage, store.banner].find(isRenderableImageUrl) || null;
}

export function getStoreAssetId(store) {
  return (
    store.assetId ||
    store.coverAssetId ||
    store.bannerAssetId ||
    store.logoId ||
    extractAssetId(store.image) ||
    extractAssetId(store.logo) ||
    extractAssetId(store.cover) ||
    extractAssetId(store.coverImage) ||
    extractAssetId(store.banner) ||
    extractAssetId(store._raw?.storeHeaderInfoSummaryDto?.assetId) ||
    extractAssetId(store._raw?.storeHeaderInfoSummaryDto?.logoId) ||
    null
  );
}

export function getStoreId(store) {
  return store?.id || store?.storeId || store?._raw?.id || store?._raw?.storeHeaderInfoSummaryDto?.id || null;
}

export function getProductStoreId(product) {
  return product?.storeId || product?.store?.id || product?.store?.storeId || product?.storeAccountId || product?.shopId || product?.merchantId || product?._raw?.productPromoSummaryDto?.storeId || null;
}

export function getProductRating(product) {
  const rating = Number(product?.rating ?? product?.averageRating ?? 0);
  return Number.isFinite(rating) ? rating : 0;
}

export function getProductReviewCount(product) {
  const count = Number(product?.reviewCount ?? product?.ratingCount ?? 0);
  return Number.isFinite(count) ? count : 0;
}

export function getSearchableStoreText(store) {
  return [
    store.name,
    store.description,
    store.category,
    store.storeCategory,
    store.type,
    store.businessType,
    store.sector,
    store.activity,
    store.city,
    store.country,
    Array.isArray(store.tags) ? store.tags.join(" ") : store.tags,
    Array.isArray(store.categories) ? store.categories.map((cat) => (typeof cat === "string" ? cat : cat?.name)).filter(Boolean).join(" ") : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function deriveStoreCategory(store) {
  const text = normalizeText(getSearchableStoreText(store));
  const matchedCategory = STORE_CATEGORIES.find((category) => {
    if (category.id === "all" || category.id === "other") return false;
    return category.keywords.some((keyword) => text.includes(normalizeText(keyword)));
  });

  return matchedCategory || STORE_CATEGORIES.find((category) => category.id === "other");
}

export function buildStoreProductMetrics(products) {
  const metrics = new Map();

  products.forEach((product) => {
    const storeId = getProductStoreId(product);
    if (!storeId) return;

    const key = String(storeId);
    const current = metrics.get(key) || { productCount: 0, ratingSum: 0, ratingWeight: 0, reviewCount: 0 };
    const rating = getProductRating(product);
    const reviewCount = getProductReviewCount(product);

    current.productCount += 1;
    current.reviewCount += reviewCount;

    if (rating > 0) {
      const weight = reviewCount > 0 ? reviewCount : 1;
      current.ratingSum += rating * weight;
      current.ratingWeight += weight;
    }

    metrics.set(key, current);
  });

  return metrics;
}

export function enrichStore(store, productMetrics) {
  const category = deriveStoreCategory(store);
  const storeId = getStoreId(store);
  const metrics = productMetrics.get(String(storeId)) || null;

  const apiRating = Number(store.rating || store.averageRating || 0);
  const apiReviewCount = Number(store.reviewCount || store.ratingCount || 0);
  const computedRating = metrics?.ratingWeight ? metrics.ratingSum / metrics.ratingWeight : 0;
  const rating = apiRating > 0 ? apiRating : computedRating;
  const reviewCount = apiReviewCount > 0 ? apiReviewCount : metrics?.reviewCount || 0;
  const productCount = metrics?.productCount || Number(store.productCount || store.totalProduct || store.totalProducts || 0);

  return {
    ...store,
    id: storeId,
    derivedCategoryId: category.id,
    derivedCategoryLabel: category.label,
    computedProductCount: productCount,
    computedRating: Number(rating || 0),
    computedReviewCount: Number(reviewCount || 0),
  };
}

export function hasExpressDelivery(store) {
  const text = normalizeText(getSearchableStoreText(store));
  return store.expressDelivery || store.fastDelivery || store.deliveryExpress || text.includes("express") || text.includes("24h") || text.includes("livraison rapide");
}

export function isCertifiedStore(store) {
  const text = normalizeText(getSearchableStoreText(store));
  return store.isVerified || store.verified || store.certified || store.isCertified || text.includes("certifie") || text.includes("verified") || text.includes("vendeur verifie");
}

export function isNewStore(store) {
  if (store.isNew || store.new) return true;
  const dateValue = store.createdAt || store.createdDate || store.creationDate;
  if (!dateValue) return false;

  const createdDate = new Date(dateValue);
  if (Number.isNaN(createdDate.getTime())) return false;

  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  return createdDate.getTime() >= thirtyDaysAgo;
}

export function matchesActiveFilters(store, activeFilters) {
  if (activeFilters.length === 0) return true;

  return activeFilters.every((filter) => {
    if (filter === "express") return hasExpressDelivery(store);
    if (filter === "certified") return isCertifiedStore(store);
    if (filter === "new") return isNewStore(store);
    return true;
  });
}

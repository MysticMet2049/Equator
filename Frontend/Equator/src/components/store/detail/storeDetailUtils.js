export const DEFAULT_RATING_BREAKDOWN = {
  5: 0,
  4: 0,
  3: 0,
  2: 0,
  1: 0,
};

export function getStoreBanner(store) {
  return (
    store.image ||
    store.logo ||
    store.cover ||
    store.coverImage ||
    store.banner ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
  );
}

export function getStoreLocation(store) {
  return formatLocation(
    store.location ||
      store.address ||
      store.headOfficeAddress ||
      store.storeAddress ||
      store.city ||
      store.country
  );
}

export function normalizeStore(apiStore, totalItems) {
  if (!apiStore) return null;

  const raw = apiStore._raw || apiStore;

  const header =
    apiStore.storeHeaderInfoSummaryDto ||
    apiStore.storeHeaderInfo ||
    raw.storeHeaderInfoSummaryDto ||
    raw.storeHeaderInfo ||
    raw.store ||
    raw.organisationSummaryDto ||
    raw.organisation ||
    {};

  const ratingInfo =
    apiStore.ratingInfo ||
    raw.ratingInfo ||
    apiStore.ratingSummaryDto ||
    raw.ratingSummaryDto ||
    {};

  const storeId =
    apiStore.id ||
    apiStore.storeId ||
    header.id ||
    raw.storeId ||
    raw.id;

  const headerName =
    header.name ||
    header.storeName ||
    raw.storeHeaderInfoSummaryDto?.name ||
    raw.name ||
    raw.storeName ||
    null;

  const currentName =
    apiStore.name && apiStore.name !== "Boutique" ? apiStore.name : null;

  const storeName = currentName || headerName || "Boutique";

  const headerDescription =
    header.description ||
    raw.storeHeaderInfoSummaryDto?.description ||
    raw.description ||
    null;

  const description =
    apiStore.description &&
    apiStore.description !== "Boutique partenaire sur Equator Marketplace."
      ? apiStore.description
      : headerDescription ||
        "Boutique partenaire sur Equator Marketplace.";

  const rating = Number(
    ratingInfo.averageRating ??
      ratingInfo.rating ??
      ratingInfo.note ??
      apiStore.averageRating ??
      apiStore.rating ??
      raw.averageRating ??
      raw.rating ??
      0
  );

  const reviewCount = Number(
    ratingInfo.ratingCount ??
      ratingInfo.reviewCount ??
      ratingInfo.totalReviews ??
      ratingInfo.numberOfRatings ??
      apiStore.ratingCount ??
      apiStore.reviewCount ??
      apiStore.totalReviews ??
      raw.ratingCount ??
      raw.reviewCount ??
      raw.totalReviews ??
      0
  );

  const imageAssetId =
    apiStore.imageAssetId ||
    apiStore.assetId ||
    apiStore.coverAssetId ||
    apiStore.bannerAssetId ||
    header.assetId ||
    header.coverAssetId ||
    header.bannerAssetId ||
    raw.storeHeaderInfoSummaryDto?.assetId ||
    raw.assetId ||
    raw.coverAssetId ||
    raw.bannerAssetId ||
    null;

  const logoId =
    apiStore.logoId ||
    apiStore.logoAssetId ||
    header.logoId ||
    header.logoAssetId ||
    raw.storeHeaderInfoSummaryDto?.logoId ||
    raw.logoId ||
    raw.logoAssetId ||
    null;

  const imageRefType =
    apiStore.imageRefType ||
    (imageAssetId ? "STORE" : "STORE");

  const imageRefEntityId =
    apiStore.imageRefEntityId ||
    apiStore.bannerRefEntityId ||
    storeId;

  const imageType =
    apiStore.imageType ||
    apiStore.bannerType ||
    (imageAssetId ? "STORE_BANNER_IMAGE" : "STORE_LOGO");

  const logoRefType = apiStore.logoRefType || "STORE";
  const logoRefEntityId = apiStore.logoRefEntityId || storeId;
  const logoType = apiStore.logoType || "STORE_LOGO";

  const apiProductCount = Number(
    apiStore.productCount ||
      apiStore.totalProducts ||
      apiStore.totalProduct ||
      apiStore.productsCount ||
      raw.productCount ||
      raw.totalProducts ||
      raw.totalProduct ||
      raw.productsCount ||
      0
  );

  const realProductCount =
    Number.isFinite(Number(totalItems)) && Number(totalItems) > 0
      ? Number(totalItems)
      : apiProductCount;

  const createdAt =
    apiStore.createdAt ||
    apiStore.createdDate ||
    header.createdAt ||
    raw.createdAt ||
    raw.createdDate ||
    null;

  const phoneFromAddress =
    header.address?.principalPhoneNumber?.number ||
    header.address?.principalPhoneNumber?.fullNumber ||
    raw.address?.principalPhoneNumber?.number ||
    raw.address?.principalPhoneNumber?.fullNumber ||
    null;

  return {
    ...apiStore,

    id: storeId,
    storeId,

    name: storeName,
    storeName,

    banner: null,
    imageAssetId,
    assetId: imageAssetId,
    coverAssetId: imageAssetId,
    bannerAssetId: imageAssetId,

    logoId,
    logoAssetId: logoId,

    imageRefType,
    imageRefEntityId,
    imageType,

    logoRefType,
    logoRefEntityId,
    logoType,

    badgeColor: "var(--color-equator-green)",
    badge:
      apiStore.isTopStore ||
      apiStore.isHeadStore ||
      header.topStore ||
      header.headStore
        ? "Top Store"
        : "Store",

    tagline:
      apiStore.tagline ||
      description ||
      "Boutique partenaire sur Equator Marketplace.",

    description,

    productCount: realProductCount,

    since: apiStore.since || createdAt?.slice?.(0, 4) || "2026",

    category: formatDisplayValue(
      apiStore.category ||
        apiStore.storeCategory ||
        header.category ||
        raw.category ||
        "Marketplace"
    ),

    location: getStoreLocation({
      ...raw,
      ...apiStore,
      address: apiStore.address || header.address || raw.address,
    }),

    badges:
      Array.isArray(apiStore.badges) && apiStore.badges.length > 0
        ? apiStore.badges.map((badge) => formatDisplayValue(badge))
        : ["Vendeur vérifié"],

    rating,
    reviewCount,

    ratingBreakdown: {
      ...DEFAULT_RATING_BREAKDOWN,
      ...(ratingInfo.ratingBreakdown || apiStore.ratingBreakdown || {}),
    },

    reviews: Array.isArray(apiStore.reviews)
      ? apiStore.reviews
      : Array.isArray(raw.reviews)
        ? raw.reviews
        : [],

    contact: {
      email:
        apiStore.email ||
        apiStore.contact?.email ||
        header.email ||
        raw.email ||
        null,
      phone:
        apiStore.phone ||
        apiStore.contact?.phone ||
        header.phone ||
        raw.phone ||
        phoneFromAddress ||
        null,
      whatsapp:
        apiStore.whatsapp ||
        apiStore.contact?.whatsapp ||
        header.whatsapp ||
        raw.whatsapp ||
        null,
    },
  };
}

export function formatLocation(value) {
  if (!value) {
    return "Localisation non renseignée";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const parts = [
      value.street,
      value.city,
      value.country,
      value.postalCode,
    ].filter(Boolean);

    return parts.length > 0
      ? parts.join(", ")
      : "Localisation non renseignée";
  }

  return String(value);
}

export function formatDisplayValue(value, fallback = "Non renseigné") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (typeof value === "object") {
    const locationText = formatLocation(value);

    if (locationText !== "Localisation non renseignée") {
      return locationText;
    }

    const parts = Object.values(value).filter(
      (item) => typeof item === "string" || typeof item === "number"
    );

    return parts.length > 0 ? parts.join(", ") : fallback;
  }

  return String(value);
}

export function getProductStoreId(product) {
  return (
    product.storeId ||
    product.store?.id ||
    product.store?.storeId ||
    product.storeHeaderInfoSummaryDto?.id ||
    product.productPromoSummaryDto?.storeId ||
    product._raw?.productPromoSummaryDto?.storeId ||
    product._raw?.storeId ||
    product._raw?.store?.id ||
    product.storeAccountId ||
    product.shopId ||
    product.merchantId ||
    null
  );
}

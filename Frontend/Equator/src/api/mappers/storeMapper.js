function normalizeId(value) {
  return value === undefined || value === null || value === "" ? null : value;
}

function formatAddress(address) {
  if (!address) return null;

  if (typeof address === "string") return address;

  if (typeof address === "object") {
    const quarterName =
      address.quarter?.name ||
      address.quarter?.label ||
      null;

    const phone =
      address.principalPhoneNumber?.number ||
      address.principalPhoneNumber?.fullNumber ||
      null;

    const parts = [
      address.title,
      address.street,
      address.name,
      quarterName,
      address.countryName,
      phone,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : null;
  }

  return null;
}

export function mapStoreFromApi(apiStore) {
  if (!apiStore) return null;

  const header =
    apiStore.storeHeaderInfoSummaryDto ||
    apiStore.storeHeaderInfo ||
    apiStore.store ||
    apiStore;

  const ratingInfo = apiStore.ratingInfo || {};

  const storeId = normalizeId(header.id || apiStore.storeId || apiStore.id);

  const name = header.name || apiStore.name || apiStore.storeName || "Boutique";

  const assetId = normalizeId(header.assetId || apiStore.assetId);
  const logoId = normalizeId(header.logoId || apiStore.logoId);

  const rating = Number(
    ratingInfo.averageRating ??
      apiStore.averageRating ??
      apiStore.rating ??
      0
  );

  const reviewCount = Number(
    ratingInfo.ratingCount ??
      apiStore.ratingCount ??
      apiStore.reviewCount ??
      0
  );

  const address = header.address || apiStore.address || null;

  return {
    ...apiStore,

    id: storeId,
    storeId,

    name,
    storeName: name,

    description:
      apiStore.description ||
      header.description ||
      "Boutique partenaire sur Equator Marketplace.",

    tagline:
      apiStore.tagline ||
      apiStore.description ||
      "Boutique partenaire sur Equator Marketplace.",

    email: header.email || apiStore.email || null,

    location:
      formatAddress(address) ||
      apiStore.location ||
      "Localisation non renseignée",

    address,

    rating,
    averageRating: rating,
    reviewCount,
    ratingCount: reviewCount,

    isTopStore: Boolean(header.topStore || apiStore.isTopStore),
    isHeadStore: Boolean(header.headStore || apiStore.isHeadStore),

    visibleCatalog: Boolean(header.visibleCatalog),
    enablePriceDisplayOnMarketPlace: Boolean(
      header.enablePriceDisplayOnMarketPlace
    ),

    assetId,
    imageAssetId: assetId,

    coverAssetId: assetId,
    bannerAssetId: assetId,

    logoId,
    logoAssetId: logoId,

    imageRefType: "STORE",
    imageRefEntityId: storeId,
    imageType: "STORE_BANNER_IMAGE",

    logoRefType: "STORE",
    logoRefEntityId: storeId,
    logoType: "STORE_LOGO",

    userPreferenceSummaryDto: apiStore.userPreferenceSummaryDto || null,

    image: null,
    logo: null,
    cover: null,
    coverImage: null,
    banner: null,

    _raw: apiStore,
  };
}

export default mapStoreFromApi;
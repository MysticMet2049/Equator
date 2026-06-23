/**
 * storeMapper.js
 * Transforms store-related backend DTOs into clean frontend objects.
 */

import { assetUrl, slugify } from "./shared";

// ─── Store ────────────────────────────────────────────────────────────────────
/**
 * Map ClientStoreHeaderInfoSummaryDto → clean store object.
 *
 * Backend shape:
 *   id, ratingInfo: { averageRating, ratingCount },
 *   storeHeaderInfoSummaryDto: {
 *     id, name, currencyName, assetId, logoId,
 *     openingOur, closingOur, email, address, topStore, headStore
 *   }
 */
export function mapStoreFromApi(apiStore) {
  if (!apiStore) return null;
  const header = apiStore.storeHeaderInfoSummaryDto ?? {};
  const rating = apiStore.ratingInfo ?? {};
  const address = header.address ?? {};

  return {
    id: apiStore.id ?? header.id,
    name: header.name ?? "",
    slug: slugify(header.name ?? String(apiStore.id ?? "")),
    image: assetUrl(header.assetId),
    logo: assetUrl(header.logoId),
    rating: rating.averageRating ?? 0,
    reviewCount: rating.ratingCount ?? 0,
    email: header.email ?? null,
    currency: header.currencyName ?? "EUR",
    openingHour: header.openingOur ?? null,
    closingHour: header.closingOur ?? null,
    isTopStore: header.topStore ?? false,
    isHeadStore: header.headStore ?? false,
    location: [address.city, address.country].filter(Boolean).join(", ") || null,
    address: {
      street: address.street ?? "",
      city: address.city ?? "",
      country: address.country ?? "",
      postalCode: address.postalCode ?? "",
    },
    // Keep raw for detail pages
    _raw: apiStore,
  };
}

export default mapStoreFromApi;

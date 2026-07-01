// Détermine si une chaîne peut être directement utilisée comme image HTML.
export function isRenderableImageUrl(value) {
  if (!value || typeof value !== "string") return false;

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  );
}

// Extrait l'identifiant d'asset depuis les formats renvoyés par le backend.
export function extractAssetId(value) {
  if (!value) return null;
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && !isRenderableImageUrl(trimmed) ? trimmed : null;
  }

  if (typeof value === "object") {
    return (
      value.assetId ||
      value.id ||
      value.coverAssetId ||
      value.bannerAssetId ||
      value.logoId ||
      value.imageAssetId ||
      null
    );
  }

  return null;
}

// Récupère l'identifiant du store malgré les variantes de DTO.
export function getStoreId(store) {
  return (
    store?.id ||
    store?.storeId ||
    store?._raw?.id ||
    store?._raw?.storeHeaderInfoSummaryDto?.id ||
    null
  );
}

// Récupère l'asset prioritaire à afficher sur la carte store.
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

// Utilise une URL déjà exploitable si aucun asset id n'est disponible.
export function getStoreFallbackImage(store) {
  return (
    [store.image, store.logo, store.cover, store.coverImage, store.banner].find(
      isRenderableImageUrl
    ) || null
  );
}

// Transforme les valeurs complexes en texte lisible pour l'utilisateur.
export function formatDisplayValue(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;

  if (["string", "number", "boolean"].includes(typeof value)) {
    return String(value);
  }

  if (typeof value === "object") {
    const parts = [value.street, value.city, value.country, value.postalCode].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");

    const simpleValues = Object.values(value).filter(
      (item) => typeof item === "string" || typeof item === "number"
    );

    return simpleValues.length > 0 ? simpleValues.join(", ") : fallback;
  }

  return String(value);
}

// Prépare le descriptif court affiché sur la carte du store.
export function getStoreDescription(store) {
  return (
    formatDisplayValue(store.description) ||
    formatDisplayValue(store.location) ||
    formatDisplayValue(store.city) ||
    "Découvrez les produits de ce store."
  );
}

// Transforme les produits en slides pour le HeroCarousel.
export function buildHeroSlides(featuredProducts = []) {
  return featuredProducts.slice(0, 3).map((product) => ({
    id: product.id,
    productId: product.productId || product.id,
    coverAssetId: product.coverAssetId,
    eyebrow: product.badge || "Produit en vedette",
    title: product.name,
    description: product.description || "Découvrez ce produit disponible sur Equator.",
    image: product.image,
    primaryLabel: "Acheter maintenant",
    secondaryLabel: "Voir le produit",
    primaryLink: `/product/${product.productId || product.id}`,
    secondaryLink: `/product/${product.productId || product.id}`,
  }));
}

export const PRODUCT_DETAIL_TABS = ["Avis Clients", "Spécifications", "Livraison & Retours"];

export function getProductId(product) {
  return product?.productId || product?.id || product?.promoId || product?.summaryId || null;
}

export function getProductImageUrl(product) {
  const image = product?.image || product?.thumbnail || product?.cover || product?.coverImage || null;

  if (!image || typeof image !== "string") return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return null;
}

export function uniqueValues(values) {
  const seen = new Set();

  return values.filter((value) => {
    if (!value) return false;
    const key = String(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getProductImages(product) {
  const productId = getProductId(product);
  const assetIds = uniqueValues([
    product?.coverAssetId,
    ...(Array.isArray(product?.assetIds) ? product.assetIds : []),
  ]);

  const assetImages = assetIds.map((assetId) => ({ kind: "asset", assetId, productId }));

  const urlImages = Array.isArray(product?.images)
    ? product.images
        .filter((image) => typeof image === "string")
        .filter(
          (image) =>
            image.startsWith("http://") ||
            image.startsWith("https://") ||
            image.startsWith("data:") ||
            image.startsWith("blob:")
        )
        .map((src) => ({ kind: "url", src }))
    : [];

  const fallbackImage = getProductImageUrl(product);
  if (fallbackImage) urlImages.push({ kind: "url", src: fallbackImage });

  const images = [...assetImages, ...urlImages];
  return images.length > 0 ? images : [{ kind: "empty" }];
}

export function normalizeProduct(apiProduct) {
  if (!apiProduct) return null;

  const productId = getProductId(apiProduct);

  return {
    ...apiProduct,
    id: productId,
    productId,
    store: apiProduct.storeName || apiProduct.store || "Store partenaire",
    storeSlug: apiProduct.storeId,
    originalPrice: apiProduct.originalPrice ?? apiProduct.oldPrice,
    warranty: apiProduct.warranty || "Garantie selon les conditions du vendeur",
    delivery: apiProduct.delivery || "Livraison disponible selon le vendeur",
    ratingBreakdown: apiProduct.ratingBreakdown || {
      5: apiProduct.reviewCount || 0,
      4: 0,
      3: 0,
    },
    specs: apiProduct.specs || {},
    reviews: apiProduct.reviews || [],
    price: Number(apiProduct.price || 0),
    rating: Number(apiProduct.rating || 0),
    reviewCount: Number(apiProduct.reviewCount || 0),
  };
}

export function productMatchesRoute(product, routeId) {
  if (!product || !routeId) return false;

  const possibleIds = [product.id, product.productId, product.promoId, product.summaryId].filter(Boolean);
  return possibleIds.some((value) => String(value) === String(routeId));
}

export function getCategoryIdsFromProduct(product) {
  if (!product) return [];

  return (product.categories || [])
    .map((category) => {
      if (typeof category === "string" || typeof category === "number") return category;
      return category?.id || category?.categoryId || category?.name || null;
    })
    .filter(Boolean)
    .map(String);
}

export function getSimilarProducts(allProducts, product) {
  if (!product) return [];

  const currentCategoryIds = getCategoryIdsFromProduct(product);
  const otherProducts = allProducts.filter((item) => String(getProductId(item)) !== String(product.id));

  if (currentCategoryIds.length === 0) return otherProducts.slice(0, 4);

  return otherProducts
    .filter((item) => {
      const itemCategoryIds = getCategoryIdsFromProduct(item);
      return itemCategoryIds.some((categoryId) => currentCategoryIds.includes(String(categoryId)));
    })
    .slice(0, 4);
}

export function formatPrice(value, currency = "FCFA") {
  return `${Number(value || 0).toLocaleString("fr-FR")} ${currency}`;
}

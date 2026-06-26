import { CATEGORY_RULES } from "./categoryConfig";

export function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function slugify(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductSearchText(product) {
  return [
    product.name,
    product.description,
    product.category,
    product.categoryName,
    product.subcategory,
    product.subcategoryName,
    product.storeName,
    Array.isArray(product.tags) ? product.tags.join(" ") : product.tags,
  ]
    .filter(Boolean)
    .join(" ");
}

export function inferProductCategory(product) {
  const explicitCategory =
    product.categoryName ||
    product.category ||
    product.subcategoryName ||
    product.subcategory;

  if (explicitCategory) {
    const explicitText = normalizeText(explicitCategory);

    const matchedExplicit = CATEGORY_RULES.find((category) =>
      category.keywords.some((keyword) =>
        explicitText.includes(normalizeText(keyword))
      )
    );

    if (matchedExplicit) {
      return matchedExplicit;
    }
  }

  const text = normalizeText(getProductSearchText(product));

  const matched = CATEGORY_RULES.find((category) => {
    if (category.slug === "autres") return false;

    return category.keywords.some((keyword) =>
      text.includes(normalizeText(keyword))
    );
  });

  return matched || CATEGORY_RULES.find((category) => category.slug === "autres");
}

export function enrichProduct(product) {
  const category = inferProductCategory(product);

  return {
    ...product,
    derivedCategorySlug: category.slug,
    derivedCategoryName: category.name,
    derivedCategoryDescription: category.description,
  };
}

export function getProductImage(product) {
  return (
    product.image ||
    product.cover ||
    product.coverImage ||
    product.thumbnail ||
    null
  );
}

export function getProductPrice(product) {
  return Number(product.price || product.amount || product.salePrice || 0);
}

export function getProductRating(product) {
  return Number(product.rating || product.averageRating || 0);
}

export function sortProducts(products, sort) {
  const copy = [...products];

  if (sort === "price-asc") {
    return copy.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  }

  if (sort === "price-desc") {
    return copy.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  }

  if (sort === "rating") {
    return copy.sort((a, b) => getProductRating(b) - getProductRating(a));
  }

  return copy;
}

export function buildCategories(products) {
  return CATEGORY_RULES.map((category) => {
    const categoryProducts = products.filter(
      (product) => product.derivedCategorySlug === category.slug
    );

    const firstProduct = categoryProducts[0];

    return {
      ...category,
      count: categoryProducts.length,
      image: firstProduct ? getProductImage(firstProduct) : null,
      coverAssetId: firstProduct?.coverAssetId || null,
      sampleProductId: firstProduct?.id || null,
    };
  }).filter((category) => category.count > 0);
}

export function filterProductsByCategory(products, slug, priceRange, stockOnly) {
  let result = products.filter(
    (product) => product.derivedCategorySlug === slug
  );

  if (priceRange.min) {
    result = result.filter(
      (product) => getProductPrice(product) >= Number(priceRange.min)
    );
  }

  if (priceRange.max) {
    result = result.filter(
      (product) => getProductPrice(product) <= Number(priceRange.max)
    );
  }

  if (stockOnly) {
    result = result.filter((product) => {
      if (typeof product.inStock === "boolean") return product.inStock;
      if (typeof product.available === "boolean") return product.available;

      return true;
    });
  }

  return result;
}

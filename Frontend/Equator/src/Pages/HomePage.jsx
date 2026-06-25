import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import HeroCarousel from "../components/home/HeroCarousel";
import ProductCard from "../components/product/ProductCard";
import ApiImage from "../components/common/ApiImage";
import { useProducts } from "../hooks/useProducts";
import { useHeadlineStores } from "../hooks/useStores";
import { TRUST_BADGES as TRUST } from "../data/ui";

function isRenderableImageUrl(value) {
  if (!value || typeof value !== "string") return false;

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  );
}

function extractAssetId(value) {
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

function getStoreId(store) {
  return (
    store?.id ||
    store?.storeId ||
    store?._raw?.id ||
    store?._raw?.storeHeaderInfoSummaryDto?.id ||
    null
  );
}

function getStoreAssetId(store) {
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

function getStoreFallbackImage(store) {
  return (
    [store.image, store.logo, store.cover, store.coverImage, store.banner].find(
      isRenderableImageUrl
    ) || null
  );
}

function formatDisplayValue(value, fallback = "") {
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
    const parts = [value.street, value.city, value.country, value.postalCode].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");

    const simpleValues = Object.values(value).filter(
      (item) => typeof item === "string" || typeof item === "number"
    );

    return simpleValues.length > 0 ? simpleValues.join(", ") : fallback;
  }

  return String(value);
}

function getStoreDescription(store) {
  return (
    formatDisplayValue(store.description) ||
    formatDisplayValue(store.location) ||
    formatDisplayValue(store.city) ||
    "Découvrez les produits de ce store."
  );
}

export default function HomePage() {
  const {
    products: featuredProducts,
    loading: productsLoading,
    error: productsError,
    isEmpty: productsEmpty,
  } = useProducts({ pageSize: 8 });

  const {
    stores: partnerStores,
    loading: storesLoading,
    error: storesError,
    isEmpty: storesEmpty,
  } = useHeadlineStores({ pageSize: 2 });

  const heroSlides = featuredProducts.slice(0, 3).map((product) => ({
    id: product.id,
    productId: product.productId || product.id,
    coverAssetId: product.coverAssetId,
    eyebrow: product.badge || "Produit en vedette",
    title: product.name,
    description:
      product.description || "Découvrez ce produit disponible sur Equator.",
    image: product.image,
    primaryLabel: "Acheter maintenant",
    secondaryLabel: "Voir le produit",
    primaryLink: `/product/${product.productId || product.id}`,
    secondaryLink: `/product/${product.productId || product.id}`,
  }));

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-7">
          <div>
            <h2
              className="text-2xl font-light"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-equator-text)",
              }}
            >
              Sélection du moment
            </h2>
            <p
              className="text-sm mt-1"
              style={{
                color: "var(--color-equator-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Nos pièces favorites choisies pour vous.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="hidden md:flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
          >
            Tout voir <FiArrowRight size={14} />
          </Link>
        </div>

        {productsLoading ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              Chargement des produits...
            </p>
          </div>
        ) : productsError ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              Impossible de charger les produits.
            </p>
          </div>
        ) : productsEmpty ? (
          <div className="py-10 text-center">
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              Aucun produit disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-6 flex md:hidden justify-center">
          <Link
            to="/marketplace"
            className="flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--color-equator-green)" }}
          >
            Tout voir <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="py-14" style={{ background: "#f0ebe3" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h2
              className="text-2xl font-light"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-equator-text)",
              }}
            >
              Nos Stores Partenaires
            </h2>
            <p
              className="text-sm mt-1 max-w-sm mx-auto"
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
            >
              Soutenez les créateurs locaux et les marques engagées pour une consommation plus juste.
            </p>
          </div>

          {storesLoading ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                Chargement des stores...
              </p>
            </div>
          ) : storesError ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                Impossible de charger les stores partenaires.
              </p>
            </div>
          ) : storesEmpty ? (
            <div className="py-10 text-center">
              <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                Aucun store partenaire disponible pour le moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {partnerStores.slice(0, 2).map((store) => {
                const storeId = getStoreId(store);
                const storeAssetId = getStoreAssetId(store);
                const fallbackImage = getStoreFallbackImage(store);
                const navigationStore = { ...store, id: storeId };

                return (
                  <div
                    key={storeId || store.name}
                    className="store-card relative overflow-hidden rounded-xl"
                    style={{ height: "260px", background: "var(--color-equator-beige)" }}
                  >
                    {storeAssetId && storeId ? (
                      <ApiImage
                        assetId={storeAssetId}
                        refType="STORE"
                        refEntityId={storeId}
                        type="STORE_BANNER_IMAGE"
                        typeCandidates={["BANNER", "COVER", "LOGO", "IMAGE"]}
                        alt={store.name || "Store partenaire"}
                        className="w-full h-full object-cover"
                      />
                    ) : fallbackImage ? (
                      <img
                        src={fallbackImage}
                        alt={store.name || "Store partenaire"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-sm" style={{ color: "var(--color-equator-muted)" }}>
                          Image indisponible
                        </span>
                      </div>
                    )}

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
                      }}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-lg font-light mb-1.5" style={{ fontFamily: "var(--font-display)" }}>
                        {store.name || "Store partenaire"}
                      </h3>
                      <p
                        className="text-xs leading-relaxed mb-4 max-w-xs"
                        style={{
                          color: "rgba(255,255,255,0.82)",
                          fontFamily: "var(--font-body)",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {getStoreDescription(store)}
                      </p>
                      {storeId ? (
                        <Link
                          to={`/stores/${storeId}`}
                          state={{ store: navigationStore }}
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all hover:bg-white/20"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.35)",
                            color: "white",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Visiter le store <FiArrowRight size={12} />
                        </Link>
                      ) : (
                        <Link
                          to="/stores"
                          className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full transition-all hover:bg-white/20"
                          style={{
                            background: "rgba(255,255,255,0.12)",
                            border: "1px solid rgba(255,255,255,0.35)",
                            color: "white",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          Voir les stores <FiArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {TRUST.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "var(--color-equator-beige)" }}>
                <Icon size={22} style={{ color: "var(--color-equator-green)" }} />
              </div>
              <h3
                className="text-sm font-semibold"
                style={{
                  color: "var(--color-equator-text)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {title}
              </h3>
              <p
                className="text-xs leading-relaxed max-w-50"
                style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

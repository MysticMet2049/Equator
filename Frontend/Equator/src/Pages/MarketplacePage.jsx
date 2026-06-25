import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import ProductCard from "../components/product/ProductCard";
import Pagination from "../components/common/Pagination";
import { useApi } from "../context/ApiContext";
import { useProducts } from "../hooks/useProducts";

export default function MarketplacePage() {
  // On garde seulement les catégories depuis ApiContext pour l’instant,
  // car il n’y a pas encore d’endpoint catégorie clair côté backend.
  const { categories } = useApi();

  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const q = searchParams.get("q") || "";
    setLocalSearch(q);
    setDebouncedSearch(q);
  }, [searchParams]);

  // Petit debounce pour éviter d’appeler l’API à chaque frappe instantanément.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const productParams = useMemo(() => {
    return {
      pageSize: 24,
      searchString: debouncedSearch,
      fieldFilters:
        selectedCategory !== "all"
          ? {
              CATEGORY_NAME: selectedCategory,
            }
          : {},
    };
  }, [debouncedSearch, selectedCategory]);

  const {
    products,
    totalItems,
    totalPages,
    page,
    setPage,
    loading,
    error,
    isEmpty,
  } = useProducts(productParams);

  // Quand la recherche ou la catégorie change, on revient à la première page.
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, selectedCategory, setPage]);

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-light mb-2"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}
          >
            Marketplace
          </h1>

          <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>
            {loading
              ? "Chargement des produits..."
              : `${totalItems || products.length} produit${
                  (totalItems || products.length) > 1 ? "s" : ""
                } trouvé${(totalItems || products.length) > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div
            className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2.5"
            style={{ background: "white", border: "1px solid var(--color-equator-beige)" }}
          >
            <FiSearch size={14} style={{ color: "var(--color-equator-muted)" }} />
            <input
              type="text"
              placeholder="Rechercher un produit ou une boutique..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent outline-none text-sm flex-1"
              style={{ fontFamily: "var(--font-body)" }}
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("all")}
            className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
            style={{
              background: selectedCategory === "all" ? "var(--color-equator-green)" : "white",
              color: selectedCategory === "all" ? "white" : "var(--color-equator-muted)",
              border: `1px solid ${
                selectedCategory === "all"
                  ? "var(--color-equator-green)"
                  : "var(--color-equator-beige)"
              }`,
              fontFamily: "var(--font-body)",
            }}
          >
            Tout
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className="text-xs px-3 py-1.5 rounded-full transition-all font-medium"
              style={{
                background: selectedCategory === cat.name ? "var(--color-equator-green)" : "white",
                color: selectedCategory === cat.name ? "white" : "var(--color-equator-muted)",
                border: `1px solid ${
                  selectedCategory === cat.name
                    ? "var(--color-equator-green)"
                    : "var(--color-equator-beige)"
                }`,
                fontFamily: "var(--font-body)",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <p
              className="text-lg"
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-display)" }}
            >
              Chargement des produits...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p
              className="text-lg"
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-display)" }}
            >
              Impossible de charger les produits.
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--color-equator-muted)" }}>
              Vérifiez que le serveur backend est lancé.
            </p>
          </div>
        ) : isEmpty ? (
          <div className="text-center py-20">
            <p
              className="text-lg"
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-display)" }}
            >
              Aucun produit trouvé.
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--color-equator-muted)" }}>
              Essayez un autre terme de recherche.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <Pagination
              current={page + 1}
              total={totalPages}
              onChange={(nextPage) => setPage(nextPage - 1)}
            />
          </>
        )}
      </div>
    </div>
  );
}
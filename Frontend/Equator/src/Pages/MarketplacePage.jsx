import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiFilter, FiSearch } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import { useApi } from "../context/ApiContext";

export default function MarketplacePage() {
  const { getProducts, categories, searchQuery, setSearchQuery } = useApi();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localSearch, setLocalSearch] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setLocalSearch(q);
  }, [searchParams]);

  const products = getProducts({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    query: localSearch,
  });

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
            {products.length} produit{products.length > 1 ? "s" : ""} trouvé{products.length > 1 ? "s" : ""}
          </p>
        </div>

        {/* Search + filters */}
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
              border: `1px solid ${selectedCategory === "all" ? "var(--color-equator-green)" : "var(--color-equator-beige)"}`,
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
                border: `1px solid ${selectedCategory === cat.name ? "var(--color-equator-green)" : "var(--color-equator-beige)"}`,
                fontFamily: "var(--font-body)",
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-display)" }}>
              Aucun produit trouvé.
            </p>
            <p className="text-sm mt-2" style={{ color: "var(--color-equator-muted)" }}>
              Essayez un autre terme de recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiChevronDown, FiStar } from "react-icons/fi";
import { PiShoppingCartSimple, PiStorefront } from "react-icons/pi";
import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useApi } from "../context/ApiContext";

const SORT_OPTIONS = [
  { value: "pertinence", label: "Pertinence" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
  { value: "recent", label: "Plus récents" },
];

const FILTER_CATEGORIES = ["Électronique", "Maison & Jardin", "Mode", "Beauté"];

export default function SearchResultsPage() {
  const { getProducts, addToCart } = useApi();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [sort, setSort] = useState("pertinence");
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState({});
  const PER_PAGE = 8;

  // Reset page when query changes
  useEffect(() => { setPage(1); }, [query]);

  const allResults = getProducts({
    query,
    category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
    minPrice: priceRange[0],
    maxPrice: priceRange[1] === 500 ? undefined : priceRange[1],
    minRating: minRating || undefined,
    sort,
  });

  const totalPages = Math.ceil(allResults.length / PER_PAGE);
  const results = allResults.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex gap-6">

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-5">
            {/* Categories */}
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                CATÉGORIES
              </p>
              <ul className="space-y-3">
                {FILTER_CATEGORIES.map((cat) => (
                  <li key={cat} className="flex items-center gap-2.5 cursor-pointer group" onClick={() => toggleCategory(cat)}>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                      style={{
                        border: `1.5px solid ${selectedCategories.includes(cat) ? "var(--color-equator-green)" : "#ccc"}`,
                        background: selectedCategories.includes(cat) ? "var(--color-equator-green)" : "white",
                      }}
                    >
                      {selectedCategories.includes(cat) && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{cat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price range */}
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                PRIX
              </p>
              <div className="space-y-3">
                <input
                  type="range"
                  min={0}
                  max={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-green-800"
                  style={{ accentColor: "var(--color-equator-green)" }}
                />
                <div className="flex justify-between text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  <span>{priceRange[0]}€</span>
                  <span>{priceRange[1] === 500 ? "500€+" : `${priceRange[1]}€`}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                ÉVALUATION
              </p>
              <button
                onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
                className="flex items-center gap-2"
              >
                <StarRating rating={4} size={16} />
                <span className="text-xs" style={{ color: "var(--color-equator-muted)" }}>& plus</span>
              </button>
            </div>
          </aside>

          {/* ── Main results ─────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                  Résultats
                  {query && (
                    <span className="text-base ml-2 font-normal" style={{ color: "var(--color-equator-muted)" }}>
                      pour « {query} »
                    </span>
                  )}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-equator-muted)" }}>
                  ({allResults.length} articles)
                </p>
              </div>

              {/* Sort */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-colors hover:bg-stone-100"
                  style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)", border: "1px solid var(--color-equator-beige)", background: "white" }}
                >
                  <span className="text-xs" style={{ color: "var(--color-equator-muted)" }}>Trier par:</span>
                  <span className="font-medium">{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
                  <FiChevronDown size={14} className={`transition-transform ${sortOpen ? "rotate-180" : ""}`} />
                </button>
                {sortOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 rounded-lg z-20 overflow-hidden min-w-[160px]"
                    style={{ background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSort(opt.value); setSortOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
                        style={{
                          fontFamily: "var(--font-body)",
                          color: sort === opt.value ? "var(--color-equator-green)" : "var(--color-equator-text)",
                          fontWeight: sort === opt.value ? "600" : "400",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Grid */}
            {results.length === 0 ? (
              <div className="text-center py-24">
                <FiSearch size={36} className="mx-auto mb-4" style={{ color: "var(--color-equator-beige)" }} />
                <p className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
                  Aucun résultat trouvé
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--color-equator-muted)" }}>
                  Essayez un autre terme ou élargissez vos filtres.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {results.map((product) => (
                  <SearchProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product)}
                    added={added[product.id]}
                  />
                ))}
              </div>
            )}

            <Pagination current={page} total={totalPages} onChange={setPage} />
          </div>
        </div>
      </div>

      <Footer variant="search" />
    </div>
  );
}

// ── SearchProductCard ─────────────────────────────────────────────────────────
function SearchProductCard({ product, onAddToCart, added }) {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--color-equator-beige)", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#f5f0e8" }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        {product.badge && (
          <span
            className="absolute top-2.5 left-2.5 text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: product.badge.startsWith("-") ? "#dc2626" : "var(--color-equator-green)",
              color: "white",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              letterSpacing: "0.05em",
            }}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} size={11} />
          <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <Link to={`/product/${product.id}`}>
          <p className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            {product.name}…
          </p>
        </Link>

        <p className="text-base font-bold mt-auto" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
          {product.price.toFixed(2).replace(".", ",")} €
        </p>

        <button
          onClick={onAddToCart}
          className="w-full py-2 rounded-lg text-xs font-medium text-white transition-all mt-1"
          style={{
            background: added ? "#16a34a" : "var(--color-equator-green)",
            fontFamily: "var(--font-body)",
          }}
        >
          {added ? "✓ Ajouté" : "Ajouter au panier"}
        </button>

        <Link
          to={`/stores/${product.storeSlug}`}
          className="w-full py-1.5 rounded-lg text-xs font-medium text-center transition-all"
          style={{
            border: "1px solid var(--color-equator-beige)",
            color: "var(--color-equator-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          Visiter le shop
        </Link>
      </div>
    </div>
  );
}
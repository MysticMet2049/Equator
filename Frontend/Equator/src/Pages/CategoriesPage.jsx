import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiChevronRight, FiChevronDown, FiHeart, FiShoppingCart } from "react-icons/fi";
import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useApi } from "../context/ApiContext";

const SORT_OPTIONS = [
  { value: "recent", label: "Plus récents" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "rating", label: "Mieux notés" },
];

// ── Category Listing (no slug) ────────────────────────────────────────────────
function CategoryListing() {
  const { categories, getProducts } = useApi();

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-light mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
          Catégories
        </h1>
        <p className="text-sm mb-10" style={{ color: "var(--color-equator-muted)" }}>
          Explorez notre sélection par univers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {categories.map((cat) => {
            const count = getProducts({ category: cat.name }).length;
            return (
              <Link
                key={cat.id}
                to={`/categories/${cat.slug}`}
                className="relative overflow-hidden rounded-2xl group"
                style={{ height: "200px" }}
              >
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-xs font-medium tracking-widest mb-1 opacity-80" style={{ fontFamily: "var(--font-body)" }}>{cat.description}</p>
                  <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)" }}>{cat.name}</h2>
                  <p className="text-xs mt-1 opacity-70">{count} produits</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <FiChevronRight size={16} color="white" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ── Category Detail (with slug) ───────────────────────────────────────────────
function CategoryDetail({ slug }) {
  const { getCategoryBySlug, getProducts, addToCart, toggleWishlist, isInWishlist } = useApi();
  const category = getCategoryBySlug(slug);

  const [selectedSub, setSelectedSub] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [stockOnly, setStockOnly] = useState(false);
  const [sort, setSort] = useState("recent");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [added, setAdded] = useState({});
  const PER_PAGE = 8;

  if (!category) {
    return (
      <div className="min-h-screen pt-14 flex items-center justify-center" style={{ background: "var(--color-equator-cream)" }}>
        <p style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>Catégorie introuvable.</p>
      </div>
    );
  }

  const allProducts = getProducts({
    category: category.name,
    subcategory: selectedSub || undefined,
    minPrice: priceRange.min ? Number(priceRange.min) : undefined,
    maxPrice: priceRange.max ? Number(priceRange.max) : undefined,
    sort,
  });

  const totalPages = Math.ceil(allProducts.length / PER_PAGE);
  const products = allProducts.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAdd = (product) => {
    addToCart(product);
    setAdded((p) => ({ ...p, [product.id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [product.id]: false })), 1400);
  };

  const clearFilters = () => {
    setSelectedSub(null);
    setPriceRange({ min: "", max: "" });
    setStockOnly(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          <Link to="/" className="hover:underline">Accueil</Link>
          <FiChevronRight size={12} />
          <Link to="/categories" className="hover:underline">Catégories</Link>
          <FiChevronRight size={12} />
          <span style={{ color: "var(--color-equator-text)" }}>{category.name}</span>
        </nav>
      </div>

      {/* ── Hero banner ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl" style={{ height: "160px" }}>
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.45)" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-8 text-white">
            <p className="text-xs font-medium tracking-widest mb-2 opacity-80">{category.description}</p>
            <h1 className="text-2xl font-light mb-1" style={{ fontFamily: "var(--font-display)" }}>Catégorie {category.name}</h1>
            <p className="text-xs leading-relaxed max-w-md opacity-80">{category.longDesc}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 flex gap-6">
        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="bg-white rounded-xl p-5 space-y-6 sticky top-20" style={{ border: "1px solid var(--color-equator-beige)" }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                Filtres
              </p>
              <button onClick={clearFilters} className="text-xs" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                ✕
              </button>
            </div>

            {/* Subcategories */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Sous-catégories</p>
              <ul className="space-y-2">
                {category.subcategories.map((sub) => (
                  <li key={sub}>
                    <button
                      onClick={() => { setSelectedSub(selectedSub === sub ? null : sub); setPage(1); }}
                      className="flex items-center gap-2 w-full text-left"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-sm border transition-all shrink-0"
                        style={{
                          border: `1.5px solid ${selectedSub === sub ? "var(--color-equator-green)" : "#ccc"}`,
                          background: selectedSub === sub ? "var(--color-equator-green)" : "white",
                        }}
                      />
                      <span className="text-xs" style={{ color: selectedSub === sub ? "var(--color-equator-text)" : "var(--color-equator-muted)", fontFamily: "var(--font-body)", fontWeight: selectedSub === sub ? "500" : "400" }}>
                        {sub}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Gamme de prix</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min €"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
                  className="w-full px-2 py-1.5 text-xs rounded outline-none"
                  style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)" }}
                />
                <input
                  type="number"
                  placeholder="Max €"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
                  className="w-full px-2 py-1.5 text-xs rounded outline-none"
                  style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)" }}
                />
              </div>
            </div>

            {/* Stock */}
            <div>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Disponibilité</p>
              <button className="flex items-center gap-2" onClick={() => setStockOnly(!stockOnly)}>
                <div
                  className="w-3.5 h-3.5 rounded-sm border transition-all shrink-0"
                  style={{ border: `1.5px solid ${stockOnly ? "var(--color-equator-green)" : "#ccc"}`, background: stockOnly ? "var(--color-equator-green)" : "white" }}
                />
                <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>En stock uniquement</span>
              </button>
            </div>

            <button
              onClick={clearFilters}
              className="w-full text-xs py-2 rounded-lg transition-colors hover:bg-stone-100"
              style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
            >
              EFFACER LES FILTRES
            </button>
          </div>
        </aside>

        {/* ── Products grid ── */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              {allProducts.length} produits trouvés
            </p>
            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-white"
                style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)", color: "var(--color-equator-text)" }}
              >
                Trier par:
                <span className="font-medium">{SORT_OPTIONS.find((o) => o.value === sort)?.label}</span>
                <FiChevronDown size={12} className={sortOpen ? "rotate-180" : ""} />
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 rounded-lg z-20 overflow-hidden min-w-[150px]" style={{ background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}>
                  {SORT_OPTIONS.map((opt) => (
                    <button key={opt.value} onClick={() => { setSort(opt.value); setSortOpen(false); }} className="w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-stone-50" style={{ fontFamily: "var(--font-body)", color: sort === opt.value ? "var(--color-equator-green)" : "var(--color-equator-text)", fontWeight: sort === opt.value ? "600" : "400" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
                Aucun produit dans cette catégorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <CategoryProductCard
                  key={product.id}
                  product={product}
                  onAdd={() => handleAdd(product)}
                  added={added[product.id]}
                  onWishlist={() => toggleWishlist(product.id)}
                  wishlisted={isInWishlist(product.id)}
                />
              ))}
            </div>
          )}

          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      <Footer />
    </div>
  );
}

// ── CategoryProductCard ───────────────────────────────────────────────────────
function CategoryProductCard({ product, onAdd, added, onWishlist, wishlisted }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col" style={{ border: "1px solid var(--color-equator-beige)" }}>
      <Link to={`/product/${product.id}`} className="relative block overflow-hidden" style={{ aspectRatio: "4/3", background: "#f0ebe3" }}>
        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(); }}
          className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
        >
          <FiHeart size={13} style={{ color: wishlisted ? "#dc2626" : "var(--color-equator-muted)", fill: wishlisted ? "#dc2626" : "none" }} />
        </button>
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full text-white"
            style={{ background: product.badge === "Nouveau" || product.badge === "NOUVEAU" || product.badge === "Nouveauté" ? "var(--color-equator-green)" : "var(--color-equator-green-dark)", fontFamily: "var(--font-body)", fontSize: "10px" }}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#e8f5ee", color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
            {product.subcategory}
          </span>
          <div className="flex items-center gap-1">
            <StarRating rating={product.rating} size={11} />
            <span className="text-xs font-medium" style={{ color: "var(--color-equator-muted)" }}>{product.rating}</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <p className="text-sm font-medium leading-snug" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            {product.name}
          </p>
        </Link>

        <p className="text-base font-semibold" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
          {product.price.toFixed(2).replace(".", ",")} €
        </p>

        <button
          onClick={onAdd}
          className="w-full mt-2 py-2.5 rounded-lg text-xs font-medium text-white flex items-center justify-center gap-1.5 transition-all"
          style={{ background: added ? "#16a34a" : "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
        >
          <FiShoppingCart size={12} />
          {added ? "Ajouté !" : "Ajouter au panier"}
        </button>
      </div>
    </div>
  );
}

// ── Main export — routes to listing or detail ─────────────────────────────────
export default function CategoriesPage() {
  const { slug } = useParams();
  return slug ? <CategoryDetail slug={slug} /> : <CategoryListing />;
}
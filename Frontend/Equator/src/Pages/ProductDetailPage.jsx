import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiZap, FiShield, FiPackage } from "react-icons/fi";
import { PiGlobe, PiEnvelope } from "react-icons/pi";
import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";
import { useApi } from "../context/ApiContext";

const STORE_CATEGORIES = ["Électronique", "Mode & Luxe", "Maison & Design", "Artisanat"];

const FILTER_OPTIONS = [
  { id: "express", label: "Livraison Express" },
  { id: "certified", label: "Vendeurs Certifiés" },
  { id: "new", label: "Nouveautés" },
];

export default function StoresPage() {
  const { getStores } = useApi();
  const [activeCategory, setActiveCategory] = useState("Électronique");
  const [activeFilters, setActiveFilters] = useState([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const toggleFilter = (id) => {
    setActiveFilters((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const allStores = getStores();
  const totalPages = Math.ceil(allStores.length / PER_PAGE);
  const stores = allStores.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex gap-6">

        {/* ── Sidebar ─────────────────────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-56 shrink-0 gap-4">
          {/* Category nav */}
          <div>
            <p className="text-xs font-bold tracking-widest mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              CATÉGORIES DE BOUTIQUE
            </p>
            <nav className="space-y-0.5">
              {STORE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-left transition-all"
                  style={{
                    background: activeCategory === cat ? "var(--color-equator-beige)" : "transparent",
                    color: activeCategory === cat ? "var(--color-equator-text)" : "var(--color-equator-muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: activeCategory === cat ? "500" : "400",
                  }}
                >
                  {cat}
                  {activeCategory === cat && <FiArrowRight size={13} />}
                </button>
              ))}
            </nav>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
            <p className="text-sm font-semibold mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              Filtrer les Stores
            </p>
            <ul className="space-y-3">
              {FILTER_OPTIONS.map(({ id, label }) => (
                <li key={id} className="flex items-center gap-2.5 cursor-pointer" onClick={() => toggleFilter(id)}>
                  <div
                    className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                    style={{
                      border: `1.5px solid ${activeFilters.includes(id) ? "var(--color-equator-green)" : "#ccc"}`,
                      background: activeFilters.includes(id) ? "var(--color-equator-green)" : "white",
                    }}
                  >
                    {activeFilters.includes(id) && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Sell */}
          <div className="rounded-xl p-5 text-white" style={{ background: "var(--color-equator-green-dark)" }}>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>Vendez sur Equator</p>
            <p className="text-xs leading-relaxed mb-4 opacity-80" style={{ fontFamily: "var(--font-body)" }}>
              Rejoignez des milliers de marchands et développez votre activité dès aujourd'hui.
            </p>
            <Link
              to="/sell"
              className="block text-center text-xs font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: "white", color: "var(--color-equator-green-dark)", fontFamily: "var(--font-body)" }}
            >
              Ouvrir ma boutique
            </Link>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                Stores
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                Découvrez les meilleures boutiques sélectionnées pour vous.
              </p>
            </div>
            <p className="text-xs self-end" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              Affichage de 1-{Math.min(PER_PAGE, stores.length)} sur {allStores.length} boutiques
            </p>
          </div>

          {/* Store cards */}
          <div className="space-y-4">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>

          <Pagination current={page} total={totalPages} onChange={setPage} />
        </div>
      </div>

      <Footer variant="stores" />
    </div>
  );
}

// ── StoreCard ─────────────────────────────────────────────────────────────────
function StoreCard({ store }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row"
      style={{ border: "1px solid var(--color-equator-beige)", transition: "box-shadow 0.2s" }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      {/* Image */}
      <div className="relative overflow-hidden shrink-0" style={{ width: "clamp(200px, 30%, 280px)", minHeight: "180px" }}>
        <img src={store.image} alt={store.name} className="w-full h-full object-cover" style={{ minHeight: "180px" }} />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between p-5 flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              {store.name}
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
              style={{ background: store.badgeColor, fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}
            >
              {store.badge}
            </span>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {store.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <StarRating rating={store.rating} size={13} />
            <span className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              {store.rating}
            </span>
            <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              ({store.reviewCount} avis)
            </span>
          </div>

          {store.badge2 && (
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#e8f5ee" }}>
                <FiShield size={10} style={{ color: "var(--color-equator-green)" }} />
              </div>
              <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                {store.badge2}
              </span>
            </div>
          )}
        </div>

        {/* Avatars + CTA */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center">
            {store.avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-7 h-7 rounded-full object-cover"
                style={{ border: "2px solid white", marginLeft: i > 0 ? "-8px" : "0" }}
              />
            ))}
            <span className="text-xs ml-2" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              +{store.productCount}
            </span>
          </div>

          <Link
            to={`/stores/${store.slug}`}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
          >
            Visiter le store <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
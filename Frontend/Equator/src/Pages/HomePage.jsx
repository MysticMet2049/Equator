import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { PiLeaf, PiSealCheck, PiTruck } from "react-icons/pi";
import HeroCarousel from "../components/HeroCarousel";
import ProductCard from "../components/ProductCard";
import { useApi } from "../../context/ApiContext";

// ─── Trust badges ─────────────────────────────────────────────────────────────
const TRUST = [
  {
    Icon: PiLeaf,
    title: "Éco-responsable",
    desc: "Produits sélectionnés pour leur faible impact environnemental.",
  },
  {
    Icon: PiSealCheck,
    title: "Qualité Certifiée",
    desc: "Nous vérifions chaque créateur pour garantir l'excellence.",
  },
  {
    Icon: PiTruck,
    title: "Livraison Zéro Carbone",
    desc: "Expédition compensée et emballages 100% recyclables.",
  },
];

export default function HomePage() {
  const { featuredProducts, partnerStores } = useApi();

  return (
    <div>
      {/* Hero */}
      <HeroCarousel />

      {/* ─── Featured Products ──────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        {/* Section header */}
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
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
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

        {/* Product grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile "tout voir" */}
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

      {/* ─── Partner Stores ─────────────────────────────────────────────── */}
      <section
        className="py-14"
        style={{ background: "#f0ebe3" }}
      >
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {partnerStores.map((store) => (
              <div
                key={store.id}
                className="store-card relative overflow-hidden rounded-xl cursor-pointer"
                style={{ height: "260px" }}
              >
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.12) 60%, transparent 100%)",
                  }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3
                    className="text-lg font-light mb-1.5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {store.name}
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
                    {store.description}
                  </p>
                  <Link
                    to={`/stores/${store.slug}`}
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust Badges ───────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {TRUST.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ background: "var(--color-equator-beige)" }}
              >
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
                className="text-xs leading-relaxed max-w-[200px]"
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

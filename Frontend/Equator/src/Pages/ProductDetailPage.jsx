import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FiHeart, FiShare2, FiShield, FiTruck, FiChevronLeft, FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";
import { PiStarFill } from "react-icons/pi";
import StarRating from "../components/StarRating";
import Footer from "../components/Footer";
import { useApi } from "../context/ApiContext";

const TABS = ["Avis Clients", "Spécifications", "Livraison & Retours"];

export default function ProductDetailPage() {
  const { id } = useParams();
  const { getProductById, getSimilarProducts, addToCart, toggleWishlist, isInWishlist } = useApi();
  const navigate = useNavigate();

  const product = getProductById(id);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4" style={{ background: "var(--color-equator-cream)" }}>
        <p className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
          Produit introuvable.
        </p>
        <button onClick={() => navigate(-1)} className="text-sm" style={{ color: "var(--color-equator-green)" }}>
          ← Retour
        </button>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [product.image];
  const similar = getSimilarProducts(product, 4);
  const wishlisted = isInWishlist(product.id);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Rating breakdown total
  const totalReviews = Object.values(product.ratingBreakdown || {}).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>

      {/* ── Product hero ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left — gallery */}
          <div className="flex gap-3 flex-1">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-col gap-2 w-14 shrink-0">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className="rounded-lg overflow-hidden transition-all"
                    style={{
                      aspectRatio: "1/1",
                      border: `2px solid ${i === activeImg ? "var(--color-equator-green)" : "var(--color-equator-beige)"}`,
                      background: "#f0ebe3",
                    }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="flex-1 relative">
              <div
                className="rounded-2xl overflow-hidden relative bg-white"
                style={{ aspectRatio: "1/1", border: "1px solid var(--color-equator-beige)" }}
              >
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}
                    >
                      <FiChevronLeft size={14} />
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i + 1) % images.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}
                    >
                      <FiChevronRight size={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Dots */}
              {images.length > 1 && (
                <div className="flex justify-center gap-1.5 mt-3">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className="rounded-full transition-all"
                      style={{ width: i === activeImg ? "18px" : "6px", height: "6px", background: i === activeImg ? "var(--color-equator-green)" : "#ccc" }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right — details */}
          <div className="lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
            {/* Badge + actions */}
            <div className="flex items-center justify-between">
              {product.isLimited ? (
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "#e8f5ee", color: "var(--color-equator-green)", fontFamily: "var(--font-body)", letterSpacing: "0.08em" }}
                >
                  ÉDITION LIMITÉE
                </span>
              ) : <div />}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-stone-100"
                  style={{ border: "1px solid var(--color-equator-beige)", background: "white" }}
                >
                  <FiHeart size={15} style={{ color: wishlisted ? "#dc2626" : "var(--color-equator-muted)", fill: wishlisted ? "#dc2626" : "none" }} />
                </button>
                <button
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-stone-100"
                  style={{ border: "1px solid var(--color-equator-beige)", background: "white" }}
                >
                  <FiShare2 size={15} style={{ color: "var(--color-equator-muted)" }} />
                </button>
              </div>
            </div>

            {/* Store */}
            <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              {product.store}
            </p>

            {/* Name */}
            <h1 className="text-2xl font-light leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              {product.name}
            </h1>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              {product.description}
            </p>

            {/* Price box */}
            <div
              className="rounded-xl p-4"
              style={{ background: "white", border: "1px solid var(--color-equator-beige)" }}
            >
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-bold" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                  {product.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through" style={{ color: "#9ca3af", fontFamily: "var(--font-body)" }}>
                    {product.originalPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                  </span>
                )}
              </div>

              {/* Quantity */}
              <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                QUANTITÉ
              </p>
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
                  style={{ border: "1px solid var(--color-equator-beige)" }}
                >
                  <FiMinus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
                  style={{ border: "1px solid var(--color-equator-beige)" }}
                >
                  <FiPlus size={13} />
                </button>
              </div>

              {/* CTAs */}
              <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all mb-2"
                style={{ background: added ? "#16a34a" : "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
              >
                <FiTruck size={15} />
                {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
              </button>

              <Link
                to={`/stores/${product.storeSlug}`}
                className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-stone-50"
                style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
              >
                <PiStorefront size={15} />
                Visiter le store
              </Link>

              {/* Guarantees */}
              <div className="mt-4 space-y-2">
                {[
                  { icon: FiShield, text: product.warranty },
                  { icon: FiTruck, text: product.delivery },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={13} style={{ color: "var(--color-equator-green)" }} />
                    <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10">
        {/* Tab bar */}
        <div className="flex border-b mb-8" style={{ borderColor: "var(--color-equator-beige)" }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-5 py-3 text-sm font-medium transition-all"
              style={{
                color: activeTab === i ? "var(--color-equator-text)" : "var(--color-equator-muted)",
                borderBottom: activeTab === i ? "2px solid var(--color-equator-green)" : "2px solid transparent",
                marginBottom: "-1px",
                fontFamily: "var(--font-body)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 0 && (
          <ReviewsTab product={product} totalReviews={totalReviews} />
        )}
        {activeTab === 1 && (
          <SpecsTab specs={product.specs} />
        )}
        {activeTab === 2 && (
          <DeliveryTab />
        )}
      </div>

      {/* ── Similar products ─────────────────────────────────────────── */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                INSPIRATION
              </p>
              <p className="text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>Produit similaire</p>
            </div>
            <div className="flex gap-2">
              {[FiChevronLeft, FiChevronRight].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
                  style={{ border: "1px solid var(--color-equator-beige)", background: "white" }}
                >
                  <Icon size={14} style={{ color: "var(--color-equator-text)" }} />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "1/1", background: "#f0ebe3" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{p.name}</p>
                <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                  {p.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer variant="product" />
    </div>
  );
}

// ── Reviews tab ───────────────────────────────────────────────────────────────
function ReviewsTab({ product, totalReviews }) {
  const breakdown = product.ratingBreakdown || {};

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left — aggregate */}
      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--color-equator-beige)" }}>
        <p className="text-5xl font-bold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
          {product.rating}
        </p>
        <StarRating rating={product.rating} size={18} />
        <p className="text-xs mt-2 mb-6" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          Basé sur {product.reviewCount} avis vérifiés
        </p>

        {/* Bars */}
        <div className="space-y-2">
          {[5, 4, 3].map((star) => {
            const count = breakdown[star] || 0;
            const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs w-4" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{star}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-equator-beige)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--color-equator-green)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right — reviews list */}
      <div className="space-y-4">
        {(product.reviews?.length ? product.reviews : [
          { id: 99, name: "Client satisfait", avatar: "CS", date: "il y a 3 jours", rating: 5, text: "Excellent produit, conforme à la description. Je recommande vivement Equator pour la qualité de service." }
        ]).map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
                >
                  {review.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{review.name}</p>
                  <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                    Acheteur vérifié · {review.date}
                  </p>
                </div>
              </div>
              <StarRating rating={review.rating} size={12} />
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              "{review.text}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Specs tab ─────────────────────────────────────────────────────────────────
function SpecsTab({ specs }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)", maxWidth: "500px" }}>
      {Object.entries(specs || {}).map(([key, value], i) => (
        <div
          key={key}
          className="flex items-center px-5 py-3"
          style={{ borderBottom: i < Object.entries(specs).length - 1 ? "1px solid var(--color-equator-beige)" : "none" }}
        >
          <span className="w-1/2 text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{key}</span>
          <span className="w-1/2 text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Delivery tab ──────────────────────────────────────────────────────────────
function DeliveryTab() {
  return (
    <div className="max-w-lg space-y-4">
      {[
        { title: "Livraison Express", desc: "Commandez avant 14h pour recevoir votre colis dès le lendemain ouvré. Suivi en temps réel inclus." },
        { title: "Livraison Standard", desc: "3 à 5 jours ouvrés. Offerte à partir de 50 € d'achat." },
        { title: "Retours & Remboursements", desc: "30 jours pour changer d'avis. Retour gratuit, remboursement sous 5 jours ouvrés." },
      ].map(({ title, desc }) => (
        <div key={title} className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{title}</p>
          <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{desc}</p>
        </div>
      ))}
    </div>
  );
}
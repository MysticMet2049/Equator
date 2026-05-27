import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  FiArrowLeft, FiShare2, FiHeart, FiPhone, FiMail,
  FiMapPin, FiStar, FiPackage, FiCheck, FiMessageCircle,
  FiChevronDown, FiChevronUp,
} from "react-icons/fi";
import { PiWhatsappLogo } from "react-icons/pi";
import StarRating from "../components/StarRating";
import ProductCard from "../components/ProductCard";
import RequireAuthButton from "../components/RequireAuthButton";
import Footer from "../components/Footer";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";

// ── Extended store mock data ──────────────────────────────────────────────────
const STORE_DETAILS = {
  "artisan-parisien": {
    slug: "artisan-parisien",
    name: "L'Artisan Parisien",
    tagline: "Maroquinerie d'exception, façonnée à la main",
    description: "Maison de maroquinerie d'exception utilisant des techniques ancestrales. Chaque pièce est unique, fabriquée à la main dans notre atelier historique du Marais avec les cuirs les plus fins sourcés localement. Depuis 1987, nous perpétuons un savoir-faire transmis de génération en génération.",
    category: "Artisanat",
    badge: "LUXE",
    badgeColor: "#1b4332",
    location: "Paris, France",
    rating: 4.9,
    reviewCount: 128,
    productCount: 12,
    since: "2018",
    banner: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=1200&q=80",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    badges: ["Expédition sous 24h", "Vendeur certifié", "Retours gratuits"],
    contact: {
      phone: "+33612345678",
      email: "contact@artisan-parisien.fr",
      whatsapp: "+33612345678",
    },
    reviews: [
      { id: 1, name: "Sophie M.", avatar: "SM", rating: 5, date: "il y a 3 jours", text: "Qualité absolument exceptionnelle. Mon sac est une véritable œuvre d'art. Je recommande vivement cette maison." },
      { id: 2, name: "Pierre D.", avatar: "PD", rating: 5, date: "il y a 1 semaine", text: "Service irréprochable et produits qui dépassent les attentes. La maroquinerie est d'un niveau professionnel rare." },
      { id: 3, name: "Marie L.", avatar: "ML", rating: 4, date: "il y a 2 semaines", text: "Très beau travail artisanal. La livraison a été rapide et le packaging luxueux. Je reviendrai." },
    ],
    ratingBreakdown: { 5: 102, 4: 18, 3: 8 },
    followed: false,
  },
  "tech-horizon": {
    slug: "tech-horizon",
    name: "Tech Horizon",
    tagline: "L'innovation technologique à portée de main",
    description: "Votre destination privilégiée pour les dernières innovations technologiques et accessoires haut de gamme. Nous sélectionnons uniquement les produits offrant une performance supérieure et un design irréprochable.",
    category: "Électronique",
    badge: "ÉLECTRONIQUE",
    badgeColor: "#1a3a5c",
    location: "Lyon, France",
    rating: 4.7,
    reviewCount: 562,
    productCount: 45,
    since: "2019",
    banner: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    avatar: null,
    badges: ["Garantie 2 ans", "Support 24/7", "Livraison express"],
    contact: {
      phone: "+33698765432",
      email: "support@tech-horizon.fr",
      whatsapp: "+33698765432",
    },
    reviews: [
      { id: 1, name: "Alex R.", avatar: "AR", rating: 5, date: "il y a 1 jour", text: "Produits conformes à la description, livraison ultra rapide. Je suis client régulier et toujours satisfait." },
      { id: 2, name: "Camille B.", avatar: "CB", rating: 4, date: "il y a 5 jours", text: "Bonne sélection de produits tech. Un peu cher mais la qualité est au rendez-vous." },
    ],
    ratingBreakdown: { 5: 410, 4: 105, 3: 47 },
    followed: false,
  },
  "echo-durable": {
    slug: "echo-durable",
    name: "Écho Durable",
    tagline: "L'intérieur éco-conscient que vous méritez",
    description: "Décoration et mobilier éco-conçus pour un intérieur sain et serein. Nous privilégions les matériaux naturels, recyclés et une production locale pour réduire notre empreinte carbone tout en sublimant votre espace.",
    category: "Maison & Design",
    badge: "MAISON",
    badgeColor: "#2d4a3e",
    location: "Bordeaux, France",
    rating: 4.8,
    reviewCount: 89,
    productCount: 28,
    since: "2020",
    banner: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80",
    avatar: null,
    badges: ["Eco-Responsable", "Matériaux naturels", "Production locale"],
    contact: {
      phone: null,
      email: "bonjour@echodurable.fr",
      whatsapp: "+33655443322",
    },
    reviews: [
      { id: 1, name: "Julien F.", avatar: "JF", rating: 5, date: "il y a 4 jours", text: "Magnifique mobilier, entièrement conforme aux valeurs éco-responsables annoncées. Très fier de mon achat." },
    ],
    ratingBreakdown: { 5: 70, 4: 14, 3: 5 },
    followed: false,
  },
};

const TABS = ["Produits", "Avis clients", "Informations"];

export default function StoreDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProducts } = useApi();
  const { isAuthenticated } = useAuth();

  const store = STORE_DETAILS[slug];

  const [activeTab, setActiveTab] = useState(0);
  const [followed, setFollowed] = useState(store?.followed || false);
  const [shared, setShared] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showAllDesc, setShowAllDesc] = useState(false);

  if (!store) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4" style={{ background: "var(--color-equator-cream)" }}>
        <p className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
          Boutique introuvable.
        </p>
        <button onClick={() => navigate("/stores")} className="text-sm" style={{ color: "var(--color-equator-green)" }}>
          ← Retour aux stores
        </button>
      </div>
    );
  }

  const products = getProducts({ storeSlug: slug });
  const totalReviews = Object.values(store.ratingBreakdown).reduce((a, b) => a + b, 0);

  // Share handler
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: store.name, text: store.tagline, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url).catch(() => {});
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  // WhatsApp link
  const whatsappMsg = encodeURIComponent(`Bonjour, je suis intéressé(e) par vos produits sur Equator Marketplace. Pouvez-vous m'en dire plus ?`);
  const whatsappUrl = store.contact.whatsapp
    ? `https://wa.me/${store.contact.whatsapp.replace(/\D/g, "")}?text=${whatsappMsg}`
    : null;

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>

      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ height: "220px" }}>
        <img src={store.banner} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)" }} />

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-sm font-medium text-white px-3 py-1.5 rounded-full transition-all"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          <FiArrowLeft size={14} /> Retour
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="absolute top-4 right-4 flex items-center gap-1.5 text-sm font-medium text-white px-3 py-1.5 rounded-full transition-all"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.3)" }}
        >
          {shared ? <FiCheck size={14} /> : <FiShare2 size={14} />}
          {shared ? "Copié !" : "Partager"}
        </button>
      </div>

      {/* ── Store header card ────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl -mt-10 relative z-10 p-6" style={{ border: "1px solid var(--color-equator-beige)", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
              style={{ background: store.badgeColor, fontFamily: "var(--font-display)" }}
            >
              {store.name.charAt(0)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                  {store.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white" style={{ background: store.badgeColor, fontFamily: "var(--font-body)" }}>
                  {store.badge}
                </span>
              </div>
              <p className="text-sm mb-2" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                {store.tagline}
              </p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                <span className="flex items-center gap-1">
                  <StarRating rating={store.rating} size={11} />
                  <strong style={{ color: "var(--color-equator-text)" }}>{store.rating}</strong>
                  ({store.reviewCount} avis)
                </span>
                <span className="flex items-center gap-1">
                  <FiPackage size={11} /> {store.productCount} produits
                </span>
                <span className="flex items-center gap-1">
                  <FiMapPin size={11} /> {store.location}
                </span>
                <span>Membre depuis {store.since}</span>
              </div>

              {/* Badge pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {store.badges.map((b) => (
                  <span key={b} className="text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1" style={{ background: "#e8f5ee", color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                    <FiCheck size={10} /> {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <RequireAuthButton
                onClick={() => setFollowed(!followed)}
                message="Connectez-vous pour suivre cette boutique et rester informé de ses nouveautés."
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
                style={{
                  background: followed ? "var(--color-equator-green)" : "white",
                  color: followed ? "white" : "var(--color-equator-text)",
                  border: `1.5px solid ${followed ? "var(--color-equator-green)" : "var(--color-equator-beige)"}`,
                  fontFamily: "var(--font-body)",
                }}
              >
                <FiHeart size={14} style={{ fill: followed ? "white" : "none" }} />
                {followed ? "Suivi" : "Suivre"}
              </RequireAuthButton>

              <button
                onClick={() => setContactOpen(!contactOpen)}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
              >
                <FiMessageCircle size={14} />
                Contacter
                {contactOpen ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
              </button>
            </div>
          </div>

          {/* Contact dropdown */}
          {contactOpen && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--color-equator-beige)" }}>
              <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                CONTACTER LE VENDEUR
              </p>
              <div className="flex flex-wrap gap-2">
                {store.contact.whatsapp && (
                  <RequireAuthButton
                    as="a"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    message="Connectez-vous pour contacter le vendeur via WhatsApp."
                    onClick={(e) => { if (!isAuthenticated) e.preventDefault(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ background: "#25d366", fontFamily: "var(--font-body)" }}
                  >
                    <PiWhatsappLogo size={16} /> WhatsApp
                  </RequireAuthButton>
                )}
                {store.contact.email && (
                  <RequireAuthButton
                    as="a"
                    href={`mailto:${store.contact.email}`}
                    message="Connectez-vous pour contacter le vendeur par email."
                    onClick={(e) => { if (!isAuthenticated) e.preventDefault(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-stone-100"
                    style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
                  >
                    <FiMail size={14} /> {store.contact.email}
                  </RequireAuthButton>
                )}
                {store.contact.phone && (
                  <RequireAuthButton
                    as="a"
                    href={`tel:${store.contact.phone}`}
                    message="Connectez-vous pour appeler le vendeur."
                    onClick={(e) => { if (!isAuthenticated) e.preventDefault(); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors hover:bg-stone-100"
                    style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
                  >
                    <FiPhone size={14} /> {store.contact.phone}
                  </RequireAuthButton>
                )}
                {!store.contact.phone && !store.contact.email && !store.contact.whatsapp && (
                  <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucun contact disponible pour cette boutique.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className="flex border-b my-6" style={{ borderColor: "var(--color-equator-beige)" }}>
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
              {i === 0 && <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--color-equator-beige)", color: "var(--color-equator-muted)" }}>{products.length}</span>}
            </button>
          ))}
        </div>

        {/* ── Tab: Products ──────────────────────────────────────────────── */}
        {activeTab === 0 && (
          <div className="pb-12">
            {products.length === 0 ? (
              <div className="text-center py-20">
                <FiPackage size={36} className="mx-auto mb-3" style={{ color: "var(--color-equator-beige)" }} />
                <p className="text-lg font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
                  Aucun produit disponible.
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
        )}

        {/* ── Tab: Reviews ───────────────────────────────────────────────── */}
        {activeTab === 1 && (
          <div className="pb-12">
            {/* Not logged in prompt */}
            {!isAuthenticated && (
              <div className="bg-white rounded-2xl p-5 mb-6 flex items-center justify-between gap-4" style={{ border: "1px solid var(--color-equator-beige)" }}>
                <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  Connectez-vous pour laisser un avis sur cette boutique.
                </p>
                <Link to="/login" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white shrink-0" style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                  Se connecter
                </Link>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Aggregate */}
              <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--color-equator-beige)" }}>
                <p className="text-5xl font-bold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{store.rating}</p>
                <StarRating rating={store.rating} size={18} />
                <p className="text-xs mt-2 mb-5" style={{ color: "var(--color-equator-muted)" }}>Basé sur {store.reviewCount} avis vérifiés</p>
                <div className="space-y-2">
                  {[5, 4, 3].map((star) => {
                    const count = store.ratingBreakdown[star] || 0;
                    const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs w-3" style={{ color: "var(--color-equator-muted)" }}>{star}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-equator-beige)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--color-equator-green)" }} />
                        </div>
                        <span className="text-xs w-6 text-right" style={{ color: "var(--color-equator-muted)" }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews list */}
              <div className="space-y-3">
                {store.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-equator-green)" }}>
                          {review.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--color-equator-text)" }}>{review.name}</p>
                          <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size={11} />
                    </div>
                    <p className="text-sm leading-relaxed italic" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                      "{review.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Info ─────────────────────────────────────────────────── */}
        {activeTab === 2 && (
          <div className="pb-12 max-w-2xl">
            <div className="bg-white rounded-2xl p-6 space-y-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <div>
                <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>À PROPOS</p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                  {showAllDesc ? store.description : store.description.slice(0, 180) + (store.description.length > 180 ? "..." : "")}
                </p>
                {store.description.length > 180 && (
                  <button onClick={() => setShowAllDesc(!showAllDesc)} className="text-xs font-medium mt-1 flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                    {showAllDesc ? "Voir moins" : "Voir plus"} {showAllDesc ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />}
                  </button>
                )}
              </div>

              <div style={{ borderTop: "1px solid var(--color-equator-beige)", paddingTop: "1.25rem" }}>
                <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>INFORMATIONS</p>
                {[
                  { label: "Catégorie", value: store.category },
                  { label: "Localisation", value: store.location },
                  { label: "Membre depuis", value: store.since },
                  { label: "Nombre de produits", value: `${store.productCount} produits` },
                  { label: "Note moyenne", value: `${store.rating}/5 (${store.reviewCount} avis)` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2.5" style={{ borderBottom: "1px solid var(--color-equator-beige)" }}>
                    <span className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{value}</span>
                  </div>
                ))}
              </div>

              {/* Contact info */}
              <div style={{ borderTop: "1px solid var(--color-equator-beige)", paddingTop: "1.25rem" }}>
                <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>CONTACT</p>
                {!isAuthenticated ? (
                  <div className="p-3 rounded-xl text-sm" style={{ background: "var(--color-equator-beige)" }}>
                    <Link to="/login" className="font-medium" style={{ color: "var(--color-equator-green)" }}>Connectez-vous</Link>
                    <span style={{ color: "var(--color-equator-muted)" }}> pour voir les informations de contact du vendeur.</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {store.contact.email && (
                      <a href={`mailto:${store.contact.email}`} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                        <FiMail size={14} style={{ color: "var(--color-equator-green)" }} /> {store.contact.email}
                      </a>
                    )}
                    {store.contact.phone && (
                      <a href={`tel:${store.contact.phone}`} className="flex items-center gap-2 text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                        <FiPhone size={14} style={{ color: "var(--color-equator-green)" }} /> {store.contact.phone}
                      </a>
                    )}
                    {store.contact.whatsapp && (
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: "#25d366", fontFamily: "var(--font-body)" }}>
                        <PiWhatsappLogo size={14} /> WhatsApp
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer variant="stores" />
    </div>
  );
}
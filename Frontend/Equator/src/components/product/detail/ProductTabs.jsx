import StarRating from "../../common/StarRating";
import { PRODUCT_DETAIL_TABS } from "./productDetailUtils";

export default function ProductTabs({ product, activeTab, setActiveTab }) {
  const totalReviews = Object.values(product.ratingBreakdown || {}).reduce((a, b) => a + Number(b || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-10">
      <div className="flex border-b mb-8" style={{ borderColor: "var(--color-equator-beige)" }}>
        {PRODUCT_DETAIL_TABS.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className="px-5 py-3 text-sm font-medium transition-all"
            style={{
              color: activeTab === index ? "var(--color-equator-text)" : "var(--color-equator-muted)",
              borderBottom: activeTab === index ? "2px solid var(--color-equator-green)" : "2px solid transparent",
              marginBottom: "-1px",
              fontFamily: "var(--font-body)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <ReviewsTab product={product} totalReviews={totalReviews} />}
      {activeTab === 1 && <SpecsTab specs={product.specs} />}
      {activeTab === 2 && <DeliveryTab />}
    </div>
  );
}

function ReviewsTab({ product, totalReviews }) {
  const breakdown = product.ratingBreakdown || {};
  const reviews = product.reviews?.length
    ? product.reviews
    : [
        {
          id: 99,
          name: "Client satisfait",
          avatar: "CS",
          date: "il y a 3 jours",
          rating: 5,
          text: "Excellent produit, conforme à la description. Je recommande vivement Equator pour la qualité de service.",
        },
      ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--color-equator-beige)" }}>
        <p className="text-5xl font-bold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
          {product.rating}
        </p>

        <StarRating rating={product.rating} size={18} />

        <p className="text-xs mt-2 mb-6" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          Basé sur {product.reviewCount} avis vérifiés
        </p>

        <div className="space-y-2">
          {[5, 4, 3].map((star) => {
            const count = breakdown[star] || 0;
            const pct = totalReviews ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs w-4" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  {star}
                </span>

                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-equator-beige)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: "var(--color-equator-green)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
                >
                  {review.avatar || review.name?.charAt(0) || "U"}
                </div>

                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                    {review.name || "Utilisateur"}
                  </p>

                  <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                    Acheteur vérifié · {review.date || ""}
                  </p>
                </div>
              </div>

              <StarRating rating={review.rating || 0} size={12} />
            </div>

            <p className="text-sm leading-relaxed italic" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              "{review.text || ""}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SpecsTab({ specs }) {
  const entries = Object.entries(specs || {});

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)", maxWidth: "500px" }}>
      {entries.map(([key, value], index) => (
        <div
          key={key}
          className="flex items-center px-5 py-3"
          style={{ borderBottom: index < entries.length - 1 ? "1px solid var(--color-equator-beige)" : "none" }}
        >
          <span className="w-1/2 text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {key}
          </span>

          <span className="w-1/2 text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            {String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DeliveryTab() {
  const deliveryOptions = [
    {
      title: "Livraison Express",
      desc: "Commandez avant 14h pour recevoir votre colis dès le lendemain ouvré. Suivi en temps réel inclus.",
    },
    { title: "Livraison Standard", desc: "3 à 5 jours ouvrés. Offerte à partir de 50 € d'achat." },
    { title: "Retours & Remboursements", desc: "30 jours pour changer d'avis. Retour gratuit, remboursement sous 5 jours ouvrés." },
  ];

  return (
    <div className="max-w-lg space-y-4">
      {deliveryOptions.map(({ title, desc }) => (
        <div key={title} className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            {title}
          </p>

          <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}

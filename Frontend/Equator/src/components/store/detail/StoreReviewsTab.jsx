import { Link } from "react-router-dom";
import StarRating from "../../common/StarRating";

export default function StoreReviewsTab({ store, isAuthenticated, ratingBreakdown, totalReviews }) {
  return (
    <div className="pb-12">
      {!isAuthenticated && <LoginReviewPrompt />}

      <div className="grid md:grid-cols-2 gap-6">
        <RatingSummary store={store} ratingBreakdown={ratingBreakdown} totalReviews={totalReviews} />
        <ReviewList reviews={store.reviews} />
      </div>
    </div>
  );
}

function LoginReviewPrompt() {
  return (
    <div className="bg-white rounded-2xl p-5 mb-6 flex items-center justify-between gap-4" style={{ border: "1px solid var(--color-equator-beige)" }}>
      <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        Connectez-vous pour laisser un avis sur cette boutique.
      </p>

      <Link to="/login" className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white shrink-0" style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
        Se connecter
      </Link>
    </div>
  );
}

function RatingSummary({ store, ratingBreakdown, totalReviews }) {
  return (
    <div className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--color-equator-beige)" }}>
      <p className="text-5xl font-bold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
        {store.rating}
      </p>

      <StarRating rating={store.rating} size={18} />

      <p className="text-xs mt-2 mb-5" style={{ color: "var(--color-equator-muted)" }}>
        Basé sur {store.reviewCount} avis vérifiés
      </p>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingBreakdown[star] || 0;
          const percentage = totalReviews ? Math.round((count / totalReviews) * 100) : 0;

          return (
            <div key={star} className="flex items-center gap-3">
              <span className="text-xs w-3" style={{ color: "var(--color-equator-muted)" }}>{star}</span>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-equator-beige)" }}>
                <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: "var(--color-equator-green)" }} />
              </div>
              <span className="text-xs w-6 text-right" style={{ color: "var(--color-equator-muted)" }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
        <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          Aucun avis disponible pour cette boutique.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-equator-green)" }}>
                {review.avatar || review.name?.charAt(0) || "U"}
              </div>

              <div>
                <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--color-equator-text)" }}>
                  {review.name || "Utilisateur"}
                </p>
                <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>{review.date || ""}</p>
              </div>
            </div>

            <StarRating rating={review.rating || 0} size={11} />
          </div>

          <p className="text-sm leading-relaxed italic" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            "{review.text || ""}"
          </p>
        </div>
      ))}
    </div>
  );
}

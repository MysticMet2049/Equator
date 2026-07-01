import { useState } from "react";
import { FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { hasConfiguredProductRatingEndpoint, rateProduct } from "../../../api/ratingApi";

export default function ProductRatingForm({ product }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const endpointAvailable = hasConfiguredProductRatingEndpoint();
  const visibleRating = hoveredRating || selectedRating;

  const handleSubmit = async () => {
    setError("");
    setMessage("");

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!endpointAvailable) {
      setError("L'endpoint backend pour envoyer une note n'est pas documenté dans le Swagger fourni.");
      return;
    }

    if (!selectedRating) {
      setError("Choisis une note entre 1 et 5.");
      return;
    }

    setSubmitting(true);

    try {
      await rateProduct(product, selectedRating);
      setMessage("Votre note a été envoyée.");
    } catch (err) {
      setError(err?.message || "Impossible d'envoyer la note.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-5 mb-5"
      style={{ border: "1px solid var(--color-equator-beige)" }}
    >
      <p className="text-sm font-semibold mb-2" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
        Noter ce produit
      </p>

      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((rating) => {
          const active = rating <= visibleRating;

          return (
            <button
              key={rating}
              type="button"
              onClick={() => setSelectedRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-stone-100"
              aria-label={`Donner ${rating} étoile${rating > 1 ? "s" : ""}`}
            >
              <FiStar
                size={18}
                style={{
                  color: active ? "#f59e0b" : "var(--color-equator-muted)",
                  fill: active ? "#f59e0b" : "none",
                }}
              />
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60"
        style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
      >
        {submitting ? "Envoi..." : "Envoyer la note"}
      </button>

      {!endpointAvailable && (
        <p className="text-xs mt-3" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          Les notes moyennes sont disponibles, mais la route backend de soumission n'est pas présente dans le Swagger. Active-la avec <code>VITE_PRODUCT_RATING_ENDPOINT</code> si elle existe côté serveur.
        </p>
      )}

      {message && <p className="text-xs mt-3" style={{ color: "#16a34a", fontFamily: "var(--font-body)" }}>{message}</p>}
      {error && <p className="text-xs mt-3" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>{error}</p>}
    </div>
  );
}

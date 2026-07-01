import { Link } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { formatPrice } from "./cartPageUtils";

// Carte individuelle d'un article du panier avec quantité et suppression.
export default function CartItemCard({ item, onUpdateQty, onRemove }) {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex gap-4"
      style={{ border: "1px solid var(--color-equator-beige)" }}
    >
      <Link to={`/product/${item.productId}`} className="shrink-0">
        <div
          className="w-20 h-20 rounded-xl overflow-hidden"
          style={{ background: "#f0ebe3" }}
        >
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-xs"
              style={{
                color: "var(--color-equator-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              Image
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/product/${item.productId}`}>
              <p
                className="text-sm font-semibold leading-snug"
                style={{
                  color: "var(--color-equator-text)",
                  fontFamily: "var(--font-body)",
                }}
              >
                {item.name}
              </p>
            </Link>
            <p
              className="text-xs mt-0.5"
              style={{
                color: "var(--color-equator-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              {item.store}
            </p>
          </div>
          <p
            className="text-sm font-semibold shrink-0"
            style={{
              color: "var(--color-equator-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {formatPrice(item.price * item.qty)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateQty(item, -1)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
              style={{ border: "1px solid var(--color-equator-beige)" }}
            >
              <FiMinus size={11} />
            </button>
            <span
              className="w-6 text-center text-sm font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.qty}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQty(item, 1)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
              style={{ border: "1px solid var(--color-equator-beige)" }}
            >
              <FiPlus size={11} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
            style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}
          >
            <FiTrash2 size={12} /> SUPPRIMER
          </button>
        </div>
      </div>
    </div>
  );
}

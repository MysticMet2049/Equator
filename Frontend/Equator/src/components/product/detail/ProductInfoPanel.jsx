import { Link } from "react-router-dom";
import { FiHeart, FiMinus, FiPlus, FiShare2, FiShield, FiTruck } from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";
import { formatPrice } from "./productDetailUtils";

export default function ProductInfoPanel({
  product,
  qty,
  setQty,
  added,
  wishlisted,
  cartLoading,
  onAdd,
  onToggleWishlist,
}) {
  return (
    <div className="lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {product.isLimited ? (
          <span
            className="text-xs font-semibold px-3 py-1 rounded-full"
            style={{
              background: "#e8f5ee",
              color: "var(--color-equator-green)",
              fontFamily: "var(--font-body)",
              letterSpacing: "0.08em",
            }}
          >
            ÉDITION LIMITÉE
          </span>
        ) : (
          <div />
        )}

        <div className="flex gap-2">
          <button
            onClick={onToggleWishlist}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-stone-100"
            style={{ border: "1px solid var(--color-equator-beige)", background: "white" }}
          >
            <FiHeart
              size={15}
              style={{ color: wishlisted ? "#dc2626" : "var(--color-equator-muted)", fill: wishlisted ? "#dc2626" : "none" }}
            />
          </button>

          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-stone-100"
            style={{ border: "1px solid var(--color-equator-beige)", background: "white" }}
          >
            <FiShare2 size={15} style={{ color: "var(--color-equator-muted)" }} />
          </button>
        </div>
      </div>

      <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        {product.store}
      </p>

      <h1 className="text-2xl font-light leading-snug" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
        {product.name}
      </h1>

      <p className="text-sm leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        {product.description || "Description non renseignée."}
      </p>

      <div className="rounded-xl p-4" style={{ background: "white", border: "1px solid var(--color-equator-beige)" }}>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="text-3xl font-bold" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            {formatPrice(product.price, product.currency)}
          </span>

          {product.originalPrice && (
            <span className="text-sm line-through" style={{ color: "#9ca3af", fontFamily: "var(--font-body)" }}>
              {formatPrice(product.originalPrice, product.currency)}
            </span>
          )}
        </div>

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

        <button
          onClick={onAdd}
          disabled={cartLoading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all mb-2"
          style={{ background: added ? "#16a34a" : "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
        >
          <FiTruck size={15} />
          {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
        </button>

        {product.storeId && (
          <Link
            to={`/stores/${product.storeId}`}
            className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors hover:bg-stone-50"
            style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
          >
            <PiStorefront size={15} />
            Visiter le store
          </Link>
        )}

        <div className="mt-4 space-y-2">
          {[
            { icon: FiShield, text: product.warranty },
            { icon: FiTruck, text: product.delivery },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={13} style={{ color: "var(--color-equator-green)" }} />
              <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

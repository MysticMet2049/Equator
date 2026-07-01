import { FiShield } from "react-icons/fi";
import { formatPrice } from "./cartPageUtils";

// Récapitulatif de commande : prix, promo et bouton de validation.
export default function CartSummaryPanel({
  subtotal,
  discount,
  total,
  promoCode,
  promoApplied,
  promoError,
  loading,
  onPromoChange,
  onApplyPromo,
  onSubmitCart,
}) {
  return (
    <div className="lg:w-80 shrink-0 space-y-4">
      <div
        className="bg-white rounded-2xl p-5"
        style={{ border: "1px solid var(--color-equator-beige)" }}
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{
            color: "var(--color-equator-text)",
            fontFamily: "var(--font-body)",
          }}
        >
          Récapitulatif
        </h3>

        <div className="space-y-2.5 mb-4">
          <SummaryLine label="Sous-total" value={formatPrice(subtotal)} />
          <SummaryLine
            label="Livraison"
            value="GRATUIT"
            valueStyle={{ color: "var(--color-equator-green)", fontWeight: 600 }}
          />

          {promoApplied && (
            <SummaryLine
              label="Promo (-10%)"
              value={`-${formatPrice(discount)}`}
              labelStyle={{ color: "var(--color-equator-green)" }}
              valueStyle={{ color: "var(--color-equator-green)", fontWeight: 500 }}
            />
          )}

          <div
            className="flex justify-between pt-2"
            style={{ borderTop: "1px solid var(--color-equator-beige)" }}
          >
            <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>
              Total
            </span>
            <span className="text-base font-bold" style={{ fontFamily: "var(--font-body)" }}>
              {formatPrice(total)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmitCart}
          disabled={loading}
          className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
          style={{
            background: "var(--color-equator-green)",
            fontFamily: "var(--font-body)",
          }}
        >
          Valider le panier →
        </button>

        <div className="mt-4">
          <p
            className="text-xs font-semibold tracking-widest mb-2"
            style={{
              color: "var(--color-equator-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            CODE PROMO
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Entrez votre code"
              value={promoCode}
              onChange={(event) => onPromoChange(event.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-lg outline-none"
              style={{
                border: "1px solid var(--color-equator-beige)",
                fontFamily: "var(--font-body)",
              }}
            />
            <button
              type="button"
              onClick={onApplyPromo}
              className="px-3 py-2 text-xs font-semibold rounded-lg text-white"
              style={{
                background: "var(--color-equator-text)",
                fontFamily: "var(--font-body)",
              }}
            >
              Appliquer
            </button>
          </div>
          {promoError && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{promoError}</p>}
          {promoApplied && (
            <p className="text-xs mt-1" style={{ color: "var(--color-equator-green)" }}>
              Code appliqué ! -10%
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: "var(--color-equator-muted)" }}>
            Démo : EQUATOR10
          </p>
        </div>
      </div>

      <BuyerProtectionCard />
    </div>
  );
}

function SummaryLine({ label, value, labelStyle = {}, valueStyle = {} }) {
  return (
    <div className="flex justify-between">
      <span
        className="text-sm"
        style={{
          color: "var(--color-equator-muted)",
          fontFamily: "var(--font-body)",
          ...labelStyle,
        }}
      >
        {label}
      </span>
      <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)", ...valueStyle }}>
        {value}
      </span>
    </div>
  );
}

function BuyerProtectionCard() {
  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-3"
      style={{ background: "#e8f5ee", border: "1px solid #a7f3d0" }}
    >
      <FiShield
        size={18}
        style={{ color: "var(--color-equator-green)", flexShrink: 0, marginTop: 2 }}
      />
      <div>
        <p
          className="text-xs font-semibold mb-1"
          style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
        >
          Garantie Equator Premiere
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
        >
          Retours gratuits sous 30 jours et protection acheteur incluse.
        </p>
      </div>
    </div>
  );
}

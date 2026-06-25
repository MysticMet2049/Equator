import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiTrash2, FiMinus, FiPlus, FiShield, FiShoppingBag } from "react-icons/fi";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/layout/Footer";

const RECOMMENDED = [
  { id: 101, name: "Étui en cuir Premium", store: "Accessoires", price: 45, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80", category: "Mode" },
  { id: 102, name: "Batterie Externe Mag", store: "Énergie", price: 89, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80", category: "Électronique" },
  { id: 103, name: "Écouteurs Air Pods Pro", store: "Audio", price: 129, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80", category: "Électronique" },
  { id: 104, name: "Clavier Mécanique Air", store: "Bureautique", price: 159, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&q=80", category: "Électronique" },
  { id: 105, name: "Tablette Créative S9", store: "Informatique", price: 599, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80", category: "Électronique" },
];

export default function CartPage() {
  const {
  cartItems,
  cartCount,
  cartTotal,
  removeFromCart,
  updateQuantity,
  loading,
  error,
} = useCart();

const { isAuthenticated } = useAuth();
const navigate = useNavigate();

const [promoCode, setPromoCode] = useState("");
const [promoApplied, setPromoApplied] = useState(false);
const [promoError, setPromoError] = useState(null);

const cart = cartItems.map((item) => {
  const product = item.product || {};

  return {
    id: item.id,
    productId: item.productId,
    name: product.name || item.name || "Produit",
    store: product.storeName || product.store || "",
    image: product.image || item.image,
    price: item.price || product.price || 0,
    qty: item.quantity || 1,
  };
});

const subtotal = cartTotal || cart.reduce((acc, item) => acc + item.price * item.qty, 0);
const discount = promoApplied ? subtotal * 0.1 : 0;
const total = subtotal - discount;

const updateQty = async (item, delta) => {
  await updateQuantity(item.id, item.qty + delta);
};

const applyPromo = () => {
  if (promoCode.toUpperCase() === "EQUATOR10") {
    setPromoApplied(true);
    setPromoError(null);
  } else {
    setPromoError("Code invalide.");
    setPromoApplied(false);
  }
};

  if (!loading && cartCount === 0) {
    return (
      <div className="min-h-screen pt-14 flex flex-col" style={{ background: "var(--color-equator-cream)" }}>
        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-20 px-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--color-equator-beige)" }}>
            <FiShoppingBag size={28} style={{ color: "var(--color-equator-muted)" }} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              Votre panier est vide
            </h2>
            <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              Découvrez nos produits et ajoutez vos coups de cœur.
            </p>
          </div>
          {!isAuthenticated && (
            <div className="text-center p-4 rounded-xl max-w-sm" style={{ background: "#e8f5ee", border: "1px solid #a7f3d0" }}>
              <p className="text-sm mb-3" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                Connectez-vous pour sauvegarder votre panier et retrouver vos articles plus tard.
              </p>
              <Link to="/login" className="text-sm font-semibold" style={{ color: "var(--color-equator-green-dark)" }}>
                Se connecter →
              </Link>
            </div>
          )}
          <Link to="/marketplace" className="px-8 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
            Explorer la marketplace
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 flex flex-col" style={{ background: "var(--color-equator-cream)" }}>
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 py-8">
        <h1 className="text-2xl font-light mb-8" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
          Mon Panier
        </h1>
           {error && (
        <p
          className="text-sm mb-4"
          style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}
        >
          {error}
        </p>
      )}

        {!isAuthenticated && (
          <div className="mb-6 p-4 rounded-xl flex items-center justify-between flex-wrap gap-3" style={{ background: "#e8f5ee", border: "1px solid #a7f3d0" }}>
            <p className="text-sm" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
              Connectez-vous pour sauvegarder votre panier et retrouver vos articles plus tard.
            </p>
            <Link to="/login" className="text-xs font-semibold px-4 py-1.5 rounded-full" style={{ background: "var(--color-equator-green)", color: "white", fontFamily: "var(--font-body)" }}>
              Se connecter
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items */}
          <div className="flex-1 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-4 flex gap-4" style={{ border: "1px solid var(--color-equator-beige)" }}>
                {/* Image */}
                <Link to={`/product/${item.id}`} className="shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: "#f0ebe3" }}>
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                     <Link to={`/product/${item.productId}`}>
                        <p className="text-sm font-semibold leading-snug" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                          {item.name}
                        </p>
                      </Link>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                        {item.store}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                      {(item.price * item.qty).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(item, -1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
                        style={{ border: "1px solid var(--color-equator-beige)" }}>
                        <FiMinus size={11} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item, 1)} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-stone-100"
                        style={{ border: "1px solid var(--color-equator-beige)" }}>
                        <FiPlus size={11} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button onClick={() => removeFromCart(item.id)}
                      className="flex items-center gap-1 text-xs font-medium transition-opacity hover:opacity-70"
                      style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>
                      <FiTrash2 size={12} /> SUPPRIMER
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:w-80 shrink-0 space-y-4">
            <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>Récapitulatif</h3>

              <div className="space-y-2.5 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Sous-total</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>{subtotal.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Livraison</span>
                  <span className="text-sm font-semibold" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>GRATUIT</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between">
                    <span className="text-sm" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>Promo (-10%)</span>
                    <span className="text-sm font-medium" style={{ color: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>-{discount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Taxes estimées</span>
                  <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>0,00 €</span>
                </div>
                <div className="flex justify-between pt-2" style={{ borderTop: "1px solid var(--color-equator-beige)" }}>
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>Total</span>
                  <span className="text-base font-bold" style={{ fontFamily: "var(--font-body)" }}>{total.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €</span>
                </div>
              </div>

              <button
                onClick={() => navigate(isAuthenticated ? "/checkout" : "/login?next=checkout")}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
              >
                Valider le panier →
              </button>

              {/* Promo code */}
              <div className="mt-4">
                <p className="text-xs font-semibold tracking-widest mb-2" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>CODE PROMO</p>
                <div className="flex gap-2">
                  <input type="text" placeholder="Entrez votre code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg outline-none"
                    style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)" }} />
                  <button onClick={applyPromo} className="px-3 py-2 text-xs font-semibold rounded-lg text-white"
                    style={{ background: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                    Appliquer
                  </button>
                </div>
                {promoError && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{promoError}</p>}
                {promoApplied && <p className="text-xs mt-1" style={{ color: "var(--color-equator-green)" }}>Code appliqué ! -10%</p>}
                <p className="text-xs mt-1" style={{ color: "var(--color-equator-muted)" }}>Démo : EQUATOR10</p>
              </div>
            </div>

            {/* Guarantee */}
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "#e8f5ee", border: "1px solid #a7f3d0" }}>
              <FiShield size={18} style={{ color: "var(--color-equator-green)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>Garantie Equator Premiere</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  Retours gratuits sous 30 jours et protection acheteur incluse.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended */}
        <div className="mt-14">
          <h2 className="text-xl font-light mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
            Recommandé pour vous
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {RECOMMENDED.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                <div className="rounded-xl overflow-hidden mb-2" style={{ aspectRatio: "1/1", background: "#f0ebe3" }}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
                <p className="text-xs font-semibold leading-snug mb-0.5" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{p.name}</p>
                <p className="text-xs mb-0.5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{p.store}</p>
                <p className="text-sm font-bold" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                  {p.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
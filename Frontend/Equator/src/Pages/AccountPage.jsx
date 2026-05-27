import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUser, FiHeart, FiShoppingBag, FiBell, FiClock,
  FiLogOut, FiEdit2, FiCamera, FiChevronRight, FiPackage,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useApi } from "../context/ApiContext";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

const STATUS_STYLES = {
  "Livré":    { bg: "#dcfce7", color: "#15803d" },
  "En cours": { bg: "#dbeafe", color: "#1d4ed8" },
  "Annulé":   { bg: "#fee2e2", color: "#dc2626" },
};

const NAV_ITEMS = [
  { id: "profile",    label: "Mon profil",           icon: FiUser },
  { id: "favorites",  label: "Mes favoris",           icon: FiHeart },
  { id: "stores",     label: "Mes comptes enseignes", icon: FiPackage },
  { id: "notifs",     label: "Notifications",         icon: FiBell },
  { id: "orders",     label: "Historique d'achats",   icon: FiClock },
];

export default function AccountPage() {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { wishlist, getProductById, addToCart, toggleWishlist } = useApi();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-14 flex flex-col items-center justify-center gap-6 px-6" style={{ background: "var(--color-equator-cream)" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: "var(--color-equator-beige)" }}>
          <FiUser size={28} style={{ color: "var(--color-equator-muted)" }} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-light mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
            Espace personnel
          </h2>
          <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>
            Connectez-vous pour accéder à votre compte.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "var(--color-equator-green)" }}>
            Se connecter
          </Link>
          <Link to="/register" className="px-6 py-2.5 rounded-xl text-sm font-medium" style={{ border: "1.5px solid var(--color-equator-beige)", color: "var(--color-equator-text)" }}>
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateProfile(form);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const wishlistProducts = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex gap-6">

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 gap-1">
          {/* Avatar + name */}
          <div className="bg-white rounded-2xl p-5 mb-2 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
            <div className="relative w-16 h-16 mx-auto mb-3">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold"
                style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-display)" }}
              >
                {user?.name?.charAt(0) || "U"}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "var(--color-equator-green)" }}>
                <FiCamera size={11} color="white" />
              </button>
            </div>
            <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)", color: "var(--color-equator-text)" }}>{user?.name}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{user?.email}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{user?.phone}</p>
          </div>

          {/* Nav */}
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-stone-50"
                style={{
                  borderBottom: "1px solid var(--color-equator-beige)",
                  background: activeSection === id ? "#f0faf5" : "white",
                  color: activeSection === id ? "var(--color-equator-green)" : "var(--color-equator-text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: activeSection === id ? "600" : "400",
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-red-50"
              style={{ color: "#dc2626", fontFamily: "var(--font-body)", fontSize: "13px" }}
            >
              <FiLogOut size={14} />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* ── Main content ──────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-6">

          {/* ── Profile section ── */}
          {(activeSection === "profile" || true) && (
            <section className="bg-white rounded-2xl p-6" style={{ border: "1px solid var(--color-equator-beige)", display: activeSection === "profile" ? "block" : "none" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                  Mon Profil
                </h2>
                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                    style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
                  >
                    <FiEdit2 size={12} /> Modifier Profil
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setEditMode(false)} className="px-4 py-2 rounded-lg text-xs font-medium transition-colors hover:bg-stone-100" style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)" }}>
                      Annuler
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-lg text-xs font-semibold text-white" style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                      Sauvegarder
                    </button>
                  </div>
                )}
              </div>

              {saved && (
                <div className="mb-4 p-3 rounded-xl text-xs font-medium" style={{ background: "#dcfce7", color: "#15803d", fontFamily: "var(--font-body)" }}>
                  ✓ Profil mis à jour avec succès.
                </div>
              )}

              {/* Avatar large */}
              <div className="flex items-start gap-6 mb-6">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-semibold" style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-display)" }}>
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "var(--color-equator-green)", border: "2px solid white" }}>
                    <FiCamera size={13} color="white" />
                  </button>
                </div>
                <div className="pt-1">
                  <p className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>{user?.name}</p>
                  <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{user?.email}</p>
                  <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{user?.phone}</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "NOM COMPLET", key: "name", placeholder: "Jean Dupont" },
                  { label: "EMAIL", key: "email", placeholder: "jean@exemple.com" },
                  { label: "TÉLÉPHONE", key: "phone", placeholder: "(XXX) XXX-XXXX" },
                ].map(({ label, key, placeholder }) => (
                  <div key={key} className={key === "phone" ? "md:col-span-1" : ""}>
                    <label className="block text-xs font-semibold tracking-widest mb-1.5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                      {label}
                    </label>
                    <input
                      type="text"
                      value={form[key]}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      disabled={!editMode}
                      className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                      style={{
                        border: "1.5px solid var(--color-equator-beige)",
                        background: editMode ? "white" : "#fafaf8",
                        color: "var(--color-equator-text)",
                        fontFamily: "var(--font-body)",
                        cursor: editMode ? "text" : "default",
                      }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Favorites section ── */}
          <section style={{ display: activeSection === "favorites" ? "block" : "none" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                  Nos Favoris
                </h2>
                <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  Les articles que vous aimez.
                </p>
              </div>
              <Link to="/marketplace" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                Voir tout <FiChevronRight size={12} />
              </Link>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
                <FiHeart size={32} className="mx-auto mb-3" style={{ color: "var(--color-equator-beige)" }} />
                <p className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                  Aucun favori pour l'instant.
                </p>
                <Link to="/marketplace" className="text-xs font-medium mt-2 inline-block" style={{ color: "var(--color-equator-green)" }}>
                  Explorer la marketplace →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {wishlistProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
                    <div className="relative" style={{ aspectRatio: "1/1" }}>
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: "white" }}
                      >
                        <FiHeart size={13} style={{ color: "#dc2626", fill: "#dc2626" }} />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium mb-1 truncate" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                        {product.name}
                      </p>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full py-1.5 rounded-lg text-xs font-medium mt-1 transition-colors hover:bg-stone-100"
                        style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Orders section ── */}
          <section style={{ display: activeSection === "orders" ? "block" : "none" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                Historique d'achats
              </h2>
              <Link to="/marketplace" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                Voir tout <FiChevronRight size={12} />
              </Link>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
              {/* Header row */}
              <div className="grid grid-cols-5 px-6 py-3 text-xs font-semibold tracking-widest" style={{ background: "var(--color-equator-cream)", borderBottom: "1px solid var(--color-equator-beige)", color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                <span>COMMANDE</span>
                <span>DATE</span>
                <span>BOUTIQUE</span>
                <span>STATUT</span>
                <span className="text-right">TOTAL</span>
              </div>
              {(user?.orders || []).length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucune commande.</p>
                </div>
              ) : (
                user.orders.map((order, i) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-5 px-6 py-4 items-center text-sm"
                    style={{ borderBottom: i < user.orders.length - 1 ? "1px solid var(--color-equator-beige)" : "none", fontFamily: "var(--font-body)" }}
                  >
                    <span className="font-medium" style={{ color: "var(--color-equator-text)" }}>{order.id}</span>
                    <span style={{ color: "var(--color-equator-muted)" }}>{order.date}</span>
                    <span style={{ color: "var(--color-equator-muted)" }}>{order.store}</span>
                    <span>
                      <span
                        className="text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{
                          background: STATUS_STYLES[order.status]?.bg || "#f3f4f6",
                          color: STATUS_STYLES[order.status]?.color || "#6b7280",
                        }}
                      >
                        {order.status}
                      </span>
                    </span>
                    <span className="text-right font-semibold" style={{ color: "var(--color-equator-text)" }}>{order.total} €</span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ── Store accounts section ── */}
          <section style={{ display: activeSection === "stores" ? "block" : "none" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
                Mes comptes enseignes
              </h2>
              <Link to="/stores" className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                Voir tout <FiChevronRight size={12} />
              </Link>
            </div>

            <div className="space-y-3">
              {(user?.storeAccounts || []).map((store) => (
                <div key={store.name} className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between" style={{ border: "1px solid var(--color-equator-beige)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                      {store.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{store.name}</p>
                      <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Membre depuis le {store.since}</p>
                    </div>
                  </div>
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-stone-100" style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                    Gérer le compte
                  </button>
                </div>
              ))}
              {(!user?.storeAccounts || user.storeAccounts.length === 0) && (
                <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
                  <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucune enseigne liée.</p>
                  <Link to="/sell" className="text-xs font-medium mt-2 inline-block" style={{ color: "var(--color-equator-green)" }}>
                    Ouvrir ma boutique →
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* ── Notifications ── */}
          <section style={{ display: activeSection === "notifs" ? "block" : "none" }}>
            <h2 className="text-xl font-light mb-5" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              Notifications
            </h2>
            <div className="bg-white rounded-2xl p-10 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
              <FiBell size={32} className="mx-auto mb-3" style={{ color: "var(--color-equator-beige)" }} />
              <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucune notification pour le moment.</p>
            </div>
          </section>

          {/* ── Inline sections visible on profile tab ── */}
          {activeSection === "profile" && (
            <>
              {/* Favorites preview */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>Nos Favoris</h3>
                    <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>Les articles que vous aimez.</p>
                  </div>
                  <button onClick={() => setActiveSection("favorites")} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                    Voir tout <FiChevronRight size={12} />
                  </button>
                </div>
                {wishlistProducts.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
                    <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucun favori — <Link to="/marketplace" className="underline" style={{ color: "var(--color-equator-green)" }}>explorer la marketplace</Link></p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {wishlistProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="bg-white rounded-xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
                        <div className="relative" style={{ aspectRatio: "1/1" }}>
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          <button onClick={() => toggleWishlist(product.id)} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "white" }}>
                            <FiHeart size={13} style={{ color: "#dc2626", fill: "#dc2626" }} />
                          </button>
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-medium mb-2 truncate" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{product.name}</p>
                          <button onClick={() => addToCart(product)} className="w-full py-1.5 rounded-lg text-xs transition-colors hover:bg-stone-100" style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                            Ajouter au panier
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Orders preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>Historique d'achats</h3>
                  <button onClick={() => setActiveSection("orders")} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                    Voir tout <FiChevronRight size={12} />
                  </button>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
                  <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold tracking-widest" style={{ background: "var(--color-equator-cream)", borderBottom: "1px solid var(--color-equator-beige)", color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                    <span>COMMANDE</span><span>DATE</span><span>BOUTIQUE</span><span>STATUT</span><span className="text-right">TOTAL</span>
                  </div>
                  {(user?.orders || []).slice(0, 3).map((order, i, arr) => (
                    <div key={order.id} className="grid grid-cols-5 px-5 py-3.5 items-center text-sm" style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--color-equator-beige)" : "none", fontFamily: "var(--font-body)" }}>
                      <span className="font-medium">{order.id}</span>
                      <span style={{ color: "var(--color-equator-muted)" }}>{order.date}</span>
                      <span style={{ color: "var(--color-equator-muted)" }}>{order.store}</span>
                      <span><span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: STATUS_STYLES[order.status]?.bg, color: STATUS_STYLES[order.status]?.color }}>{order.status}</span></span>
                      <span className="text-right font-semibold">{order.total} €</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Store accounts preview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>Mes comptes enseignes</h3>
                  <button onClick={() => setActiveSection("stores")} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
                    Voir tout <FiChevronRight size={12} />
                  </button>
                </div>
                <div className="space-y-2">
                  {(user?.storeAccounts || []).map((store) => (
                    <div key={store.name} className="bg-white rounded-xl px-5 py-4 flex items-center justify-between" style={{ border: "1px solid var(--color-equator-beige)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-equator-green)" }}>{store.initials}</div>
                        <div>
                          <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)", color: "var(--color-equator-text)" }}>{store.name}</p>
                          <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Membre depuis le {store.since}</p>
                        </div>
                      </div>
                      <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                        Gérer le compte
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer variant="product" />
    </div>
  );
}
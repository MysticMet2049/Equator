import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Navbar from "./components/layout/Navbar";

// ── Pages ──────────────────────────────────────────────────────────────────────
import HomePage            from "./pages/HomePage";
import MarketplacePage     from "./pages/MarketplacePage";
import SearchResultsPage   from "./pages/SearchResultsPage";
import CategoriesPage      from "./pages/CategoriesPage";
import StoresPage          from "./pages/StoresPage";
import StoreDetailPage     from "./pages/StoreDetailPage";
import ProductDetailPage   from "./pages/ProductDetailPage";
import CartPage            from "./pages/CartPage";
import AccountPage         from "./pages/AccountPage";
import LoginPage           from "./pages/LoginPage";
import RegisterChoicePage  from "./pages/RegisterChoicePage";
import RegisterPage        from "./pages/RegisterPage";
import VerifyEmailPage     from "./pages/VerifyEmailPage";

// ── Placeholder ───────────────────────────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--color-equator-cream)" }}>
      <h1 className="text-3xl font-light"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
        {title}
      </h1>
      <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>
        Page en cours de développement.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ApiProvider>
          <FavoritesProvider>
            <CartProvider>
              <Navbar />
            <Routes>
              {/* ── Public ── */}
              <Route path="/"                   element={<HomePage />} />
              <Route path="/marketplace"        element={<MarketplacePage />} />
              <Route path="/search"             element={<SearchResultsPage />} />
              <Route path="/categories"         element={<CategoriesPage />} />
              <Route path="/categories/:slug"   element={<CategoriesPage />} />
              <Route path="/stores"             element={<StoresPage />} />
              <Route path="/stores/:id"         element={<StoreDetailPage />} />
              <Route path="/product/:id"        element={<ProductDetailPage />} />
              <Route path="/deals"              element={<PlaceholderPage title="Deals & Offres" />} />

              {/* ── Auth pages ── */}
              <Route path="/login"              element={<LoginPage />} />
              <Route path="/register"           element={<RegisterChoicePage />} />
              <Route path="/register/buyer"     element={<RegisterPage />} />
              <Route path="/verify-email"       element={<VerifyEmailPage />} />
              <Route path="/forgot-password"    element={<PlaceholderPage title="Mot de passe oublié" />} />

              {/* ── Protected (accessible but shows prompt if not logged in) ── */}
              <Route path="/cart"               element={<CartPage />} />
              <Route path="/account"            element={<AccountPage />} />

              {/* ── Footer links ── */}
              <Route path="/about"              element={<PlaceholderPage title="À Propos" />} />
              <Route path="/sell"               element={<PlaceholderPage title="Vendre sur Equator" />} />
              <Route path="/careers"            element={<PlaceholderPage title="Carrières" />} />
              <Route path="/contact"            element={<PlaceholderPage title="Contact" />} />
              <Route path="/privacy"            element={<PlaceholderPage title="Politique de Confidentialité" />} />
              <Route path="/terms"              element={<PlaceholderPage title="Conditions d'Utilisation" />} />

              {/* ── 404 ── */}
              <Route path="*"                   element={<PlaceholderPage title="Page introuvable" />} />
            </Routes>
            </CartProvider>
          </FavoritesProvider>
        </ApiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

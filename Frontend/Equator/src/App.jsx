import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApiProvider } from "./context/ApiContext";
import Navbar from "/components/Navbar";
import HomePage from "/pages/HomePage";
import MarketplacePage from "/pages/MarketplacePage";
import SearchResultsPage from "./pages/SearchResultsPage";
import CategoriesPage from "./pages/CategoriesPage";
import StoresPage from "./pages/StoresPage";
import ProductDetailPage from "./pages/ProductDetailPage";

// ── Simple placeholder pages ───────────────────────────────────────────────────
function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4" style={{ background: "var(--color-equator-cream)" }}>
      <h1 className="text-3xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>{title}</h1>
      <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Page en cours de développement.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Navbar />
        <Routes>
          {/* ── Core pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* ── Categories */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<CategoriesPage />} />

          {/* ── Stores */}
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/stores/:slug" element={<PlaceholderPage title="Page du Store" />} />

          {/* ── Product detail */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* ── Utility */}
          <Route path="/cart" element={<PlaceholderPage title="Mon Panier" />} />
          <Route path="/account" element={<PlaceholderPage title="Mon Compte" />} />
          <Route path="/deals" element={<PlaceholderPage title="Deals & Offres" />} />
          <Route path="/about" element={<PlaceholderPage title="À Propos" />} />
          <Route path="/sell" element={<PlaceholderPage title="Vendre sur Equator" />} />
          <Route path="/careers" element={<PlaceholderPage title="Carrières" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Politique de Confidentialité" />} />
          <Route path="/terms" element={<PlaceholderPage title="Conditions d'Utilisation" />} />

          {/* ── 404 */}
          <Route path="*" element={<PlaceholderPage title="Page introuvable" />} />
        </Routes>
      </ApiProvider>
    </BrowserRouter>
  );
}

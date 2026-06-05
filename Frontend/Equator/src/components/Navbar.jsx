import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch, FiMenu, FiX, FiLogOut, FiPackage } from "react-icons/fi";
import { useApi } from "../context/ApiContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { cartCount, searchQuery, setSearchQuery } = useApi();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery || "");
  const [userMenu, setUserMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch.trim());
      navigate(`/search?q=${encodeURIComponent(localSearch.trim())}`);
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/stores",      label: "Stores" },
    { to: "/categories",  label: "Categories" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/97 backdrop-blur-md shadow-sm" : "bg-white"}`}
      style={{ borderBottom: "1px solid #e9e4dc" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center gap-4 md:gap-6">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold tracking-tight shrink-0"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
          Equator
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => `nav-link text-sm font-medium pb-0.5 transition-colors ${isActive ? "active" : ""}`}
              style={({ isActive }) => ({ color: isActive ? "var(--color-equator-green)" : "var(--color-equator-muted)" })}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5"
          style={{ background: "var(--color-equator-beige)", border: "1px solid #d9d3c8", minWidth: "220px" }}>
          <FiSearch size={13} style={{ color: "var(--color-equator-muted)", flexShrink: 0 }} />
          <input type="text" placeholder="Rechercher sur Equator..."
            value={localSearch} onChange={(e) => setLocalSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
            style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }} />
        </form>

        {/* Cart */}
        <Link to="/cart" className="relative p-2 rounded-full transition-colors hover:bg-stone-100">
          <FiShoppingCart size={18} style={{ color: "var(--color-equator-text)" }} />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 text-white w-4 h-4 rounded-full flex items-center justify-center font-medium"
              style={{ background: "var(--color-equator-green)", fontSize: "9px" }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* User — desktop */}
        <div className="hidden md:block relative">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full transition-colors hover:bg-stone-100"
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}>
                  {user?.name?.charAt(0) || "U"}
                </div>
              </button>
              {userMenu && (
                <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden w-48 z-50"
                  style={{ background: "white", boxShadow: "0 8px 30px rgba(0,0,0,0.12)", border: "1px solid var(--color-equator-beige)" }}>
                  <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--color-equator-beige)" }}>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{user?.name}</p>
                    <p className="text-xs truncate" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>{user?.email}</p>
                  </div>
                  {[
                    { to: "/account", icon: FiUser, label: "Mon profil" },
                    { to: "/cart", icon: FiShoppingCart, label: "Mon panier" },
                    { to: "/stores", icon: FiPackage, label: "Mes boutiques" },
                  ].map(({ to, icon: Icon, label }) => (
                    <Link key={to} to={to} onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-stone-50"
                      style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                      <Icon size={13} /> {label}
                    </Link>
                  ))}
                  <button onClick={() => { logout(); setUserMenu(false); navigate("/"); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                    style={{ color: "#dc2626", fontFamily: "var(--font-body)", borderTop: "1px solid var(--color-equator-beige)" }}>
                    <FiLogOut size={13} /> Déconnexion
                  </button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="p-2 rounded-full transition-colors hover:bg-stone-100">
              <FiUser size={18} style={{ color: "var(--color-equator-text)" }} />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-full transition-colors hover:bg-stone-100" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX size={18} style={{ color: "var(--color-equator-text)" }} /> : <FiMenu size={18} style={{ color: "var(--color-equator-text)" }} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3"
          style={{ borderTop: "1px solid var(--color-equator-beige)", background: "white" }}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} className="text-sm font-medium py-1"
              style={{ color: "var(--color-equator-muted)" }} onClick={() => setMobileOpen(false)}>
              {label}
            </NavLink>
          ))}
          <form onSubmit={handleSearch} className="flex items-center gap-2 rounded-full px-3 py-1.5 mt-1"
            style={{ background: "var(--color-equator-beige)", border: "1px solid #d9d3c8" }}>
            <FiSearch size={13} style={{ color: "var(--color-equator-muted)" }} />
            <input type="text" placeholder="Rechercher..." value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)} className="bg-transparent outline-none text-sm flex-1"
              style={{ fontFamily: "var(--font-body)" }} />
          </form>
          <div className="flex gap-2 pt-1">
            {isAuthenticated ? (
              <button onClick={() => { logout(); setMobileOpen(false); navigate("/"); }}
                className="text-xs px-3 py-2 rounded-lg" style={{ color: "#dc2626", border: "1px solid #fecaca" }}>
                Déconnexion
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-xs py-2 rounded-lg font-medium text-white"
                  style={{ background: "var(--color-equator-green)" }}>
                  Se connecter
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center text-xs py-2 rounded-lg font-medium"
                  style={{ border: "1px solid var(--color-equator-beige)", color: "var(--color-equator-text)" }}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

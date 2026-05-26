import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiShoppingCart,FiUser,FiSearch,FiMenu,FiX,} from "react-icons/fi";
import { useApi } from "../../context/ApiContext";

export default function Navbar() {
  const { cartCount, searchQuery, setSearchQuery } = useApi();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ setSearchOpen] = useState(false);
  const navigate = useNavigate();

useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

 const navLinks = [
    { to: "/marketplace", label: "Marketplace" },
    { to: "/stores", label: "Stores" },
    { to: "/categories", label: "Categories" },
    { to: "/deals", label: "Deals" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white"
      }`}
      style={{ borderBottom: "1px solid #e9e4dc" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight shrink-0"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}
        >
          Equator
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-link text-sm font-medium pb-0.5 transition-colors ${
                  isActive
                    ? "active"
                    : ""
                }`
              }
              style={({ isActive }) => ({
                color: isActive
                  ? "var(--color-equator-green)"
                  : "var(--color-equator-muted)",
              })}
            >
    {label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2 rounded-full px-3 py-1.5 text-sm"
            style={{
              background: "var(--color-equator-beige)",
              border: "1px solid #d9d3c8",
            }}
          >
            <FiSearch size={14} style={{ color: "var(--color-equator-muted)" }} />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-40"
              style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
            />
          </form>
           {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 rounded-full transition-colors hover:bg-stone-100"
          >
            <FiShoppingCart size={18} style={{ color: "var(--color-equator-text)" }} />
            {cartCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium"
                style={{ background: "var(--color-equator-green)", fontSize: "10px" }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            to="/account"
            className="p-2 rounded-full transition-colors hover:bg-stone-100"
          >
            <FiUser size={18} style={{ color: "var(--color-equator-text)" }} />
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-full transition-colors hover:bg-stone-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <FiX size={18} style={{ color: "var(--color-equator-text)" }} />
            ) : (
              <FiMenu size={18} style={{ color: "var(--color-equator-text)" }} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-4 pt-2 flex flex-col gap-3"
          style={{ borderTop: "1px solid var(--color-equator-beige)", background: "white" }}
        >
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className="text-sm font-medium py-1"
              style={{ color: "var(--color-equator-muted)" }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </NavLink>
          ))}
          <form onSubmit={handleSearch} className="flex items-center gap-2 mt-1">
            <div
              className="flex items-center gap-2 flex-1 rounded-full px-3 py-1.5"
              style={{ background: "var(--color-equator-beige)" }}
            >
              <FiSearch size={14} style={{ color: "var(--color-equator-muted)" }} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1"
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}


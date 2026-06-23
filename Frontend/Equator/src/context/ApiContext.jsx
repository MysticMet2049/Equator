import { createContext, useContext, useState } from "react";
import { HERO_SLIDES } from "../data/heroSlides";
import { CATEGORIES } from "../data/categories";
import { ALL_STORES } from "../data/stores";
import { ALL_PRODUCTS } from "../data/products";

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const toggleWishlist = (id) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };
  const isInWishlist = (id) => wishlist.includes(id);

  // ── Product helpers ───────────────────────────────────────────────────────
  const getProducts = (filters = {}) => {
    let products = [...ALL_PRODUCTS];
    if (filters.category)    products = products.filter((p) => p.category === filters.category);
    if (filters.subcategory) products = products.filter((p) => p.subcategory === filters.subcategory);
    if (filters.storeSlug)   products = products.filter((p) => p.storeSlug === filters.storeSlug);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.store.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    if (filters.minPrice !== undefined) products = products.filter((p) => p.price >= filters.minPrice);
    if (filters.maxPrice !== undefined) products = products.filter((p) => p.price <= filters.maxPrice);
    if (filters.minRating !== undefined) products = products.filter((p) => p.rating >= filters.minRating);
    if (filters.sort === "price-asc")  products.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") products.sort((a, b) => b.price - a.price);
    if (filters.sort === "rating")     products.sort((a, b) => b.rating - a.rating);
    if (filters.sort === "recent")     products.sort((a, b) => b.id - a.id);
    return products;
  };

  const getProductById = (id) => ALL_PRODUCTS.find((p) => p.id === parseInt(id));

  const getSimilarProducts = (product, limit = 4) =>
    ALL_PRODUCTS.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);

  // ── Store helpers ─────────────────────────────────────────────────────────
  const getStores = (filters = {}) => {
    let stores = [...ALL_STORES];
    if (filters.category) stores = stores.filter((s) => s.category === filters.category);
    return stores;
  };

  const getStoreBySlug = (slug) => ALL_STORES.find((s) => s.slug === slug);

  // ── Category helpers ──────────────────────────────────────────────────────
  const getCategoryBySlug = (slug) => CATEGORIES.find((c) => c.slug === slug);

  return (
    <ApiContext.Provider value={{
      heroSlides: HERO_SLIDES,
      categories: CATEGORIES,
      allStores: ALL_STORES,
      featuredProducts: ALL_PRODUCTS.slice(0, 4),
      partnerStores: ALL_STORES.slice(0, 2),
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, clearCart,
      wishlist, toggleWishlist, isInWishlist,
      searchQuery, setSearchQuery,
      getProducts, getProductById, getSimilarProducts,
      getStores, getStoreBySlug,
      getCategoryBySlug,
    }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}

import { createContext, useContext, useState, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  {
    id: 1,
    tag: "ÉDITION LIMITÉE 2024",
    title: "L'élégance durable pour votre quotidien",
    subtitle:
      "Découvrez une sélection rigoureuse d'objets conçus pour durer, alliant artisanat d'exception et respect de l'environnement.",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80",
    cta: "Acheter maintenant",
    ctaSecondary: "Voir la collection",
  },
  {
    id: 2,
    tag: "ARTISANAT LOCAL",
    title: "Chaque pièce raconte une histoire",
    subtitle:
      "Des créateurs locaux qui façonnent le monde de demain avec passion et savoir-faire.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
    cta: "Explorer",
    ctaSecondary: "Nos artisans",
  },
  {
    id: 3,
    tag: "MODE DURABLE",
    title: "Une garde-robe qui respecte la planète",
    subtitle:
      "Matières naturelles et coupes intemporelles pour un style conscient et raffiné.",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    cta: "Découvrir",
    ctaSecondary: "Mode Durable",
  },
];

const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: "Vase en céramique brute",
    store: "Artisanat local",
    price: 75.0,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80",
    badge: null,
    category: "Décoration",
  },
  {
    id: 2,
    name: "Sac cabas en coton recyclé",
    store: "Mode Durable",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80",
    badge: "Durable",
    category: "Mode",
  },
  {
    id: 3,
    name: "Sandales en cuir végétal",
    store: "Confort Naturel",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
    badge: null,
    category: "Chaussures",
  },
  {
    id: 4,
    name: "Bougie bois de santal",
    store: "Ambiance",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1608181831718-c9ebb5d09652?w=500&q=80",
    badge: null,
    category: "Maison",
  },
];

const PARTNER_STORES = [
  {
    id: 1,
    name: "Artisanat local",
    description:
      "Chaque pièce raconte une histoire. Découvrez le savoir-faire de nos artisans de proximité et apportez une âme à votre intérieur.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80",
    slug: "artisanat-local",
  },
  {
    id: 2,
    name: "Mode Durable",
    description:
      "Une garde-robe qui respecte la planète. Matières naturelles et coupes intemporelles pour un style conscient.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    slug: "mode-durable",
  },
];

const CATEGORIES = [
  { id: 1, name: "Décoration", slug: "decoration", count: 124 },
  { id: 2, name: "Mode", slug: "mode", count: 89 },
  { id: 3, name: "Maison", slug: "maison", count: 67 },
  { id: 4, name: "Alimentation", slug: "alimentation", count: 45 },
  { id: 5, name: "Beauté", slug: "beaute", count: 38 },
  { id: 6, name: "Jardin", slug: "jardin", count: 29 },
];

const ALL_PRODUCTS = [
  ...FEATURED_PRODUCTS,
  {
    id: 5,
    name: "Carafe en verre soufflé",
    store: "Artisanat local",
    price: 58.0,
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&q=80",
    badge: "Nouveau",
    category: "Décoration",
  },
  {
    id: 6,
    name: "Pull en laine mérinos",
    store: "Mode Durable",
    price: 145.0,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80",
    badge: "Durable",
    category: "Mode",
  },
  {
    id: 7,
    name: "Savon surgras artisanal",
    store: "Ambiance",
    price: 12.0,
    image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=500&q=80",
    badge: null,
    category: "Beauté",
  },
  {
    id: 8,
    name: "Panier en osier tressé",
    store: "Artisanat local",
    price: 48.0,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=80",
    badge: null,
    category: "Maison",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const getProducts = (filters = {}) => {
    let products = [...ALL_PRODUCTS];
    if (filters.category) {
      products = products.filter((p) => p.category === filters.category);
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q)
      );
    }
    return products;
  };

  const getProductById = (id) => ALL_PRODUCTS.find((p) => p.id === parseInt(id));

  return (
    <ApiContext.Provider
      value={{
        heroSlides: HERO_SLIDES,
        featuredProducts: FEATURED_PRODUCTS,
        partnerStores: PARTNER_STORES,
        categories: CATEGORIES,
        cart,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        clearCart,
        searchQuery,
        setSearchQuery,
        isLoading,
        getProducts,
        getProductById,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error("useApi must be used within ApiProvider");
  return ctx;
}

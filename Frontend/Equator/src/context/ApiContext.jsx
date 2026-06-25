import { createContext, useContext, useState } from "react";

// ─── Hero Slides ──────────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    id: 1,
    tag: "ÉDITION LIMITÉE 2024",
    title: "L'élégance durable pour votre quotidien",
    subtitle: "Découvrez une sélection rigoureuse d'objets conçus pour durer, alliant artisanat d'exception et respect de l'environnement.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80",
    cta: "Acheter maintenant",
    ctaSecondary: "Voir la collection",
  },
  {
    id: 2,
    tag: "ARTISANAT LOCAL",
    title: "Chaque pièce raconte une histoire",
    subtitle: "Des créateurs locaux qui façonnent le monde de demain avec passion et savoir-faire.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&q=80",
    cta: "Explorer",
    ctaSecondary: "Nos artisans",
  },
  {
    id: 3,
    tag: "MODE DURABLE",
    title: "Une garde-robe qui respecte la planète",
    subtitle: "Matières naturelles et coupes intemporelles pour un style conscient et raffiné.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80",
    cta: "Découvrir",
    ctaSecondary: "Mode Durable",
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 1, name: "Maison & Jardin", slug: "maison-jardin", count: 128,
    description: "Collection Signature",
    longDesc: "Découvrez une sélection exclusive de produits haut de gamme conçus pour élever votre quotidien avec élégance et fonctionnalité.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
    subcategories: ["Design d'intérieur", "Accessoires de Bureau", "Mobilier Moderne"],
  },
  {
    id: 2, name: "Électronique", slug: "electronique", count: 94,
    description: "Tech & Innovation",
    longDesc: "Les dernières innovations technologiques sélectionnées par nos experts pour des performances et un design irréprochables.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    subcategories: ["Audio", "Wearables", "Accessoires"],
  },
  {
    id: 3, name: "Mode", slug: "mode", count: 89,
    description: "Style & Élégance",
    longDesc: "Une garde-robe curatée pour les esprits exigeants, alliant matières nobles et coupes intemporelles.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    subcategories: ["Vêtements", "Accessoires", "Chaussures"],
  },
  {
    id: 4, name: "Beauté", slug: "beaute", count: 56,
    description: "Soins & Bien-être",
    longDesc: "Des formules d'exception pour prendre soin de vous avec des ingrédients naturels et éco-responsables.",
    image: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?w=1200&q=80",
    subcategories: ["Soins visage", "Corps", "Parfums"],
  },
];

// ─── Stores ───────────────────────────────────────────────────────────────────
const ALL_STORES = [
  {
    id: 1,
    name: "L'Artisan Parisien",
    slug: "artisan-parisien",
    category: "Artisanat",
    badge: "LUXE",
    badgeColor: "#1b4332",
    description: "Maison de maroquinerie d'exception utilisant des techniques ancestrales. Chaque pièce est unique, fabriquée à la main dans notre atelier historique du Marais avec les cuirs les plus fins sourcés localement.",
    image: "https://images.unsplash.com/photo-1604754742629-3e5728249d73?w=800&q=80",
    rating: 4.9,
    reviewCount: 128,
    badge2: "Expédition sous 24h",
    avatars: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=80",
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&q=80",
    ],
    productCount: 12,
  },
  {
    id: 2,
    name: "Tech Horizon",
    slug: "tech-horizon",
    category: "Électronique",
    badge: "ÉLECTRONIQUE",
    badgeColor: "#1a3a5c",
    description: "Votre destination privilégiée pour les dernières innovations technologiques et accessoires haut de gamme. Nous sélectionnons uniquement les produits offrant une performance supérieure et un design irréprochable.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    rating: 4.7,
    reviewCount: 562,
    badge2: "Garantie 2 ans",
    avatars: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80",
    ],
    productCount: 45,
  },
  {
    id: 3,
    name: "Écho Durable",
    slug: "echo-durable",
    category: "Maison",
    badge: "MAISON",
    badgeColor: "#2d4a3e",
    description: "Décoration et mobilier éco-conçus pour un intérieur sain et serein. Nous privilégions les matériaux naturels, recyclés et une production locale pour réduire notre empreinte carbone tout en sublimant votre espace.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
    rating: 4.8,
    reviewCount: 89,
    badge2: "Eco-Responsable",
    avatars: [
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=40&q=80",
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=40&q=80",
    ],
    productCount: 28,
  },
  {
    id: 4,
    name: "Mode Durable",
    slug: "mode-durable",
    category: "Mode & Luxe",
    badge: "MODE",
    badgeColor: "#3d2b1f",
    description: "Une garde-robe qui respecte la planète. Matières naturelles et coupes intemporelles pour un style conscient et raffiné.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    rating: 4.6,
    reviewCount: 203,
    badge2: "Livraison offerte",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40&q=80",
    ],
    productCount: 34,
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────
const ALL_PRODUCTS = [
  {
    id: 1,
    name: "Vase en céramique brute",
    store: "L'Artisan Parisien",
    storeSlug: "artisan-parisien",
    price: 75.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    ],
    badge: null,
    category: "Maison & Jardin",
    subcategory: "Design d'intérieur",
    rating: 4.8,
    reviewCount: 24,
    description: "Un chef-d'œuvre de précision artisanale. Ce vase allie l'élégance intemporelle à une céramique d'exception. Conçu pour ceux qui exigent l'exceptionnel au quotidien.",
    specs: { Matière: "Céramique brute", Dimensions: "H 28cm × Ø 14cm", Origine: "France", Poids: "1.2 kg" },
    reviews: [
      { id: 1, name: "Julien Delacroix", avatar: "JD", date: "il y a 2 jours", rating: 5, text: "Qualité de fabrication exceptionnelle. La texture brute est encore plus belle en vrai que sur les photos. La livraison a été extrêmement rapide et le packaging est très luxueux." },
      { id: 2, name: "Marie Lefèvre", avatar: "ML", date: "il y a 1 semaine", rating: 5, text: "Un design d'une sobriété magnifique. Je suis très satisfaite de mon achat. Le service client d'Equator a été impeccable pour répondre à mes questions." },
    ],
    ratingBreakdown: { 5: 18, 4: 4, 3: 2 },
    isLimited: false,
    delivery: "Livraison Express Offerte",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 2,
    name: "Sac cabas en coton recyclé",
    store: "Mode Durable",
    storeSlug: "mode-durable",
    price: 45.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"],
    badge: "Durable",
    category: "Mode",
    subcategory: "Accessoires",
    rating: 4.7,
    reviewCount: 38,
    description: "Sac cabas confectionné en coton recyclé, alliant praticité et engagement environnemental. Un accessoire iconique pour le quotidien.",
    specs: { Matière: "Coton recyclé 100%", Dimensions: "40×35×12 cm", Couleur: "Naturel", Certification: "GOTS" },
    reviews: [],
    ratingBreakdown: { 5: 28, 4: 7, 3: 3 },
    isLimited: false,
    delivery: "Livraison Express Offerte",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 3,
    name: "Sandales en cuir végétal",
    store: "L'Artisan Parisien",
    storeSlug: "artisan-parisien",
    price: 120.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80"],
    badge: null,
    category: "Mode",
    subcategory: "Chaussures",
    rating: 4.6,
    reviewCount: 17,
    description: "Sandales artisanales en cuir végétal tanné naturellement. Confort naturel et durabilité exemplaire.",
    specs: { Matière: "Cuir végétal", Semelle: "Caoutchouc naturel", Origine: "Italie" },
    reviews: [],
    ratingBreakdown: { 5: 11, 4: 4, 3: 2 },
    isLimited: false,
    delivery: "Expédition sous 48h",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 4,
    name: "Bougie bois de santal",
    store: "Écho Durable",
    storeSlug: "echo-durable",
    price: 32.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1608181831718-c9ebb5d09652?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1608181831718-c9ebb5d09652?w=800&q=80"],
    badge: null,
    category: "Maison & Jardin",
    subcategory: "Design d'intérieur",
    rating: 4.9,
    reviewCount: 52,
    description: "Bougie artisanale au bois de santal. Cire de soja naturelle, mèche en coton. Ambiance douce et enveloppante.",
    specs: { Matière: "Cire de soja", Parfum: "Bois de santal", Durée: "45h", Contenance: "220g" },
    reviews: [],
    ratingBreakdown: { 5: 44, 4: 6, 3: 2 },
    isLimited: false,
    delivery: "Livraison Express Offerte",
    warranty: "Satisfait ou remboursé 30 jours",
  },
  {
    id: 5,
    name: "Chaise de Bureau Minimaliste",
    store: "Écho Durable",
    storeSlug: "echo-durable",
    price: 249.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80"],
    badge: "Artisanat",
    category: "Maison & Jardin",
    subcategory: "Mobilier Moderne",
    rating: 4.8,
    reviewCount: 31,
    description: "Chaise de bureau au design scandinave, fabriquée en bois de hêtre massif. Élégance fonctionnelle.",
    specs: { Matière: "Bois de hêtre massif", Dimensions: "H82×L45×P48 cm", Capacité: "120 kg" },
    reviews: [],
    ratingBreakdown: { 5: 24, 4: 5, 3: 2 },
    isLimited: false,
    delivery: "Livraison programmée",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 6,
    name: "Canapé Velours Emeraude",
    store: "Écho Durable",
    storeSlug: "echo-durable",
    price: 1299.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    badge: "Salon",
    category: "Maison & Jardin",
    subcategory: "Mobilier Moderne",
    rating: 4.9,
    reviewCount: 18,
    description: "Canapé 3 places en velours côtelé émeraude. Structure en bois massif, pieds laiton brossé.",
    specs: { Matière: "Velours côtelé", Couleur: "Émeraude", Dimensions: "L200×H82×P90 cm" },
    reviews: [],
    ratingBreakdown: { 5: 16, 4: 2, 3: 0 },
    isLimited: false,
    delivery: "Livraison programmée",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 7,
    name: "Article X Chronographe",
    store: "Tech Horizon",
    storeSlug: "tech-horizon",
    price: 1250.0,
    originalPrice: 1500.0,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=500&q=80",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80",
      "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f?w=800&q=80",
    ],
    badge: "ÉDITION LIMITÉE",
    category: "Électronique",
    subcategory: "Wearables",
    rating: 4.9,
    reviewCount: 128,
    description: "Un chef-d'œuvre de précision horlogère. L'Article X allie l'élégance intemporelle à une ingénierie de pointe. Conçu pour ceux qui exigent l'exceptionnel au quotidien.",
    specs: { Mouvement: "Automatique Suisse", Boîtier: "Acier 316L", Verre: "Saphir", Étanchéité: "200m", Bracelet: "Acier brossé" },
    reviews: [
      { id: 1, name: "Julien Delacroix", avatar: "JD", date: "il y a 2 jours", rating: 5, text: "Qualité de fabrication exceptionnelle. Le cadran émeraude est encore plus beau en vrai que sur les photos. La livraison a été extrêmement rapide et le packaging est très luxueux." },
      { id: 2, name: "Marie Lefèvre", avatar: "ML", date: "il y a 1 semaine", rating: 5, text: "Un design d'une sobriété magnifique. Je suis très satisfaite de mon achat. Le service client d'Equator a été impeccable pour répondre à mes questions sur l'ajustement du bracelet." },
    ],
    ratingBreakdown: { 5: 98, 4: 22, 3: 8 },
    isLimited: true,
    delivery: "Livraison Express Offerte",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 8,
    name: "Casque Audio Studio Pro",
    store: "Tech Horizon",
    storeSlug: "tech-horizon",
    price: 249.0,
    originalPrice: 310.0,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    badge: "-20%",
    category: "Électronique",
    subcategory: "Audio",
    rating: 4.7,
    reviewCount: 89,
    description: "Casque professionnel à réduction de bruit active. Son studio qualité, confort longue durée.",
    specs: { Connectivité: "Bluetooth 5.3", Autonomie: "40h", Réduction: "Active ANC", Transducteur: "40mm" },
    reviews: [],
    ratingBreakdown: { 5: 67, 4: 15, 3: 7 },
    isLimited: false,
    delivery: "Livraison Express Offerte",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 9,
    name: "Montre Minimaliste Or Rose",
    store: "Tech Horizon",
    storeSlug: "tech-horizon",
    price: 199.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    badge: null,
    category: "Électronique",
    subcategory: "Wearables",
    rating: 4.9,
    reviewCount: 156,
    description: "Montre minimaliste en acier or rose. Cadran épuré, bracelet cuir véritable. L'élégance à son état pur.",
    specs: { Boîtier: "Acier or rose 40mm", Verre: "Minéral", Bracelet: "Cuir véritable", Étanchéité: "5ATM" },
    reviews: [],
    ratingBreakdown: { 5: 130, 4: 20, 3: 6 },
    isLimited: false,
    delivery: "Expédition sous 24h",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 10,
    name: "Chaussure Running Premium",
    store: "Mode Durable",
    storeSlug: "mode-durable",
    price: 129.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"],
    badge: "NOUVEAU",
    category: "Mode",
    subcategory: "Chaussures",
    rating: 4.8,
    reviewCount: 24,
    description: "Chaussure running haute performance. Semelle amortissante, tige respirante. Pour les athlètes exigeants.",
    specs: { Tige: "Mesh respirant", Semelle: "React Foam", Poids: "265g", Usage: "Route" },
    reviews: [],
    ratingBreakdown: { 5: 18, 4: 4, 3: 2 },
    isLimited: false,
    delivery: "Livraison Express Offerte",
    warranty: "Satisfait ou remboursé 30 jours",
  },
  {
    id: 11,
    name: "Lunettes Solaires Aviateur",
    store: "Mode Durable",
    storeSlug: "mode-durable",
    price: 89.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80"],
    badge: null,
    category: "Mode",
    subcategory: "Accessoires",
    rating: 4.6,
    reviewCount: 42,
    description: "Lunettes aviateur intemporelles, monture métal doré. Verres polarisés UV400 protection totale.",
    specs: { Monture: "Métal doré", Verres: "Polarisés", Protection: "UV400", Standard: "CE" },
    reviews: [],
    ratingBreakdown: { 5: 30, 4: 8, 3: 4 },
    isLimited: false,
    delivery: "Expédition sous 48h",
    warranty: "Garantie Equator 2 ans incluse",
  },
  {
    id: 12,
    name: "Table Basse Sculptura",
    store: "Écho Durable",
    storeSlug: "echo-durable",
    price: 450.0,
    originalPrice: null,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    badge: null,
    category: "Maison & Jardin",
    subcategory: "Mobilier Moderne",
    rating: 5.0,
    reviewCount: 11,
    description: "Table basse en noyer massif, plateau verre trempé. Une sculpture fonctionnelle pour votre salon.",
    specs: { Matière: "Noyer massif + verre", Dimensions: "L120×H40×P60 cm", Finition: "Huile naturelle" },
    reviews: [],
    ratingBreakdown: { 5: 11, 4: 0, 3: 0 },
    isLimited: false,
    delivery: "Livraison programmée",
    warranty: "Garantie Equator 2 ans incluse",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────
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
    if (filters.category) products = products.filter((p) => p.category === filters.category);
    if (filters.subcategory) products = products.filter((p) => p.subcategory === filters.subcategory);
    if (filters.storeSlug) products = products.filter((p) => p.storeSlug === filters.storeSlug);
    if (filters.query) {
      const q = filters.query.toLowerCase();
      products = products.filter((p) => p.name.toLowerCase().includes(q) || p.store.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (filters.minPrice !== undefined) products = products.filter((p) => p.price >= filters.minPrice);
    if (filters.maxPrice !== undefined) products = products.filter((p) => p.price <= filters.maxPrice);
    if (filters.minRating !== undefined) products = products.filter((p) => p.rating >= filters.minRating);
    if (filters.sort === "price-asc") products.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") products.sort((a, b) => b.price - a.price);
    if (filters.sort === "rating") products.sort((a, b) => b.rating - a.rating);
    if (filters.sort === "recent") products.sort((a, b) => b.id - a.id);
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
      // ── Backward-compat aliases used by HomePage ──
      featuredProducts: ALL_PRODUCTS.slice(0, 4),
      partnerStores: ALL_STORES.slice(0, 2).map(s => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        description: s.description,
        image: s.image,
      })),
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

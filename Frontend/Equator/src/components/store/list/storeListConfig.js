export const STORE_CATEGORIES = [
  { id: "all", label: "Toutes les boutiques", keywords: [] },
  {
    id: "electronics",
    label: "Électronique",
    keywords: ["tech", "technologie", "technology", "électronique", "electronique", "phone", "smartphone", "ordinateur", "computer", "laptop", "pc", "informatique", "gaming", "accessoire", "accessoires"],
  },
  {
    id: "fashion",
    label: "Mode & Luxe",
    keywords: ["mode", "fashion", "luxe", "luxury", "vêtement", "vetement", "chaussure", "sac", "bijou", "montre", "maroquinerie", "textile"],
  },
  {
    id: "home",
    label: "Maison & Design",
    keywords: ["maison", "home", "design", "déco", "deco", "décoration", "decoration", "meuble", "mobilier", "jardin", "intérieur", "interieur", "cuisine"],
  },
  {
    id: "beauty",
    label: "Beauté & Bien-être",
    keywords: ["beauté", "beaute", "beauty", "cosmétique", "cosmetique", "soin", "bien-être", "bien etre", "wellness", "parfum", "cheveux", "skin", "visage"],
  },
  {
    id: "food",
    label: "Alimentation",
    keywords: ["food", "alimentaire", "alimentation", "restaurant", "cuisine", "épicerie", "epicerie", "boisson", "snack", "pâtisserie", "patisserie"],
  },
  {
    id: "artisanal",
    label: "Artisanat",
    keywords: ["artisan", "artisanat", "handmade", "fait main", "local", "création", "creation", "atelier", "traditionnel"],
  },
  { id: "other", label: "Autres boutiques", keywords: [] },
];

export const FILTER_OPTIONS = [
  { id: "express", label: "Livraison Express" },
  { id: "certified", label: "Vendeurs Certifiés" },
  { id: "new", label: "Nouveautés" },
];

export const STORES_PER_PAGE = 6;

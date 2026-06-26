import { useMemo, useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { useStores } from "../../../hooks/useStores";
import { STORE_CATEGORIES, STORES_PER_PAGE } from "./storeListConfig";
import { buildStoreProductMetrics, enrichStore, matchesActiveFilters } from "./storeListUtils";

export default function useStoresPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState([]);
  const [page, setPage] = useState(1);

  const storeParams = useMemo(() => ({ pageSize: 100 }), []);
  const { stores: apiStores, loading, error, isEmpty } = useStores(storeParams);
  const { products: allProducts } = useProducts({ pageSize: 100 });

  const productMetrics = useMemo(() => buildStoreProductMetrics(allProducts || []), [allProducts]);
  const categorizedStores = useMemo(() => (apiStores || []).map((store) => enrichStore(store, productMetrics)), [apiStores, productMetrics]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    STORE_CATEGORIES.forEach((category) => {
      counts[category.id] = 0;
    });

    categorizedStores.forEach((store) => {
      counts.all += 1;
      counts[store.derivedCategoryId] = (counts[store.derivedCategoryId] || 0) + 1;
    });

    return counts;
  }, [categorizedStores]);

  const filteredStores = useMemo(() => {
    return categorizedStores.filter((store) => {
      const categoryMatches = activeCategory === "all" || store.derivedCategoryId === activeCategory;
      return categoryMatches && matchesActiveFilters(store, activeFilters);
    });
  }, [categorizedStores, activeCategory, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredStores.length / STORES_PER_PAGE));
  const stores = filteredStores.slice((page - 1) * STORES_PER_PAGE, page * STORES_PER_PAGE);


  const toggleFilter = (filterId) => {
    setActiveFilters((previous) =>
      previous.includes(filterId) ? previous.filter((item) => item !== filterId) : [...previous, filterId]
    );
    setPage(1);
  };

  return {
    activeCategory,
    setActiveCategory: (category) => {
      setActiveCategory(category);
      setPage(1);
    },
    activeFilters,
    toggleFilter,
    page,
    setPage,
    stores,
    filteredStores,
    categoryCounts,
    totalPages,
    loading,
    error,
    isEmpty,
  };
}

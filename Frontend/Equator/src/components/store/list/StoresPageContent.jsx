import Footer from "../layout/Footer";
import Pagination from "../common/Pagination";
import StoreCard from "./list/StoreCard";
import StoresHeader from "./list/StoresHeader";
import StoresSidebar from "./list/StoresSidebar";
import StoresStatus from "./list/StoresStatus";
import useStoresPage from "./list/useStoresPage";

export default function StoresPage() {
  const {
    activeCategory,
    setActiveCategory,
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
  } = useStoresPage();

  const hasContent = !loading && !error && !isEmpty && stores.length > 0;

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex gap-6">
        <StoresSidebar
          activeCategory={activeCategory}
          onChangeCategory={setActiveCategory}
          activeFilters={activeFilters}
          onToggleFilter={toggleFilter}
          categoryCounts={categoryCounts}
        />

        <div className="flex-1 min-w-0">
          <StoresHeader loading={loading} page={page} storesCount={stores.length} filteredCount={filteredStores.length} />
          <StoresStatus loading={loading} error={error} isEmpty={isEmpty || stores.length === 0} />

          {hasContent && (
            <>
              <div className="space-y-4">
                {stores.map((store) => <StoreCard key={store.id} store={store} />)}
              </div>

              {totalPages > 1 && <Pagination current={page} total={totalPages} onChange={setPage} />}
            </>
          )}
        </div>
      </div>

      <Footer variant="stores" />
    </div>
  );
}

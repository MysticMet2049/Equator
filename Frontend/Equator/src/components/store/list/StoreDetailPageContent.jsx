import Footer from "../layout/Footer";
import StoreDetailStatus from "./detail/StoreDetailStatus";
import StoreHero from "./detail/StoreHero";
import StoreInfoTab from "./detail/StoreInfoTab";
import StoreProductsTab from "./detail/StoreProductsTab";
import StoreReviewsTab from "./detail/StoreReviewsTab";
import StoreSummaryCard from "./detail/StoreSummaryCard";
import StoreTabsNav from "./detail/StoreTabsNav";
import useStoreDetailPage from "./detail/useStoreDetailPage";

export default function StoreDetailPage() {
  const {
    store,
    products,
    storeLoading,
    storeError,
    productsLoading,
    productsError,
    notFound,
    isAuthenticated,
    activeTab,
    setActiveTab,
    followed,
    setFollowed,
    shared,
    contactOpen,
    setContactOpen,
    showAllDesc,
    setShowAllDesc,
    ratingBreakdown,
    totalReviews,
    whatsappUrl,
    handleShare,
    goBack,
  } = useStoreDetailPage();

  if (!store && storeLoading) return <StoreDetailStatus type="loading" />;
  if (!store && storeError) return <StoreDetailStatus type="error" />;
  if (notFound || !store) return <StoreDetailStatus type="notFound" />;

  return (
    <div className="min-h-screen pt-14" style={{ background: "var(--color-equator-cream)" }}>
      <StoreHero store={store} shared={shared} onBack={goBack} onShare={handleShare} />

      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <StoreSummaryCard
          store={store}
          followed={followed}
          setFollowed={setFollowed}
          contactOpen={contactOpen}
          setContactOpen={setContactOpen}
          isAuthenticated={isAuthenticated}
          whatsappUrl={whatsappUrl}
        />

        <StoreTabsNav activeTab={activeTab} setActiveTab={setActiveTab} productsLoading={productsLoading} productsCount={products.length} />

        {activeTab === 0 && <StoreProductsTab products={products} store={store} loading={productsLoading} error={productsError} />}
        {activeTab === 1 && <StoreReviewsTab store={store} isAuthenticated={isAuthenticated} ratingBreakdown={ratingBreakdown} totalReviews={totalReviews} />}
        {activeTab === 2 && (
          <StoreInfoTab
            store={store}
            isAuthenticated={isAuthenticated}
            showAllDesc={showAllDesc}
            setShowAllDesc={setShowAllDesc}
            whatsappUrl={whatsappUrl}
          />
        )}
      </div>

      <Footer variant="stores" />
    </div>
  );
}

import HeroCarousel from "../components/home/HeroCarousel";
import FeaturedProductsSection from "../components/home/sections/FeaturedProductsSection";
import PartnerStoresSection from "../components/home/sections/PartnerStoresSection";
import TrustBadgesSection from "../components/home/sections/TrustBadgesSection";
import { buildHeroSlides } from "../components/home/homePageUtils";
import { useProducts } from "../hooks/useProducts";
import { useHeadlineStores } from "../hooks/useStores";

// Page d'accueil : elle assemble les grandes sections sans contenir leur JSX détaillé.
export default function HomePage() {
  const {
    products: featuredProducts,
    loading: productsLoading,
    error: productsError,
    isEmpty: productsEmpty,
  } = useProducts({ pageSize: 8 });

  const {
    stores: partnerStores,
    loading: storesLoading,
    error: storesError,
    isEmpty: storesEmpty,
  } = useHeadlineStores({ pageSize: 2 });

  const heroSlides = buildHeroSlides(featuredProducts);

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <FeaturedProductsSection
        products={featuredProducts}
        loading={productsLoading}
        error={productsError}
        isEmpty={productsEmpty}
      />

      <PartnerStoresSection
        stores={partnerStores}
        loading={storesLoading}
        error={storesError}
        isEmpty={storesEmpty}
      />

      <TrustBadgesSection />
    </div>
  );
}

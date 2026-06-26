import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useProducts } from "../../../hooks/useProducts";
import { useStores } from "../../../hooks/useStores";
import { DEFAULT_RATING_BREAKDOWN, getProductStoreId, normalizeStore } from "./storeDetailUtils";

const WHATSAPP_MESSAGE = "Bonjour, je suis intéressé(e) par vos produits sur Equator Marketplace. Pouvez-vous m'en dire plus ?";

export default function useStoreDetailPage() {
  const { id } = useParams();
  const storeId = id;
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const storeFromNavigation = routerLocation.state?.store || null;
  const { isAuthenticated } = useAuth();

  const { stores: allStores, loading: storeLoading, error: storeError } = useStores({ pageSize: 100 });
  const { products: allProducts, loading: productsLoading, error: productsError } = useProducts({ pageSize: 100 });

  const apiStore = useMemo(() => {
    if (storeFromNavigation && String(storeFromNavigation.id) === String(storeId)) return storeFromNavigation;
    return allStores.find((store) => String(store.id) === String(storeId));
  }, [storeFromNavigation, allStores, storeId]);

  const products = useMemo(() => {
    return allProducts.filter((product) => String(getProductStoreId(product)) === String(storeId));
  }, [allProducts, storeId]);

  const store = useMemo(() => normalizeStore(apiStore, products.length), [apiStore, products.length]);
  const notFound = !apiStore && !storeLoading && !storeError;

  const [activeTab, setActiveTab] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [shared, setShared] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [showAllDesc, setShowAllDesc] = useState(false);

  const ratingBreakdown = store?.ratingBreakdown || DEFAULT_RATING_BREAKDOWN;
  const totalReviews = Object.values(ratingBreakdown).reduce((total, value) => total + Number(value || 0), 0);

  const whatsappUrl = store?.contact?.whatsapp
    ? `https://wa.me/${store.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : null;

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: store.name, text: store.tagline, url });
      } catch {
        return;
      }
      return;
    }

    await navigator.clipboard.writeText(url).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return {
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
    goBack: () => navigate(-1),
  };
}

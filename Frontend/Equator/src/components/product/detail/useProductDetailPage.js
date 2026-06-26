import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../context/ApiContext";
import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../hooks/useCart";
import { useProducts } from "../../../hooks/useProducts";
import {
  getProductId,
  getProductImages,
  getSimilarProducts,
  normalizeProduct,
  productMatchesRoute,
} from "./productDetailUtils";

export default function useProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const productFromNavigation = routerLocation.state?.product || null;

  const { toggleWishlist, isInWishlist } = useApi();
  const { isAuthenticated } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();

  const { products: allProducts, loading, error } = useProducts({ pageSize: 100 });

  const apiProduct = useMemo(() => {
    if (productMatchesRoute(productFromNavigation, id)) return productFromNavigation;
    return allProducts.find((item) => productMatchesRoute(item, id)) || null;
  }, [productFromNavigation, allProducts, id]);

  const product = useMemo(() => normalizeProduct(apiProduct), [apiProduct]);
  const similar = useMemo(() => getSimilarProducts(allProducts, product), [allProducts, product]);
  const images = useMemo(() => getProductImages(product), [product]);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!product?.id || !product?.storeId) {
      console.warn("[ProductDetailPage] productId ou storeId manquant :", product);
      return;
    }

    try {
      for (let i = 0; i < qty; i += 1) {
        await addToCart(product.id, product.storeId);
      }

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error("[ProductDetailPage] Erreur ajout panier :", err);
    }
  };

  return {
    product,
    loading,
    error,
    images,
    similar,
    activeImg,
    setActiveImg,
    qty,
    setQty,
    activeTab,
    setActiveTab,
    added,
    cartLoading,
    wishlisted: product ? isInWishlist(getProductId(product)) : false,
    handleAdd,
    toggleWishlist: () => product && toggleWishlist(getProductId(product)),
    goToMarketplace: () => navigate("/marketplace"),
  };
}

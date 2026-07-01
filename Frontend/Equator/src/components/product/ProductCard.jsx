import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import StarRating from "../common/StarRating";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../hooks/useCart";
import ApiImage from "../common/ApiImage";
import ProductFavoriteButton from "../favorites/ProductFavoriteButton";

function getProductId(product) {
  return product?.productId || product?.id || product?.promoId || null;
}

function getProductImageUrl(product) {
  const image =
    product?.image ||
    product?.thumbnail ||
    product?.cover ||
    product?.coverImage ||
    null;

  if (!image || typeof image !== "string") return null;

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return null;
}

function ProductImage({ product }) {
  const productId = getProductId(product);
  const fallbackImage = getProductImageUrl(product);

  if (product?.coverAssetId && productId) {
    return (
      <ApiImage
        assetId={product.coverAssetId}
        refType="PRODUCT"
        refEntityId={productId}
        type="PRODUCT_IMAGE"
        alt={product.name || "Produit"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  if (fallbackImage) {
    return (
      <img
        src={fallbackImage}
        alt={product?.name || "Produit"}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span
        className="text-xs"
        style={{
          color: "var(--color-equator-muted)",
          fontFamily: "var(--font-body)",
        }}
      >
        Image indisponible
      </span>
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();
  const [localError, setLocalError] = useState(null);

  const productId = getProductId(product);

  const handleNavigate = () => {
    if (!productId) return;

    navigate(`/product/${productId}`, {
      state: {
        product: {
          ...product,
          id: productId,
          productId,
        },
      },
    });
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    setLocalError(null);

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!productId || !product?.storeId) {
      console.warn("[ProductCard] productId ou storeId manquant :", product);
      setLocalError("Impossible d’ajouter ce produit au panier.");
      return;
    }

    try {
      await addToCart(productId, product.storeId);
    } catch (err) {
      console.error("[ProductCard] Erreur ajout panier :", err);
      setLocalError("Impossible d’ajouter ce produit au panier.");
    }
  };

  const handleFavoriteError = (error) => {
    console.error("[ProductCard] Erreur favori :", error);
    setLocalError(error?.message || "Impossible de mettre à jour les favoris.");
  };

  return (
    <div
      className="product-card group relative cursor-pointer"
      onClick={handleNavigate}
    >
      <div
        className="relative overflow-hidden rounded-xl mb-3"
        style={{ aspectRatio: "1 / 1", background: "#f0ebe3" }}
      >
        <ProductImage product={product} />

        {product?.badge && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: String(product.badge).startsWith("-")
                ? "#dc2626"
                : "var(--color-equator-green)",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
            }}
          >
            {product.badge}
          </span>
        )}

        <ProductFavoriteButton
          product={product}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
          iconSize={12}
          onError={handleFavoriteError}
        />

        <button
          onClick={handleAddToCart}
          disabled={cartLoading}
          className="absolute bottom-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 disabled:opacity-60"
          style={{
            background: "white",
            boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
          }}
          aria-label="Ajouter au panier"
        >
          <FiShoppingCart
            size={13}
            style={{ color: "var(--color-equator-green)" }}
          />
        </button>
      </div>

      <div>
        <p
          className="text-xs mb-0.5"
          style={{
            color: "var(--color-equator-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          {product?.storeName || product?.store || "Store partenaire"}
        </p>

        <h3
          className="text-sm font-medium mb-1 leading-snug"
          style={{
            color: "var(--color-equator-text)",
            fontFamily: "var(--font-body)",
          }}
        >
          {product?.name || "Produit"}
        </h3>

        <div className="flex items-center justify-between">
          <p
            className="text-sm font-semibold"
            style={{
              color: "var(--color-equator-text)",
              fontFamily: "var(--font-body)",
            }}
          >
            {Number(product?.price || 0).toLocaleString("fr-FR")} FCFA
          </p>

          {Boolean(product?.rating) && (
            <StarRating rating={product.rating} size={11} showValue />
          )}
        </div>

        {localError && (
          <p className="text-[11px] mt-1" style={{ color: "#dc2626" }}>
            {localError}
          </p>
        )}
      </div>
    </div>
  );
}
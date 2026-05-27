import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import StarRating from "./StarRating";
import { useApi } from "../context/ApiContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useApi();
  const navigate = useNavigate();
  const wishlisted = isInWishlist(product.id);

  return (
    <div
      className="product-card group relative cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden rounded-xl mb-3"
        style={{ aspectRatio: "1 / 1", background: "#f0ebe3" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-2 left-2 text-white text-xs font-medium px-2 py-0.5 rounded"
            style={{
              background: product.badge.startsWith("-") ? "#dc2626" : "var(--color-equator-green)",
              fontFamily: "var(--font-body)",
              fontSize: "10px",
            }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          aria-label="Ajouter aux favoris"
        >
          <FiHeart
            size={12}
            style={{
              color: wishlisted ? "#dc2626" : "var(--color-equator-muted)",
              fill: wishlisted ? "#dc2626" : "none",
            }}
          />
        </button>

        {/* Add to cart button */}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="absolute bottom-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
          style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
          aria-label="Ajouter au panier"
        >
          <FiShoppingCart size={13} style={{ color: "var(--color-equator-green)" }} />
        </button>
      </div>

      {/* Info */}
      <div>
        <p
          className="text-xs mb-0.5"
          style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
        >
          {product.store}
        </p>
        <h3
          className="text-sm font-medium mb-1 leading-snug"
          style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
        >
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}
          >
            {product.price.toFixed(2).replace(".", ",")} €
          </p>
          {product.rating && <StarRating rating={product.rating} size={11} showValue />}
        </div>
      </div>
    </div>
  );
}

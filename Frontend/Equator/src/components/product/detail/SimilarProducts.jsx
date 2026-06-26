import { Link } from "react-router-dom";
import { formatPrice, getProductId, getProductImages } from "./productDetailUtils";
import ProductImage from "./ProductImage";

export default function SimilarProducts({ products }) {
  if (!products.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 mb-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            INSPIRATION
          </p>

          <p className="text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
            Produits similaires
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((item) => {
          const similarId = getProductId(item);
          const similarImages = getProductImages(item);

          return (
            <Link
              key={similarId || item.name}
              to={`/product/${similarId}`}
              state={{ product: { ...item, id: similarId, productId: similarId } }}
              className="group block"
            >
              <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "1/1", background: "#f0ebe3" }}>
                <ProductImage
                  image={similarImages[0]}
                  product={item}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <p className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                {item.name}
              </p>

              <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                {formatPrice(item.price, item.currency)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

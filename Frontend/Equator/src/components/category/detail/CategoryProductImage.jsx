import ApiImage from "../../common/ApiImage";
import { getProductImage } from "../categoryUtils";

export default function CategoryProductImage({ product }) {
  const image = getProductImage(product);

  if (product.coverAssetId) {
    return (
      <ApiImage
        assetId={product.coverAssetId}
        refType="PRODUCT"
        refEntityId={product.id}
        type="PRODUCT_IMAGE"
        alt={product.name || "Produit"}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    );
  }

  if (image) {
    return (
      <img
        src={image}
        alt={product.name || "Produit"}
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-xs" style={{ color: "var(--color-equator-muted)" }}>
        Image indisponible
      </span>
    </div>
  );
}

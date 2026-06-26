import ApiImage from "../../common/ApiImage";
import { getProductId } from "./productDetailUtils";

export default function ProductImage({ image, product, className = "w-full h-full object-cover" }) {
  const productId = getProductId(product);

  if (image?.kind === "asset" && image.assetId && productId) {
    return (
      <ApiImage
        assetId={image.assetId}
        refType="PRODUCT"
        refEntityId={productId}
        type="PRODUCT_IMAGE"
        alt={product?.name || "Produit"}
        className={className}
      />
    );
  }

  if (image?.kind === "url" && image.src) {
    return <img src={image.src} alt={product?.name || "Produit"} className={className} />;
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="text-sm" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        Image indisponible
      </span>
    </div>
  );
}

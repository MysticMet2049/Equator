import { Link } from "react-router-dom";
import { FiArrowRight, FiShield } from "react-icons/fi";
import { PiStorefront } from "react-icons/pi";
import ApiImage from "../../common/ApiImage";
import StarRating from "../../common/StarRating";
import { getStoreAssetId, getStoreId, getStoreImage } from "./storeListUtils";

export default function StoreCard({ store }) {
  const fallbackImage = getStoreImage(store);
  const imageAssetId = getStoreAssetId(store);
  const storeId = getStoreId(store);

  const rating = Number(store.computedRating || 0);
  const reviewCount = Number(store.computedReviewCount || 0);
  const productCount = Number(store.computedProductCount || 0);

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row"
      style={{ border: "1px solid var(--color-equator-beige)", transition: "box-shadow 0.2s" }}
      onMouseEnter={(event) => {
        event.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = "none";
      }}
    >
      <StoreCardImage store={store} storeId={storeId} imageAssetId={imageAssetId} fallbackImage={fallbackImage} />

      <div className="flex flex-col justify-between p-5 flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-lg font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              {store.name || "Boutique"}
            </h2>

            {store.derivedCategoryLabel && <CategoryBadge label={store.derivedCategoryLabel} />}
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {store.description || "Boutique partenaire sur Equator Marketplace."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <StoreRating rating={rating} reviewCount={reviewCount} />
          {(store.badge2 || store.isVerified || store.certified || store.verified) && <VerifiedBadge label={store.badge2 || "Vendeur vérifié"} />}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
            {productCount} produit{productCount > 1 ? "s" : ""}
          </span>

          <Link
            to={`/stores/${storeId}`}
            state={{ store }}
            className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)" }}
          >
            Visiter le store <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StoreCardImage({ store, storeId, imageAssetId, fallbackImage }) {
  return (
    <div className="relative overflow-hidden shrink-0" style={{ width: "clamp(200px, 30%, 280px)", minHeight: "180px", background: "var(--color-equator-beige)" }}>
      {imageAssetId && storeId ? (
        <ApiImage
          assetId={imageAssetId}
          refType="STORE"
          refEntityId={storeId}
          type="STORE_BANNER_IMAGE"
          typeCandidates={["BANNER", "COVER", "LOGO", "IMAGE"]}
          alt={store.name || "Boutique"}
          className="w-full h-full object-cover"
          style={{ minHeight: "180px" }}
        />
      ) : fallbackImage ? (
        <img src={fallbackImage} alt={store.name || "Boutique"} className="w-full h-full object-cover" style={{ minHeight: "180px" }} />
      ) : (
        <div className="w-full h-full min-h-[180px] flex items-center justify-center">
          <PiStorefront size={42} style={{ color: "var(--color-equator-green)" }} />
        </div>
      )}
    </div>
  );
}

function CategoryBadge({ label }) {
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full text-white shrink-0"
      style={{ background: "var(--color-equator-green)", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}
    >
      {label}
    </span>
  );
}

function StoreRating({ rating, reviewCount }) {
  return (
    <div className="flex items-center gap-1.5">
      <StarRating rating={rating} size={13} />
      <span className="text-sm font-medium" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
        {rating.toFixed(1).replace(".0", "")}
      </span>
      <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        ({reviewCount} avis)
      </span>
    </div>
  );
}

function VerifiedBadge({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#e8f5ee" }}>
        <FiShield size={10} style={{ color: "var(--color-equator-green)" }} />
      </div>
      <span className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
        {label}
      </span>
    </div>
  );
}

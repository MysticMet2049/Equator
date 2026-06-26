import { useEffect, useMemo, useState } from "react";
import { fetchAssetUrl } from "../../api/assetApi";

const FALLBACK =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#f0ebe3"/>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        fill="#8a8178"
        font-family="Arial"
        font-size="22"
      >
        Image indisponible
      </text>
    </svg>
  `);

function isImageUrl(value) {
  if (!value || typeof value !== "string") return false;

  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("blob:")
  );
}

function normalizeAssetId(value) {
  if (!value) return null;

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim() || null;
  }

  if (typeof value === "object") {
    return (
      value.assetId ||
      value.id ||
      value.coverAssetId ||
      value.logoId ||
      value.bannerAssetId ||
      value.imageAssetId ||
      null
    );
  }

  return null;
}

function unique(values) {
  return values.filter((value, index, array) => {
    return value && array.indexOf(value) === index;
  });
}

function getTypeCandidates(refType, type, typeCandidates = []) {
  const extraTypes = Array.isArray(typeCandidates) ? typeCandidates : [];

  if (refType === "PRODUCT") {
    return unique([
      type,
      ...extraTypes,
      "PRODUCT_IMAGE",
      "PRODUCT_COVER",
      "COVER",
      "GALLERY",
      "IMAGE",
    ]);
  }

  if (refType === "STORE") {
    return unique([
      type,
      ...extraTypes,
      "STORE_BANNER_IMAGE",
      "STORE_LOGO",
      "BANNER",
      "COVER",
      "LOGO",
      "GALLERY",
      "IMAGE",
    ]);
  }

  return unique([type, ...extraTypes]);
}

export default function ApiImage({
  assetId,
  refType,
  refEntityId,
  type,
  typeCandidates,
  fileSizeType = "MEDIUM",
  fallback = FALLBACK,
  alt = "",
  className = "",
  style,
}) {
  const [src, setSrc] = useState(fallback);

  const safeAssetId = normalizeAssetId(assetId);
  const safeRefEntityId = normalizeAssetId(refEntityId);

  const typeCandidatesKey = useMemo(() => {
    return JSON.stringify(typeCandidates || []);
  }, [typeCandidates]);

  useEffect(() => {
    let alive = true;
    let objectUrl = null;

    async function loadImage() {
      if (isImageUrl(safeAssetId)) {
        setSrc(safeAssetId);
        return;
      }

      const parsedTypeCandidates = JSON.parse(typeCandidatesKey || "[]");

      const candidates = getTypeCandidates(
        refType,
        type,
        parsedTypeCandidates
      );

      if (!safeAssetId || !refType || !safeRefEntityId || candidates.length === 0) {
        setSrc(fallback);

        if (import.meta.env.DEV) {
          console.warn("[ApiImage] Données image manquantes :", {
            assetId,
            safeAssetId,
            refType,
            refEntityId,
            safeRefEntityId,
            type,
            candidates,
            alt,
          });
        }

        return;
      }

      setSrc(fallback);

      for (const currentType of candidates) {
        try {
          const url = await fetchAssetUrl(safeAssetId, {
            refType,
            refEntityId: safeRefEntityId,
            type: currentType,
            fileSizeType,
          });

          if (!alive) return;

          if (url) {
            objectUrl = url;
            setSrc(url);

            if (import.meta.env.DEV) {
              console.log("[ApiImage] Image chargée :", {
                assetId: safeAssetId,
                refType,
                refEntityId: safeRefEntityId,
                type: currentType,
                url,
                alt,
              });
            }

            return;
          }
        } catch (error) {
          if (import.meta.env.DEV) {
            console.warn("[ApiImage] Échec avec ce type :", {
              assetId: safeAssetId,
              refType,
              refEntityId: safeRefEntityId,
              type: currentType,
              status: error?.status,
              message: error?.message,
              data: error?.data,
              alt,
            });
          }
        }
      }

      if (alive) {
        setSrc(fallback);

        if (import.meta.env.DEV) {
          console.error("[ApiImage] Aucun type n'a permis de charger l'image :", {
            assetId: safeAssetId,
            refType,
            refEntityId: safeRefEntityId,
            triedTypes: candidates,
            alt,
          });
        }
      }
    }

    loadImage();

    return () => {
      alive = false;

      if (objectUrl && objectUrl.startsWith("blob:")) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [
    safeAssetId,
    safeRefEntityId,
    refType,
    type,
    typeCandidatesKey,
    fileSizeType,
    fallback,
    alt,
    assetId,
    refEntityId,
  ]);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={(event) => {
        event.currentTarget.src = fallback;

        if (import.meta.env.DEV) {
          console.warn("[ApiImage] Le navigateur n'arrive pas à afficher l'image :", {
            src,
            alt,
          });
        }
      }}
    />
  );
}
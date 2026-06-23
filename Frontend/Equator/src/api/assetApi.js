/**

* assetApi.js
* Services de téléversement, téléchargement et gestion des assets (images/fichiers).
*
* Couvre :
* POST   /api/client/assets/upload
* POST   /api/client/assets/download/{assetId}
* PUT    /api/client/assets/set-cover-image
* POST   /api/client/assets/delete
* POST   /api/client/assets/multiple-delete
* POST   /api/client/assets/change-asset/{assetId}
*
* IMPORTANT — hypothèse corrigée depuis mappers.js :
* /api/client/assets/download/{assetId} est un POST (et non un GET) et son
* schéma de réponse est déclaré comme `string` — très probablement une URL
* présignée ou une charge utile en base64, et NON un endpoint d’image directement
* exploitable que l’on peut placer dans un <img src="..."> sans headers
* d’authentification. L’ancien helper assetUrl() dans mappers.js supposait
* une simple URL GET authentifiée ; cela ne fonctionne que si le backend autorise
* le GET sur ce chemin avec une authentification par query params, ce qui
* n’est pas confirmé. Tant que ce n’est pas vérifié, privilégier fetchAssetUrl()
* ci-dessous (qui effectue le POST authentifié approprié et résout l’URL réelle/
* la chaîne base64), et considérer assetUrl() comme un fallback/une estimation
* au mieux.
*
* Les conventions refType / type (utilisées dans toutes les fonctions ci-dessous)
* ne sont pas énumérées dans le fichier OpenAPI — valeurs courantes à confirmer
* avec le backend :
* refType: "PRODUCT" | "STORE" | "CUSTOMER" | "ORGANISATION"
* type:    "COVER" | "GALLERY" | "LOGO" | "PROFILE"
  */


import http from "./httpClient";

// ─── Téléversement ─────────────────────────────────────────────────────────────
/**

* Téléverse un nouvel asset (image/fichier) pour une entité donnée.
* @param {{ file: File, refType: string, refEntityId: number, type?: string, alt?: string, title?: string, coverImage?: boolean }} params
* @returns {Promise<{ refEntityId: number, originalFilename: string, assetId: number, coverImage: boolean }>}
  */

export async function uploadAsset({
  file,
  refType,
  refEntityId,
  type = "GALLERY",
  alt = "",
  title = "",
  coverImage = false,
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("refType", refType);
  formData.append("type", type);
  formData.append("refEntityId", refEntityId);
  formData.append("alt", alt);
  formData.append("title", title);
  formData.append("coverImage", coverImage);

  return http.upload("/api/client/assets/upload", formData);
}

/**
 * Téléverse un nouvel asset pour remplacer un asset existant
 * (conserve le même emplacement logique).
 * @param {number|string} assetId — l’asset à remplacer
 * @param {{ file: File, refType: string, refEntityId: number, type?: string, alt?: string, title?: string, coverImage?: boolean }} params
 */
export async function changeAsset(assetId, {
  file,
  refType,
  refEntityId,
  type = "GALLERY",
  alt = "",
  title = "",
  coverImage = false,
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("refType", refType);
  formData.append("type", type);
  formData.append("refEntityId", refEntityId);
  formData.append("alt", alt);
  formData.append("title", title);
  formData.append("coverImage", coverImage);

  return http.upload(`/api/client/assets/change-asset/${assetId}`, formData);
}

// ─── Téléchargement ────────────────────────────────────────────────────────────
/**
 * Résout l’URL/les données réellement affichables d’un asset via l’endpoint
 * POST authentifié approprié.
 * @param {number|string} assetId
 * @param {{ refType: string, refEntityId: number, type?: string, fileSizeType?: string }} params
 * @returns {Promise<string>} URL ou chaîne base64, telle que retournée par le backend
 */
export async function fetchAssetUrl(assetId, { refType, refEntityId, type = "GALLERY", fileSizeType = "ORIGINAL" }) {
  const response = await http.post(`/api/client/assets/download/${assetId}`, {
    refType,
    type,
    refEntityId,
    assetId,
    fileSizeType,
  });
  return response;
}

// ─── Image de couverture ──────────────────────────────────────────────────────
/**
 * Définit un asset comme image de couverture/par défaut pour son entité.
 * @param {{ refType: string, refEntityId: number, assetId: number, type?: string, fileSizeType?: string }} params
 */
export async function setCoverImage({ refType, refEntityId, assetId, type = "GALLERY", fileSizeType = "ORIGINAL" }) {
  return http.put("/api/client/assets/set-cover-image", {
    refType,
    type,
    refEntityId,
    assetId,
    fileSizeType,
  });
}

// ─── Suppression ───────────────────────────────────────────────────────────────
/**
 * Supprime un seul asset.
 * @param {{ refType: string, refEntityId: number, assetId: number, type?: string }} params
 */
export async function deleteAsset({ refType, refEntityId, assetId, type = "GALLERY" }) {
  return http.post("/api/client/assets/delete", {
    refType,
    type,
    refEntityId,
    assetId,
  });
}

/**
 * Supprime plusieurs assets en un seul appel.
 * @param {Array<{ refType: string, refEntityId: number, assetId: number, type?: string }>} assets
 */
export async function deleteMultipleAssets(assets) {
  return http.post("/api/client/assets/multiple-delete", assets);
}

const assetApi = {
  uploadAsset,
  changeAsset,
  fetchAssetUrl,
  setCoverImage,
  deleteAsset,
  deleteMultipleAssets,
};

export default assetApi;
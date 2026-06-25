import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import cartApi from "../api/cartApi";
import productApi from "../api/productApi";
import { ApiError } from "../api/httpClient";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart] = useState(null); // { id, storeId, customerId, note, items: [] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cartItems = cart?.items ?? [];

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
    [cartItems]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
        0
      ),
    [cartItems]
  );

  // ── Guard helper — "Connectez-vous pour continuer." ──────────────────────
  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      const message = "Connectez-vous pour continuer.";
      setError(message);
      throw new ApiError(401, message);
    }
  }, [isAuthenticated]);

  // ── Enrich cart items with product name/image (see header note) ─────────
  const enrichItems = useCallback(async (rawCart) => {
    if (!rawCart) return rawCart;
    const enrichedItems = await Promise.all(
      rawCart.items.map(async (item) => {
        try {
          const product = await productApi.getProductDetails(item.productId);
          return { ...item, product };
        } catch (err) {
          console.error(
            `[CartContext] Failed to enrich product ${item.productId}:`,
            err
          );
          return item;
        }
      })
    );
    return { ...rawCart, items: enrichedItems };
  }, []);

  // ── Refresh cart from backend ────────────────────────────────────────────
  /**
   * @param {number|string} storeId — required since carts are per-store
   */
  const refreshCart = useCallback(
    async (storeId) => {
      if (!isAuthenticated || !storeId) return null;
      setLoading(true);
      setError(null);
      try {
        const found = await cartApi.findCartByStoreAndCustomer(storeId, user.id);
        const enriched = await enrichItems(found);
        setCart(enriched);
        setLoading(false);
        return enriched;
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Impossible de contacter le serveur.";
        console.error("[CartContext] refreshCart failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    [isAuthenticated, user, enrichItems]
  );

  // ── Add to cart ───────────────────────────────────────────────────────────
  /**
   * @param {number|string} productId
   * @param {number|string} storeId
   */
  const addToCart = useCallback(
    async (productId, storeId) => {
      requireAuth();
      setLoading(true);
      setError(null);
      try {
        const updated = await cartApi.addProductToCart(storeId, productId);
        const enriched = await enrichItems(updated);
        setCart(enriched);
        setLoading(false);
        return enriched;
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible d'ajouter le produit au panier.";
        console.error("[CartContext] addToCart failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    [requireAuth, enrichItems]
  );

  // ── Remove from cart ──────────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (itemId) => {
      requireAuth();
      setLoading(true);
      setError(null);
      try {
        await cartApi.deleteCartItem(itemId);
        setCart((prev) =>
          prev ? { ...prev, items: prev.items.filter((i) => i.id !== itemId) } : prev
        );
        setLoading(false);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Impossible de supprimer cet article.";
        console.error("[CartContext] removeFromCart failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    [requireAuth]
  );

  // ── Update quantity ───────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      requireAuth();
      if (quantity < 1) return removeFromCart(itemId);

      setLoading(true);
      setError(null);
      try {
        const existingItem = cartItems.find((i) => i.id === itemId);
        if (!existingItem) throw new Error("Article introuvable dans le panier.");

        await cartApi.editCartItem({
          id: itemId,
          productId: existingItem.productId,
          customerId: user.id,
          storeId: existingItem.storeId,
          quantity,
          salesPrice: existingItem.price,
          note: existingItem.note,
        });

        setCart((prev) =>
          prev
            ? { ...prev, items: prev.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)) }
            : prev
        );
        setLoading(false);
      } catch (err) {
        const message =
          err instanceof ApiError ? err.message : "Impossible de mettre à jour la quantité.";
        console.error("[CartContext] updateQuantity failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [requireAuth, cartItems, user, removeFromCart]
  );

  // ── Empty cart ─────────────────────────────────────────────────────────────
  const emptyCart = useCallback(
    async (shoppingCartId) => {
      requireAuth();
      const id = shoppingCartId ?? cart?.id;
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const updated = await cartApi.emptyCart(id);
        setCart(updated);
        setLoading(false);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Impossible de vider le panier.";
        console.error("[CartContext] emptyCart failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    [requireAuth, cart]
  );

  // ── Submit (checkout) cart ────────────────────────────────────────────────
  const submitCart = useCallback(
    async (payload) => {
      requireAuth();
      if (!cart) throw new Error("Aucun panier actif.");
      setLoading(true);
      setError(null);
      try {
        const result = await cartApi.submitCart(payload ?? cart._raw ?? cart);
        setCart(null);
        setLoading(false);
        return result;
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Impossible de valider le panier.";
        console.error("[CartContext] submitCart failed:", err);
        setError(message);
        setLoading(false);
        throw err;
      }
    },
    [requireAuth, cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        loading,
        error,
        addToCart,
        removeFromCart,
        updateQuantity,
        emptyCart,
        submitCart,
        refreshCart,
        setError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCartContext must be used within CartProvider");
  return ctx;
}

export default CartContext;

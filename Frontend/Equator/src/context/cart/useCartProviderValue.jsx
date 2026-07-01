import { useState, useCallback, useMemo } from "react";
import cartApi from "../../api/cartApi";
import customerAccountApi from "../../api/customerAccountApi";
import customerApi from "../../api/customerApi";
import productApi from "../../api/productApi";
import { ApiError } from "../../api/httpClient";
import { useAuth } from "../AuthContext";

// Hook interne : il regroupe la logique complète du panier pour alléger CartContext.jsx.


const ACTIVE_CART_STORE_KEY = "equator_active_cart_store_id";
const ACTIVE_CART_SNAPSHOT_KEY = "equator_active_cart_snapshot";
const CURRENT_CUSTOMER_KEY = "equator_current_customer";

const activeCartStoreStorage = {
  get: () => localStorage.getItem(ACTIVE_CART_STORE_KEY),
  set: (storeId) => {
    if (storeId) {
      localStorage.setItem(ACTIVE_CART_STORE_KEY, String(storeId));
    }
  },
  remove: () => localStorage.removeItem(ACTIVE_CART_STORE_KEY),
};

const cartSnapshotStorage = {
  get: () => {
    try {
      const raw = localStorage.getItem(ACTIVE_CART_SNAPSHOT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (cart) => {
    if (cart) {
      localStorage.setItem(ACTIVE_CART_SNAPSHOT_KEY, JSON.stringify(cart));
    }
  },
  remove: () => localStorage.removeItem(ACTIVE_CART_SNAPSHOT_KEY),
};

const currentCustomerStorage = {
  get: () => {
    try {
      const raw = localStorage.getItem(CURRENT_CUSTOMER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (customer) => {
    if (customer) {
      localStorage.setItem(CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
    }
  },
  remove: () => localStorage.removeItem(CURRENT_CUSTOMER_KEY),
};

const getErrorMessage = (error) =>
  String(
    error?.message ||
      error?.data?.message ||
      error?.details?.message ||
      error?.raw?.message ||
      error?.response?.message ||
      ""
  ).toLowerCase();

const getBackendSubmitMessage = (error) => {
  const fieldErrors =
    error?.data?.content?.fieldErrors ||
    error?.raw?.content?.fieldErrors ||
    error?.content?.fieldErrors ||
    [];

  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    return fieldErrors
      .map((fieldError) => fieldError?.message)
      .filter(Boolean)
      .join("\n");
  }

  return (
    error?.data?.content?.message ||
    error?.raw?.content?.message ||
    error?.content?.message ||
    error?.data?.message ||
    error?.raw?.message ||
    error?.message ||
    "Impossible de valider le panier."
  );
};

const shouldAskCustomerAccountConfirmation = (
  error,
  { missingCustomerAccount = false } = {}
) => {
  const message = getErrorMessage(error);
  const status = Number(error?.status);

  const hasConfirmationMessage =
    message.includes("compte client") ||
    message.includes("customer account") ||
    message.includes("customeraccount") ||
    message.includes("enseigne") ||
    message.includes("organisation") ||
    message.includes("confirmation") ||
    message.includes("confirmer");

  if ([400, 409, 412].includes(status) && hasConfirmationMessage) {
    return true;
  }

  // Le backend renvoie actuellement 500 au lieu d'une erreur métier
  // quand le compte client de l'enseigne est absent.
  return status === 500 && missingCustomerAccount;
};

const getGenericConfirmationMessage = () =>
  "Vous n'avez pas de compte client dans cette enseigne. En confirmant, un compte sera créé dans l'enseigne dès que votre commande sera validée.";

const isAlreadyInCartError = (error) => {
  const message = getErrorMessage(error);

  return (
    error?.status === 412 ||
    error?.httpStatusCode === "PRECONDITION_FAILED" ||
    error?.raw?.httpStatusCode === "PRECONDITION_FAILED" ||
    error?.data?.httpStatusCode === "PRECONDITION_FAILED" ||
    message.includes("déja présent") ||
    message.includes("déjà présent") ||
    message.includes("deja present") ||
    message.includes("already") ||
    message.includes("present dans votre panier")
  );
};


const isNoActiveCartError = (error) => {
  const message = getErrorMessage(error);

  return (
    error?.status === 404 &&
    (message.includes("panier actif") ||
      message.includes("point de vente") ||
      message.includes("no active cart"))
  );
};

const getProductPrice = (product) =>
  product?.price ??
  product?.salesPrice ??
  product?.amount ??
  product?.unitPrice ??
  product?.product?.price ??
  0;

const getProductName = (product, fallback = "Produit") =>
  product?.name ||
  product?.title ||
  product?.designation ||
  product?.label ||
  product?.product?.name ||
  fallback;

const getProductImage = (product) =>
  product?.image ||
  product?.imageUrl ||
  product?.mainImage ||
  product?.thumbnail ||
  product?.product?.image ||
  null;

const sameStore = (cart, storeId) => {
  if (!cart || !storeId || !cart.storeId) return true;
  return String(cart.storeId) === String(storeId);
};

const hasProduct = (cart, productId) => {
  const items = cart?.items ?? [];
  return items.some((item) => String(item.productId) === String(productId));
};

const getBestExistingCart = (currentCart, storeId = null) => {
  if (currentCart && sameStore(currentCart, storeId)) return currentCart;

  const cachedCart = cartSnapshotStorage.get();
  if (cachedCart && sameStore(cachedCart, storeId)) return cachedCart;

  return currentCart || cachedCart || null;
};

const buildFallbackCartItem = (
  productId,
  storeId,
  product = null,
  response = null
) => {
  const responseProduct = response?.product || response?.catalogProduct || null;
  const safeProduct = product || responseProduct || {};

  return {
    id:
      response?.id ??
      response?.itemId ??
      response?.shoppingCartItemId ??
      `local-${storeId}-${productId}`,
    productId: response?.productId ?? productId,
    storeId: response?.storeId ?? storeId,
    quantity: response?.quantity ?? 1,
    price:
      response?.price ??
      response?.salesPrice ??
      response?.unitPrice ??
      getProductPrice(safeProduct),
    image: response?.image ?? getProductImage(safeProduct),
    name: response?.name ?? getProductName(safeProduct),
    product: {
      ...safeProduct,
      ...responseProduct,
      id: safeProduct?.id ?? productId,
      productId,
      name: getProductName(safeProduct),
      image: getProductImage(safeProduct),
      price: getProductPrice(safeProduct),
    },
  };
};

const mergeCartItem = (previousCart, item, storeId) => {
  const previousItems = previousCart?.items ?? [];
  const itemProductId = String(item.productId);

  const alreadyExists = previousItems.some(
    (existing) => String(existing.productId) === itemProductId
  );

  const items = alreadyExists ? previousItems : [...previousItems, item];

  return {
    ...(previousCart ?? {}),
    id:
      previousCart?.id ??
      item.shoppingCartId ??
      item.cartId ??
      item.shoppingCart?.id ??
      `${storeId}-local`,
    storeId: previousCart?.storeId ?? storeId,
    items,
  };
};

const normalizeCartAfterAdd = (
  response,
  productId,
  storeId,
  product = null,
  previousCart = null
) => {
  if (response?.items && Array.isArray(response.items)) {
    return {
      ...response,
      storeId: response.storeId ?? storeId,
      items: response.items,
    };
  }

  const item = buildFallbackCartItem(productId, storeId, product, response);
  return mergeCartItem(previousCart, item, storeId);
};

const toNumberOrUndefined = (value) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const getCustomerIdFromUser = (user) =>
  toNumberOrUndefined(
    user?.customerId ??
      user?.customer?.id ??
      user?.storecardCustomerId ??
      user?.storecardCustomer?.id
  );

const getCustomerIdFromCustomer = (customer) =>
  toNumberOrUndefined(customer?.id ?? customer?.customerId ?? customer?.customer?.id);

const normalizeMobileNumber = (value) => {
  const raw = String(value || "").trim();

  if (!raw) return "";

  if (raw.startsWith("+")) {
    const digits = raw.slice(1).replace(/\D/g, "");
    return digits ? `+${digits}` : "";
  }

  const digits = raw.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("237")) return `+${digits}`;
  if (digits.length === 9 && digits.startsWith("6")) return `+237${digits}`;

  return `+${digits}`;
};

const getPhoneNumberFromCustomerOrUser = (customer, user) =>
  normalizeMobileNumber(
    customer?.user?.mobileNumber ||
      customer?.mobileNumber ||
      customer?.phoneNumber ||
      customer?.address?.principalPhoneNumber?.phoneNumber ||
      customer?.user?.address?.principalPhoneNumber?.phoneNumber ||
      user?.mobileNumber ||
      user?.phoneNumber ||
      user?.phone ||
      user?.address?.principalPhoneNumber?.phoneNumber ||
      ""
  );

const isNoRegisteredAccountForPhoneError = (error) => {
  const message = getErrorMessage(error);
  const status = Number(error?.status);

  return (
    status === 412 &&
    (message.includes("aucun compte client") ||
      message.includes("aucun compte") ||
      message.includes("no customer account") ||
      message.includes("not found"))
  );
};

const isBackendId = (value) => {
  const numberValue = toNumberOrUndefined(value);
  return numberValue !== undefined && !String(value).startsWith("local-");
};

const getBackendCartId = (sourceCart) => {
  const candidate =
    sourceCart?.id ??
    sourceCart?.shoppingCartId ??
    sourceCart?.cartId ??
    sourceCart?.shoppingCart?.id;

  return isBackendId(candidate) ? Number(candidate) : undefined;
};

const getBackendCartItemId = (item) => {
  const candidate =
    item?.id ??
    item?.shoppingCartItemId ??
    item?.cartItemId ??
    item?.itemId ??
    item?.shoppingCartItem?.id;

  return isBackendId(candidate) ? Number(candidate) : undefined;
};

const getCartStoreId = (sourceCart) =>
  sourceCart?.storeId ??
  sourceCart?.store?.id ??
  sourceCart?.pointOfSaleId ??
  sourceCart?.items?.[0]?.storeId ??
  sourceCart?.cartItems?.[0]?.storeId ??
  sourceCart?.salesItems?.[0]?.storeId ??
  null;

const buildSubmitCartPayload = (sourceCart, customerId, customerAccountId) => {
  const storeId = getCartStoreId(sourceCart);
  const cartId = getBackendCartId(sourceCart);
  const sourceItems =
    sourceCart?.items ?? sourceCart?.cartItems ?? sourceCart?.salesItems ?? [];

  const cartItems = sourceItems
    .map((item) => {
      const itemId = getBackendCartItemId(item);
      const productId = toNumberOrUndefined(
        item.productId ??
          item.product?.id ??
          item.product?.productId ??
          item.catalogProduct?.id ??
          item.catalogProduct?.productId
      );
      const itemStoreId =
        toNumberOrUndefined(
          item.storeId ??
            item.store?.id ??
            item.product?.storeId ??
            item.catalogProduct?.storeId
        ) ?? storeId;
      const quantity = Number(item.quantity ?? item.qty ?? 1);
      const salesPrice = Number(
        item.salesPrice ??
          item.finalSalesPrice ??
          item.currentListPrice ??
          item.price ??
          item.unitPrice ??
          item.amount ??
          item.product?.price ??
          item.catalogProduct?.price ??
          0
      );

      if (!productId || !Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      return {
        ...(itemId ? { id: itemId } : {}),
        productId,
        customerId,
        storeId: itemStoreId,
        quantity,
        salesPrice: Number.isFinite(salesPrice) ? salesPrice : 0,
        note: item.note ?? "",
      };
    })
    .filter(Boolean);

  return {
    ...(cartId ? { id: cartId } : {}),
    customerId,
    ...(customerAccountId ? { customerAccountId } : {}),
    storeId,
    note: sourceCart?.note ?? "",
    cartItems,
  };
};

const isValidSubmitCartPayload = (payload) =>
  Boolean(
    payload?.customerId &&
      payload?.storeId &&
      Array.isArray(payload?.cartItems) &&
      payload.cartItems.length > 0
  );

const getCartItems = (sourceCart) =>
  Array.isArray(sourceCart?.items)
    ? sourceCart.items
    : Array.isArray(sourceCart?.cartItems)
      ? sourceCart.cartItems
      : Array.isArray(sourceCart?.salesItems)
        ? sourceCart.salesItems
        : [];

const isInactiveSubmittedCart = (candidateCart) => {
  const state = String(
    candidateCart?.shoppingCartState ||
      candidateCart?.cartState ||
      candidateCart?.orderStatus ||
      candidateCart?.status ||
      ""
  ).toUpperCase();

  return [
    "SUBMITTED",
    "VALIDATED",
    "COMPLETED",
    "CLOSED",
    "CANCELLED",
    "CANCELED",
    "DELETED",
  ].some((word) => state.includes(word));
};

const hasBackendCartId = (sourceCart) => Boolean(getBackendCartId(sourceCart));

const hasBackendCartItemIds = (sourceCart) =>
  getCartItems(sourceCart).some((item) => Boolean(getBackendCartItemId(item)));

const mergeBackendCartWithSource = (backendCart, sourceCart) => {
  if (!backendCart) return sourceCart;

  const backendItems = getCartItems(backendCart);
  const sourceItems = getCartItems(sourceCart);

  return {
    ...sourceCart,
    ...backendCart,
    storeId: backendCart.storeId ?? sourceCart?.storeId,
    items: backendItems.length ? backendItems : sourceItems,
  };
};

const findBackendCartForSubmit = async (
  storeId,
  customerId,
  customerAccountId
) => {
  const found = await cartApi.findCartByStoreAndCustomer(storeId, customerId);

  if (found && !isInactiveSubmittedCart(found)) {
    return found;
  }

  const searched = await cartApi
    .searchCartsByCustomerAndStore({
      customerId,
      customerAccountId,
      storeId,
    })
    .catch((err) => {
      console.warn("[CartContext] searchCartsByCustomerAndStore failed:", err);
      return [];
    });

  return (
    searched.find(
      (candidate) =>
        String(candidate?.storeId ?? "") === String(storeId) &&
        !isInactiveSubmittedCart(candidate)
    ) ||
    searched.find((candidate) => !isInactiveSubmittedCart(candidate)) ||
    null
  );
};

const createBackendCartFromFallback = async (
  submitPayload,
  sourceCart,
  customerAccountId
) => {
  const created = await cartApi.createCart({
    customerId: submitPayload.customerId,
    ...(customerAccountId ? { customerAccountId } : {}),
    storeId: submitPayload.storeId,
    note: submitPayload.note ?? "",
    cartItems: submitPayload.cartItems,
  });

  return mergeBackendCartWithSource(created, {
    ...sourceCart,
    id: created?.id ?? sourceCart?.id,
    storeId: submitPayload.storeId,
  });
};

const ensureBackendCartForSubmit = async (
  sourceCart,
  customerId,
  customerAccountId
) => {
  const basePayload = buildSubmitCartPayload(
    sourceCart,
    customerId,
    customerAccountId
  );

  if (!isValidSubmitCartPayload(basePayload)) {
    return basePayload;
  }

  let backendCart = null;

  try {
    backendCart = await findBackendCartForSubmit(
      basePayload.storeId,
      customerId,
      customerAccountId
    );
  } catch (err) {
    console.warn("[CartContext] findBackendCartForSubmit failed:", err);
  }

  if (!hasBackendCartId(backendCart)) {
    try {
      backendCart = await createBackendCartFromFallback(
        basePayload,
        sourceCart,
        customerAccountId
      );
    } catch (err) {
      /**
       * If create fails because the cart already exists, try to recover the
       * real cart once more through search/find. If it still cannot be found,
       * keep the base payload so the backend returns a clear validation error.
       */
      console.warn("[CartContext] createBackendCartFromFallback failed:", err);

      backendCart = await findBackendCartForSubmit(
        basePayload.storeId,
        customerId,
        customerAccountId
      ).catch(() => null);
    }
  }

  if (hasBackendCartId(backendCart) && !hasBackendCartItemIds(backendCart)) {
    const refreshedBackendCart = await findBackendCartForSubmit(
      basePayload.storeId,
      customerId,
      customerAccountId
    ).catch((err) => {
      console.warn("[CartContext] refresh backend cart with item ids failed:", err);
      return null;
    });

    if (hasBackendCartId(refreshedBackendCart)) {
      backendCart = mergeBackendCartWithSource(refreshedBackendCart, backendCart);
    }
  }

  console.log(
    "[BACKEND CART BEFORE SUBMIT SYNC]",
    JSON.stringify(backendCart, null, 2)
  );

  const syncedCart = mergeBackendCartWithSource(backendCart, sourceCart);
  const syncedPayload = buildSubmitCartPayload(
    syncedCart,
    customerId,
    customerAccountId
  );

  /**
   * If the backend returned only EntitySummaryDto from /create, the cart id is
   * still important for /submit. Preserve it even if mapCartFromApi returned
   * an object without cartItems.
   */
  if (isBackendId(backendCart?.id) && !syncedPayload.id) {
    syncedPayload.id = Number(backendCart.id);
  }

  console.log(
    "[SUBMIT SHOPPING CART DTO]",
    JSON.stringify(syncedPayload, null, 2)
  );

  return syncedPayload;
};

const submitShoppingCartPayload = async (shoppingCartDto) =>
  cartApi.submitCart(shoppingCartDto);

const getFirstCustomerAccountId = (accounts = []) => {
  const account = Array.isArray(accounts) ? accounts[0] : accounts;

  return toNumberOrUndefined(
    account?.id ??
      account?.customerAccountId ??
      account?.accountId ??
      account?.customerAccount?.id ??
      account?.storecardCustomerAccountId ??
      account?.storecardCustomerAccount?.id ??
      account?.card?.customerAccountId ??
      account?.card?.customerAccount?.id
  );
};

export function useCartProviderValue() {
  const { user, isAuthenticated } = useAuth();

  const [cart, setCart] = useState(() => cartSnapshotStorage.get());
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

  const requireAuth = useCallback(() => {
    if (!isAuthenticated) {
      const message = "Connectez-vous pour continuer.";
      setError(message);
      throw new ApiError(401, message);
    }
  }, [isAuthenticated]);


  const resolveCurrentCustomer = useCallback(async () => {
    const cachedCustomer = currentCustomerStorage.get();
    const cachedCustomerId = getCustomerIdFromCustomer(cachedCustomer);

    try {
      const currentCustomer = await customerApi.getCurrentCustomer();
      const currentCustomerId = getCustomerIdFromCustomer(currentCustomer);

      if (currentCustomerId) {
        currentCustomerStorage.set(currentCustomer);
        return { customer: currentCustomer, customerId: currentCustomerId };
      }
    } catch (err) {
      console.warn("[CartContext] getCurrentCustomer failed, using cached/auth fallback:", err);
    }

    const authCustomerId = getCustomerIdFromUser(user);
    const fallbackCustomerId = cachedCustomerId ?? authCustomerId ?? toNumberOrUndefined(user?.id);

    return {
      customer: cachedCustomer ?? null,
      customerId: fallbackCustomerId,
    };
  }, [user]);

  const saveCart = useCallback((nextCart) => {
    setCart(nextCart);

    if (nextCart) {
      cartSnapshotStorage.set(nextCart);
      if (nextCart.storeId) activeCartStoreStorage.set(nextCart.storeId);
    }

    return nextCart;
  }, []);

  const enrichItems = useCallback(async (rawCart) => {
    if (!rawCart) return rawCart;

    const items = rawCart.items ?? [];

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        if (item.product) return item;

        try {
          const product = await productApi.getProductDetails(item.productId);
          return {
            ...item,
            product,
            price: item.price ?? getProductPrice(product),
          };
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

  const refreshCart = useCallback(
    async (storeId) => {
      if (!isAuthenticated || !storeId) return null;

      setLoading(true);
      setError(null);

      try {
        const { customerId } = await resolveCurrentCustomer();

        if (!customerId) {
          const fallbackCart = getBestExistingCart(cart, storeId);
          if (fallbackCart) saveCart(fallbackCart);
          return fallbackCart;
        }

        const found = await cartApi.findCartByStoreAndCustomer(
          storeId,
          customerId
        );

        // cartApi.findCartByStoreAndCustomer() retourne déjà null quand le
        // backend répond 404 "pas de panier actif". Il ne faut surtout pas
        // faire setCart(null), sinon CartPage devient vide alors qu'un produit
        // peut déjà exister côté panier.
        if (!found) {
          const fallbackCart = getBestExistingCart(cart, storeId);
          if (fallbackCart) saveCart(fallbackCart);
          setError(null);
          return fallbackCart;
        }

        const enriched = await enrichItems(found);
        saveCart(enriched);

        return enriched;
      } catch (err) {
        if (isNoActiveCartError(err)) {
          const fallbackCart = getBestExistingCart(cart, storeId);
          if (fallbackCart) saveCart(fallbackCart);
          setError(null);
          return fallbackCart;
        }

        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible de contacter le serveur.";

        console.error("[CartContext] refreshCart failed:", err);
        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, resolveCurrentCustomer, enrichItems, cart, saveCart]
  );

  const refreshActiveCart = useCallback(
    async ({ force = false } = {}) => {
      const activeStoreId = activeCartStoreStorage.get();
      const cachedCart = getBestExistingCart(cart, activeStoreId);

      // Dans ton backend, find-by-store-and-customer peut répondre 404 alors
      // que add-product dit que le produit est déjà dans le panier. On affiche
      // donc d'abord le snapshot local, et on ne force le GET que si demandé.
      if (cachedCart && !force) {
        saveCart(cachedCart);
        return cachedCart;
      }

      if (!activeStoreId) {
        if (cachedCart) saveCart(cachedCart);
        return cachedCart;
      }

      return refreshCart(activeStoreId);
    },
    [cart, refreshCart, saveCart]
  );

  const addToCart = useCallback(
    async (productId, storeId, product = null) => {
      requireAuth();

      if (!productId || !storeId) {
        const message = "Produit ou boutique invalide.";
        setError(message);

        return {
          ok: false,
          alreadyExists: false,
          noActiveCart: false,
          message,
        };
      }

      setLoading(true);
      setError(null);

      try {
        const response = await cartApi.addProductToCart(storeId, productId);

        activeCartStoreStorage.set(storeId);

        const previousCart = getBestExistingCart(cart, storeId);
        const cartFromAdd = normalizeCartAfterAdd(
          response,
          productId,
          storeId,
          product,
          previousCart
        );

        const enrichedFromAdd = await enrichItems(cartFromAdd);
        saveCart(enrichedFromAdd);

        // Le refresh est optionnel : s'il échoue ou retourne null, on garde le
        // panier construit depuis addProductToCart.
        const refreshed = await refreshCart(storeId).catch((err) => {
          if (isNoActiveCartError(err)) return enrichedFromAdd;
          throw err;
        });

        return {
          ok: true,
          alreadyExists: false,
          noActiveCart: false,
          cart: refreshed || enrichedFromAdd,
          message: "Produit ajouté au panier.",
        };
      } catch (err) {
        if (isAlreadyInCartError(err)) {
          activeCartStoreStorage.set(storeId);
          setError(null);

          const previousCart = getBestExistingCart(cart, storeId);
          const nextCart = hasProduct(previousCart, productId)
            ? previousCart
            : normalizeCartAfterAdd(null, productId, storeId, product, previousCart);

          const enriched = await enrichItems(nextCart);
          saveCart(enriched);

          return {
            ok: true,
            alreadyExists: true,
            noActiveCart: false,
            cart: enriched,
            message: "Ce produit est déjà dans votre panier.",
          };
        }

        if (isNoActiveCartError(err)) {
          const message =
            err?.message || "Ce point de vente n'a pas de panier actif.";

          setError(null);

          return {
            ok: false,
            alreadyExists: false,
            noActiveCart: true,
            message,
          };
        }

        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible d'ajouter le produit au panier.";

        console.error("[CartContext] addToCart failed:", err);
        setError(message);

        return {
          ok: false,
          alreadyExists: false,
          noActiveCart: false,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, refreshCart, enrichItems, saveCart, cart]
  );

  function isLocalCartItemId(value) {
  return String(value || "").startsWith("local-");
    }

const removeFromCart = useCallback(
  async (itemId) => {
    requireAuth();

    const safeItemId = String(itemId || "");

    setLoading(true);
    setError(null);

    try {
      // ✅ Si l'article vient du panier local, on ne contacte pas l'API
      if (isLocalCartItemId(safeItemId)) {
        setCart((prev) => {
          const nextCart = prev
            ? {
                ...prev,
                items: prev.items.filter(
                  (item) => String(item.id) !== safeItemId
                ),
              }
            : prev;

          if (nextCart?.items?.length) {
            cartSnapshotStorage.set(nextCart);
          } else {
            cartSnapshotStorage.remove();
            activeCartStoreStorage.remove();
          }

          return nextCart;
        });

        return {
          success: true,
          localOnly: true,
        };
      }

      // ✅ Si c'est un vrai id backend, on appelle l'API
      await cartApi.deleteCartItem(safeItemId);

      setCart((prev) => {
        const nextCart = prev
          ? {
              ...prev,
              items: prev.items.filter(
                (item) => String(item.id) !== safeItemId
              ),
            }
          : prev;

        if (nextCart?.items?.length) {
          cartSnapshotStorage.set(nextCart);
        } else {
          cartSnapshotStorage.remove();
          activeCartStoreStorage.remove();
        }

        return nextCart;
      });

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Impossible de supprimer cet article.";

      console.error("[CartContext] removeFromCart failed:", err);
      setError(message);

      throw err;
    } finally {
      setLoading(false);
    }
  },
  [requireAuth]
);

  const updateQuantity = useCallback(
    async (itemId, quantity) => {
      requireAuth();

      if (quantity < 1) return removeFromCart(itemId);

      setLoading(true);
      setError(null);

      const applyQuantityLocally = () => {
        const nextCart = cart
          ? {
              ...cart,
              items: (cart.items ?? []).map((item) =>
                String(item.id) === String(itemId)
                  ? { ...item, quantity }
                  : item
              ),
            }
          : cart;

        if (nextCart) saveCart(nextCart);
        return nextCart;
      };

      try {
        const existingItem = cartItems.find(
          (item) => String(item.id) === String(itemId)
        );

        if (!existingItem) {
          throw new Error("Article introuvable dans le panier.");
        }

        /**
         * Si l'article vient du panier fallback local, son id ressemble à
         * "local-6-4912". Le backend ne peut pas modifier cet item avec
         * /shopping-cart/items/edit, donc on met seulement la quantité à jour
         * localement.
         */
        if (!isBackendId(existingItem.id)) {
          applyQuantityLocally();

          return {
            ok: true,
            localOnly: true,
            message: "Quantité mise à jour localement.",
          };
        }

        const { customerId } = await resolveCurrentCustomer();

        await cartApi.editCartItem({
          id: Number(existingItem.id),
          productId: existingItem.productId,
          customerId,
          storeId: existingItem.storeId,
          quantity,
          salesPrice: existingItem.price,
          note: existingItem.note ?? "",
        });

        applyQuantityLocally();

        return {
          ok: true,
          localOnly: false,
          message: "Quantité mise à jour.",
        };
      } catch (err) {
        /**
         * Certains items existants côté UI ne sont pas acceptés par l'endpoint
         * edit. Pour éviter de bloquer l'utilisateur, on garde la quantité
         * cohérente côté interface et on laisse submitCart envoyer le panier
         * complet au format ShoppingCartDto.
         */
        const nextCart = applyQuantityLocally();

        const message =
          err instanceof ApiError
            ? err.message
            : "Quantité mise à jour localement.";

        console.warn("[CartContext] updateQuantity fallback:", err);
        setError(null);

        return {
          ok: true,
          localOnly: true,
          cart: nextCart,
          message,
        };
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, cartItems, resolveCurrentCustomer, removeFromCart, cart, saveCart]
  );

  const emptyCart = useCallback(
    async (shoppingCartId) => {
      requireAuth();

      const id = shoppingCartId ?? cart?.id;
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const updated = await cartApi.emptyCart(id);
        saveCart(updated);

        if (!updated?.items?.length) {
          cartSnapshotStorage.remove();
          activeCartStoreStorage.remove();
        }
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible de vider le panier.";

        console.error("[CartContext] emptyCart failed:", err);
        setError(message);

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, cart, saveCart]
  );

  const requestCustomerAccountLinkCode = useCallback(
    async ({ phoneNumber } = {}) => {
      requireAuth();

      const sourceCart = getBestExistingCart(cart, cart?.storeId);
      const storeId = getCartStoreId(sourceCart);

      let resolvedPhoneNumber = normalizeMobileNumber(phoneNumber);

      setLoading(true);
      setError(null);

      try {
        const { customer, customerId } = await resolveCurrentCustomer();
        const normalizedPhoneNumber =
          resolvedPhoneNumber || getPhoneNumberFromCustomerOrUser(customer, user);
        resolvedPhoneNumber = normalizedPhoneNumber;

        if (!normalizedPhoneNumber) {
          const message =
            "Aucun numéro de téléphone n'a été trouvé sur votre profil. Entrez un numéro pour continuer.";
          setError(message);
          return { ok: false, message, customerId, storeId };
        }

        console.log("[VERIFY PHONE NUMBER]", normalizedPhoneNumber);

        const response = await customerAccountApi.verifyPhoneNumber(
          normalizedPhoneNumber
        );

        return {
          ok: true,
          response,
          phoneNumber: normalizedPhoneNumber,
          customerId,
          storeId,
          message: "Code envoyé. Vérifiez votre téléphone.",
        };
      } catch (err) {
        const normalizedPhoneNumber = resolvedPhoneNumber || normalizeMobileNumber(phoneNumber);

        if (isNoRegisteredAccountForPhoneError(err)) {
          const message =
            "L’option création de compte n’est pas disponible pour ce store.";

          console.warn("[CartContext] Aucun compte lié à ce numéro, endpoint de création requis:", err);
          setError(null);

          return {
            ok: false,
            needsCustomerAccountCreation: true,
            requiresBackendEndpoint: true,
            phoneNumber: normalizedPhoneNumber,
            storeId,
            message,
            backendError: err?.data ?? err?.raw ?? null,
          };
        }

        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible d'envoyer le code de vérification.";

        console.error("[CartContext] requestCustomerAccountLinkCode failed:", err);
        setError(message);

        return {
          ok: false,
          message,
          phoneNumber: normalizedPhoneNumber,
          backendError: err?.data ?? err?.raw ?? null,
        };
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, cart, resolveCurrentCustomer, user]
  );

  const linkCustomerAccountByPhoneCode = useCallback(
    async ({ phoneNumber, code } = {}) => {
      requireAuth();

      const sourceCart = getBestExistingCart(cart, cart?.storeId);
      const storeId = getCartStoreId(sourceCart);
      const normalizedPhoneNumber = String(phoneNumber || "").trim();
      const safeCode = String(code || "").trim();

      if (!storeId) {
        const message = "Boutique introuvable pour ce panier.";
        setError(message);
        return { ok: false, message };
      }

      if (!normalizedPhoneNumber) {
        const message = "Entrez votre numéro de téléphone.";
        setError(message);
        return { ok: false, message };
      }

      if (!safeCode) {
        const message = "Entrez le code reçu par SMS.";
        setError(message);
        return { ok: false, message };
      }

      setLoading(true);
      setError(null);

      try {
        const { customerId } = await resolveCurrentCustomer();

        if (!customerId) {
          const message = "Impossible d'identifier le client connecté.";
          setError(message);
          return { ok: false, message };
        }

        console.log("[LINK CUSTOMER ACCOUNT BY PHONE]", {
          phoneNumber: normalizedPhoneNumber,
          storeId,
          customerId,
        });

        await customerAccountApi.linkCardsByPhoneNumber({
          phoneNumber: normalizedPhoneNumber,
          code: safeCode,
        });

        const accounts = await customerAccountApi.getCustomerAccountsByStore(
          customerId,
          storeId
        );

        console.log(
          "[CUSTOMER ACCOUNTS AFTER LINK]",
          JSON.stringify(accounts, null, 2)
        );

        const customerAccountId = getFirstCustomerAccountId(accounts);

        if (!customerAccountId) {
          const message =
            "Le compte n'a pas encore été lié à cette enseigne. Vérifiez le code ou contactez le support.";
          setError(message);

          return {
            ok: false,
            needsCustomerAccountCreation: true,
            customerAccounts: accounts,
            customerId,
            storeId,
            message,
          };
        }

        return {
          ok: true,
          customerAccountId,
          customerAccounts: accounts,
          customerId,
          storeId,
          message: "Compte client lié avec succès.",
        };
      } catch (err) {
        if (isNoRegisteredAccountForPhoneError(err)) {
          const message =
            "L’option création de compte n’est pas disponible pour ce store.";

          console.warn("[CartContext] Aucun compte à lier avec ce numéro, endpoint de création requis:", err);
          setError(null);

          return {
            ok: false,
            needsCustomerAccountCreation: true,
            requiresBackendEndpoint: true,
            phoneNumber: normalizedPhoneNumber,
            customerId: undefined,
            storeId,
            message,
            backendError: err?.data ?? err?.raw ?? null,
          };
        }

        const message =
          err instanceof ApiError
            ? err.message
            : "Impossible de lier ou créer le compte client.";

        console.error("[CartContext] linkCustomerAccountByPhoneCode failed:", err);
        setError(message);

        return {
          ok: false,
          message,
          phoneNumber: normalizedPhoneNumber,
          backendError: err?.data ?? err?.raw ?? null,
        };
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, cart, resolveCurrentCustomer]
  );

  const createCustomerAccountForCurrentStore = useCallback(
    async () => {
      requireAuth();

      const sourceCart = getBestExistingCart(cart, cart?.storeId);
      const storeId = getCartStoreId(sourceCart);

      if (!storeId) {
        const message = "Boutique introuvable pour ce panier.";
        setError(message);
        return { ok: false, message };
      }

      let customerId;

      try {
        const resolved = await resolveCurrentCustomer();
        customerId = resolved?.customerId;
      } catch (err) {
        console.warn("[CartContext] resolveCurrentCustomer failed before create request:", err);
      }

      const message =
        "L’option création de compte n’est pas disponible pour ce store.";

      const backendRequest = {
        suggestedEndpoint: "/api/client/customer-accounts/create-for-store",
        suggestedMethod: "POST",
        suggestedPayload: { storeId },
        expectedResponse: {
          id: "customerAccountId",
          customerId: customerId ?? "currentCustomerId",
          storeId,
        },
      };

      console.warn("[CartContext] Customer account creation endpoint required", backendRequest);
      setError(message);

      return {
        ok: false,
        needsCustomerAccountCreation: true,
        requiresBackendEndpoint: true,
        customerId,
        storeId,
        message,
        backendRequest,
      };
    },
    [requireAuth, cart, resolveCurrentCustomer]
  );

  const submitCart = useCallback(
    async (options = {}) => {
      requireAuth();

      const { successRedirect } = typeof options === "object" && !Array.isArray(options)
        ? options
        : {};

      const sourceCart = getBestExistingCart(cart, cart?.storeId);

      if (!sourceCart) {
        const message = "Aucun panier actif.";
        setError(message);
        return { ok: false, message };
      }

      const storeId = getCartStoreId(sourceCart);

      if (!storeId) {
        const message = "Boutique introuvable pour ce panier.";
        setError(message);
        return { ok: false, message };
      }

      setLoading(true);
      setError(null);

      try {
        const { customer, customerId } = await resolveCurrentCustomer();
        const customerPhoneNumber = getPhoneNumberFromCustomerOrUser(customer, user);

        if (!customerId) {
          const message = "Impossible d'identifier le client connecté.";
          setError(message);
          return { ok: false, message };
        }

        const selectedCustomerAccountId = toNumberOrUndefined(
          options?.customerAccountId ??
            options?.selectedCustomerAccountId ??
            options?.customerAccount?.id ??
            options?.customerAccount?.customerAccountId
        );

        let customerAccountId = selectedCustomerAccountId;
        let accounts = [];

        if (!customerAccountId) {
          accounts = await customerAccountApi
            .getCustomerAccountsByStore(customerId, storeId)
            .catch((err) => {
              console.warn("[CartContext] getCustomerAccountsByStore failed:", err);
              return [];
            });

          console.log(
            "[CUSTOMER ACCOUNTS BY STORE]",
            JSON.stringify(accounts, null, 2)
          );

          if (Array.isArray(accounts) && accounts.length > 0) {
            const message = "Sélectionnez le compte client à utiliser pour cette enseigne.";
            setError(null);

            return {
              ok: false,
              needsCustomerAccountSelection: true,
              customerAccounts: accounts,
              customerId,
              storeId,
              message,
            };
          }

          const message =
            "Aucun compte client trouvé pour cette enseigne. La validation du panier nécessite d’abord un customerAccountId.";
          setError(null);

          return {
            ok: false,
            needsCustomerAccountCreation: true,
            requiresBackendEndpoint: true,
            needsCustomerAccountSelection: false,
            customerAccounts: [],
            customerId,
            storeId,
            phoneNumber: customerPhoneNumber,
            message,
          };
        }

        const submitPayload = await ensureBackendCartForSubmit(
          sourceCart,
          customerId,
          customerAccountId
        );

        console.log(
          "[SOURCE CART BEFORE SUBMIT]",
          JSON.stringify(sourceCart, null, 2)
        );

        console.log(
          "[SUBMIT SHOPPING CART DTO FINAL]",
          JSON.stringify(submitPayload, null, 2)
        );

        if (!submitPayload?.id) {
          const message =
            "Impossible de valider le panier : aucun id de panier backend n'a été trouvé.";

          console.error("[CartContext] Missing backend shoppingCart id:", submitPayload);
          setError(message);

          return {
            ok: false,
            message,
          };
        }

        if (!isValidSubmitCartPayload(submitPayload)) {
          const message = "Panier invalide : aucun article valide à commander.";
          setError(message);

          return {
            ok: false,
            message,
          };
        }

        if (!submitPayload.cartItems.some((item) => item.id)) {
          console.warn(
            "[CartContext] Submit payload cartItems do not contain backend item ids.",
            submitPayload.cartItems
          );
        }

        const result = await submitShoppingCartPayload(submitPayload);

        setCart(null);
        activeCartStoreStorage.remove();
        cartSnapshotStorage.remove();

        return {
          ok: true,
          result,
          redirectTo: successRedirect ?? "/account",
          message:
            result?.message ||
            result?.content?.message ||
            "Commande validée avec succès.",
        };
      } catch (err) {
        const message = getBackendSubmitMessage(err);

        console.error("[CartContext] submitCart failed:", err);
        setError(message);

        return {
          ok: false,
          message,
          backendError: err?.data ?? err?.raw ?? null,
        };
      } finally {
        setLoading(false);
      }
    },
    [requireAuth, cart, resolveCurrentCustomer, user]
  );

  const value = useMemo(
    () => ({
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
      requestCustomerAccountLinkCode,
      linkCustomerAccountByPhoneCode,
      createCustomerAccountForCurrentStore,
      refreshCart,
      refreshActiveCart,
      setError,
    }),
    [
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
      requestCustomerAccountLinkCode,
      linkCustomerAccountByPhoneCode,
      createCustomerAccountForCurrentStore,
      refreshCart,
      refreshActiveCart,
      setError,
    ]
  );

  return value;
}

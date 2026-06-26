/**
 * useCart.js
 * Re-exports the new API-backed CartContext hook.
 *
 * ⚠️ DISAMBIGUATION: this is NOT the same cart as ApiContext's mock cart
 * (useApi().cart / addToCart / removeFromCart / clearCart), which remains
 * untouched and still powers CartPage.jsx, Navbar.jsx's cart badge, and
 * ProductCard.jsx's "add to cart" button today.
 *
 * `useCart()` here gives access to the REAL backend-backed cart
 * (CartContext.jsx) for progressive migration. Until pages are migrated,
 * both carts coexist independently — see integration notes for the
 * recommended migration order.
 */

import { useCartContext } from "../context/CartContext";

export const useCart = useCartContext;

export default useCart;
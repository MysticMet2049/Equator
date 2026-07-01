import CartItemCard from "./CartItemCard";

// Liste des articles présents dans le panier.
export default function CartItemsList({ cart, onUpdateQty, onRemove }) {
  return (
    <div className="flex-1 space-y-3">
      {cart.map((item) => (
        <CartItemCard
          key={item.id}
          item={item}
          onUpdateQty={onUpdateQty}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

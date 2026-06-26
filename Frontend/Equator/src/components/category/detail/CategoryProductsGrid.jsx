import CategoryStatusMessage from "../CategoryStatusMessage";
import CategoryProductCard from "./CategoryProductCard";

export default function CategoryProductsGrid({
  loading,
  error,
  products,
  added,
  onAdd,
}) {
  if (loading) {
    return <CategoryStatusMessage message="Chargement des produits..." size="lg" />;
  }

  if (error) {
    return (
      <CategoryStatusMessage
        message="Impossible de charger les produits."
        size="lg"
      />
    );
  }

  if (products.length === 0) {
    return (
      <CategoryStatusMessage
        message="Aucun produit dans cette catégorie."
        size="lg"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((product) => (
        <CategoryProductCard
          key={product.id}
          product={product}
          onAdd={() => onAdd(product)}
          added={added[product.id]}
        />
      ))}
    </div>
  );
}

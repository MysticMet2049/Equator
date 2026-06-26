import ProductCard from "../../product/ProductCard";

export default function StoreProductsTab({ products, store, loading, error }) {
  if (loading) return <TabMessage message="Chargement des produits..." />;
  if (error) return <TabMessage message="Impossible de charger les produits." />;
  if (products.length === 0) return <TabMessage message="Aucun produit disponible." />;

  return (
    <div className="pb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              storeId: product.storeId ?? store.id,
              storeName: product.storeName ?? store.name,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TabMessage({ message }) {
  return (
    <div className="pb-12">
      <div className="text-center py-20">
        <p className="text-lg font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-muted)" }}>
          {message}
        </p>
      </div>
    </div>
  );
}

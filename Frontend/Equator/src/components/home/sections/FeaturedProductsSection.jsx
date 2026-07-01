import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "../../product/ProductCard";
import HomeSectionHeader from "./HomeSectionHeader";
import HomeSectionStatus from "./HomeSectionStatus";

// Section de la page d'accueil dédiée aux produits mis en avant.
export default function FeaturedProductsSection({ products, loading, error, isEmpty }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <HomeSectionHeader
        title="Sélection du moment"
        description="Nos pièces favorites choisies pour vous."
        linkTo="/marketplace"
      />

      {loading ? (
        <HomeSectionStatus>Chargement des produits...</HomeSectionStatus>
      ) : error ? (
        <HomeSectionStatus>Impossible de charger les produits.</HomeSectionStatus>
      ) : isEmpty ? (
        <HomeSectionStatus>Aucun produit disponible pour le moment.</HomeSectionStatus>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="mt-6 flex md:hidden justify-center">
        <Link
          to="/marketplace"
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: "var(--color-equator-green)" }}
        >
          Tout voir <FiArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

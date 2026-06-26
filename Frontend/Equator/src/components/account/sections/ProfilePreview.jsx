import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import ProductCard from "../../product/ProductCard";
import { formatDate, formatMoney, getCardBalance, getCardName, getCardPoints, getPurchaseDate, getPurchaseId, getPurchaseStore, getPurchaseTotal } from "../accountUtils";

export default function ProfilePreview({ favoriteProducts, purchases, linkedCards, setActiveSection }) {
  return (
    <div className="space-y-8">
      <PreviewBlock title="Mes favoris" subtitle="Les articles que vous aimez." target="favorites" setActiveSection={setActiveSection}>
        {favoriteProducts.length === 0 ? <SmallEmpty message="Aucun favori" link="/marketplace" /> : <FavoritesPreview products={favoriteProducts} />}
      </PreviewBlock>

      <PreviewBlock title="Historique d'achats" target="orders" setActiveSection={setActiveSection}>
        <PurchasesPreview purchases={purchases} />
      </PreviewBlock>

      <PreviewBlock title="Mes comptes enseignes" target="stores" setActiveSection={setActiveSection}>
        <CardsPreview linkedCards={linkedCards} />
      </PreviewBlock>
    </div>
  );
}

function PreviewBlock({ title, subtitle, target, setActiveSection, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-light" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>{title}</h3>
          {subtitle && <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>{subtitle}</p>}
        </div>
        <button onClick={() => setActiveSection(target)} className="text-xs font-medium flex items-center gap-1" style={{ color: "var(--color-equator-green)" }}>
          Voir tout <FiChevronRight size={12} />
        </button>
      </div>
      {children}
    </div>
  );
}

function FavoritesPreview({ products }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.productId || product.id} product={{ ...product, id: product.productId || product.id, productId: product.productId || product.id }} />
      ))}
    </div>
  );
}

function PurchasesPreview({ purchases }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-equator-beige)" }}>
      {purchases.length === 0 ? (
        <div className="p-8 text-center"><p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>Aucun achat enregistré.</p></div>
      ) : (
        purchases.slice(0, 3).map((order, index) => (
          <div key={order.id || order.reference || index} className="grid grid-cols-4 px-5 py-3.5 items-center text-sm" style={{ borderBottom: index < Math.min(purchases.length, 3) - 1 ? "1px solid var(--color-equator-beige)" : "none", fontFamily: "var(--font-body)" }}>
            <span className="font-medium">{getPurchaseId(order)}</span>
            <span style={{ color: "var(--color-equator-muted)" }}>{formatDate(getPurchaseDate(order))}</span>
            <span style={{ color: "var(--color-equator-muted)" }}>{getPurchaseStore(order)}</span>
            <span className="text-right font-semibold">{formatMoney(getPurchaseTotal(order))}</span>
          </div>
        ))
      )}
    </div>
  );
}

function CardsPreview({ linkedCards }) {
  if (linkedCards.length === 0) return <SmallEmpty message="Aucun compte enseigne lié." />;

  return (
    <div className="space-y-2">
      {linkedCards.slice(0, 3).map((card, index) => (
        <div key={card.id || card.cardId || index} className="bg-white rounded-xl px-5 py-4 flex items-center justify-between" style={{ border: "1px solid var(--color-equator-beige)" }}>
          <div>
            <p className="text-sm font-medium">{getCardName(card)}</p>
            <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>Solde : {formatMoney(getCardBalance(card))}</p>
          </div>
          <p className="text-xs font-semibold">{getCardPoints(card).toLocaleString("fr-FR")} pts</p>
        </div>
      ))}
    </div>
  );
}

function SmallEmpty({ message, link }) {
  return (
    <div className="bg-white rounded-xl p-8 text-center" style={{ border: "1px solid var(--color-equator-beige)" }}>
      <p className="text-sm" style={{ color: "var(--color-equator-muted)" }}>
        {message} {link && <Link to={link} className="underline" style={{ color: "var(--color-equator-green)" }}>explorer la marketplace</Link>}
      </p>
    </div>
  );
}

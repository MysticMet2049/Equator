import { FiCreditCard } from "react-icons/fi";
import { formatMoney, getCardBalance, getCardDebt, getCardName, getCardPoints } from "../accountUtils";
import EmptyState from "../shared/EmptyState";
import SectionError from "../shared/SectionError";

export default function StoreAccountsSection({ linkedCards, debtItems, error }) {
  return (
    <section className="space-y-6">
      <SectionError message={error} />

      {linkedCards.length === 0 ? (
        <EmptyState icon={FiCreditCard} text="Aucun compte enseigne lié à votre profil." />
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {linkedCards.map((card, index) => <StoreAccountCard key={card.id || card.cardId || index} card={card} />)}
        </div>
      )}

      {debtItems.length > 0 && (
        <div>
          <h3 className="text-lg font-light mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
            Achats avec dette
          </h3>
          <div className="space-y-2">
            {debtItems.map((item, index) => (
              <div key={item.id || index} className="bg-white rounded-xl p-4 flex items-center justify-between" style={{ border: "1px solid var(--color-equator-beige)" }}>
                <span className="text-sm" style={{ fontFamily: "var(--font-body)" }}>{getCardName(item)}</span>
                <strong className="text-sm" style={{ color: "#dc2626", fontFamily: "var(--font-body)" }}>{formatMoney(getCardDebt(item))}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function StoreAccountCard({ card }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>{getCardName(card)}</p>
          <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>Compte enseigne lié</p>
        </div>
        <FiCreditCard size={22} style={{ color: "var(--color-equator-green)" }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Solde" value={formatMoney(getCardBalance(card))} />
        <Metric label="Points" value={getCardPoints(card).toLocaleString("fr-FR")} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl p-3" style={{ background: "var(--color-equator-cream)" }}>
      <p className="text-xs" style={{ color: "var(--color-equator-muted)" }}>{label}</p>
      <p className="text-sm font-semibold" style={{ color: "var(--color-equator-text)" }}>{value}</p>
    </div>
  );
}

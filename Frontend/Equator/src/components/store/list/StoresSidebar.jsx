import { Link } from "react-router-dom";
import { FILTER_OPTIONS, STORE_CATEGORIES } from "./storeListConfig";

export default function StoresSidebar({ activeCategory, onChangeCategory, activeFilters, onToggleFilter, categoryCounts }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 space-y-5">
      <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
        <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
          CATÉGORIES
        </p>

        <ul className="space-y-2">
          {STORE_CATEGORIES.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onChangeCategory(category.id)}
                className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-stone-50"
                style={{
                  background: activeCategory === category.id ? "#e8f5ee" : "transparent",
                  color: activeCategory === category.id ? "var(--color-equator-green)" : "var(--color-equator-text)",
                  fontFamily: "var(--font-body)",
                  fontWeight: activeCategory === category.id ? 600 : 400,
                }}
              >
                <span>{category.label}</span>
                <span className="text-xs" style={{ color: "var(--color-equator-muted)" }}>
                  {categoryCounts[category.id] || 0}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl p-5" style={{ border: "1px solid var(--color-equator-beige)" }}>
        <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
          FILTRES
        </p>

        <ul className="space-y-3">
          {FILTER_OPTIONS.map(({ id, label }) => (
            <li key={id} className="flex items-center gap-2.5 cursor-pointer" onClick={() => onToggleFilter(id)}>
              <Checkbox checked={activeFilters.includes(id)} />
              <span className="text-sm" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl p-5 text-white" style={{ background: "var(--color-equator-green-dark)" }}>
        <p className="text-sm font-semibold mb-1" style={{ fontFamily: "var(--font-body)" }}>
          Vendez sur Equator
        </p>
        <p className="text-xs leading-relaxed mb-4 opacity-80" style={{ fontFamily: "var(--font-body)" }}>
          Rejoignez des milliers de marchands et développez votre activité dès aujourd'hui.
        </p>
        <Link
          to="/sell"
          className="block text-center text-xs font-semibold py-2.5 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: "white", color: "var(--color-equator-green-dark)", fontFamily: "var(--font-body)" }}
        >
          Ouvrir ma boutique
        </Link>
      </div>
    </aside>
  );
}

function Checkbox({ checked }) {
  return (
    <div
      className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
      style={{
        border: `1.5px solid ${checked ? "var(--color-equator-green)" : "#ccc"}`,
        background: checked ? "var(--color-equator-green)" : "white",
      }}
    >
      {checked && (
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

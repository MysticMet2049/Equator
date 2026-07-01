import { TRUST_BADGES as TRUST } from "../../../data/ui";

// Section de réassurance affichée sous les produits et les stores.
export default function TrustBadgesSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        {TRUST.map(({ Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "var(--color-equator-beige)" }}
            >
              <Icon size={22} style={{ color: "var(--color-equator-green)" }} />
            </div>
            <h3
              className="text-sm font-semibold"
              style={{
                color: "var(--color-equator-text)",
                fontFamily: "var(--font-body)",
              }}
            >
              {title}
            </h3>
            <p
              className="text-xs leading-relaxed max-w-50"
              style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}
            >
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

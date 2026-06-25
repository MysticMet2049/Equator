import { Link } from "react-router-dom";
import { FiGlobe, FiMail, FiInstagram } from "react-icons/fi";
import { useState } from "react";


// Composant Footer réutilisable avec plusieurs variantes d'affichage
export default function Footer({ variant = "default" }) {
  const [email, setEmail] = useState("");
  // État local pour le champ newsletter
  return (
    <footer style={{ background: "var(--color-equator-cream)", borderTop: "1px solid var(--color-equator-beige)" }}>
      <div className="max-w-7xl mx-auto px-6 py-14">
         {/* Grille principale du footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Section marque / présentation */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-xl font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--color-equator-text)" }}>
              {variant === "product" ? "Equator" : "EQUATOR"}
                {/* Description dynamique selon la variante */}
            </p>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
              {variant === "stores"
                ? "La première place de marché digitale dédiée à l'excellence et à l'artisanat moderne. Trouvez des produits uniques qui racontent une histoire."
                : variant === "product"
                ? "La destination premium pour les objets d'exception. Curés avec soin pour les connaisseurs du monde entier."
                : "La place de marché premium pour les esprits exigeants. Découvrez une sélection curatée des meilleurs produits."}
            </p>
            {/* Réseaux sociaux et moyens de contact */}
            <div className="flex gap-2">
              {[FiGlobe, FiInstagram, FiMail].map((Icon, i) => (
                <a key={i} href="#" className="p-1.5 rounded-full transition-colors hover:bg-stone-100" style={{ color: "var(--color-equator-muted)" }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Première colonne de navigation */}
          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              {variant === "stores" ? "EXPLORER" : variant === "product" ? "MARKETPLACE" : "PLATEFORME"}
            </p>
            <ul className="flex flex-col gap-2.5">
              {(variant === "stores"
                ? [["Marketplace", "/marketplace"], ["Stores", "/stores"], ["Categories", "/categories"], ["Deals", "/deals"]]
                : [["About Us", "/about"], ["Sell on Equator", "/sell"], ["Careers", "/careers"]]
              ).map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-xs transition-colors hover:text-stone-800" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Deuxième colonne de navigation */}
          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              {variant === "stores" ? "SOCIÉTÉ" : "SUPPORT"}
            </p>
            <ul className="flex flex-col gap-2.5">
              {(variant === "stores"
                ? [["About Us", "/about"], ["Careers", "/careers"], ["Sell on Equator", "/sell"], ["Contact Support", "/contact"]]
                : [["Contact Support", "/contact"], ["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"]]
              ).map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="text-xs transition-colors hover:text-stone-800" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section newsletter */}
          <div>
            <p className="text-xs font-semibold mb-4 tracking-widest" style={{ color: "var(--color-equator-text)", fontFamily: "var(--font-body)" }}>
              NEWSLETTER
            </p>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--color-equator-muted)" }}>
              Recevez nos dernières sorties et offres exclusives.
            </p>

             {/* Formulaire d'inscription newsletter */}
            <div className="flex gap-1">
              <input
                type="email"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-l outline-none"
                style={{ border: "1px solid var(--color-equator-beige)", fontFamily: "var(--font-body)", background: "white" }}
              />
              <button
                className="px-3 py-2 text-white text-xs rounded-r font-medium transition-opacity hover:opacity-90"
                style={{ background: "var(--color-equator-green)", minWidth: "36px" }}
              >
                ›
              </button>
            </div>

            {/* Bloc support affiché uniquement pour la variante stores */}
            {variant === "stores" && (
              <div className="mt-6 rounded-lg p-4" style={{ background: "var(--color-equator-green-dark)" }}>
                <p className="text-xs font-semibold text-white mb-1">Besoin d'aide ?</p>
                <p className="text-xs font-bold" style={{ color: "#6ee7b7" }}>SUPPORT DISPONIBLE 24/7</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barre inférieure du footer */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2" style={{ borderTop: "1px solid var(--color-equator-beige)" }}>
        {/* Copyright */}
        <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)" }}>
          © 2024 EQUATOR DIGITAL MARKETPLACE. ALL RIGHTS RESERVED.
        </p>
        {/* Signature premium visible uniquement sur la page stores */}
        {variant === "stores" && (
          <p className="text-xs" style={{ color: "var(--color-equator-muted)", fontFamily: "var(--font-body)", letterSpacing: "0.1em" }}>
            MADE WITH PRECISION · EQUATOR . YATA EXPERTS
          </p>
        )}
      </div>
    </footer>
  );
}

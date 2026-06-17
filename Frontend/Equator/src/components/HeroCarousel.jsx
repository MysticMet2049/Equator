// Importe les hooks React nécessaires :
// useState pour gérer l'état local,
// useEffect pour lancer l'autoplay,
// useCallback pour mémoriser la fonction next.
import { useState, useEffect, useCallback } from "react"; 
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useApi } from "../context/ApiContext";

export default function HeroCarousel() {
  // Récupère les données des slides depuis le contexte global de l'application.
  const { heroSlides } = useApi(); 
  // current stocke l'index du slide actuellement affiché.
  const [current, setCurrent] = useState(0);
  // isPaused permet de suspendre le défilement automatique au survol de la souris.
  const [isPaused, setIsPaused] = useState(false);

  // Passe au slide suivant.
  // Le modulo permet de revenir au premier slide après le dernier.
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, [heroSlides.length]);

  // Revient au slide précédent.
  // L'ajout de heroSlides.length évite d'obtenir un index négatif.
  const prev = () => {
    setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  };

  // Active le défilement automatique des slides toutes les 5 secondes.
  // Le timer est nettoyé à chaque démontage ou changement de dépendance.
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  // Récupère les informations du slide actuellement affiché.
  const slide = heroSlides[current];

  return (
    // Section principale du carousel.
    // Elle occupe presque toute la hauteur de l'écran en tenant compte de la navbar.
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 3.5rem)", minHeight: "520px", maxHeight: "820px" }}
      // Met le carousel en pause quand la souris entre dans la zone.
      onMouseEnter={() => setIsPaused(true)}
      // Relance le défilement automatique quand la souris quitte la zone.
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {/* Affiche tous les slides en position absolue.*/}
      {/*Seul le slide courant est rendu visible grâce aux classes active/inactive.*/}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 hero-slide ${
            i === current ? "active" : "inactive"
          }`}
          style={{ zIndex: i === current ? 1 : 0 }}
        >
          {/* Image principale du slide.*/}
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          {/* Dégradé sombre placé au-dessus de l'image pour améliorer la lisibilité du texte.*/}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)",
            }}
          />
        </div>
      ))}

      {/* Contenu */}
      {/*Contenu textuel du slide : tag, titre, sous-titre et boutons d'action.*/}
      <div
        className="relative z-10 h-full flex flex-col justify-center px-10 md:px-20 max-w-2xl"
        style={{ paddingTop: "3.5rem" }}
      >
        <span
          className="text-xs font-semibold tracking-[0.2em] mb-4 inline-block"
          style={{
            color: "rgba(255,255,255,0.85)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.18em",
          }}
        >
          {slide.tag}
          {/* Petit label affiché au-dessus du titre du slide.*/}
        </span>

        <h1
          className="text-4xl md:text-5xl font-light text-white leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          {slide.title}
          {/*Titre principal du slide.*/}
        </h1>

          
        <p
          className="text-sm md:text-base mb-8 leading-relaxed max-w-md"
          style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}
        >
          {slide.subtitle}
        </p>
          {/*Groupe des boutons d'appel à l'action.*/}
        <div className="flex flex-wrap gap-3">
          {/* Bouton principal qui redirige vers la marketplace.*/}
          <Link
            to="/marketplace"
            className="btn-primary px-6 py-2.5 rounded text-sm font-medium text-white transition-all"
            style={{
              background: "var(--color-equator-green)",
              fontFamily: "var(--font-body)",
            }}
          >
            {slide.cta}
          </Link>

          {/* Bouton secondaire qui redirige également vers la marketplace.*/}
          <Link
            to="/marketplace"
            className="px-6 py-2.5 rounded text-sm font-medium transition-all"
            style={{
              background: "rgba(255,255,255,0.15)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.4)",
              backdropFilter: "blur(4px)",
              fontFamily: "var(--font-body)",
            }}
          >
            {slide.ctaSecondary}
          </Link>
        </div>
      </div>

      {/* Flèche de Navigation */}
      {/*Bouton permettant d'aller au slide précédent*/}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(4px)",
          color: "white",
        }}
        aria-label="Slide précédent"
      >
        <FiChevronLeft size={20} />
      </button>
      {/* Bouton permettant d'aller au slide suivant */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          backdropFilter: "blur(4px)",
          color: "white",
        }}
        aria-label="Slide suivant"
      >
        <FiChevronRight size={20} />
      </button>

         {/*Indicateurs de pagination du carousel*/}
        {/*Chaque point permet d'accéder directement à un slide*/}
      {/* point de Pagination */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
          // Change le slide courant au clic sur un indicateur.
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="carousel-dot rounded-full"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              background: i === current ? "white" : "rgba(255,255,255,0.45)",
            }}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

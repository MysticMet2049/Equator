import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useApi } from "../../context/ApiContext";

export default function HeroCarousel() {
  const { heroSlides } = useApi();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prev = () => {
    setCurrent((c) => (c - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 3.5rem)", minHeight: "520px", maxHeight: "820px" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {heroSlides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 hero-slide ${
            i === current ? "active" : "inactive"
          }`}
          style={{ zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.04) 100%)",
            }}
          />
        </div>
      ))}

      {/* Content */}
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
        </span>

        <h1
          className="text-4xl md:text-5xl font-light text-white leading-tight mb-4"
          style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
        >
          {slide.title}
        </h1>

        <p
          className="text-sm md:text-base mb-8 leading-relaxed max-w-md"
          style={{ color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-body)" }}
        >
          {slide.subtitle}
        </p>

        <div className="flex flex-wrap gap-3">
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

      {/* Navigation arrows */}
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

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, i) => (
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

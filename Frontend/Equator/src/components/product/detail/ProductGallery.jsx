import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductImage from "./ProductImage";

export default function ProductGallery({ product, images, activeImg, setActiveImg }) {
  const activeImage = images[Math.min(activeImg, images.length - 1)] || images[0];

  return (
    <div className="flex gap-3 flex-1">
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-14 shrink-0">
          {images.map((image, index) => (
            <button
              key={`${image.kind}-${image.assetId || image.src || index}`}
              onClick={() => setActiveImg(index)}
              className="rounded-lg overflow-hidden transition-all"
              style={{
                aspectRatio: "1/1",
                border: `2px solid ${
                  index === activeImg ? "var(--color-equator-green)" : "var(--color-equator-beige)"
                }`,
                background: "#f0ebe3",
              }}
            >
              <ProductImage image={image} product={product} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 relative">
        <div
          className="rounded-2xl overflow-hidden relative bg-white"
          style={{ aspectRatio: "1/1", border: "1px solid var(--color-equator-beige)" }}
        >
          <ProductImage image={activeImage} product={product} className="w-full h-full object-cover" />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImg((index) => (index - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}
              >
                <FiChevronLeft size={14} />
              </button>

              <button
                onClick={() => setActiveImg((index) => (index + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white flex items-center justify-center"
                style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.10)", border: "1px solid var(--color-equator-beige)" }}
              >
                <FiChevronRight size={14} />
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImg(index)}
                className="rounded-full transition-all"
                style={{
                  width: index === activeImg ? "18px" : "6px",
                  height: "6px",
                  background: index === activeImg ? "var(--color-equator-green)" : "#ccc",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

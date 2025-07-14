import { useState, useEffect, useRef } from "react";
import "./UtilCarousel.css";
import "./Carousel.css";

export default function Carousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slides = [
    "Random Question",
    "Text Compare",
    "Tree Diagram",
    "Carousel",
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollTop = carousel.scrollTop;
      const clientHeight = carousel.clientHeight;
      const slideHeight = clientHeight; // Each slide takes full viewport height

      // Calculate which slide is currently most visible
      const currentSlide = Math.round(scrollTop / slideHeight);
      const newActiveSlide = Math.max(
        0,
        Math.min(currentSlide, slides.length - 1),
      );

      setActiveSlide(newActiveSlide);
      console.log("scroll", {
        scrollTop,
        clientHeight,
        slideHeight,
        currentSlide,
        activeSlide: newActiveSlide,
      });
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [slides.length]);

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slideHeight = carousel.clientHeight; // Each slide takes full viewport height
    carousel.scrollTo({
      top: index * slideHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="carousel-section absolute top-0 left-0 h-full w-full">
      {/* <div className="carousel-section-header pt-16">
        <h2 className="text-2xl font-bold">Wheel</h2>
        <div className="tags">
          <span className="bg-zinc-600">Scroll Buttons</span>
          <span className="bg-zinc-600">Scroll Markers</span>
          <span className="bg-zinc-600">Scroll-State Queries</span>
          <span className="bg-zinc-600">Scroll Driven Animation</span>
          <span className="bg-zinc-600">Anchor</span>
        </div>
        <p>A classic vertical wheel of choices carousel.</p>
        <div className="slide-indicator">
          <span>
            Active Slide: {activeSlide + 1} of {slides.length}
          </span>
          <div className="slide-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slide-dot ${index === activeSlide ? "active" : ""}`}
                onClick={() => scrollToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div> */}

      <div role="region" aria-label="Wheel carousel demo">
        <div
          ref={carouselRef}
          className="carousel carousel--vertical carousel--scroll-markers carousel--offscreen-inert"
          aria-live="polite"
        >
          {slides.map((game, index) => (
            <div
              key={index}
              className="carousel__slide bg-zinc-500"
              data-label={game}
            >
              <h3>{game}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

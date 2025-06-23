import { useState, useEffect, useRef } from "react";
import "./UtilCarousel.css";
import "./Carousel.css";

export default function Carousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const slides = [
    "Super Mario Bros.",
    "The Legend of Zelda",
    "Metroid",
    "Castlevania",
    "Mega Man 2",
    "Final Fantasy",
    "Contra",
    "Ninja Gaiden",
    "Tecmo Bowl",
    "Punch-Out",
    "Excitebike",
    "Kid Icarus",
    "Double Dragon",
    "Bubble Bobble",
    "Kirby's Adventure",
    "Tetris",
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollTop = carousel.scrollTop;
      const slideHeight = carousel.scrollHeight / slides.length;
      const currentSlide = Math.round(scrollTop / slideHeight);
      setActiveSlide(Math.max(0, Math.min(currentSlide, slides.length - 1)));
    };

    carousel.addEventListener("scroll", handleScroll);
    return () => carousel.removeEventListener("scroll", handleScroll);
  }, [slides.length]);

  const scrollToSlide = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const slideHeight = carousel.scrollHeight / slides.length;
    carousel.scrollTo({
      top: index * slideHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="carousel-section">
      <div className="carousel-section-header pt-16">
        <h2>Wheel</h2>
        <div className="tags">
          <span>Scroll Buttons</span>
          <span>Scroll Markers</span>
          <span>Scroll-State Queries</span>
          <span>Scroll Driven Animation</span>
          <span>Anchor</span>
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
      </div>

      <div role="region" aria-label="Wheel carousel demo">
        <div
          ref={carouselRef}
          className="carousel carousel--vertical carousel--scroll-markers carousel--offscreen-inert"
          aria-live="polite"
        >
          {slides.map((game, index) => (
            <div key={index} className="carousel__slide" data-label={game}>
              <h3>{game}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

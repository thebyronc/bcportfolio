import "./UtilCarousel.css";
import "./Carousel.css";

export default function Carousel() {
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
      </div>

      <div role="region" aria-label="Wheel carousel demo">
        <div
          className="carousel carousel--vertical carousel--scroll-markers carousel--offscreen-inert"
          aria-live="polite"
        >
          <div className="carousel__slide" data-label="Super Mario Bros">
            <h3>Super Mario Bros.</h3>
          </div>
          <div className="carousel__slide" data-label="The Legend of Zelda">
            <h3>The Legend of Zelda</h3>
          </div>
          <div className="carousel__slide" data-label="Metroid">
            <h3>Metroid</h3>
          </div>
          <div className="carousel__slide" data-label="Castlevania">
            <h3>Castlevania</h3>
          </div>
          <div className="carousel__slide" data-label="Mega Man 2">
            <h3>Mega Man 2</h3>
          </div>
          <div className="carousel__slide" data-label="Final Fantasy">
            <h3>Final Fantasy</h3>
          </div>
          <div className="carousel__slide" data-label="Contra">
            <h3>Contra</h3>
          </div>
          <div className="carousel__slide" data-label="Ninja Gaiden">
            <h3>Ninja Gaiden</h3>
          </div>
          <div className="carousel__slide" data-label="Tecmo Bowl">
            <h3>Tecmo Bowl</h3>
          </div>
          <div className="carousel__slide" data-label="Punch-Out">
            <h3>Punch-Out</h3>
          </div>
          <div className="carousel__slide" data-label="Excitebike">
            <h3>Excitebike</h3>
          </div>
          <div className="carousel__slide" data-label="Kid Icarus">
            <h3>Kid Icarus</h3>
          </div>
          <div className="carousel__slide" data-label="Double Dragon">
            <h3>Double Dragon</h3>
          </div>
          <div className="carousel__slide" data-label="Bubble Bobble">
            <h3>Bubble Bobble</h3>
          </div>
          <div className="carousel__slide" data-label="Kirby's Adventure">
            <h3>Kirby's Adventure</h3>
          </div>
          <div className="carousel__slide" data-label="Tetris">
            <h3>Tetris</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

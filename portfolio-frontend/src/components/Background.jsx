import "./Background.css";

/* The ONE global background for the whole portfolio. Render it once at the app root, before the page content.

   Layers (back → front):
     1. charcoal base
     2. a single muted-orange glow, fixed to the top-left of the viewport
     3. one uniform square grid (identical horizontal/vertical spacing, same alignment everywhere)

   It is position: fixed, so the glow and grid never move, reset or re-align while scrolling or when
   navigating between sections. Sections and the Hero are transparent and must not paint their own
   background, glow or grid.

   Theme: every section is designed for the dark terminal look, so this layer is always the dark
   workspace (the previous light variant was never visible, because sections painted over it). */
const Background = () => (
  <div className="bg-root" aria-hidden="true">
    <div className="bg-glow" />
    <div className="bg-grid" />
  </div>
);

export default Background;
# Design Specification: Website Redesign (Home Page Pilot)

*   **Date**: 2026-05-30
*   **Project**: Chess Community Chhattisgarh (Redesign)
*   **Author**: Antigravity (AI Assistant)
*   **Status**: Proposed

---

## 1. Product Context & Objectives
The platform is a comprehensive chess community space for Chhattisgarh, housing:
*   State-level tournament listings & registrations (e.g., Summer Fiesta)
*   Curated video vaults & interactive PGN lesson players
*   Product store & educational chess courses
*   Player profile databases & FIDE ratings

This redesign converts the Home page / Landing page into a premium, high-fidelity experience that stands alongside top-tier digital SaaS/esports designs, establishing the visual system for the rest of the application.

---

## 2. Visual Identity & Theme Definition

### A. Color & Surface Constraints
Per user feedback, the current visual color palette is preserved:
*   **Background Ground**: Dark brown-black `#100d0b` HSL/hex.
*   **Primary Accent**: Signature Neon Green/Yellow `#c8ff2e`.
*   **Secondary Accents**: Warm Gold `#D4AF37` and white tints.
*   **Card Surfaces**: Dark glassmorphic or lacquer-like dark cards (`bg-white/5` or similar) with thin high-contrast borders.

### B. Typography
*   **Headings**: Oswald (for display titles).
*   **Body Copy**: Space Grotesk (for body text).
*   **Technical Details**: Roboto Mono / monospaced fonts (for ratings, dates, coordinates).
*   **Constraints**:
    *   Display H1 clamp max is set to `6rem` (~96px) to avoid comically large, overwhelming titles.
    *   Display H1 letter-spacing floor is set to `tracking-[-0.03em]` to prevent overlapping letters.
    *   No all-caps formatting on body copy blocks.

---

## 3. Structural Layout & Bento Grids

The home page sections will be converted from stacked lists to **Bento Grids** (12-column responsive layout):

### A. Hero Section
*   **Left Column**: High-impact editorial copy:
    *   *Headline*: "Chhattisgarh Chess Union. Play in open state tournaments, study the grandmaster archives, and track your official FIDE rating improvements."
    *   *CTAs*: "Explore Tournaments" (primary, solid neon background) & "Study Vault" (secondary, transparent with border).
*   **Right Column**: Hybrid visual canvas consisting of:
    *   2-3 floating 3D chess pieces (WebGL/Three.js) rendered in highly detailed textures (polished black lacquer, gold leaf, matte finish).
    *   A static, flat 2D coordinate outline box (`a1` to `h8` grid border) acting as a technical overlay.

### B. Videos Preview Bento
*   **Tile 1 (2/3 width)**: Dynamic featured video playback preview. Shows thumbnail, video title, length badge, and a glowing play icon.
*   **Tile 2 (1/3 width)**: Vertically stacked preview of other lessons in the active playlist.

### C. Events Preview Bento
*   **Summer Fiesta Tile (Full/Wide)**: Wide promotional block for the "Summer Fiesta Grand Chess Open" showing the date (9th May 2026), location (Ambuja Mall), prize pool (₹1,00,000+), download brochure CTA, and registration entry button.
*   **Camps & Supporting Tournaments Grid**: Staggered smaller bento blocks listing other active chess camps and events.

### D. Store Preview Bento
*   **Tile 1 (1/2 width)**: Highlighted chess equipment or course product.
*   **Tile 2 & 3 (1/4 width each)**: Smaller product inventory entries with clean, high-contrast price tags.

---

## 4. Motion & Animation System

### A. Entrance Sequence
1.  **Header Reveal**: Characters/words slide up and fade in utilizing `easeOutExpo` easing over `0.8s`.
2.  **Copy & CTA Slide**: Secondary text elements and action buttons stagger-fade in from `y: 15px` to `y: 0px`.
3.  **Visual Canvas Draw**: The 2D borders draw their lines (via SVG stroke path animation) as the 3D canvas reveals the rotating pieces.

### B. Scroll & Hover States
*   **Staggered Reveals**: Bento grid tiles fade and slide up with a `40ms` delay between neighboring blocks.
*   **Image Hover Ban**: **No** scaling, zooming, or rotation transitions will be applied to images.
*   **Interactive Cards**: Card borders highlight on hover (e.g. opacity transition from `border-white/10` to `border-neon/40`), and background shades change slightly (`bg-white/5` to `bg-white/10`).
*   **Mouse Parallax**: The WebGL pieces rotate gently according to cursor coordinates relative to the screen center.

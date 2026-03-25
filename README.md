# Sharn Interactive Map

An interactive map web application for the city of Sharn (Eberron campaign setting). Features three independent, toggleable map layers (Upper, Middle, Lower Wards) with per-layer note pinning, marker clustering, and **Convex** persistence.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Backend / data:** [Convex](https://www.convex.dev/) (real-time queries & mutations)
- **Mapping:** Leaflet.js with react-leaflet and react-leaflet-cluster
- **Styling:** Tailwind CSS

## Setup

1. **Place map images** (if not already present): Copy `Sharn_Upper_Wards.webp`, `Sharn_Middle_Wards.webp`, and `Sharn_Lower_Wards.webp` into the project root. The `postinstall` script will copy them to `public/maps/`. Or place them directly in `public/maps/`.

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Convex backend:** In a separate terminal, run:
   ```bash
   npx convex dev
   ```
   This configures your dev deployment and writes `NEXT_PUBLIC_CONVEX_URL` to `.env.local` (gitignored). For a first-time non-interactive setup you can use `CONVEX_AGENT_MODE=anonymous npx convex dev --once`.

4. **Start the Next.js app:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Configuration

Layer names, images, colors, and storage keys are defined in [`config/layers.ts`](config/layers.ts). Edit that file to customize layers.

## Features

- **3 independent map layers** — Switch via tabs; each layer has its own notes
- **Click to add notes** — Click anywhere on the active map to create a note at that location
- **Marker clustering** — Proximate notes group into clusters; zoom to expand
- **Edit / Delete** — Available from the marker popup, with confirmation dialogs
- **Convex persistence** — Notes sync to your Convex deployment; per-layer namespaces match `storageKey` in [`config/layers.ts`](config/layers.ts)

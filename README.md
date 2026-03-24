# Sharn Interactive Map

An interactive map web application for the city of Sharn (Eberron campaign setting). Features three independent, toggleable map layers (Upper, Middle, Lower Wards) with per-layer note pinning, marker clustering, and localStorage persistence.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Mapping:** Leaflet.js with react-leaflet and react-leaflet-cluster
- **Styling:** Tailwind CSS

## Setup

1. **Place map images** (if not already present): Copy `Sharn_Upper_Wards.webp`, `Sharn_Middle_Wards.webp`, and `Sharn_Lower_Wards.webp` into the project root. The `postinstall` script will copy them to `public/maps/`. Or place them directly in `public/maps/`.

2. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Configuration

Layer names, images, colors, and storage keys are defined in [`config/layers.ts`](config/layers.ts). Edit that file to customize layers.

## Features

- **3 independent map layers** — Switch via tabs; each layer has its own notes
- **Click to add notes** — Click anywhere on the active map to create a note at that location
- **Marker clustering** — Proximate notes group into clusters; zoom to expand
- **Edit / Delete** — Available from the marker popup, with confirmation dialogs
- **localStorage persistence** — Notes survive page refresh; structured for easy database migration

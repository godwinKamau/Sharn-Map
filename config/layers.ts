import type { LayerConfig } from "@/lib/types";

/**
 * Layer configuration — edit this file to change layer names, images, colors, and storage keys.
 * Each layer maintains its own independent set of notes.
 */
export const LAYERS: LayerConfig[] = [
  {
    id: "upper",
    name: "Upper Wards",
    image: "/maps/Sharn_Upper_Wards.webp",
    color: "#6366f1",
    storageKey: "sharn-notes-upper",
  },
  {
    id: "middle",
    name: "Middle Wards",
    image: "/maps/Sharn_Middle_Wards.webp",
    color: "#f59e0b",
    storageKey: "sharn-notes-middle",
  },
  {
    id: "lower",
    name: "Lower Wards",
    image: "/maps/Sharn_Lower_Wards.webp",
    color: "#10b981",
    storageKey: "sharn-notes-lower",
  },
];

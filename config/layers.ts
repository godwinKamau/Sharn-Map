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
    color: "#6B46C1",
    storageKey: "sharn-notes-upper",
  },
  {
    id: "middle",
    name: "Middle Wards",
    image: "/maps/Sharn_Middle_Wards.webp",
    color: "#92400E",
    storageKey: "sharn-notes-middle",
  },
  {
    id: "lower",
    name: "Lower Wards",
    image: "/maps/Sharn_Lower_Wards.webp",
    color: "#065F46",
    storageKey: "sharn-notes-lower",
  },
];

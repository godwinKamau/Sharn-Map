import type { District } from "@/lib/types";

/** Base wiki host — article paths use MediaWiki title encoding (spaces → underscores). */
const W = "https://eberron.fandom.com/wiki";

/**
 * District data — coordinates are pixel positions on each map image (CRS.Simple).
 * Fine-tune lat/lng by clicking on the map. Edit `wikiUrl` if a page moves or 404s.
 */
export const DISTRICTS: District[] = [
  // Upper Wards
  {
    id: "ivy-towers",
    name: "Ivy Towers",
    layerId: "upper",
    lat: 290,
    lng: 450,
    wikiUrl: `${W}/Ivy_Towers`,
  },
  {
    id: "seventh-tower",
    name: "Seventh Tower",
    layerId: "upper",
    lat: 240,
    lng: 450,
    wikiUrl: `${W}/Seventh_Tower`,
  },
  {
    id: "university-district",
    name: "University District",
    layerId: "upper",
    lat: 250,
    lng: 550,
    wikiUrl: `${W}/University_District`,
  },
  {
    id: "deniyas",
    name: "Deniyas",
    layerId: "upper",
    lat: 330,
    lng: 600,
    wikiUrl: `${W}/Sharn#Upper_Wards`,
  },
  {
    id: "platinate",
    name: "Platinate",
    layerId: "upper",
    lat: 250,
    lng: 620,
    wikiUrl: `${W}/Platinate`,
  },
  {
    id: "highest-towers",
    name: "Highest Towers",
    layerId: "upper",
    lat: 400,
    lng: 450,
    wikiUrl: `${W}/Sharn#Upper_Wards`,
  },
  {
    id: "mithral-tower",
    name: "Mithral Tower",
    layerId: "upper",
    lat: 500,
    lng: 450,
    wikiUrl: `${W}/Sharn#Upper_Wards`,
  },
  {
    id: "pinnacle",
    name: "Pinnacle",
    layerId: "upper",
    lat: 350,
    lng: 600,
    wikiUrl: `${W}/Sharn#Upper_Wards`,
  },
  {
    id: "platinum-heights",
    name: "Platinum Heights",
    layerId: "upper",
    lat: 630,
    lng: 550,
    wikiUrl: `${W}/Platinum_Heights`,
  },
  // Middle Wards
  {
    id: "menthis-plateau",
    name: "Menthis Plateau",
    layerId: "middle",
    lat: 400,
    lng: 450,
    wikiUrl: `${W}/Menthis_Plateau`,
  },
  {
    id: "middle-dura",
    name: "Middle Dura",
    layerId: "middle",
    lat: 350,
    lng: 300,
    wikiUrl: `${W}/Dura`,
  },
  {
    id: "middle-northedge",
    name: "Middle Northedge",
    layerId: "middle",
    lat: 500,
    lng: 250,
    wikiUrl: `${W}/Northedge`,
  },
  {
    id: "tavicks-landing",
    name: "Tavick's Landing",
    layerId: "middle",
    lat: 300,
    lng: 550,
    wikiUrl: `${W}/Tavick's_Landing`,
  },
  // Lower Wards
  {
    id: "lower-dura",
    name: "Lower Dura",
    layerId: "lower",
    lat: 400,
    lng: 350,
    wikiUrl: `${W}/Dura`,
  },
  {
    id: "cliffside",
    name: "Cliffside",
    layerId: "lower",
    lat: 350,
    lng: 500,
    wikiUrl: `${W}/Cliffside`,
  },
  {
    id: "lower-northedge",
    name: "Lower Northedge",
    layerId: "lower",
    lat: 450,
    lng: 200,
    wikiUrl: `${W}/Northedge`,
  },
  {
    id: "fallen",
    name: "Fallen",
    layerId: "lower",
    lat: 250,
    lng: 400,
    wikiUrl: `${W}/Fallen`,
  },
];

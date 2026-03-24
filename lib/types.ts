export interface Note {
  id: string;
  title: string;
  body: string;
  lat: number;
  lng: number;
  createdAt: string;
  updatedAt: string;
}

export interface LayerConfig {
  id: string;
  name: string;
  image: string;
  color: string;
  storageKey: string;
}

export interface District {
  id: string;
  name: string;
  layerId: "upper" | "middle" | "lower";
  lat: number;
  lng: number;
  /** Full URL to the district article on the Eberron Wiki (Fandom). */
  wikiUrl: string;
}

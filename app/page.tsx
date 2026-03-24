"use client";

import { useState, useCallback } from "react";
import type { District } from "@/lib/types";
import { LAYERS } from "@/config/layers";
import { LayerTabs } from "@/components/LayerTabs";
import { DistrictSearch } from "@/components/DistrictSearch";
import { StorageWarning } from "@/components/StorageWarning";
import { MapWrapper } from "@/components/MapWrapper";

export default function HomePage() {
  const [activeLayerId, setActiveLayerId] = useState(LAYERS[0]!.id);
  const [targetDistrict, setTargetDistrict] = useState<District | null>(null);

  const handleLayerChange = useCallback((layerId: string) => {
    setActiveLayerId(layerId);
    setTargetDistrict(null);
  }, []);

  const handleDistrictSelect = useCallback((district: District) => {
    setActiveLayerId(district.layerId);
    setTargetDistrict(district);
  }, []);

  const activeIndex = LAYERS.findIndex((l) => l.id === activeLayerId);
  const currentIndex = activeIndex >= 0 ? activeIndex : 0;

  const goPrev = useCallback(() => {
    const nextIndex = (currentIndex - 1 + LAYERS.length) % LAYERS.length;
    setActiveLayerId(LAYERS[nextIndex]!.id);
    setTargetDistrict(null);
  }, [currentIndex]);

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % LAYERS.length;
    setActiveLayerId(LAYERS[nextIndex]!.id);
    setTargetDistrict(null);
  }, [currentIndex]);

  const activeLayer = LAYERS.find((l) => l.id === activeLayerId) ?? LAYERS[0]!;

  const handleMapClick = useCallback(() => {
    setTargetDistrict(null);
  }, []);

  return (
    <main className="h-screen flex flex-col">
      <StorageWarning />
      <header className="relative z-[1100] flex-shrink-0 border-b-2 border-frame bg-parchment-light/95 px-6 py-4 shadow-parchment">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="font-cinzel text-xl font-semibold tracking-wide text-brown-heading uppercase">
            Sharn Map
          </h1>
          <DistrictSearch onSelect={handleDistrictSelect} />
        </div>
        <LayerTabs
          layers={LAYERS}
          activeLayerId={activeLayerId}
          onLayerChange={handleLayerChange}
        />
      </header>
      <div className="flex-1 min-h-0 relative">
        <MapWrapper
          activeLayer={activeLayer}
          targetDistrict={targetDistrict}
          onMapClick={handleMapClick}
          onResetZoom={handleMapClick}
        />
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous map layer"
          className="font-sharn-ui absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-parchment-light/95 hover:bg-crimson hover:text-white border-2 border-frame text-brown-body flex items-center justify-center shadow-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-parchment"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next map layer"
          className="font-sharn-ui absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-parchment-light/95 hover:bg-crimson hover:text-white border-2 border-frame text-brown-body flex items-center justify-center shadow-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-parchment"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </main>
  );
}

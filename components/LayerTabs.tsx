"use client";

import type { LayerConfig } from "@/lib/types";

interface LayerTabsProps {
  layers: LayerConfig[];
  activeLayerId: string;
  onLayerChange: (layerId: string) => void;
}

export function LayerTabs({
  layers,
  activeLayerId,
  onLayerChange,
}: LayerTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Map layers"
      className="mt-3 flex flex-wrap gap-2"
    >
      {layers.map((layer) => {
        const isActive = layer.id === activeLayerId;
        return (
          <button
            key={layer.id}
            role="tab"
            aria-selected={isActive}
            aria-controls="map-panel"
            id={`layer-tab-${layer.id}`}
            type="button"
            onClick={() => onLayerChange(layer.id)}
            className={`
              rounded-lg px-4 py-2 text-sm font-medium transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800
              ${isActive ? "ring-2 ring-white/30" : "hover:bg-slate-700/60"}
            `}
            style={{
              backgroundColor: isActive ? layer.color : "transparent",
              color: isActive ? "white" : "rgb(203 213 225)",
            }}
          >
            {layer.name}
          </button>
        );
      })}
    </div>
  );
}

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
              rounded-lg px-4 py-2 text-sm font-medium transition-colors border
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-parchment focus:ring-crimson
              ${
                isActive
                  ? "border-crimson-dark text-white ring-2 ring-crimson/40"
                  : "border-frame bg-transparent text-brown-muted hover:bg-parchment-dark/40 hover:text-brown-body"
              }
            `}
            style={
              isActive
                ? {
                    backgroundColor: "#7B1D1D",
                    borderLeftWidth: "4px",
                    borderLeftColor: layer.color,
                  }
                : undefined
            }
          >
            {layer.name}
          </button>
        );
      })}
    </div>
  );
}

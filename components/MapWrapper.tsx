"use client";

import dynamic from "next/dynamic";
import type { LayerConfig, District } from "@/lib/types";

const MapClient = dynamic(
  () => import("./MapClient").then((mod) => mod.MapClient),
  { ssr: false }
);

interface MapWrapperProps {
  activeLayer: LayerConfig;
  targetDistrict?: District | null;
  onMapClick?: () => void;
  onResetZoom?: () => void;
  overlayImage?: string;
  overlayEnabled?: boolean;
}

export function MapWrapper({
  activeLayer,
  targetDistrict = null,
  onMapClick,
  onResetZoom,
  overlayImage,
  overlayEnabled = false,
}: MapWrapperProps) {
  return (
    <div className="h-full w-full">
      <MapClient
        activeLayer={activeLayer}
        targetDistrict={targetDistrict}
        onMapClick={onMapClick}
        onResetZoom={onResetZoom}
        overlayImage={overlayImage}
        overlayEnabled={overlayEnabled}
      />
    </div>
  );
}

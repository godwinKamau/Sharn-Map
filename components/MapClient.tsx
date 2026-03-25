"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import L from "leaflet";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  useMapEvent,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { LayerConfig, District } from "@/lib/types";
import type { Marker as LeafletMarker } from "leaflet";
import type { Note } from "@/lib/types";
import { useNotes } from "@/lib/useNotes";
import { NoteModal } from "./NoteModal";
import { ConfirmDialog } from "./ConfirmDialog";

interface MapClientProps {
  activeLayer: LayerConfig;
  targetDistrict?: District | null;
  onMapClick?: () => void;
  onResetZoom?: () => void;
}

function MapClickHandler({
  onNoteClick,
  onMapClick,
}: {
  onNoteClick: (lat: number, lng: number) => void;
  onMapClick?: () => void;
}) {
  const onNoteClickRef = useRef(onNoteClick);
  const onMapClickRef = useRef(onMapClick);
  onNoteClickRef.current = onNoteClick;
  onMapClickRef.current = onMapClick;

  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    onMapClickRef.current?.();
    onNoteClickRef.current(e.latlng.lat, e.latlng.lng);
  }, []);

  useMapEvent("click", handleClick);
  return null;
}

function FlyToDistrict({
  district,
  activeLayerId,
}: {
  district: District;
  activeLayerId: string;
}) {
  const map = useMap();
  useEffect(() => {
    if (district && district.layerId === activeLayerId) {
      map.flyTo([district.lat, district.lng], 2, { duration: 1.2 });
    }
  }, [district, activeLayerId, map]);
  return null;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function DistrictWikiMarker({ district }: { district: District }) {
  const markerRef = useRef<LeafletMarker | null>(null);

  const icon = useMemo(
    () =>
      L.divIcon({
        className: "district-wiki-divicon",
        html: `<a href="${escapeHtmlAttr(district.wikiUrl)}" target="_blank" rel="noopener noreferrer" class="district-wiki-link" aria-label="${escapeHtmlAttr(district.name + " on Eberron Wiki")}"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg></a>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
    [district]
  );

  useEffect(() => {
    const m = markerRef.current;
    if (!m) return;
    const el = m.getElement();
    if (el) L.DomEvent.disableClickPropagation(el);
  }, [district]);

  return (
    <Marker
      ref={markerRef}
      position={[district.lat, district.lng]}
      icon={icon}
      zIndexOffset={1000}
    />
  );
}

function ResetZoomControl({
  center,
  zoom,
  onResetZoom,
}: {
  center: [number, number];
  zoom: number;
  onResetZoom?: () => void;
}) {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = controlRef.current;
    if (!el) return;
    L.DomEvent.disableClickPropagation(el);
  }, []);

  return (
    <div
      ref={controlRef}
      className="absolute bottom-4 right-4 z-[1000]"
    >
      <button
        type="button"
        onClick={() => {
          map.setView(center, zoom);
          onResetZoom?.();
        }}
        aria-label="Reset zoom"
        className="font-sharn-ui w-12 h-12 rounded-full bg-parchment-light/95 hover:bg-crimson hover:text-white border-2 border-frame text-brown-body flex items-center justify-center shadow-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-parchment"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>
    </div>
  );
}

// Fix default marker icon in Next.js (webpack doesn't resolve leaflet's icon paths)
if (typeof window !== "undefined") {
  const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = DefaultIcon;
}

export function MapClient({ activeLayer, targetDistrict = null, onMapClick, onResetZoom }: MapClientProps) {
  const { notes, saveNote, deleteNote } = useNotes(activeLayer.storageKey);
  const [bounds, setBounds] = useState<L.LatLngBoundsLiteral | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLatLng, setModalLatLng] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [modalExistingNote, setModalExistingNote] = useState<Note | null>(null);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const [discardCallback, setDiscardCallback] = useState<(() => void) | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Load image dimensions for bounds
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setBounds([
        [0, 0],
        [img.naturalHeight, img.naturalWidth],
      ]);
    };
    img.src = activeLayer.image;
  }, [activeLayer.image]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setModalLatLng({ lat, lng });
    setModalExistingNote(null);
    setModalOpen(true);
  }, []);

  const handleNoteSave = useCallback(
    (noteData: Omit<Note, "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const note: Note = {
        ...noteData,
        createdAt: modalExistingNote?.createdAt ?? now,
        updatedAt: now,
      };
      void saveNote(note);
    },
    [modalExistingNote, saveNote]
  );

  const handleNoteEdit = useCallback((note: Note) => {
    setModalExistingNote(note);
    setModalLatLng(null);
    setModalOpen(true);
  }, []);

  const handleNoteDeleteClick = useCallback((note: Note) => {
    setNoteToDelete(note);
    setDeleteDialogOpen(true);
  }, []);

  const handleNoteDeleteConfirm = useCallback(() => {
    if (noteToDelete) {
      void deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
    setDeleteDialogOpen(false);
  }, [noteToDelete, deleteNote]);

  const handleDiscardConfirm = useCallback((confirm: () => void) => {
    setDiscardCallback(() => confirm);
    setDiscardDialogOpen(true);
  }, []);

  const handleDiscardDialogConfirm = useCallback(() => {
    discardCallback?.();
    setDiscardCallback(null);
    setDiscardDialogOpen(false);
    setModalOpen(false);
  }, [discardCallback]);

  const defaultCenter: [number, number] = useMemo(() => {
    if (bounds) {
      const [[south, west], [north, east]] = bounds;
      return [(south + north) / 2, (west + east) / 2];
    }
    return [500, 500];
  }, [bounds]);

  if (!bounds) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-parchment">
        <p className="text-brown-muted italic font-garamond">Loading map...</p>
      </div>
    );
  }

  return (
    <>
      <MapContainer
        id="map-panel"
        crs={L.CRS.Simple}
        center={defaultCenter}
        zoom={0}
        minZoom={-2}
        maxZoom={4}
        maxBounds={bounds}
        maxBoundsViscosity={1}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <ImageOverlay url={activeLayer.image} bounds={bounds} />
        {targetDistrict && targetDistrict.layerId === activeLayer.id && (
          <>
            <FlyToDistrict district={targetDistrict} activeLayerId={activeLayer.id} />
            <DistrictWikiMarker district={targetDistrict} />
          </>
        )}
        <MapClickHandler onNoteClick={handleMapClick} onMapClick={onMapClick} />
        <ResetZoomControl center={defaultCenter} zoom={0} onResetZoom={onResetZoom} />
        <MarkerClusterGroup chunkedLoading>
          {notes.map((note) => (
            <Marker key={note.id} position={[note.lat, note.lng]}>
              <Popup>
                <div className="min-w-[180px] p-1">
                  <h3 className="font-cinzel font-semibold text-brown-heading mb-1">
                    {note.title}
                  </h3>
                  {note.body ? (
                    <p className="text-sm text-brown-body whitespace-pre-wrap mb-3">
                      {note.body}
                    </p>
                  ) : null}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleNoteEdit(note)}
                      className="text-sm px-2 py-1 rounded-sm bg-brown-body text-parchment-light hover:bg-frame-dark"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNoteDeleteClick(note)}
                      className="text-sm px-2 py-1 rounded-sm bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <NoteModal
        open={modalOpen}
        existingNote={modalExistingNote}
        latLng={modalLatLng}
        onSave={handleNoteSave}
        onClose={() => setModalOpen(false)}
        onDiscardConfirm={handleDiscardConfirm}
      />

      <ConfirmDialog
        open={discardDialogOpen && !!discardCallback}
        title="Discard changes?"
        message="You have unsaved changes. Are you sure you want to close without saving?"
        confirmLabel="Discard"
        confirmVariant="destructive"
        onConfirm={handleDiscardDialogConfirm}
        onCancel={() => {
          setDiscardCallback(null);
          setDiscardDialogOpen(false);
        }}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete note?"
        message="This note will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        confirmVariant="destructive"
        onConfirm={handleNoteDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setNoteToDelete(null);
        }}
      />
    </>
  );
}

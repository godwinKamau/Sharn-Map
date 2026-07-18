"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
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
  overlayImage?: string;
  overlayEnabled?: boolean;
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

  const handleMapClick = useCallback(() => {
    onMapClickRef.current?.();
  }, []);

  const handleNoteClick = useCallback((e: L.LeafletMouseEvent) => {
    onNoteClickRef.current(e.latlng.lat, e.latlng.lng);
  }, []);

  useMapEvent("click", handleMapClick);
  useMapEvent("dblclick", handleNoteClick);
  return null;
}

function MapViewReset({
  center,
  zoom,
  resetRef,
}: {
  center: [number, number];
  zoom: number;
  resetRef: MutableRefObject<(() => void) | null>;
}) {
  const map = useMap();
  useEffect(() => {
    resetRef.current = () => map.setView(center, zoom);
    return () => {
      resetRef.current = null;
    };
  }, [map, center, zoom, resetRef]);
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

const MAP_CONTROL_BUTTON_CLASS =
  "font-sharn-ui w-12 h-12 rounded-full bg-parchment-light/95 hover:bg-crimson hover:text-white border-2 border-frame text-brown-body flex items-center justify-center shadow-parchment transition-colors focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-parchment";

const RESET_ZOOM_ICON = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>`;

const NOTES_VISIBLE_ICON = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;

const NOTES_HIDDEN_ICON = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1l22 22"/></svg>`;

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
  const onResetZoomRef = useRef(onResetZoom);
  onResetZoomRef.current = onResetZoom;

  useEffect(() => {
    const control = new L.Control({ position: "bottomright" });
    control.onAdd = () => {
      const container = L.DomUtil.create(
        "div",
        "sharn-map-control sharn-map-control--right"
      );
      const button = L.DomUtil.create(
        "button",
        MAP_CONTROL_BUTTON_CLASS,
        container
      );
      button.type = "button";
      button.setAttribute("aria-label", "Reset zoom");
      button.innerHTML = RESET_ZOOM_ICON;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      L.DomEvent.on(button, "click", (event) => {
        L.DomEvent.stopPropagation(event);
        map.setView(center, zoom);
        onResetZoomRef.current?.();
      });
      return container;
    };
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map, center, zoom]);

  return null;
}

function NotesVisibilityToggle({
  notesVisible,
  onToggle,
}: {
  notesVisible: boolean;
  onToggle: () => void;
}) {
  const map = useMap();
  const onToggleRef = useRef(onToggle);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  onToggleRef.current = onToggle;

  useEffect(() => {
    const control = new L.Control({ position: "bottomleft" });
    control.onAdd = () => {
      const container = L.DomUtil.create(
        "div",
        "sharn-map-control sharn-map-control--left"
      );
      const button = L.DomUtil.create(
        "button",
        MAP_CONTROL_BUTTON_CLASS,
        container
      ) as HTMLButtonElement;
      button.type = "button";
      buttonRef.current = button;
      L.DomEvent.disableClickPropagation(container);
      L.DomEvent.disableScrollPropagation(container);
      L.DomEvent.on(button, "click", (event) => {
        L.DomEvent.stopPropagation(event);
        onToggleRef.current();
      });
      return container;
    };
    control.addTo(map);
    return () => {
      buttonRef.current = null;
      control.remove();
    };
  }, [map]);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    button.setAttribute(
      "aria-label",
      notesVisible ? "Hide notes" : "Show notes"
    );
    button.setAttribute("aria-pressed", String(notesVisible));
    button.innerHTML = notesVisible ? NOTES_VISIBLE_ICON : NOTES_HIDDEN_ICON;
  }, [notesVisible]);

  return null;
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

export function MapClient({
  activeLayer,
  targetDistrict = null,
  onMapClick,
  onResetZoom,
  overlayImage,
  overlayEnabled = false,
}: MapClientProps) {
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
  const [notesVisible, setNotesVisible] = useState(true);
  const resetMapViewRef = useRef<(() => void) | null>(null);

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
  }, [discardCallback]);

  const defaultCenter: [number, number] = useMemo(() => {
    if (bounds) {
      const [[south, west], [north, east]] = bounds;
      return [(south + north) / 2, (west + east) / 2];
    }
    return [500, 500];
  }, [bounds]);

  const handleModalClose = useCallback(
    (reason?: "save" | "cancel") => {
      const isCreating = modalExistingNote === null;
      setModalOpen(false);
      setModalLatLng(null);
      setModalExistingNote(null);

      if (reason !== "save" && isCreating) {
        resetMapViewRef.current?.();
        onResetZoom?.();
      }
    },
    [modalExistingNote, onResetZoom]
  );

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
        {overlayEnabled && overlayImage ? (
          <ImageOverlay url={overlayImage} bounds={bounds} />
        ) : null}
        {targetDistrict && targetDistrict.layerId === activeLayer.id && (
          <>
            <FlyToDistrict district={targetDistrict} activeLayerId={activeLayer.id} />
            <DistrictWikiMarker district={targetDistrict} />
          </>
        )}
        <MapClickHandler onNoteClick={handleMapClick} onMapClick={onMapClick} />
        <MapViewReset
          center={defaultCenter}
          zoom={0}
          resetRef={resetMapViewRef}
        />
        <ResetZoomControl center={defaultCenter} zoom={0} onResetZoom={onResetZoom} />
        <NotesVisibilityToggle
          notesVisible={notesVisible}
          onToggle={() => setNotesVisible((v) => !v)}
        />
        <MarkerClusterGroup chunkedLoading>
          {notesVisible && notes.map((note) => (
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
        onClose={handleModalClose}
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

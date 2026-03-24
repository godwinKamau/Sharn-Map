"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Note } from "@/lib/types";

interface NoteModalProps {
  open: boolean;
  /** When creating, pass null. When editing, pass the note. */
  existingNote: Note | null;
  /** For create: lat/lng of the clicked point. For edit: ignored. */
  latLng: { lat: number; lng: number } | null;
  onSave: (note: Omit<Note, "createdAt" | "updatedAt">) => void;
  onClose: () => void;
  onDiscardConfirm?: (confirm: () => void) => void;
}

const TITLE_MAX_LENGTH = 100;

export function NoteModal({
  open,
  existingNote,
  latLng,
  onSave,
  onClose,
  onDiscardConfirm,
}: NoteModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const handleCloseRef = useRef<() => void>(() => {});

  const isEditing = existingNote !== null;

  useEffect(() => {
    if (open) {
      if (existingNote) {
        setTitle(existingNote.title);
        setBody(existingNote.body);
      } else {
        setTitle("");
        setBody("");
      }
      setError(null);
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open, existingNote]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseRef.current();
    };
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleClose = useCallback(() => {
    const hasChanges =
      (existingNote
        ? title !== existingNote.title || body !== existingNote.body
        : title.trim() !== "" || body.trim() !== "") as boolean;

    if (hasChanges && onDiscardConfirm) {
      onDiscardConfirm(() => {
        onClose();
      });
    } else {
      onClose();
    }
  }, [existingNote, title, body, onClose, onDiscardConfirm]);

  handleCloseRef.current = handleClose;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }
    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be at most ${TITLE_MAX_LENGTH} characters.`);
      return;
    }

    const titleToStore = trimmedTitle.slice(0, TITLE_MAX_LENGTH);
    const bodyToStore = body.trim();

    if (existingNote) {
      onSave({
        id: existingNote.id,
        title: titleToStore,
        body: bodyToStore,
        lat: existingNote.lat,
        lng: existingNote.lng,
      });
    } else if (latLng) {
      onSave({
        id: crypto.randomUUID(),
        title: titleToStore,
        body: bodyToStore,
        lat: latLng.lat,
        lng: latLng.lng,
      });
    }
    onClose();
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="note-modal-title"
      aria-describedby="note-modal-description"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-600 ring-2 ring-slate-500/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`mb-4 pl-4 border-l-4 ${
            isEditing ? "border-amber-500" : "border-emerald-500"
          }`}
        >
          <h2
            id="note-modal-title"
            className="text-xl font-semibold text-slate-100"
          >
            {isEditing ? "Edit Note" : "New Note"}
          </h2>
          <p
            id="note-modal-description"
            className="text-slate-400 text-sm mt-0.5"
          >
            {isEditing
              ? "Update the note title and body."
              : "Add a note at this location on the map."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="note-title"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Title
              </label>
              <input
                ref={firstInputRef}
                id="note-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={TITLE_MAX_LENGTH + 50}
                placeholder="Short label"
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                autoComplete="off"
                aria-required="true"
                aria-invalid={!!error}
                aria-describedby={error ? "note-title-error" : undefined}
              />
              {error && (
                <p id="note-title-error" className="mt-1 text-sm text-red-400">
                  {error}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="note-body"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Body
              </label>
              <textarea
                id="note-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="Free-text content"
                className="w-full px-3 py-2 rounded-lg bg-slate-700 border border-slate-600 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-y"
                aria-describedby="note-body-hint"
              />
              <p id="note-body-hint" className="mt-1 text-xs text-slate-500">
                Optional
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800"
            >
              {isEditing ? "Save" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

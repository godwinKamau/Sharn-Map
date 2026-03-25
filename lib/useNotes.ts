"use client";

import { useMemo, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Note } from "@/lib/types";
import { unescapeHtml } from "@/lib/sanitize";

function mapRowsToNotes(
  rows: Array<{
    id: string;
    title: string;
    body: string;
    lat: number;
    lng: number;
    createdAt: string;
    updatedAt: string;
  }>
): Note[] {
  return rows.map((row) => ({
    id: row.id,
    title: unescapeHtml(row.title),
    body: unescapeHtml(row.body),
    lat: row.lat,
    lng: row.lng,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));
}

export function useNotes(namespace: string) {
  const raw = useQuery(api.notes.getNotes, { namespace });
  const saveMut = useMutation(api.notes.saveNote);
  const deleteMut = useMutation(api.notes.deleteNote);

  const notes = useMemo(() => {
    if (raw === undefined) return [];
    return mapRowsToNotes(raw);
  }, [raw]);

  const isLoading = raw === undefined;

  const saveNote = useCallback(
    async (note: Note) => {
      await saveMut({
        namespace,
        id: note.id,
        title: note.title,
        body: note.body,
        lat: note.lat,
        lng: note.lng,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      });
    },
    [namespace, saveMut]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await deleteMut({ namespace, id });
    },
    [namespace, deleteMut]
  );

  return { notes, saveNote, deleteNote, isLoading };
}

import type { Note } from "./types";
import { unescapeHtml } from "./sanitize";

const STORAGE_TEST_KEY = "__sharn_storage_test__";

export function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_TEST_KEY, "1");
    window.localStorage.removeItem(STORAGE_TEST_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getNotes(storageKey: string): Note[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const filtered = parsed.filter(
      (n): n is Note =>
        n &&
        typeof n === "object" &&
        typeof (n as Note).id === "string" &&
        typeof (n as Note).title === "string" &&
        typeof (n as Note).body === "string" &&
        typeof (n as Note).lat === "number" &&
        typeof (n as Note).lng === "number"
    );
    return filtered.map((n: Note) => ({
      ...n,
      title: unescapeHtml(n.title),
      body: unescapeHtml(n.body),
    }));
  } catch {
    return [];
  }
}

export function saveNote(storageKey: string, note: Note): Note[] {
  try {
    const notes = getNotes(storageKey);
    const updated = notes.filter((n) => n.id !== note.id);
    updated.push(note);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(updated));
    }
    return updated;
  } catch {
    return getNotes(storageKey);
  }
}

export function updateNote(storageKey: string, note: Note): Note[] {
  return saveNote(storageKey, note);
}

export function deleteNote(storageKey: string, id: string): Note[] {
  try {
    const notes = getNotes(storageKey).filter((n) => n.id !== id);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, JSON.stringify(notes));
    }
    return notes;
  } catch {
    return getNotes(storageKey);
  }
}

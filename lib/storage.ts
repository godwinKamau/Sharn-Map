/**
 * Notes are persisted in Convex. This module only keeps compatibility for
 * {@link StorageWarning}, which checks whether a storage backend is available.
 */
export function isStorageAvailable(): boolean {
  return true;
}

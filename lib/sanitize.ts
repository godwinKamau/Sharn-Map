/**
 * Escapes HTML to prevent XSS when rendering user content.
 * Use ONLY when rendering to DOM, never before storing.
 */
export function escapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
    "/": "&#x2F;",
  };
  return str.replace(/[&<>"'/]/g, (ch) => map[ch] ?? ch);
}

/**
 * Reverses escapeHtml. Used when loading notes that were previously stored escaped.
 * Order matters: decode compound entities (e.g. &#039;) before &amp;.
 */
export function unescapeHtml(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x2F;/g, "/")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

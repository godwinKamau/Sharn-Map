"use client";

import { useEffect, useState } from "react";
import { isStorageAvailable } from "@/lib/storage";

export function StorageWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!isStorageAvailable());
  }, []);

  if (!show) return null;

  return (
    <div
      role="alert"
      className="bg-amber-900/90 text-amber-100 px-6 py-3 text-sm text-center border-b border-amber-700"
    >
      localStorage is not available. Notes will not be saved. If you're in
      private browsing mode, try using a normal window.
    </div>
  );
}

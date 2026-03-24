"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import type { District } from "@/lib/types";
import { DISTRICTS } from "@/config/districts";
import { LAYERS } from "@/config/layers";

interface DistrictSearchProps {
  onSelect: (district: District) => void;
}

export function DistrictSearch({ onSelect }: DistrictSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return DISTRICTS;
    const q = query.trim().toLowerCase();
    return DISTRICTS.filter((d) => d.name.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const groups: { layerId: string; layerName: string; color: string; districts: District[] }[] = [];
    for (const layer of LAYERS) {
      const districts = filtered.filter((d) => d.layerId === layer.id);
      if (districts.length > 0) {
        groups.push({
          layerId: layer.id,
          layerName: layer.name,
          color: layer.color,
          districts,
        });
      }
    }
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => grouped.flatMap((g) => g.districts), [grouped]);
  const totalCount = flatList.length;

  const handleSelect = (district: District) => {
    onSelect(district);
    setQuery("");
    setIsOpen(false);
    setHighlightedIndex(0);
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    if (highlightedIndex >= totalCount) setHighlightedIndex(Math.max(0, totalCount - 1));
    if (highlightedIndex < 0) setHighlightedIndex(0);
  }, [highlightedIndex, totalCount]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && e.key !== "Escape") {
      setIsOpen(true);
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((i) => Math.min(i + 1, totalCount - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        const selected = flatList[highlightedIndex];
        if (selected) handleSelect(selected);
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setQuery("");
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let flatIndex = 0;
  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search districts..."
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls="district-search-list"
        aria-activedescendant={flatList[highlightedIndex] ? `district-${flatList[highlightedIndex]!.id}` : undefined}
        id="district-search-input"
        className="w-full rounded-lg border-2 border-frame bg-parchment-light px-3 py-2 text-sm text-brown-body placeholder-brown-muted focus:border-frame-dark focus:outline-none focus:ring-2 focus:ring-crimson focus:ring-offset-2 focus:ring-offset-parchment"
      />
      {isOpen && (
        <ul
          id="district-search-list"
          role="listbox"
          aria-labelledby="district-search-input"
          className="absolute top-full left-0 right-0 z-20 mt-1 max-h-64 overflow-y-auto rounded-lg border-2 border-frame bg-parchment-light shadow-parchment"
        >
          {grouped.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-brown-muted" role="option">
              No districts found
            </li>
          ) : (
            grouped.map((group) => (
              <li key={group.layerId} className="border-b border-frame last:border-b-0">
                <div className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-brown-muted font-cinzel">
                  {group.layerName}
                </div>
                {group.districts.map((district) => {
                  const idx = flatIndex++;
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <button
                      key={district.id}
                      id={`district-${district.id}`}
                      role="option"
                      aria-selected={isHighlighted}
                      type="button"
                      onClick={() => handleSelect(district)}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                        isHighlighted
                          ? "bg-parchment-dark/70 text-brown-heading"
                          : "text-brown-body hover:bg-parchment-dark/40"
                      }`}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: group.color }}
                        aria-hidden
                      />
                      {district.name}
                    </button>
                  );
                })}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

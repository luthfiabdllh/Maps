"use client";

import React, { useState } from "react";
import { type ImageCoords } from "../hooks/use-map-overlay";
import { type DebugPoint } from "../hooks/use-map-debugger";
import { 
  MapPin, 
  Copy, 
  Check, 
  Trash2, 
  Crosshair, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2,
  MousePointerClick
} from "lucide-react";

interface MapDebugHudProps {
  debugCoords: ImageCoords;
  scaleImage: (factor: number) => void;
  points: DebugPoint[];
  activePointId: string | null;
  isClickToAddEnabled: boolean;
  setIsClickToAddEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
  removePoint: (id: string) => void;
  clearAllPoints: () => void;
  flyToPoint: (point: DebugPoint) => void;
}

export function MapDebugHud({
  debugCoords,
  scaleImage,
  points,
  activePointId,
  isClickToAddEnabled,
  setIsClickToAddEnabled,
  removePoint,
  clearAllPoints,
  flyToPoint,
}: MapDebugHudProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showOverlaySection, setShowOverlaySection] = useState(false);

  const activePoint = points.find((p) => p.id === activePointId) || points[points.length - 1];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getPoiJsonTemplate = (point: DebugPoint) => {
    return JSON.stringify(
      {
        id: `poi-${point.index}`,
        name: `Titik Lokasi #${point.index}`,
        slug: `titik-${point.index}`,
        category: "rides",
        subcategory: "family",
        regionId: "zona-utara",
        coordinates: [point.lng, point.lat],
        thumbnailUrl: "/placeholder.jpg",
        description: "Deskripsi titik baru.",
        meta: {},
      },
      null,
      2
    );
  };

  const getAllPointsJson = () => {
    return JSON.stringify(
      points.map((p) => ({
        index: p.index,
        coordinates: [p.lng, p.lat],
      })),
      null,
      2
    );
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="absolute bottom-6 right-6 z-50 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-full font-medium text-xs shadow-2xl backdrop-blur-md transition-transform hover:scale-105"
      >
        <MapPin className="w-4 h-4 animate-pulse" />
        <span>Debugger ({points.length} Titik)</span>
        <Maximize2 className="w-3.5 h-3.5 ml-1" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 right-6 z-50 bg-neutral-900/95 text-white p-4 rounded-2xl w-84 sm:w-96 text-xs shadow-2xl backdrop-blur-lg border border-white/10 font-sans pointer-events-auto max-h-[85vh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <p className="font-semibold text-white tracking-wide">
            MAP DEBUGGER
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsClickToAddEnabled((prev) => !prev)}
            title={isClickToAddEnabled ? "Klik peta untuk menambah titik aktif" : "Mode klik peta dijeda"}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              isClickToAddEnabled
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            <MousePointerClick className="w-3 h-3" />
            <span>{isClickToAddEnabled ? "Klik Peta: ON" : "Klik: PAUSE"}</span>
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/10 text-neutral-400 hover:text-white rounded"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto space-y-3.5 pt-3 pr-1">
        {/* Helper Hint */}
        <p className="text-[11px] text-neutral-400 leading-relaxed">
          {isClickToAddEnabled
            ? "💡 Klik di mana saja pada peta untuk meletakkan titik baru. Marker bisa digeser (drag) untuk mengatur koordinat presisi."
            : "⏸️ Mode klik dijeda. Anda dapat menggeser/navigasi peta dengan bebas tanpa menambah titik."}
        </p>

        {/* Active Point Coordinates */}
        {activePoint ? (
          <div className="bg-neutral-800/80 p-3 rounded-xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                Titik Terpilih #{activePoint.index}
              </span>
              <button
                onClick={() => flyToPoint(activePoint)}
                className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <Crosshair className="w-3 h-3" /> Lihat di Peta
              </button>
            </div>
            
            <div className="bg-black/60 p-2 rounded-lg font-mono text-[11px] text-amber-300 flex items-center justify-between select-all">
              <span>
                [{activePoint.lng}, {activePoint.lat}]
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleCopy(
                    `[${activePoint.lng}, ${activePoint.lat}]`,
                    `coord-${activePoint.id}`
                  )
                }
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-neutral-200 py-1.5 px-2 rounded-lg transition-colors text-[11px]"
              >
                {copiedKey === `coord-${activePoint.id}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Salin Koordinat</span>
              </button>

              <button
                onClick={() =>
                  handleCopy(
                    getPoiJsonTemplate(activePoint),
                    `poi-${activePoint.id}`
                  )
                }
                className="flex-1 flex items-center justify-center gap-1.5 bg-red-600/30 hover:bg-red-600/40 text-red-200 py-1.5 px-2 rounded-lg transition-colors text-[11px] border border-red-500/20"
              >
                {copiedKey === `poi-${activePoint.id}` ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>Salin Format POI</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-neutral-800/40 p-4 rounded-xl border border-dashed border-white/10 text-center text-neutral-400">
            <MapPin className="w-5 h-5 mx-auto mb-1 text-neutral-500" />
            <p className="text-[11px]">Belum ada titik yang ditandai.</p>
            <p className="text-[10px] text-neutral-500">Klik di peta untuk mulai menandai.</p>
          </div>
        )}

        {/* List of Points */}
        {points.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Daftar Titik ({points.length})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(getAllPointsJson(), "all-points")}
                  className="text-neutral-300 hover:text-white flex items-center gap-1 text-[10px]"
                >
                  {copiedKey === "all-points" ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  Salin Semua
                </button>
                <button
                  onClick={clearAllPoints}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 text-[10px]"
                >
                  <Trash2 className="w-3 h-3" /> Reset
                </button>
              </div>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
              {points.map((pt) => {
                const isActive = pt.id === (activePoint?.id ?? null);
                return (
                  <div
                    key={pt.id}
                    className={`flex items-center justify-between p-2 rounded-lg text-[11px] font-mono transition-colors ${
                      isActive
                        ? "bg-red-950/40 border border-red-500/40 text-white"
                        : "bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    <button
                      onClick={() => flyToPoint(pt)}
                      className="flex items-center gap-2 text-left truncate flex-1"
                    >
                      <span className="w-4 h-4 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center font-sans font-bold shrink-0">
                        {pt.index}
                      </span>
                      <span className="truncate">
                        [{pt.lng}, {pt.lat}]
                      </span>
                    </button>
                    <div className="flex items-center gap-1 ml-2 shrink-0">
                      <button
                        onClick={() =>
                          handleCopy(`[${pt.lng}, ${pt.lat}]`, `pt-${pt.id}`)
                        }
                        className="p-1 hover:bg-white/10 rounded text-neutral-400 hover:text-white"
                        title="Salin koordinat"
                      >
                        {copiedKey === `pt-${pt.id}` ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <button
                        onClick={() => removePoint(pt.id)}
                        className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400"
                        title="Hapus titik"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Collapsible Overlay Alignment Section */}
        <div className="border-t border-white/10 pt-2 shrink-0">
          <button
            onClick={() => setShowOverlaySection((prev) => !prev)}
            className="flex items-center justify-between w-full text-neutral-400 hover:text-neutral-200 text-[11px] py-1"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Pengaturan Overlay Gambar
            </span>
            {showOverlaySection ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showOverlaySection && (
            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => scaleImage(0.95)}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 px-2 rounded-lg text-neutral-200"
                >
                  ➖ Kecilkan (5%)
                </button>
                <button
                  onClick={() => scaleImage(1.05)}
                  className="flex-1 bg-white/10 hover:bg-white/20 py-1.5 px-2 rounded-lg text-neutral-200"
                >
                  ➕ Besarkan (5%)
                </button>
              </div>

              <pre className="overflow-x-auto p-2 bg-black/60 rounded-lg text-[10px] font-mono text-neutral-300 max-h-24">
                {JSON.stringify(debugCoords, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

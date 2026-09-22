import { type ImageCoords } from "../hooks/use-map-overlay";

interface MapDebugHudProps {
  debugCoords: ImageCoords;
  scaleImage: (factor: number) => void;
}

export function MapDebugHud({ debugCoords, scaleImage }: MapDebugHudProps) {
  return (
    <div className="absolute bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-xl max-w-sm text-xs font-mono shadow-2xl backdrop-blur-md pointer-events-auto">
      <p className="mb-2 font-bold text-red-400">🔧 DEBUG ALIGNMENT MODE</p>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => scaleImage(0.95)}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
        >
          ➖ Kecilkan
        </button>
        <button
          onClick={() => scaleImage(1.05)}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded"
        >
          ➕ Besarkan
        </button>
      </div>
      <p className="mb-2 text-gray-300">
        Salin koordinat di bawah ini jika
        sudah pas:
      </p>
      <pre className="overflow-x-auto p-2 bg-black/50 rounded select-all text-[10px]">
        {JSON.stringify(debugCoords, null, 2)}
      </pre>
    </div>
  );
}

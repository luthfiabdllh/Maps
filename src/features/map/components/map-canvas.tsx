import { forwardRef } from "react";

export const MapCanvas = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full h-full ${className}`}
        {...props}
      />
    );
  }
);
MapCanvas.displayName = "MapCanvas";

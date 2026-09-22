import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { icons, MapPin, type LucideIcon } from "lucide-react";

/**
 * Resolves a Lucide icon component dynamically by its name.
 * Supports PascalCase ("Coffee", "RadioTower"), kebab-case ("coffee", "radio-tower"),
 * snake_case ("radio_tower"), and case-insensitive matching.
 */
export function resolveLucideIcon(
  iconName?: string,
  fallback: LucideIcon = MapPin
): LucideIcon {
  if (!iconName) return fallback;

  // 1. Direct match
  if (icons[iconName as keyof typeof icons]) {
    return icons[iconName as keyof typeof icons];
  }

  // 2. PascalCase conversion (e.g., "radio-tower" -> "RadioTower")
  const pascalName = iconName
    .replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
    .replace(/^\w/, (c) => c.toUpperCase());

  if (icons[pascalName as keyof typeof icons]) {
    return icons[pascalName as keyof typeof icons];
  }

  // 3. Case-insensitive normalization
  const normalized = iconName.toLowerCase().replace(/[-_]/g, "");
  const foundKey = Object.keys(icons).find(
    (key) => key.toLowerCase() === normalized
  );

  if (foundKey && icons[foundKey as keyof typeof icons]) {
    return icons[foundKey as keyof typeof icons];
  }

  return fallback;
}

/**
 * Renders a Lucide icon directly to an SVG HTML string for Mapbox markers.
 */
export function renderLucideIconSvg(
  iconName?: string,
  options?: {
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
    fallback?: LucideIcon;
  }
): string {
  const IconComponent = resolveLucideIcon(iconName, options?.fallback);
  return renderToStaticMarkup(
    React.createElement(IconComponent, {
      size: options?.size ?? 16,
      color: options?.color ?? "currentColor",
      strokeWidth: options?.strokeWidth ?? 2,
      className: options?.className,
    })
  );
}

/**
 * React component to render dynamic Lucide icon without violating static component lint rules.
 */
export function DynamicLucideIcon({
  icon,
  fallback = MapPin,
  ...props
}: {
  icon?: string;
  fallback?: LucideIcon;
  className?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const IconComponent = resolveLucideIcon(icon, fallback);
  return React.createElement(IconComponent, props);
}

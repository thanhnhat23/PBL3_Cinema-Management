"use client";

import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { cn } from "@/lib/utils";


export interface GoogleMapProps {
  latitude?: number | null;
  longitude?: number | null;
  title?: string;
  zoom?: number;
  className?: string;
  mapClassName?: string;
  showDirectionsButton?: boolean;
}

export function GoogleMapView({
  latitude,
  longitude,
  title = "Cinema location",
  zoom = 15,
  className,
  mapClassName,
  showDirectionsButton = true,
}: GoogleMapProps) {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const hasValidCoords =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey,
  });

  if (!googleMapsApiKey) {
    return (
      <div className={cn("rounded-xl border p-4 text-sm text-red-500", className)}>
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
      </div>
    );
  }

  if (!hasValidCoords) {
    return (
      <div className={cn("rounded-xl border p-4 text-sm text-zinc-500", className)}>
        Invalid location coordinates.
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={cn("rounded-xl border p-4 text-sm text-red-500", className)}>
        Failed to load Google Maps.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={cn("rounded-xl border p-4 text-sm text-zinc-500", className)}>
        Loading map...
      </div>
    );
  }

  const center = { lat: latitude, lng: longitude };
  const directionsHref = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className={cn("w-full", className)}>
      <GoogleMap
        center={center}
        zoom={zoom}
        mapContainerClassName={cn(
          "h-[380px] w-full rounded-xl overflow-hidden",
          mapClassName
        )}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <MarkerF position={center} title={title} />
      </GoogleMap>

      {showDirectionsButton ? (
        <div className="mt-3">
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md border px-3 py-2 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            Open in Google Maps
          </a>
        </div>
      ) : null}
    </div>
  );
}

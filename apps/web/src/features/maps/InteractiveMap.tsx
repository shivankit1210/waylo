import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Maximize2, Minimize2, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RouteGeometry, RouteWaypoint } from '@waylo/shared';

interface InteractiveMapProps {
  route?: RouteGeometry;
  waypoints?: RouteWaypoint[];
  className?: string;
}

export function InteractiveMap({
  route,
  waypoints: directWaypoints,
  className = 'h-[460px]',
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const waypoints = route?.waypoints || directWaypoints || [];
  const coordinates = route?.coordinates || [];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up existing map instance if any
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default center (Western Ghats / Mumbai / Goa corridor)
    const defaultCenter: [number, number] =
      waypoints.length > 0
        ? [waypoints[0].latitude, waypoints[0].longitude]
        : [17.5, 73.5];

    // Initialize Leaflet map
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 7,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Add CartoDB Voyager tiles (crisp, modern travel map tiles)
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(map);

    // Render polyline route if coordinates exist
    let polylineLayer: L.Polyline | null = null;
    if (coordinates.length > 0) {
      polylineLayer = L.polyline(coordinates, {
        color: '#2563EB',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
    }

    // Marker layers
    const markerGroup = L.featureGroup();

    waypoints.forEach((wp, index) => {
      const isOrigin = index === 0;
      const isDestination = index === waypoints.length - 1;

      // Custom HTML Marker Icon
      const iconHtml = isOrigin
        ? `<div style="background-color: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">📍</div>`
        : isDestination
        ? `<div style="background-color: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">🏁</div>`
        : `<div style="background-color: #f59e0b; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2.5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.25);">${wp.orderIndex || index}</div>`;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'waylo-map-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const popupContent = `
        <div style="font-family: inherit; padding: 4px 2px; min-width: 160px;">
          <div style="font-weight: 800; font-size: 13px; color: #0f172a; margin-bottom: 2px;">
            ${wp.name}
          </div>
          ${
            wp.stopType
              ? `<span style="display: inline-block; font-size: 10px; font-weight: 700; background: #e0f2fe; color: #0369a1; padding: 2px 6px; border-radius: 6px; margin-bottom: 4px;">${wp.stopType}</span>`
              : ''
          }
          ${
            wp.estimatedArrival
              ? `<div style="font-size: 11px; color: #64748b; margin-top: 2px;">⏰ Scheduled: <b>${wp.estimatedArrival}</b></div>`
              : ''
          }
          ${
            wp.description
              ? `<div style="font-size: 11px; color: #475569; margin-top: 4px; line-height: 1.3;">${wp.description}</div>`
              : ''
          }
        </div>
      `;

      const marker = L.marker([wp.latitude, wp.longitude], { icon: customIcon })
        .bindPopup(popupContent)
        .addTo(markerGroup);

      markerGroup.addLayer(marker);
    });

    markerGroup.addTo(map);

    // Auto-fit bounds
    if (polylineLayer && coordinates.length > 1) {
      map.fitBounds(polylineLayer.getBounds(), { padding: [50, 50], maxZoom: 13 });
    } else if (waypoints.length > 0) {
      map.fitBounds(markerGroup.getBounds(), { padding: [50, 50], maxZoom: 13 });
    }

    // Invalidate size once after mounting to prevent partial grey tiles
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [coordinates, waypoints]);

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    if (coordinates.length > 1) {
      const polyline = L.polyline(coordinates);
      mapInstanceRef.current.fitBounds(polyline.getBounds(), {
        padding: [50, 50],
        maxZoom: 13,
      });
    } else if (waypoints.length > 0) {
      const group = L.featureGroup(
        waypoints.map((w) => L.marker([w.latitude, w.longitude]))
      );
      mapInstanceRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50],
        maxZoom: 13,
      });
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-border/80 shadow-inner transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)] shadow-2xl' : className
      }`}
    >
      {/* Map DOM Element */}
      <div ref={mapContainerRef} className="h-full w-full bg-slate-100 dark:bg-slate-900" />

      {/* Control Overlay Buttons */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-9 w-9 rounded-xl shadow-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-md hover:bg-white text-foreground"
          onClick={handleRecenter}
          title="Fit whole route"
        >
          <Navigation className="h-4 w-4 text-primary" />
        </Button>

        <Button
          type="button"
          size="icon"
          variant="secondary"
          className="h-9 w-9 rounded-xl shadow-md bg-white/95 dark:bg-slate-800/95 backdrop-blur-md hover:bg-white text-foreground"
          onClick={() => {
            setIsFullscreen(!isFullscreen);
            setTimeout(() => {
              mapInstanceRef.current?.invalidateSize();
            }, 100);
          }}
          title={isFullscreen ? 'Exit fullscreen' : 'View fullscreen map'}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Bottom Info Pill */}
      {route && (
        <div className="absolute bottom-4 left-4 z-[400] pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-black/75 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-3 shadow-lg border border-white/10">
            <span>
              🛣️ <b>{route.distanceKm} km</b> total
            </span>
            <span>•</span>
            <span>
              ⏱️ ~<b>{Math.floor(route.durationMinutes / 60)}h {route.durationMinutes % 60}m</b> drive
            </span>
            <span>•</span>
            <span>📍 {waypoints.length} stops</span>
          </div>
        </div>
      )}
    </div>
  );
}

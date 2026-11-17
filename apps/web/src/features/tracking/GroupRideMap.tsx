import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Compass,
  Maximize2,
  Minimize2,
  Navigation,
  Crosshair,
  Battery,
  BatteryMedium,
  BatteryLow,
  Zap,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { RiderLocation, CrewPingAlert } from '@waylo/shared';

interface GroupRideMapProps {
  riders: RiderLocation[];
  recentPings?: CrewPingAlert[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

export function GroupRideMap({
  riders,
  recentPings = [],
  center = [15.2993, 74.124], // Goa default
  zoom = 12,
  className = '',
}: GroupRideMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const pingsGroupRef = useRef<L.LayerGroup | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(containerRef.current, {
        center,
        zoom,
        zoomControl: false,
      });

      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          maxZoom: 19,
        }
      ).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      markersGroupRef.current = L.layerGroup().addTo(map);
      pingsGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Riders Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    riders.forEach((rider) => {
      const isMoving = rider.isMoving && (rider.speedKmh || 0) > 3;
      const initial = rider.displayName.slice(0, 2).toUpperCase();
      const speedLabel = isMoving ? `${rider.speedKmh} km/h` : 'Stopped';

      const iconHtml = `
        <div class="relative flex flex-col items-center group cursor-pointer" style="transform: translate(-50%, -50%);">
          <div class="relative flex items-center justify-center">
            ${
              isMoving
                ? '<div class="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping"></div>'
                : ''
            }
            <div class="h-9 w-9 rounded-full ${
              isMoving
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 ring-2 ring-white shadow-lg'
                : 'bg-slate-800 ring-2 ring-amber-400 shadow-md'
            } text-white flex items-center justify-center font-black text-xs">
              ${initial}
            </div>
            ${
              rider.batteryPercent !== undefined && rider.batteryPercent !== null
                ? `<div class="absolute -bottom-1 -right-1 px-1 py-0.2 bg-black/80 text-[9px] rounded-full text-emerald-400 font-bold border border-white/20">
                    ${rider.batteryPercent}%
                   </div>`
                : ''
            }
          </div>
          <div class="mt-1 px-2 py-0.5 rounded-full ${
            isMoving ? 'bg-blue-600 text-white' : 'bg-slate-800 text-amber-300'
          } text-[10px] font-bold shadow-md whitespace-nowrap">
            ${rider.displayName.split(' ')[0]} • ${speedLabel}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-rider-marker',
        iconSize: [40, 50],
        iconAnchor: [20, 25],
      });

      const marker = L.marker([rider.latitude, rider.longitude], {
        icon: customIcon,
      });

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; padding: 4px; min-width: 140px;">
          <h4 style="margin: 0 0 4px; font-weight: 800; font-size: 13px;">${rider.displayName}</h4>
          <div style="font-size: 11px; color: #475569; line-height: 1.5;">
            <div>Status: <b>${isMoving ? 'Cruising' : 'Stationary'}</b></div>
            ${rider.speedKmh ? `<div>Speed: <b>${rider.speedKmh} km/h</b></div>` : ''}
            ${rider.headingDeg ? `<div>Heading: <b>${rider.headingDeg}°</b></div>` : ''}
            ${
              rider.batteryPercent
                ? `<div>Battery: <b>${rider.batteryPercent}%</b></div>`
                : ''
            }
            ${rider.altitude ? `<div>Altitude: <b>${rider.altitude} m</b></div>` : ''}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      group.addLayer(marker);
    });
  }, [riders]);

  // Update Recent Crew Pings Beacons
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = pingsGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    recentPings.slice(0, 5).forEach((ping) => {
      if (!ping.latitude || !ping.longitude) return;

      const isSOS = ping.pingType === 'SOS_EMERGENCY';

      const pingIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer" style="transform: translate(-50%, -50%);">
          <div class="absolute -inset-2 rounded-full ${
            isSOS ? 'bg-red-500/40 animate-ping' : 'bg-amber-500/40 animate-ping'
          }"></div>
          <div class="h-8 w-8 rounded-full ${
            isSOS ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'
          } flex items-center justify-center shadow-xl ring-2 ring-white text-xs font-bold">
            ${isSOS ? '🚨' : '📍'}
          </div>
        </div>
      `;

      const beaconIcon = L.divIcon({
        html: pingIconHtml,
        className: 'custom-ping-beacon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([ping.latitude, ping.longitude], {
        icon: beaconIcon,
      });

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; padding: 4px;">
          <h4 style="margin: 0; color: ${isSOS ? '#dc2626' : '#d97706'}; font-weight: 800; font-size: 12px;">
            ${ping.pingType}
          </h4>
          <p style="margin: 4px 0 0; font-size: 11px;">${ping.message || 'Crew Alert'}</p>
          <span style="font-size: 10px; color: #64748b;">From: ${ping.senderName}</span>
        </div>
      `);

      group.addLayer(marker);
    });
  }, [recentPings]);

  // Camera Helper: Fit all active riders in view
  const fitAllRiders = () => {
    const map = mapInstanceRef.current;
    if (!map || riders.length === 0) return;

    const latLngs = riders.map((r) => [r.latitude, r.longitude] as [number, number]);
    if (latLngs.length === 1) {
      map.setView(latLngs[0], 15, { animate: true });
    } else {
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-border/80 shadow-md ${className}`}
      style={{ minHeight: isFullscreen ? '100vh' : '440px' }}
    >
      {/* Leaflet DOM container */}
      <div ref={containerRef} className="h-full w-full" style={{ minHeight: '440px' }} />

      {/* Floating Status & Overlay Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        <Badge
          variant="outline"
          className="bg-card/90 backdrop-blur-md border-border/80 text-foreground font-bold text-xs py-1 px-3 shadow-md gap-1.5"
        >
          <Radio className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
          <span>{riders.length} Riders Active in Convoy</span>
        </Badge>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={fitAllRiders}
          className="rounded-xl text-xs font-semibold gap-1.5 bg-card/90 backdrop-blur-md border-border/80 shadow-md hover:bg-card"
        >
          <Crosshair className="h-3.5 w-3.5 text-primary" />
          <span className="hidden sm:inline">Fit Convoy</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          className="rounded-xl h-8 w-8 bg-card/90 backdrop-blur-md border-border/80 shadow-md hover:bg-card"
          aria-label="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

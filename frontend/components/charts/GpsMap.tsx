"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LatLngExpression } from "leaflet";

// Dynamically import react-leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false });

interface GpsLocation {
  lat: number;
  lng: number;
  timestamp: number;
  speed?: number;
  accuracy?: number;
}

interface GpsMapProps {
  live?: boolean;
  locations?: GpsLocation[];
  height?: number;
  showPath?: boolean;
  showHeatmap?: boolean;
}

export function GpsMap({ live = true, locations: externalLocations, height = 400, showPath = true, showHeatmap = false }: GpsMapProps) {
  // Default location: Ho Chi Minh City, Vietnam
  const [locations, setLocations] = useState<GpsLocation[]>(
    externalLocations || [{ lat: 10.8231, lng: 106.6297, timestamp: Date.now(), speed: 0, accuracy: 10 }]
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!live || externalLocations) return;

    // Simulate GPS tracking with random walk
    const interval = setInterval(() => {
      setLocations((prev) => {
        const lastLoc = prev[prev.length - 1];
        const newLoc: GpsLocation = {
          lat: lastLoc.lat + (Math.random() - 0.5) * 0.001,
          lng: lastLoc.lng + (Math.random() - 0.5) * 0.001,
          timestamp: Date.now(),
          speed: Math.random() * 5,
          accuracy: 5 + Math.random() * 10
        };
        const updated = [...prev, newLoc];
        // Keep last 50 points
        return updated.slice(-50);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [live, externalLocations]);

  useEffect(() => {
    if (externalLocations) {
      setLocations(externalLocations);
    }
  }, [externalLocations]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center bg-muted" style={{ height: `${height}px` }}>
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const currentLocation = locations[locations.length - 1];
  const center: LatLngExpression = [currentLocation.lat, currentLocation.lng];
  const pathCoordinates: LatLngExpression[] = locations.map((loc) => [loc.lat, loc.lng]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg" style={{ height: `${height}px` }}>
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {showPath && pathCoordinates.length > 1 && (
          <Polyline positions={pathCoordinates} color="#3b82f6" weight={3} opacity={0.7} />
        )}
        
        {showHeatmap && locations.map((loc, idx) => (
          <Circle
            key={idx}
            center={[loc.lat, loc.lng]}
            radius={20}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.1 + (idx / locations.length) * 0.4 }}
          />
        ))}
        
        <Marker position={center}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Current Location</p>
              <p>Lat: {currentLocation.lat.toFixed(6)}</p>
              <p>Lng: {currentLocation.lng.toFixed(6)}</p>
              {currentLocation.speed !== undefined && <p>Speed: {currentLocation.speed.toFixed(1)} km/h</p>}
              {currentLocation.accuracy && <p>Accuracy: ±{currentLocation.accuracy.toFixed(1)} m</p>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {live && (
        <div className="absolute right-4 top-4 rounded-lg border bg-background/90 px-3 py-2 shadow-lg backdrop-blur">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
            <span className="text-xs font-semibold">GPS Tracking</span>
          </div>
        </div>
      )}
    </div>
  );
}

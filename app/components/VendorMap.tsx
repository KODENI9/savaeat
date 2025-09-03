"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type * as LType from "leaflet";

// Import Leaflet uniquement côté client
let L: typeof LType | null = null;
if (typeof window !== "undefined") {
  import("leaflet").then((leaflet) => {
    L = leaflet;
    delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  });
}

// Dynamic import React-Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then((mod) => mod.Polyline), { ssr: false });
import { useMap } from "react-leaflet";

interface VendorMapProps {
  lat: number;
  lng: number;
}

export default function VendorMap({ lat, lng }: VendorMapProps) {
  const [clientLocation, setClientLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const mapRef = useRef<LType.Map | null>(null);

  // Récupération position client
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setClientLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          console.log("Précision:", pos.coords.accuracy, "mètres");
        },
        (err) => console.error("Erreur localisation client:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Récupération de l’itinéraire OSRM
  useEffect(() => {
    if (!clientLocation) return;

    const fetchRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${clientLocation.lng},${clientLocation.lat}?geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (c: [number, number]) => [c[1], c[0]] // inversion [lng, lat] -> [lat, lng]
          );
          setRoute(coords);
        }
      } catch (err) {
        console.error("Erreur récupération itinéraire:", err);
      }
    };

    fetchRoute();
  }, [clientLocation, lat, lng]);

  // Ajustement de la carte
  function FitBounds() {
    const map = useMap();
    mapRef.current = map as LType.Map;

    useEffect(() => {
      if (!map || !L) return;

      if (clientLocation) {
        const bounds = L.latLngBounds(
          [lat, lng],
          [clientLocation.lat, clientLocation.lng]
        );
        map.fitBounds(bounds, { padding: [50, 50] });
      } else {
        map.setView([lat, lng], 15);
      }
    }, [map, clientLocation]);

    return null;
  }

  if (!L) return null;

  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow">
      <MapContainer center={[lat, lng]} zoom={15} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marker vendeuse */}
        <Marker position={[lat, lng]}>
          <Popup>Vendeuse👩‍🍳</Popup>
        </Marker>

        {/* Marker client */}
        {clientLocation && (
          <Marker position={[clientLocation.lat, clientLocation.lng]}>
            <Popup>Vous êtes ici👤</Popup>
          </Marker>
        )}

        {/* Tracé de l’itinéraire */}
        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{ color: "blue", weight: 4, opacity: 0.8 }}
          />
        )}

        <FitBounds />
      </MapContainer>
    </div>
  );
}

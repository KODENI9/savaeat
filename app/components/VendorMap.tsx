"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type * as LType from "leaflet";

// Import Leaflet uniquement côté client (safe avec typeof window)
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

// Dynamic import des composants React-Leaflet (SSRed safe)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });
import { useMap } from "react-leaflet";

interface VendorMapProps {
  lat: number;
  lng: number;
}

export default function VendorMap({ lat, lng }: VendorMapProps) {
  const [clientLocation, setClientLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<LType.Map | null>(null);

  // Récupération position client
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setClientLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error("Erreur localisation client:", err),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Composant interne pour centrer la carte sur vendeuse + client
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
    }, [map]); // ✅ dépendances correctes

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
          <Popup>Vendeuse</Popup>
        </Marker>

        {/* Marker client */}
        {clientLocation && (
          <Marker position={[clientLocation.lat, clientLocation.lng]}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        <FitBounds />
      </MapContainer>
    </div>
  );
}

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const PIN_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 24 34">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 22 12 22S24 20.5 24 12C24 5.37 18.63 0 12 0zm0 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#7C3AED"/>
  </svg>`,
  className: "",
  iconSize: [28, 40],
  iconAnchor: [14, 40],
});

const ITALY = [41.8719, 12.5674];

function FlyTo({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    if (lat != null && lon != null) {
      map.flyTo([lat, lon], 12, { duration: 0.8 });
    }
  }, [lat, lon, map]);
  return null;
}

function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LeafletMap({ position, onMapClick, readOnly = false }) {
  const hasPos = position?.lat != null && position?.lon != null;

  return (
    <MapContainer
      center={hasPos ? [position.lat, position.lon] : ITALY}
      zoom={hasPos ? 12 : 6}
      style={{ width: "100%", height: "100%", minHeight: 260 }}
      zoomControl={!readOnly}
      dragging={!readOnly}
      scrollWheelZoom={!readOnly}
      doubleClickZoom={!readOnly}
      touchZoom={!readOnly}
      keyboard={!readOnly}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {hasPos && <Marker position={[position.lat, position.lon]} icon={PIN_ICON} />}
      {!readOnly && onMapClick && <ClickHandler onMapClick={onMapClick} />}
      <FlyTo lat={hasPos ? position.lat : null} lon={hasPos ? position.lon : null} />
    </MapContainer>
  );
}

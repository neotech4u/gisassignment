import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

function MapPicker({ lat, lon, onLocationChange }) {
  const [position, setPosition] = useState(
    lat && lon ? { lat: parseFloat(lat), lng: parseFloat(lon) } : { lat: 0, lng: 0 }
  );

  useEffect(() => {
    if (lat && lon && (position.lat !== parseFloat(lat) || position.lng !== parseFloat(lon))) {
      setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) });
    }
  }, [lat, lon]);

  const handlePositionChange = (newPos) => {
    setPosition(newPos);
    onLocationChange(newPos.lat, newPos.lng);
  };

  return (
    <div className="map-container">
      <MapContainer 
        center={position.lat === 0 && position.lng === 0 ? [20, 0] : position} 
        zoom={position.lat === 0 && position.lng === 0 ? 2 : 8} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={handlePositionChange} />
      </MapContainer>
    </div>
  );
}

export default MapPicker;

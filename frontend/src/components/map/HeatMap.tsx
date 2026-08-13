import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { JunctionData } from '../../lib/api';

interface HeatMapProps {
  junctions: JunctionData[];
  onJunctionClick: (id: string) => void;
}

// Map center for Nagpur
const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];

const getRiskColor = (score: number) => {
  if (score >= 80) return '#E74C3C'; // Red
  if (score >= 50) return '#F5A623'; // Amber
  return '#2ECC71'; // Green
};

function MapController({ junctions }: { junctions: JunctionData[] }) {
  const map = useMap();
  useEffect(() => {
    if (junctions.length > 0) {
      // Logic for heatmap layer can be added here
      // For now we use CircleMarkers for precision and interactivity
    }
  }, [junctions, map]);
  return null;
}

export const HeatMap: React.FC<HeatMapProps> = ({ junctions, onJunctionClick }) => {
  return (
    <MapContainer center={NAGPUR_CENTER} zoom={13} style={{ height: '100%', width: '100%' }}>
      {/* Dark theme map tiles */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      />
      <MapController junctions={junctions} />
      
      {junctions.map((j) => (
        <CircleMarker
          key={j.id}
          center={[j.lat, j.lng]}
          radius={j.score >= 80 ? 12 : 8}
          pathOptions={{
            color: getRiskColor(j.score),
            fillColor: getRiskColor(j.score),
            fillOpacity: 0.7,
            weight: 2
          }}
          eventHandlers={{
            click: () => onJunctionClick(j.id)
          }}
        >
          <Popup>
            <div className="text-gray-900 font-sans">
              <strong className="block text-lg">{j.name}</strong>
              <span className="text-sm">Risk Score: {j.score}</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

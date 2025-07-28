// src/components/map/MapDisplay.tsx
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  origem?: { lat: number; lng: number };
  isMarkerDraggable?: boolean;
}

export const MapDisplay = ({ 
  latitude, 
  longitude,
  origem,
  isMarkerDraggable = false
}: MapDisplayProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      zoom={15}
      center={{ lat: latitude, lng: longitude }}
      mapContainerClassName="w-full h-full rounded-lg"
    >
      <Marker
        position={{ lat: latitude, lng: longitude }}
        draggable={isMarkerDraggable}
      />
      
      {origem && (
        <>
          <Marker
            position={{ lat: origem.lat, lng: origem.lng }}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
          <Polyline
            path={[
              { lat: origem.lat, lng: origem.lng },
              { lat: latitude, lng: longitude }
            ]}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2
            }}
          />
        </>
      )}
    </GoogleMap>
  );
};
// src/components/map/MapDisplay.tsx
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

// Garanta que google.maps está disponível globalmente ou importe seu tipo específico se estiver usando um tsconfig mais restritivo.
// Para a maioria dos casos de uso com @react-google-maps/api, ele é inferido.
// Se você ainda tiver erros relacionados a 'google' ou 'MapMouseEvent', pode ser necessário
// adicionar 'types': ['google.maps'] ao seu tsconfig.json ou declarar a interface globalmente.
// Exemplo:
// declare global {
//   namespace google {
//     namespace maps {
//       interface MapMouseEvent extends Omit<google.maps.IconMouseEvent, 'stop'> {}
//       // Outras interfaces se necessário
//     }
//   }
// }

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  origem?: { lat: number; lng: number };
  isMarkerDraggable?: boolean;
  onMarkerDragEnd?: (e: google.maps.MapMouseEvent) => void;
}

export const MapDisplay = ({
  latitude,
  longitude,
  origem,
  isMarkerDraggable = false,
  onMarkerDragEnd
}: MapDisplayProps) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY as string, // Adicione 'as string' para tipagem mais estrita
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
        // A prop onDragEnd está corretamente sendo passada aqui
        onDragEnd={onMarkerDragEnd}
      />

      {origem && (
        <>
          <Marker
            position={{ lat: origem.lat, lng: origem.lng }}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" // Exemplo de ícone, ajuste se tiver um específico
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
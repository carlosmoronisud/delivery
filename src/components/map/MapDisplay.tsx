// src/components/map/MapDisplay.tsx
import { useCallback} from 'react'; // Adicionado useMemo
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface MapDisplayProps {
  latitude: number;
  longitude: number;
  zoom?: number;
}

// Estilos do contêiner do mapa
const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

// Opções do mapa para desativar controles desnecessários
const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

// Mover a array de bibliotecas para fora do componente para que seja constante
const libraries: ("places" | "geometry" | "drawing" | "visualization" | "geocoding")[] = ['places', 'geocoding'];


function MapDisplay({ latitude, longitude, zoom = 17 }: MapDisplayProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_Maps_API_KEY || '',
    libraries: libraries, // <--- Agora usa a constante 'libraries'
  });

  // O 'map' não está sendo lido. Se você não precisa da instância do mapa para interações diretas (como centralizar programaticamente), pode remover o estado.
  // Se precisar, o ideal é usar `useRef` para armazenar a instância e `useEffect` para interagir.
  // Por ora, vamos remover para eliminar o aviso, já que o 'map' não está sendo usado.
  // const [map, setMap] = useState<google.maps.Map | null>(null); // Pode ser removido

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    // setMap(map); // Não é mais necessário se 'map' for removido
    console.log("MapDisplay: Mapa carregado com sucesso. Instância:", map); // LOG: Ver a instância do mapa
  }, []);

  const onUnmount = useCallback(function callback() {
    // setMap(null); // Não é mais necessário se 'map' for removido
    console.log("MapDisplay: Mapa desmontado."); // LOG
  }, []);

  if (loadError) {
    console.error("MapDisplay: Erro de carregamento da API:", loadError); // LOG: Detalhes do erro de carregamento
    return <div className="text-red-600 text-center p-4">Erro ao carregar o mapa. Verifique sua chave de API e conexão.</div>;
  }

  if (!isLoaded) {
    console.log("MapDisplay: API do mapa ainda não carregada."); // LOG
    return <div className="text-gray-600 text-center p-4">Carregando mapa...</div>;
  }

  const center = {
    lat: latitude,
    lng: longitude,
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      <Marker position={center} />
    </GoogleMap>
  );
}

export default MapDisplay;
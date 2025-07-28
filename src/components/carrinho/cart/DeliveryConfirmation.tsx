import type { EnderecoData } from "../../../models/EnderecoData";
import AddressForm from "../map/AddressForm";
import { MapDisplay } from "../map/MapDisplay";

interface DeliveryConfirmationProps {
  enderecoData: EnderecoData;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSelect: (selectedAddress: EnderecoData) => void;
  handleMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
  onGeocodeRequest: (address: EnderecoData) => Promise<void>;
}

export const DeliveryConfirmation = ({
  enderecoData,
  handleAddressChange,
  handleAddressSelect,
  handleMarkerDragEnd,
  onGeocodeRequest
}: DeliveryConfirmationProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      {/* Seção do Formulário */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <AddressForm
          enderecoData={enderecoData}
          onAddressChange={handleAddressChange}
          onAddressSelect={handleAddressSelect}
          onGeocodeRequest={onGeocodeRequest}
        />
      </div>

      {/* Seção do Mapa */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 h-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Confirmação no Mapa
        </h3>
        {enderecoData.latitude && enderecoData.longitude ? (
          <div className="h-96">
            <MapDisplay 
              latitude={enderecoData.latitude} 
              longitude={enderecoData.longitude} 
              onMarkerDragEnd={handleMarkerDragEnd}
            />
            <p className="text-sm text-gray-600 mt-2">
              Arraste o marcador para ajustar o local exato de entrega
            </p>
          </div>
        ) : (
          <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
            <p className="text-gray-500">
              Digite um endereço válido para visualizar o mapa
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
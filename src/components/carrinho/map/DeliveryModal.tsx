// src/components/carrinho/DeliveryModal.tsx
import { X } from '@phosphor-icons/react';
import type { EnderecoData } from '../../../models/EnderecoData';

import AddressForm from './AddressForm';
import { MapDisplay } from './MapDisplay';
// Certifique-se que o caminho está correto para MapDisplay
// Se MapDisplay estiver em 'src/components/map/MapDisplay.tsx',
// e DeliveryModal está em 'src/components/carrinho/DeliveryModal.tsx',
// então o caminho correto é '../../map/MapDisplay'.



interface DeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  enderecoData: EnderecoData;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddressSelect: (selectedAddress: EnderecoData) => void;
  handleMarkerDragEnd: (e: google.maps.MapMouseEvent) => void;
  onGeocodeRequest: (address: EnderecoData) => Promise<void>;
  isLoadingLocation: boolean;
  mapCenter: { lat: number; lng: number } | null;
}

export const DeliveryModal = ({
  isOpen,
  onClose,
  onConfirm,
  enderecoData,
  handleAddressChange,
  handleAddressSelect,
  handleMarkerDragEnd,
  onGeocodeRequest,
  isLoadingLocation,
  mapCenter
}: DeliveryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Endereço de entrega</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Verifique se o endereço está correto para garantir a entrega.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Seção do Formulário */}
            <div>
              <AddressForm
                enderecoData={enderecoData}
                onAddressChange={handleAddressChange}
                onAddressSelect={handleAddressSelect}
                onGeocodeRequest={onGeocodeRequest}
              />
              <div className="mt-6 flex justify-end">
                <button
                  onClick={onConfirm} // Chamando onConfirm que já faz o cálculo e fecha o modal
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition"
                  disabled={!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade}
                >
                  Confirmar Endereço
                </button>
              </div>
            </div>

            {/* Seção do Mapa */}
            <div className="h-96">
              {isLoadingLocation ? (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Obtendo sua localização...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Renderiza o MapDisplay apenas se houver mapCenter ou enderecoData com coords */}
                  {(mapCenter || (enderecoData.latitude !== undefined && enderecoData.longitude !== undefined)) ? (
                    <MapDisplay
                      // Se enderecoData.latitude/longitude estiverem definidos, use-os, senão use mapCenter
                      latitude={enderecoData.latitude ?? mapCenter?.lat ?? 0}
                      longitude={enderecoData.longitude ?? mapCenter?.lng ?? 0}
                      isMarkerDraggable={true}
                      // <<-- AQUI ESTÁ A SEGUNDA PARTE DA CORREÇÃO: Passando a prop para o MapDisplay
                      onMarkerDragEnd={handleMarkerDragEnd}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Digite um endereço para visualizar o mapa</p>
                    </div>
                  )}
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/carrinho/AddressForm.tsx
import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { MapPin } from '@phosphor-icons/react';
import type { EnderecoData } from '../../../models/EnderecoData';
import { ToastAlerta } from '../../../utils/ToastAlerta';
import { useUserLocation } from '../../../contexts/userLocation';
import { buscarEnderecoPorCep } from '../../../services/CepService';


interface AddressFormProps {
  enderecoData: EnderecoData;
  onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect: (address: EnderecoData) => void;
  onGeocodeRequest: (address: EnderecoData) => Promise<void>;
}

const AddressForm: React.FC<AddressFormProps> = ({ 
  enderecoData, 
  onAddressChange, 
  onAddressSelect,
  onGeocodeRequest
}) => {
  const { setUserAddress } = useUserLocation();
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const autocompleteInputRef = useRef<HTMLInputElement>(null);

  // Configura o autocomplete do Google Maps
  useEffect(() => {
    if (!window.google?.maps?.places || !autocompleteInputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInputRef.current, 
      {
        fields: ['address_components', 'geometry', 'formatted_address'],
        componentRestrictions: { country: 'br' }
      }
    );

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const newAddress: EnderecoData = {
        ...enderecoData, 
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        cep: '',
        estado: '',
        latitude: place.geometry?.location?.lat(),
        longitude: place.geometry?.location?.lng()
      };

      place.address_components.forEach(component => {
        const type = component.types[0];
        switch(type) {
          case 'route': newAddress.rua = component.long_name; break;
          case 'street_number': newAddress.numero = component.long_name; break;
          case 'sublocality_level_1':
          case 'neighborhood': newAddress.bairro = component.long_name; break;
          case 'locality': newAddress.cidade = component.long_name; break;
          case 'administrative_area_level_1': 
            newAddress.estado = component.short_name; 
            break;
          case 'postal_code': 
            newAddress.cep = component.long_name.replace(/\D/g, ''); 
            break;
        }
      });

      onAddressSelect(newAddress);
      setUserAddress(newAddress);
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [enderecoData, onAddressSelect, setUserAddress]);

  const handleCepBlur = async () => {
  const cep = enderecoData.cep?.replace(/\D/g, '');
  if (cep && cep.length === 8) {
    setIsLoadingCep(true);
    try {
      const resultado = await buscarEnderecoPorCep(cep);
      if (resultado) {
        const newAddress = { 
          ...enderecoData,
          rua: resultado.rua || enderecoData.rua,
          bairro: resultado.bairro || enderecoData.bairro,
          cidade: resultado.cidade || enderecoData.cidade,
          estado: resultado.estado || enderecoData.estado,
          cep: resultado.cep || enderecoData.cep
        };
        
        onAddressSelect(newAddress);
        
        // Não faz geocode ainda, só quando tiver número
        if (enderecoData.numero) {
          await onGeocodeRequest(newAddress);
        }
      }
    } catch (error) {
      ToastAlerta('Erro ao buscar CEP', 'erro');
    } finally {
      setIsLoadingCep(false);
    }
  }
};
const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newAddress = {
    ...enderecoData,
    numero: e.target.value
  };
  
  onAddressChange(e); // Atualiza o estado
  
  // Se já tem rua e cidade, faz o geocode
  if (e.target.value && enderecoData.rua && enderecoData.cidade) {
    onGeocodeRequest(newAddress);
  }
};

  return (
    <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Dados para Entrega <MapPin size={24} className="inline-block ml-2 text-orange-600"/>
      </h3>
      
      <form className="flex flex-col gap-3">
        {/* Campo de busca por endereço (Google Autocomplete) */}
        <input
          ref={autocompleteInputRef}
          type="text"
          name="rua"
          placeholder="Digite seu endereço completo"
          value={enderecoData.rua || ''}
          onChange={onAddressChange}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />

        {/* Demais campos do formulário */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="numero"
            placeholder="Número"
            value={enderecoData.numero || ''}
            onChange={handleNumeroChange} 
            required
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <div className="relative">
            <input
              type="text"
              name="cep"
              placeholder="CEP"
              value={enderecoData.cep || ''}
              onChange={onAddressChange}
              onBlur={handleCepBlur}
              maxLength={9}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-full"
            />
            {isLoadingCep && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* ... outros campos do formulário ... */}
      </form>
    </div>
  );
};

export default AddressForm;
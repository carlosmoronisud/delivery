// src/components/carrinho/AddressForm.tsx
import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { MapPin } from '@phosphor-icons/react';
import type { EnderecoData } from '../../../models/EnderecoData';
import { ToastAlerta } from '../../../utils/ToastAlerta';
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
   
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const autocompleteInputRef = useRef<HTMLInputElement>(null);

    

    // autocomplete do Google Maps
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
            if (!place.address_components) {
                ToastAlerta('Não foi possível obter detalhes do local selecionado.', 'erro');
                return;
            }

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
                switch (type) {
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
            onGeocodeRequest(newAddress);
        });

        return () => {
            if (window.google?.maps?.event) {
                window.google.maps.event.removeListener(listener);
            }
        };
    }, [enderecoData, onAddressSelect, onGeocodeRequest]);

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

                    if (newAddress.rua && newAddress.cidade && newAddress.numero) {
                        await onGeocodeRequest(newAddress);
                    }
                } else {
                    ToastAlerta('CEP não encontrado.', 'erro');
                }
            } catch (error) {
                ToastAlerta('Erro ao buscar CEP', 'erro');
                console.error('Erro ao buscar CEP:', error);
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

        onAddressChange(e);
        onAddressSelect(newAddress);

        if (e.target.value && enderecoData.rua && enderecoData.cidade) {
            onGeocodeRequest(newAddress);
        }
    };

    const handleSearchAddress = async () => {
        if (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade) {
            ToastAlerta('Preencha Rua, Número e CEP para buscar no mapa.', 'info'); 
            return;
        }
        await onGeocodeRequest(enderecoData);
    };


    return (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Dados para Entrega <MapPin size={24} className="inline-block ml-2 text-orange-600" />
            </h3>

            <form className="flex flex-col gap-3">
                {/* Campo de busca por endereço (Google Autocomplete) */}
                <input
                    ref={autocompleteInputRef}
                    type="text"
                    name="rua"
                    placeholder="Digite seu endereço completo (Rua, Cidade, Estado)" // Sugestão para o placeholder
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
                {/* Campo do Bairro, mantido para preenchimento manual ou por CEP/autocomplete */}
                <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={enderecoData.bairro || ''}
                    onChange={onAddressChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                
                <input
                    type="text"
                    name="complemento"
                    placeholder="Telefone"
                    value={enderecoData.complemento || ''}
                    onChange={onAddressChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />

                {/* Botão para buscar o endereço */}
                <button
                    type="button"
                    onClick={handleSearchAddress}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                    <MapPin size={20} /> Buscar Endereço no Mapa
                </button>
            </form>
        </div>
    );
};

export default AddressForm;
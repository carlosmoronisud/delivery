/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef,  useCallback, type ChangeEvent } from 'react'; 
import { MapPin } from '@phosphor-icons/react';
import type { EnderecoData } from '../models/EnderecoData';
import { buscarEnderecoPorCep } from '../services/CepService';


// Props para o componente AddressForm
interface AddressFormProps {
    enderecoData: EnderecoData;
    onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddressSelect: (address: EnderecoData) => void; 
}

const AddressForm: React.FC<AddressFormProps> = ({ enderecoData, onAddressChange, onAddressSelect }) => {
    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const autocomplete: React.MutableRefObject<any | null> = useRef(null);

    // Função para lidar com a mudança no campo de CEP
    const handleCepChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        // Chama a função onAddressChange do pai para manter o estado do CEP
        onAddressChange(e);

        if (cep.replace(/\D/g, '').length === 8) { 
            const enderecoEncontrado = await buscarEnderecoPorCep(cep);
            if (enderecoEncontrado) {
               
                onAddressSelect({
                    ...enderecoData, 
                    ...enderecoEncontrado, 
                    rua: enderecoEncontrado.rua || '',
                    bairro: enderecoEncontrado.bairro || '',
                    cidade: enderecoEncontrado.cidade || '',
                    cep: enderecoEncontrado.cep || ''
                });
            } else {
                
                onAddressSelect({
                    ...enderecoData, 
                    rua: '',
                    bairro: '',
                    cidade: '',
                });
            }
        }
    }, [enderecoData, onAddressChange, onAddressSelect]); 

    useEffect(() => {
        // 
        if (window.google?.maps?.places && autocompleteInputRef.current) {
            if (!autocomplete.current) { 
                autocomplete.current = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
                    types: ['address'], 
                    componentRestrictions: { country: 'br' }, 
                });

                autocomplete.current.addListener('place_changed', () => {
                    const place = autocomplete.current?.getPlace();
                    if (place && place.address_components) {
                        const newAddress: EnderecoData = {
                            rua: '',
                            numero: '',
                            bairro: '',
                            cidade: '',
                            complemento: '',
                            cep: '',
                        };

                        for (const component of place.address_components) {
                            const type = component.types[0];
                            switch (type) {
                                case 'street_number':
                                    newAddress.numero = component.long_name;
                                    break;
                                case 'route':
                                    newAddress.rua = component.long_name;
                                    break;
                                case 'sublocality_level_1': 
                                case 'sublocality':
                                    newAddress.bairro = component.long_name;
                                    break;
                                case 'administrative_area_level_2': 
                                    newAddress.cidade = component.long_name;
                                    break;
                                case 'postal_code': 
                                    newAddress.cep = component.long_name.replace('-', ''); 
                                    break;
                            }
                        }
                        
                        onAddressSelect({ ...enderecoData, ...newAddress });
                    }
                });
            }
        }
    }, [enderecoData, onAddressSelect]); 

    return (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Dados para Entrega <MapPin size={24} className="inline-block ml-2 text-orange-600"/></h3>
            <form className="flex flex-col gap-3">
                <input
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={enderecoData.cep || ''}
                    onChange={handleCepChange} 
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    maxLength={9} 
                />
                <input
                    type="text"
                    name="rua"
                    placeholder="Rua"
                    value={enderecoData.rua}
                    onChange={onAddressChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    ref={autocompleteInputRef} 
                />
                <input
                    type="text"
                    name="numero"
                    placeholder="Número"
                    value={enderecoData.numero}
                    onChange={onAddressChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                    type="text"
                    name="bairro"
                    placeholder="Bairro"
                    value={enderecoData.bairro}
                    onChange={onAddressChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                    type="text"
                    name="cidade"
                    placeholder="Cidade"
                    value={enderecoData.cidade}
                    onChange={onAddressChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <input
                    type="text"
                    name="complemento"
                    placeholder="Complemento (opcional)"
                    value={enderecoData.complemento || ''}
                    onChange={onAddressChange}
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
            </form>
        </div>
    );
};

export default AddressForm;
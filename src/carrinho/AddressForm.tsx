/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef,  useCallback, type ChangeEvent } from 'react'; // Adicionado useCallback
import { MapPin } from '@phosphor-icons/react';
import type { EnderecoData } from '../models/EnderecoData';
import { buscarEnderecoPorCep } from '../services/CepService';


// Props para o componente AddressForm
interface AddressFormProps {
    enderecoData: EnderecoData;
    onAddressChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddressSelect: (address: EnderecoData) => void; // Callback quando um endereço é selecionado do Autocomplete ou via CEP
}

const AddressForm: React.FC<AddressFormProps> = ({ enderecoData, onAddressChange, onAddressSelect }) => {
    const autocompleteInputRef = useRef<HTMLInputElement>(null);
    const autocomplete: React.MutableRefObject<any | null> = useRef(null);

    // Função para lidar com a mudança no campo de CEP
    const handleCepChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        // Chama a função onAddressChange do pai para manter o estado do CEP
        onAddressChange(e);

        if (cep.replace(/\D/g, '').length === 8) { // Verifica se o CEP tem 8 dígitos (apenas números)
            const enderecoEncontrado = await buscarEnderecoPorCep(cep);
            if (enderecoEncontrado) {
                // Ao encontrar o endereço, preenche os campos correspondentes
                // Mantém o número e complemento existentes se já foram digitados
                // ou se o usuário não quer sobrescrevê-los
                onAddressSelect({
                    ...enderecoData, // Mantém os valores atuais (como numero, complemento)
                    ...enderecoEncontrado, // Sobrescreve rua, bairro, cidade, cep
                    // Garante que rua, bairro, cidade sejam strings vazias se null/undefined
                    rua: enderecoEncontrado.rua || '',
                    bairro: enderecoEncontrado.bairro || '',
                    cidade: enderecoEncontrado.cidade || '',
                    cep: enderecoEncontrado.cep || ''
                });
            } else {
                // Se o CEP não for encontrado ou inválido, pode-se limpar os campos
                // ou apenas deixar o usuário digitar manualmente.
                // Por enquanto, vamos manter o que o usuário digitou e limpar os campos automáticos.
                onAddressSelect({
                    ...enderecoData, // Mantém o número, complemento e o CEP digitado
                    rua: '',
                    bairro: '',
                    cidade: '',
                });
            }
        }
    }, [enderecoData, onAddressChange, onAddressSelect]); // onAddressChange e onAddressSelect são callbacks do pai

    useEffect(() => {
        // Verifica se a API do Google Maps Places está carregada e o input ref existe
        if (window.google?.maps?.places && autocompleteInputRef.current) {
            if (!autocomplete.current) { // Impede múltiplas inicializações
                autocomplete.current = new window.google.maps.places.Autocomplete(autocompleteInputRef.current, {
                    types: ['address'], // Sugere apenas endereços
                    componentRestrictions: { country: 'br' }, // Restringe a sugestões no Brasil
                });

                // Listener para quando um lugar é selecionado no autocomplete
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
                                case 'sublocality_level_1': // Bairro para Brasil
                                case 'sublocality':
                                    newAddress.bairro = component.long_name;
                                    break;
                                case 'administrative_area_level_2': // Cidade para Brasil
                                    newAddress.cidade = component.long_name;
                                    break;
                                case 'postal_code': // CEP
                                    newAddress.cep = component.long_name.replace('-', ''); // Limpa o hífen do CEP
                                    break;
                            }
                        }
                        // Mescla com os dados atuais para não perder número/complemento se já digitados
                        onAddressSelect({ ...enderecoData, ...newAddress });
                    }
                });
            }
        }
    }, [enderecoData, onAddressSelect]); // onAddressSelect é uma dependência estável

    return (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Dados para Entrega <MapPin size={24} className="inline-block ml-2 text-orange-600"/></h3>
            <form className="flex flex-col gap-3">
                <input
                    type="text"
                    name="cep"
                    placeholder="CEP"
                    value={enderecoData.cep || ''}
                    onChange={handleCepChange} // Nova função de tratamento para o CEP
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    maxLength={9} // Limita a 9 caracteres (8 dígitos + hífen)
                />
                <input
                    type="text"
                    name="rua"
                    placeholder="Rua"
                    value={enderecoData.rua}
                    onChange={onAddressChange}
                    required
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    ref={autocompleteInputRef} // Ref para o Autocomplete do Google Maps (para o campo de rua)
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
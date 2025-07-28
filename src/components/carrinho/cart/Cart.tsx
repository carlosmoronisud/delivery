/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState, useCallback, useEffect } from 'react';
import { CartContext, type Items } from '../../../contexts/CartContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { ToastAlerta } from '../../../utils/ToastAlerta';
import { useNavigate } from 'react-router-dom';
import { geocodeAddress } from '../../../services/GeocodeService';
import CardCart from './CartCard';
import { ConfirmOrderButton } from './ConfirmOrderButon';
import { CartEmpty } from './CartEmpty';
import { OrderSummary } from './OrderSumary';
import type { EnderecoData } from '../../../models/EnderecoData';
import { CartHeader } from './CartHeader';
import ErrorBoundary from '../../ErrorBoundary';
import { useUserLocation } from '../../../contexts/userLocation';
import { DeliveryModal } from '../map/DeliveryModal';
import { MapDisplay } from '../map/MapDisplay';
import { PencilSimpleLine } from '@phosphor-icons/react'; 
import { MapPinLine } from '@phosphor-icons/react/dist/ssr/MapPinLine';

export function Cart() {
    const { items, quantidadeItems, valorTotal, limparCart } = useContext(CartContext);    
    const { setUserAddress } = useUserLocation();
    const [showAddressForm, setShowAddressForm] = useState(false); 

    // Estados para controle do modal e localização
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
    const navigate = useNavigate();    
    const { usuario } = useContext(AuthContext);

    // Estados para entrega
    const [frete, setFrete] = useState<number>(0);
    const [deliveryTime, setDeliveryTime] = useState<string>('');
    const [distance, setDistance] = useState<string>('');
    const valorTotalComFrete = valorTotal + frete;
    const CENTRO_CAMPINAS = {
        lat: -22.9099, 
        lng: -47.0626
    };
    const [isFreteCalculated, setIsFreteCalculated] = useState(false);
    const [deliveryOption, setDeliveryOption] = useState<'none' | 'pickup' | 'delivery'>('none');
    const [enderecoData, setEnderecoData] = useState<EnderecoData>({ 
        rua: '', numero: '', bairro: '', cidade: '', complemento: '', 
        cep: '', latitude: undefined, longitude: undefined, estado: '' 
    });
    
    useEffect(() => {
        if (deliveryOption === 'delivery' && enderecoData.latitude !== undefined && enderecoData.longitude !== undefined) {
            calcularFreteFixo(enderecoData.latitude, enderecoData.longitude);
        } else if (deliveryOption === 'pickup') {
            setFrete(0);
            setDeliveryTime('Retirada no local');
            setDistance('N/A');
            setIsFreteCalculated(true);
        } else {
            setFrete(0);
            setDeliveryTime('');
            setDistance('');
            setIsFreteCalculated(false);
        }
    }, [deliveryOption, enderecoData.latitude, enderecoData.longitude]);

    const getBrowserLocation = useCallback(() => {
        setIsLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setMapCenter({ lat: latitude, lng: longitude });
                    setIsLoadingLocation(false);

                    setEnderecoData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                },
                (error) => {
                    console.error("Erro ao obter localização:", error);
                    ToastAlerta('Não foi possível obter sua localização', 'erro');
                    setIsLoadingLocation(false);
                }
            );
        } else {
            ToastAlerta('Geolocalização não suportada pelo navegador', 'erro');
            setIsLoadingLocation(false);
        }
    }, []);

    const handleDeliveryOptionChange = (option: 'none' | 'pickup' | 'delivery') => {
        setDeliveryOption(option);
        
        if (option === 'delivery') {
            setIsDeliveryModalOpen(true);
            getBrowserLocation();
        } else {
             // Limpa dados de endereço e frete ao mudar para "none" ou "pickup"
            setEnderecoData({ 
                rua: '', numero: '', bairro: '', cidade: '', complemento: '', 
                cep: '', latitude: undefined, longitude: undefined, estado: '' 
            });
            setFrete(0);
            setDeliveryTime('');
            setDistance('');
            setIsFreteCalculated(false);
        }
    };

    const handleGeocodeRequest = async (address: EnderecoData) => {
        try {
            if (!address.rua || !address.cidade) return;
            
            const fullAddress = `${address.rua}, ${address.numero}, ${address.bairro}, ${address.cidade}, ${address.estado}`;
            const result = await geocodeAddress(fullAddress);
            
            if (result) {
                const updatedAddress = {
                    ...address,
                    latitude: result.latitude,
                    longitude: result.longitude
                };
                setEnderecoData(updatedAddress);
                setUserAddress(updatedAddress);
            }
        } catch (error) {
            ToastAlerta('Não foi possível encontrar a localização no mapa', 'erro');
            console.error('Erro ao geocodificar o endereço:', error);
        }
    };

    const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    const calcularFreteFixo = useCallback((latDestino: number, lngDestino: number) => {
        const distancia = calcularDistancia(
            CENTRO_CAMPINAS.lat, 
            CENTRO_CAMPINAS.lng,
            latDestino,
            lngDestino
        );
        
        const freteCalculado = 5 + (distancia * 1);
        const tempoEstimado = Math.round(20 + (distancia * 1));
        
        setFrete(parseFloat(freteCalculado.toFixed(2)));
        setDistance(`${distancia.toFixed(1)} km`);
        setDeliveryTime(`${tempoEstimado} minutos`);
        setIsFreteCalculated(true);
    }, [CENTRO_CAMPINAS.lat, CENTRO_CAMPINAS.lng]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddressData = {
            ...enderecoData,
            [e.target.name]: e.target.value,
        };
        setEnderecoData(newAddressData);
        setIsFreteCalculated(false);
        setDeliveryTime('');
        setDistance('');
    };

    const handleAddressSelect = (selectedAddress: EnderecoData) => {
        setEnderecoData(selectedAddress);
        setIsFreteCalculated(false); 
        setDeliveryTime('');
        setDistance('');
    };

    const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const newLat = e.latLng.lat();
            const newLng = e.latLng.lng();
            
            setEnderecoData(prev => ({
                ...prev,
                latitude: newLat,
                longitude: newLng
            }));
            setIsFreteCalculated(false); 
            setDeliveryTime('');
            setDistance('');
        }
    }, []);

    const handleConfirmAddress = async () => {
        try {
            if (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade) {
                ToastAlerta('Preencha todos os campos obrigatórios para entrega', 'erro');
                return false;
            }

            if (enderecoData.latitude === undefined || enderecoData.longitude === undefined) {
                await handleGeocodeRequest(enderecoData);
            }
            
            return true;
        } catch (error) {
            console.error('Erro ao confirmar endereço:', error);
            ToastAlerta('Erro ao validar endereço', 'erro');
            return false;
        }
    };

    const handleFinalizarPedido = async () => {
        if (!usuario?.token) {
            ToastAlerta('Você precisa estar logado!', 'erro');
            navigate('/login', { state: { from: '/cart' } });
            return;
        }

        if (quantidadeItems === 0) {
            ToastAlerta('Seu carrinho está vazio', 'erro');
            return;
        }

        if (deliveryOption === 'none') {
            ToastAlerta('Selecione uma opção de entrega', 'erro');
            return;
        }

        if (deliveryOption === 'delivery') {
            const addressConfirmed = await handleConfirmAddress();
            if (!addressConfirmed) {
                return; 
            }
           
            if (!isFreteCalculated) {
                ToastAlerta('Aguarde o cálculo do frete para prosseguir.', 'info');
                return;
            }
        }

        // Navega para a página de confirmação
        navigate('/order-confirmation', {
            state: {
                items,
                deliveryOption,
                frete: deliveryOption === 'delivery' ? frete : 0, 
                enderecoData: deliveryOption === 'delivery' ? enderecoData : null,
                valorTotal,
                totalFinal: valorTotalComFrete,
                deliveryTime: deliveryOption === 'delivery' ? deliveryTime : 'Retirada no local', 
                distance: deliveryOption === 'delivery' ? distance : 'N/A', 
                user: usuario
            }
        })
        limparCart()
    };

    const isConfirmButtonDisabled =
        quantidadeItems === 0 ||
        deliveryOption === 'none' ||
        (deliveryOption === 'delivery' && (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade || 
         enderecoData.latitude === undefined || enderecoData.longitude === undefined || !isFreteCalculated)) ||
        !usuario?.token;

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-7xl flex flex-col mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                <CartHeader />

                {items.length === 0 ? (
                    <CartEmpty />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 mt-8 w-full">
                        <div className="flex-1 flex flex-col gap-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {items.map((produto: Items) => (
                                    <CardCart key={produto.id} item={produto} />
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 flex flex-col gap-6">
                            <ErrorBoundary 
                                fallback={
                                    <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                                        <div className="text-red-600 font-semibold">
                                            Não foi possível carregar o resumo do pedido
                                        </div>
                                    </div>
                                }
                            >
                                <OrderSummary 
                                    deliveryOption={deliveryOption}
                                    setDeliveryOption={handleDeliveryOptionChange}
                                    frete={frete}
                                    deliveryTime={deliveryTime}
                                    distance={distance}
                                    setShowAddressForm={setShowAddressForm}
                                />
                            </ErrorBoundary>

                            {/* Seção do mapa e endereço no Cart.tsx para delivery */}
                            {deliveryOption === 'delivery' && enderecoData.latitude !== undefined && enderecoData.longitude !== undefined && isFreteCalculated && (
                                <div className="p-4 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Endereço de Entrega</h3>
                                    <div className="h-48 w-full rounded-lg overflow-hidden mb-3">
                                        <MapDisplay 
                                            latitude={enderecoData.latitude} 
                                            longitude={enderecoData.longitude}
                                            isMarkerDraggable={false} 
                                        />
                                    </div>
                                    {showAddressForm && (     
                                    <div className="text-sm text-gray-700 space-y-1">
                                        <p><strong>Rua:</strong> {enderecoData.rua}, {enderecoData.numero}</p>
                                        <p><strong>Bairro:</strong> {enderecoData.bairro}</p>
                                        <p><strong>Cidade/Estado:</strong> {enderecoData.cidade} - {enderecoData.estado}</p>
                                        {enderecoData.complemento && <p><strong>Complemento:</strong> {enderecoData.complemento}</p>}
                                        {enderecoData.cep && <p><strong>CEP:</strong> {enderecoData.cep}</p>}
                                        <p className="mt-2 text-orange-600 font-semibold">Tempo estimado: {deliveryTime}</p>
                                        <p className="text-gray-600 font-semibold">Distância: {distance}</p>
                                    </div>
                                    )}
                                    <button
                                        onClick={() => setIsDeliveryModalOpen(true)}
                                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2
                                                   hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <PencilSimpleLine size={18} /> Alterar Endereço
                                    </button>
                                </div>
                            )}
                            {deliveryOption === 'delivery' && (!enderecoData.latitude || !enderecoData.longitude || !isFreteCalculated) && (
                                <div className="p-4 bg-yellow-100 text-yellow-800 rounded-lg border border-yellow-200 text-center">
                                    <p className="font-semibold">Aguardando definição do endereço de entrega ou cálculo de frete.</p>
                                    <button
                                        onClick={() => setIsDeliveryModalOpen(true)}
                                        className="mt-3 bg-yellow-500 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2
                                                   hover:bg-yellow-600 transition-colors duration-200 text-sm font-medium mx-auto"
                                    >
                                        <MapPinLine size={18} /> Definir Endereço
                                    </button>
                                </div>
                            )}

                            <ConfirmOrderButton 
                                isConfirmButtonDisabled={isConfirmButtonDisabled}
                                handleFinalizarPedido={handleFinalizarPedido}
                                deliveryOption={deliveryOption}
                                enderecoData={enderecoData}
                                isFreteCalculated={isFreteCalculated}
                            />                      
                        </div>                       
                    </div>
                )}
                <DeliveryModal
                    isOpen={isDeliveryModalOpen}
                    onClose={() => setIsDeliveryModalOpen(false)}
                    onConfirm={async () => {
                        const success = await handleConfirmAddress();
                        if (success) {
                            setIsDeliveryModalOpen(false);
                           
                        }
                    }}
                    enderecoData={enderecoData}
                    handleAddressChange={handleAddressChange}
                    handleAddressSelect={handleAddressSelect}
                    handleMarkerDragEnd={handleMarkerDragEnd}
                    onGeocodeRequest={handleGeocodeRequest}
                    isLoadingLocation={isLoadingLocation}
                    mapCenter={mapCenter}
                />
            </div>
        </div>
    );
}
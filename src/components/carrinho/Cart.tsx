/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useState, useEffect, useCallback } from 'react';
import CardCart from './CartCard';
import { CartContext, type Items } from '../../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastAlerta } from '../../utils/ToastAlerta';
import { AuthContext } from '../../contexts/AuthContext';
import AddressForm from './AddressForm';
import type { EnderecoData } from '../../models/EnderecoData'; 

import { ShoppingCart } from '@phosphor-icons/react';
import MapDisplay from '../../components/map/MapDisplay'; 
import { geocodeAddress } from '../../services/GeocodeService';



const LOJA_ENDERECO_ORIGEM = 'Rua do Ouvidor, 666, Campinas, SP'; 

function Cart() {
    const navigate = useNavigate();
    const { items, quantidadeItems, valorTotal, limparCart } = useContext(CartContext);
    const { usuario } = useContext(AuthContext);

    const [deliveryOption, setDeliveryOption] = useState<'none' | 'pickup' | 'delivery'>('none');
    const [frete, setFrete] = useState<number>(0);
    const [enderecoData, setEnderecoData] = useState<EnderecoData>({ rua: '', numero: '', bairro: '', cidade: '', complemento: '', cep: '', latitude: undefined, longitude: undefined });
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [isFreteCalculated, setIsFreteCalculated] = useState(false);
    const [deliveryTime, setDeliveryTime] = useState<string>('');
    const [distance, setDistance] = useState<string>('');

    const valorTotalComFrete = valorTotal + frete;

    // Função para geocodificar e atualizar enderecoData com lat/lng
    const updateAddressWithCoordinates = useCallback(async (address: EnderecoData) => {
        const fullAddressString = `${address.rua}, ${address.numero}, ${address.bairro ? address.bairro + ', ' : ''}${address.cidade}, ${address.estado || ''}, ${address.cep || ''}`;
        
        console.log("Cart: Iniciando geocodificação para:", fullAddressString); // LOG 1
        const coords = await geocodeAddress(fullAddressString);
        
        if (coords) {
            console.log("Cart: Coordenadas obtidas:", coords); // LOG 2
            setEnderecoData(prev => ({
                ...prev,
                latitude: coords.latitude,
                longitude: coords.longitude,
            }));
        } else {
            console.log("Cart: Falha ao obter coordenadas para:", fullAddressString); 
            ToastAlerta('Não foi possível geocodificar o endereço para o mapa.', 'info');
            setEnderecoData(prev => ({ ...prev, latitude: undefined, longitude: undefined }));
        }
    }, []);

    useEffect(() => {
        if (deliveryOption === 'pickup' || deliveryOption === 'none') {
            setFrete(0);
            setDeliveryTime('');
            setDistance('');
            setIsFreteCalculated(false);
            // Ao mudar para pickup/none, limpa coords também
            setEnderecoData(prev => ({ ...prev, latitude: undefined, longitude: undefined }));
        } else if (deliveryOption === 'delivery' && (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade)) {
            setFrete(0);
            setDeliveryTime('');
            setDistance('');
            setIsFreteCalculated(false);
            // Ao tornar o endereço incompleto, limpa coords
            setEnderecoData(prev => ({ ...prev, latitude: undefined, longitude: undefined }));
        }
    }, [deliveryOption, enderecoData.rua, enderecoData.numero, enderecoData.cidade]);


    const handleRouteCalculated = (calculatedDistance: string, calculatedDuration: string) => {
        const distanceInKm = parseFloat(calculatedDistance.replace(',', '.').replace(' km', '')) || 0;
        const simulatedFrete = parseFloat((distanceInKm * 0.5 + 5).toFixed(2));

        setFrete(simulatedFrete);
        setDeliveryTime(calculatedDuration);
        setDistance(calculatedDistance);
        setIsFreteCalculated(true);
        ToastAlerta(`Frete calculado: R$ ${simulatedFrete.toFixed(2).replace('.', ',')} (Tempo: ${calculatedDuration})`, 'info');
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddressData = {
            ...enderecoData,
            [e.target.name]: e.target.value,
        };
        setEnderecoData(newAddressData);
        setIsFreteCalculated(false);
        setDeliveryTime('');
        setDistance('');
        
        // Disparar geocodificação ao digitar, se o endereço estiver minimamente completo
        if (newAddressData.rua && newAddressData.cidade) {
            updateAddressWithCoordinates(newAddressData);
            // Simular cálculo de rota para preencher frete/tempo
            const simulatedDistance = "5.0 km";
            const simulatedDuration = "20 mins";
            handleRouteCalculated(simulatedDistance, simulatedDuration);
        }
    };

    const handleAddressSelect = (selectedAddress: EnderecoData) => {
        setEnderecoData(selectedAddress);
        setIsFreteCalculated(false);
        setDeliveryTime('');
        setDistance('');

        if (selectedAddress.rua && selectedAddress.cidade) {
            // Se o autocomplete já trouxe lat/lng (ideal), use. Senão, geocodifique.
            if (selectedAddress.latitude && selectedAddress.longitude) {
                console.log("Cart: Endereço selecionado já tem coords.", selectedAddress); // LOG 4
                setEnderecoData(selectedAddress); // Use o endereço completo já com coords
                // Simular cálculo de rota
                const simulatedDistance = "7.5 km";
                const simulatedDuration = "30 mins";
                handleRouteCalculated(simulatedDistance, simulatedDuration);
            } else {
                console.log("Cart: Endereço selecionado sem coords, geocodificando."); // LOG 5
                updateAddressWithCoordinates(selectedAddress); // Geocodifique
                // Simular cálculo de rota
                const simulatedDistance = "7.5 km";
                const simulatedDuration = "30 mins";
                handleRouteCalculated(simulatedDistance, simulatedDuration);
            }
        }
    };

    const handleFinalizarPedido = () => {
        console.log("Cart: Finalizar Pedido clicado."); // LOG 6
        if (!usuario || !usuario.token) {
            ToastAlerta('Você precisa estar logado para finalizar a compra!', 'erro');
            return;
        }

        if (deliveryOption === 'delivery') {
            if (!enderecoData.rua || !enderecoData.numero || !enderecoData.bairro || !enderecoData.cidade) {
                ToastAlerta('Por favor, preencha todos os campos obrigatórios do endereço para entrega.', 'erro');
                return;
            }
            // Verifica se as coordenadas estão disponíveis antes de prosseguir
            if (!enderecoData.latitude || !enderecoData.longitude) {
                ToastAlerta('Aguarde a confirmação do endereço no mapa ou digite um endereço válido.', 'erro');
                return;
            }
            if (!isFreteCalculated) {
                ToastAlerta('Aguarde o cálculo do frete ou selecione novamente a opção de entrega.', 'erro');
                return;
            }
        } else if (deliveryOption === 'none') {
            ToastAlerta('Selecione uma opção de entrega/retirada.', 'erro');
            return;
        }

        navigate('/order-confirmation', { 
            state: {
                deliveryOption,
                frete,
                enderecoData: { // Passa uma cópia do enderecoData para evitar modificações acidentais
                    ...enderecoData,
                    latitude: enderecoData.latitude, 
                    longitude: enderecoData.longitude,
                },
                valorTotal,
                quantidadeItems,
                deliveryTime,
                distance,
                totalFinal: valorTotalComFrete
            }
        });

        ToastAlerta('Pedido finalizado com sucesso!', 'sucesso'); // Movido para após a navegação
        limparCart();
        setDeliveryOption('none');
        setEnderecoData({ rua: '', numero: '', bairro: '', cidade: '', complemento: '', cep: '', latitude: undefined, longitude: undefined });
        setShowAddressForm(false);
        setIsFreteCalculated(false);
        setDeliveryTime('');
        setDistance('');
    };

    const isConfirmButtonDisabled =
        quantidadeItems === 0 ||
        deliveryOption === 'none' ||
        (deliveryOption === 'delivery' && (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade || !enderecoData.latitude || !enderecoData.longitude || !isFreteCalculated)) ||
        !usuario.token;


    const showConfirmButton =
        (deliveryOption === 'pickup' && quantidadeItems > 0 && usuario.token) ||
        (deliveryOption === 'delivery' && isFreteCalculated && enderecoData.rua && enderecoData.numero && enderecoData.cidade && enderecoData.latitude && enderecoData.longitude && quantidadeItems > 0 && usuario.token);

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-7xl flex flex-col mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
                    Seu Carrinho de Compras 🛒
                </h1>

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                        <ShoppingCart size={80} className="mb-4 text-gray-400" />
                        <span className="text-2xl md:text-3xl text-center font-semibold mb-4">
                            O seu carrinho está vazio!
                        </span>
                        <p className="text-lg md:text-xl text-center">
                            Que tal explorar nossos <Link to="/produtos" className="text-orange-600 hover:underline font-bold">produtos deliciosos</Link>?
                        </p>
                    </div>
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
                            <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-4 border-gray-200">
                                    Resumo do Pedido ✨
                                </h2>

                                <div className="flex flex-col gap-3 text-lg text-gray-700 mb-8">
                                    <p className="flex justify-between"><span className="font-semibold">Items:</span><span>{quantidadeItems}</span></p>
                                    <p className="flex justify-between"><span className="font-semibold">Subtotal:</span><span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotal)}</span></p>
                                    <p className="flex justify-between"><span className="font-semibold">Desconto:</span><span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0.0)}</span></p>
                                    <p className="flex justify-between"><span className="font-semibold">Frete:</span><span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(frete)}</span></p>
                                    {deliveryTime && deliveryOption === 'delivery' && (<p className="flex justify-between text-base text-gray-600 italic"><span className="font-semibold">Tempo estimado:</span><span>{deliveryTime}</span></p>)}
                                    {distance && deliveryOption === 'delivery' && (<p className="flex justify-between text-base text-gray-600 italic"><span className="font-semibold">Distância:</span><span>{distance}</span></p>)}
                                    <hr className="border-t-2 border-gray-300 my-2" />
                                    <p className="flex justify-between text-xl font-bold text-orange-600"><span className="text-xl font-extrabold">Total Final:</span><span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valorTotalComFrete)}</span></p>
                                </div>

                                <div className="mb-6 border-t pt-6 border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Como deseja receber seu pedido?</h3>
                                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                                        <button 
                                            onClick={() => { setDeliveryOption('pickup'); setShowAddressForm(false); }} 
                                            className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md ${deliveryOption === 'pickup' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200 cursor-pointer`}
                                        >
                                            Retirar no Balcão
                                        </button>
                                        <button 
                                            onClick={() => { setDeliveryOption('delivery'); setShowAddressForm(true); }} 
                                            className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md ${deliveryOption === 'delivery' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200 cursor-pointer`}
                                        >
                                            Entrega (Delivery)
                                        </button>
                                    </div>
                                </div>

                                {showAddressForm && deliveryOption === 'delivery' && (
                                    <>
                                        <AddressForm
                                            enderecoData={enderecoData}
                                            onAddressChange={handleAddressChange}
                                            onAddressSelect={handleAddressSelect}
                                        />
                                        {/* NOVO: Mapa de Confirmação do Endereço */}
                                        {enderecoData.latitude !== undefined && enderecoData.longitude !== undefined ? ( // Verifica se lat/lng são definidos
                                            <div className="mt-8">
                                                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirme seu Endereço no Mapa:</h3>
                                                <MapDisplay 
                                                    latitude={enderecoData.latitude} 
                                                    longitude={enderecoData.longitude} 
                                                />
                                                <p className="text-sm text-gray-600 mt-2 text-center">Este é o ponto de entrega. Arraste para ajustar se necessário (funcionalidade avançada, não implementada aqui).</p>
                                            </div>
                                        ) : (
                                            <div className="text-gray-600 text-center p-4 bg-gray-100 rounded-md">
                                                Aguardando coordenadas do endereço para exibir o mapa...
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="flex justify-center flex-col items-center mt-4">
                                    {showConfirmButton ? (
                                        <button
                                            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                            type="button"
                                            onClick={handleFinalizarPedido}
                                            disabled={isConfirmButtonDisabled}
                                        >
                                            Confirmar Pedido
                                        </button>
                                    ) : (
                                        <div className="text-sm text-red-500 mt-2 text-center">
                                            {!usuario.token && (
                                                <p className="mb-2">
                                                    Para confirmar o pedido, você precisa estar <Link to="/login" className="font-bold underline">logado</Link>!
                                                </p>
                                            )}
                                            {usuario.token && deliveryOption === 'none' && (
                                                <p className="mb-2">Selecione uma opção de entrega/retirada para continuar.</p>
                                            )}
                                            {usuario.token && deliveryOption === 'delivery' && 
                                                (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade || !isFreteCalculated || enderecoData.latitude === undefined || enderecoData.longitude === undefined) && ( // Ajustado aqui
                                                <p className="mb-2">Preencha o endereço, confirme no mapa e aguarde o cálculo do frete para finalizar.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
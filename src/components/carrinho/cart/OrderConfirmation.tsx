/* eslint-disable @typescript-eslint/no-explicit-any */
// src/carrinho/OrderConfirmation.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ToastAlerta } from '../../../utils/ToastAlerta';
import type { EnderecoData } from '../../../models/EnderecoData';
import { ShoppingCartSimple, MapPinLine, ArrowCircleRight } from '@phosphor-icons/react'; 

// FIX: Caminho corrigido para a animação Lottie
import orderConfirmedAnimation from '../../../assets/lottie-animations/orderconfirmed.json'; // <<-- AQUI ESTÁ A CORREÇÃO
import { MapDisplay } from '../map/MapDisplay';

// Interface para os dados do pedido passados via state do Cart
interface OrderConfirmationState {
    items: any[]; 
    deliveryOption: 'pickup' | 'delivery';
    frete: number;
    enderecoData: EnderecoData | null; 
    valorTotal: number;
    totalFinal: number;
    deliveryTime: string;
    distance: string;
    user: any; 
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state as OrderConfirmationState | null;

    useEffect(() => {
        // Redireciona se não houver dados válidos do pedido ou se o carrinho estiver vazio
        if (!orderData || !orderData.items || orderData.items.length === 0) {
            ToastAlerta('Nenhum pedido para confirmar. Faça um pedido primeiro!', 'info');
            navigate('/home');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-100">
                <p>Carregando confirmação do pedido...</p>
            </div>
        );
    }

    // Simula o link do celular para a página de rastreamento
    const getTrackingLink = () => {
        const orderId = Math.floor(Math.random() * 1000000); 
        return `/order-tracking/${orderId}`; 
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 flex lg:flex-row flex-col gap-8 border border-gray-200">
                
                {/* Animação e Resumo do Pedido */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-6">
                        Pedido Confirmado! 🎉
                    </h1>

                    <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 h-64 md:h-80 items-center">
                        <Lottie 
                            animationData={orderConfirmedAnimation} 
                            loop={true} 
                            autoplay={true} 
                            style={{ width: '80%', maxWidth: 250, height: 'auto' }} 
                            aria-label="Animação de pedido confirmado"
                        />
                    </div>

                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">
                            Detalhes do Pedido <ShoppingCartSimple size={24} className="inline-block ml-2 text-orange-600"/>
                        </h2>
                        <div className="text-base text-gray-700 space-y-2">
                            {orderData.items.map((item: any) => (
                                <p key={item.id} className="flex justify-between">
                                    <span>{item.nome} x {item.quantidade}</span>
                                    <span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}</span>
                                </p>
                            ))}
                        </div>
                        <div className="border-t pt-3 mt-3 space-y-2">
                            <p className="flex justify-between">
                                <span className="font-semibold">Subtotal:</span>
                                <span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.valorTotal)}</span>
                            </p>
                            {orderData.deliveryOption === 'delivery' && (
                                <p className="flex justify-between">
                                    <span className="font-semibold">Frete:</span>
                                    <span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.frete)}</span>
                                </p>
                            )}
                            <p className="flex justify-between text-lg font-bold pt-2 border-t mt-2">
                                <span>Total Final:</span>
                                <span className="text-orange-600">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.totalFinal)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Informações de Entrega e Link de Rastreamento */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">
                            Detalhes da Entrega <MapPinLine size={24} className="inline-block ml-2 text-orange-600"/>
                        </h2>
                        {orderData.deliveryOption === 'delivery' && orderData.enderecoData ? (
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><span className="font-semibold">Tipo:</span> Entrega (Delivery)</p>
                                <p><span className="font-semibold">Endereço:</span> {orderData.enderecoData.rua}, {orderData.enderecoData.numero}</p>
                                <p><span className="font-semibold">Bairro:</span> {orderData.enderecoData.bairro}</p>
                                <p><span className="font-semibold">Cidade:</span> {orderData.enderecoData.cidade}-{orderData.enderecoData.estado}</p>
                                {orderData.enderecoData.complemento && <p><span className="font-semibold">Complemento:</span> {orderData.enderecoData.complemento}</p>}
                                {orderData.enderecoData.cep && <p><span className="font-semibold">CEP:</span> {orderData.enderecoData.cep}</p>}
                                <p className="mt-4 text-orange-600 font-semibold">Tempo estimado: {orderData.deliveryTime}</p>
                                <p className="mt-2 text-gray-600 font-semibold">Distância: {orderData.distance}</p>

                                {/* Mapa na página de Confirmação */}
                                {orderData.enderecoData.latitude !== undefined && orderData.enderecoData.longitude !== undefined && (
                                    <div className="mt-4 h-48 w-full rounded-lg overflow-hidden border border-gray-300">
                                        <MapDisplay 
                                            latitude={orderData.enderecoData.latitude} 
                                            longitude={orderData.enderecoData.longitude}
                                            isMarkerDraggable={false}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><span className="font-semibold">Tipo:</span> Retirar no Balcão</p>
                                <p><span className="font-semibold">Endereço de Retirada:</span> Rua do Ouvidor, 666 - Campinas/SP</p>
                            </div>
                        )}
                    </div>

                    {/* Bloco do Link para o celular */}
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-inner text-center mt-auto">
                        <p className="mb-2 font-semibold flex items-center justify-center gap-2">
                            <ArrowCircleRight size={24} className="text-blue-600" />
                            Link de rastreamento enviado para seu celular!
                        </p>
                        <Link
                            to={getTrackingLink()}
                            state={orderData} 
                            className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                        >
                            Abrir Link de Rastreamento
                        </Link>
                        <p className="text-xs mt-2 italic"> (Clique acima para simular a abertura do link no celular)</p>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg 
                                       hover:bg-orange-700 transition-all duration-300 transform hover:-translate-y-1 
                                       cursor-pointer"
                        >
                            Voltar para a Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
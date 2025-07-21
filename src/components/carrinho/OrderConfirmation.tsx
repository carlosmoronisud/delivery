// src/carrinho/OrderConfirmation.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ToastAlerta } from '../../utils/ToastAlerta';
import type { EnderecoData } from '../../models/EnderecoData';
import { ShoppingCartSimple, MapPinLine } from '@phosphor-icons/react'; // Adicione os ícones aqui

// Importe sua animação Lottie de confirmação
import orderConfirmedAnimation from '../../assets/lottie-animations/order_confirmed.json'; // Adapte o caminho

// Interface para os dados do pedido passados via state do Cart
interface OrderConfirmationState {
    deliveryOption: 'pickup' | 'delivery';
    frete: number;
    enderecoData: EnderecoData;
    valorTotal: number;
    quantidadeItems: number;
    deliveryTime: string;
    distance: string;
    totalFinal: number;
}

const OrderConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state as OrderConfirmationState | null;

    useEffect(() => {
        // Redireciona se não houver dados válidos do pedido
        if (!orderData || orderData.quantidadeItems === 0) {
            ToastAlerta('Nenhum pedido para confirmar. Faça um pedido primeiro!', 'info');
            navigate('/home');
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Carregando confirmação do pedido...
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
                
                {/* Lado Esquerdo: Animação e Resumo do Pedido */}
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
                        <p className="text-lg"><span className="font-semibold">Items:</span> {orderData.quantidadeItems}</p>
                        <p className="text-lg"><span className="font-semibold">Total Final:</span> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.totalFinal)}</p>
                        {orderData.deliveryOption === 'delivery' && (
                            <p className="text-lg"><span className="font-semibold">Entrega em:</span> {orderData.enderecoData.rua}, {orderData.enderecoData.numero}</p>
                        )}
                    </div>
                </div>

                {/* Lado Direito: Informações de Entrega e Link de Rastreamento */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">
                            Detalhes da Entrega <MapPinLine size={24} className="inline-block ml-2 text-orange-600"/>
                        </h2>
                        {orderData.deliveryOption === 'delivery' ? (
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><span className="font-semibold">Tipo:</span> Entrega (Delivery)</p>
                                <p><span className="font-semibold">Endereço:</span> {orderData.enderecoData.rua}, {orderData.enderecoData.numero}</p>
                                <p><span className="font-semibold">Bairro:</span> {orderData.enderecoData.bairro}</p>
                                <p><span className="font-semibold">Cidade:</span> {orderData.enderecoData.cidade}</p>
                                {orderData.enderecoData.complemento && <p><span className="font-semibold">Complemento:</span> {orderData.enderecoData.complemento}</p>}
                                {orderData.enderecoData.cep && <p><span className="font-semibold">CEP:</span> {orderData.enderecoData.cep}</p>}
                                {orderData.deliveryTime && <p className="mt-4 text-orange-600 font-semibold">Tempo estimado: {orderData.deliveryTime}</p>}
                                {orderData.distance && <p className="mt-2 text-gray-600 font-semibold">Distância: {orderData.distance}</p>}
                            </div>
                        ) : (
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><span className="font-semibold">Tipo:</span> Retirar no Balcão</p>
                                <p><span className="font-semibold">Endereço de Retirada:</span> Rua do Ouvidor, 666 - Campinas/SP</p>
                            </div>
                        )}
                    </div>

                    {/* Bloco do Link para o celular */}
                    <div className="p-4 bg-blue-100 text-blue-800 rounded-lg shadow-inner text-center mt-auto"> {/* mt-auto para empurrar para o fundo */}
                        <p className="mb-2 font-semibold">🔗 Link de rastreamento enviado para seu celular!</p>
                        <Link
                            to={getTrackingLink()}
                            state={orderData} // Passa os dados do pedido para a página de rastreamento
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
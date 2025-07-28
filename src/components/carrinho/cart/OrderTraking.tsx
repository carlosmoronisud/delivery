import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import { ToastAlerta } from '../../../utils/ToastAlerta';

import type { EnderecoData } from '../../../models/EnderecoData';

import orderReceivedAnimation from '../../../assets/lottie-animations/orderreceived.json';
import preparingFoodAnimation from '../../../assets/lottie-animations/preparingfood.json'; 
import onTheWayAnimation from '../../../assets/lottie-animations/ontheway.json';     
import courrierAnimation from '../../../assets/lottie-animations/courier.json';       
import deliveredAnimation from '../../../assets/lottie-animations/deliver.json';     
import cancelledOrderAnimation from '../../../assets/lottie-animations/cancelled.json'; 

import { ShoppingCartSimple, MapPinLine } from '@phosphor-icons/react';
import { useState, useEffect, useCallback } from 'react';

// Interface para os dados do pedido passados via state
interface OrderTrackingState {
    deliveryOption: 'pickup' | 'delivery';
    frete: number;
    enderecoData: EnderecoData; 
    valorTotal: number; 
    quantidadeItems: number; 
    deliveryTime: string; 
    distance: string; 
    totalFinal: number; 
}

// Novos estados possíveis do pedido, incluindo o "entregador na porta"
type OrderStatus = 'pending' | 'preparing' | 'on_the_way' | 'courier_arrived' | 'delivered' | 'cancelled';

function OrderTracking() {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams<{ orderId?: string }>();
    
    const orderData = location.state as OrderTrackingState | null;

    const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
    const [progress, setProgress] = useState(0); 
    const [isSimulating, setIsSimulating] = useState(true); 

    // Efeito para simular o avanço do pedido
    useEffect(() => {
        if (!orderData || orderData.quantidadeItems === 0) { 
            ToastAlerta('Nenhum pedido para rastrear. Faça um pedido primeiro!', 'info');
            navigate('/home');
            return;
        }

        if (isSimulating) {
            // Nova sequência de status
            const statuses: OrderStatus[] = ['pending', 'preparing', 'on_the_way', 'courier_arrived']; 
            let currentStatusIndex = statuses.indexOf(orderStatus);
            if (currentStatusIndex === -1) currentStatusIndex = 0;

            const interval = setInterval(() => {
                if (currentStatusIndex < statuses.length - 1) {
                    currentStatusIndex++;
                    setOrderStatus(statuses[currentStatusIndex]);
                    setProgress((currentStatusIndex / (statuses.length - 1)) * 100);
                } else {
                    // Se a simulação chegou ao fim (entregador na porta), para o intervalo
                    clearInterval(interval);
                    setIsSimulating(false); 
                    // Se o status final da simulação for 'courier_arrived', mostra a mensagem
                    if (statuses[currentStatusIndex] === 'courier_arrived') {
                         ToastAlerta('Seu pedido chegou! O entregador está na porta.', 'sucesso');
                    }
                }
            }, 5000); // Muda de status a cada 5 segundos

            return () => clearInterval(interval);
        }
    }, [orderData, navigate, isSimulating, orderStatus]);

    // Função para obter a animação Lottie e o texto do status
    const getStatusAnimation = useCallback((status: OrderStatus) => {
        switch (status) {
            case 'pending': return { text: 'Pedido Recebido', animation: orderReceivedAnimation, loop: true };
            case 'preparing': return { text: 'Preparando seu Pedido', animation: preparingFoodAnimation, loop: true };
            case 'on_the_way': return { text: 'A Caminho!', animation: onTheWayAnimation, loop: true };
            case 'courier_arrived': return { text: 'Seu pedido chegou!', animation: courrierAnimation, loop: true }; 
            case 'delivered': return { text: 'Pedido Entregue!', animation: deliveredAnimation, loop: false }; 
           case 'cancelled': return { text: 'Pedido Cancelado', animation: cancelledOrderAnimation, loop: false }; 
            default: return { text: 'Desconhecido', animation: null, loop: false };
        }
    }, []);

    // Ações do usuário
    const handleCancelOrder = () => {
        if (orderStatus !== 'delivered' && orderStatus !== 'cancelled') {
            setOrderStatus('cancelled');
            setIsSimulating(false);
            setProgress(0); // Ou um valor específico para cancelado
            ToastAlerta('Seu pedido foi cancelado.', 'info');
        } else {
            ToastAlerta('Não é possível cancelar um pedido já entregue ou cancelado.', 'erro');
        }
    };

    // Nova função para confirmar a entrega pelo usuário
    const handleConfirmDelivery = () => {
        if (orderStatus === 'courier_arrived') {
            setOrderStatus('delivered');
            setIsSimulating(false); // Garante que a simulação pare
            setProgress(100); // Força a barra para 100%
            ToastAlerta('Entrega confirmada com sucesso!', 'sucesso');
        } else if (orderStatus === 'delivered' || orderStatus === 'cancelled') {
            ToastAlerta('Este pedido já foi finalizado.', 'info');
        } else {
            ToastAlerta('O pedido ainda não chegou para ser confirmado.', 'erro');
        }
    };

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Carregando dados do pedido ou redirecionando...
            </div>
        );
    }

    const currentAnimation = getStatusAnimation(orderStatus);

    // Habilita o botão de confirmar entrega apenas quando o entregador chega
    const isConfirmDeliveryEnabled = orderStatus === 'courier_arrived';

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 flex lg:flex-row flex-col gap-8 border border-gray-200">
                
                {/* Lado Esquerdo: Animação e Resumo do Pedido */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                        Acompanhe Pedido {orderId ? `(#${orderId})` : ''} 🚚
                    </h1>

                    {/* Bloco da Animação do Status Atual */}
                    <div className="flex flex-col items-center justify-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200 h-64 md:h-80">
                        {currentAnimation.animation && (
                            <Lottie 
                                animationData={currentAnimation.animation} 
                                loop={currentAnimation.loop} 
                                autoplay={true} 
                                style={{ width: '80%', maxWidth: 250, height: 'auto' }} 
                                aria-label={`Animação de status: ${currentAnimation.text}`}
                            />
                        )}
                        <span className="text-xl md:text-2xl font-semibold text-gray-800 text-center">
                            {currentAnimation.text}
                        </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                        <div 
                            className="bg-orange-500 h-3 rounded-full transition-all duration-500 ease-in-out" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    {/* Detalhes do Pedido */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">
                            Resumo do Pedido <ShoppingCartSimple size={24} className="inline-block ml-2 text-orange-600"/>
                        </h2>
                        <ul className="space-y-2 text-lg text-gray-700">
                            <li><span className="font-semibold">Total de Itens:</span> {orderData.quantidadeItems}</li>
                            <li><span className="font-semibold">Subtotal:</span> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.valorTotal)}</li>
                            <li><span className="font-semibold">Frete:</span> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.frete)}</li>
                            <li className="text-xl font-bold text-orange-600"><span className="font-extrabold">Total Final:</span> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.totalFinal)}</li>
                        </ul>
                    </div>
                </div>

                {/* Lado Direito: Informações da Entrega e Botões de Ação */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    {/* Detalhes da Entrega */}
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
                                <p className="mt-2 text-green-600 font-semibold">Seu pedido será entregue em breve!</p>
                            </div>
                        ) : (
                            <div className="text-lg text-gray-700 space-y-2">
                                <p><span className="font-semibold">Tipo:</span> Retirar no Balcão</p>
                                <p><span className="font-semibold">Endereço de Retirada:</span> Rua do Ouvidor, 666 - Campinas/SP</p>
                            </div>
                        )}
                    </div>

                    {/* Botões de Ação do Pedido */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 mt-auto"> {/* mt-auto para empurrar para o fundo */}
                        <button
                            onClick={handleCancelOrder}
                            disabled={orderStatus === 'delivered' || orderStatus === 'cancelled'}
                            className="flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md 
                                       bg-red-600 text-white hover:bg-red-700 
                                       transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar Pedido
                        </button>
                        {orderData.deliveryOption === 'delivery' && (
                            <button
                                onClick={handleConfirmDelivery}
                                // Botão ativado apenas quando entregador na porta e não finalizado
                                disabled={!isConfirmDeliveryEnabled} 
                                className="flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md 
                                           bg-green-600 text-white hover:bg-green-700 
                                           transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirmar Entrega
                            </button>
                        )}
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
}

export default OrderTracking;
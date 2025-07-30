/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Importar useParams
import Lottie from 'lottie-react';

import { ShoppingCartSimple, CheckCircle } from '@phosphor-icons/react';

// Importações das animações Lottie (ajuste os caminhos conforme necessário)
import preparingFoodAnimation from '../../../assets/lottie-animations/preparingfood.json'; 
import deliveredAnimation from '../../../assets/lottie-animations/deliver.json'; 
import { ToastAlerta } from '../../../utils/ToastAlerta';

// Componente MessageBox para exibir mensagens ao usuário (reutilizado)
const MessageBox = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Atenção!</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

// Interface para os dados do pedido passados via state
interface PickupConfirmationState {
    items: any[]; 
    valorTotal: number;
    totalFinal: number;
    pickupName: string;
    pickupPhone: string;
}

// Novos estados possíveis do pedido para retirada
type OrderStatus = 'preparing' | 'ready_for_pickup' | 'picked_up';

const PickupConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { orderId } = useParams<{ orderId?: string }>(); // Obter orderId da URL
    const orderData = location.state as PickupConfirmationState | null;

    const [orderStatus, setOrderStatus] = useState<OrderStatus>('preparing');
    const [progress, setProgress] = useState(0); 
    const [isSimulating, setIsSimulating] = useState(true); 

    // Novos estados para o fluxo de código de retirada
    const [showCodeSentMessage, setShowCodeSentMessage] = useState<boolean>(false);
    const [pickupCode, setPickupCode] = useState<string | null>(null);
    const [isCodeReceived, setIsCodeReceived] = useState<boolean>(false); // Controla se o código foi "recebido"

    useEffect(() => {
        if (!orderData || !orderData.items || orderData.items.length === 0) {
            ToastAlerta('Nenhum pedido para confirmar. Faça um pedido primeiro!', 'info');
            navigate('/home');
            return;
        }

        if (isSimulating) {
            const statuses: OrderStatus[] = ['preparing', 'ready_for_pickup']; 
            let currentStatusIndex = statuses.indexOf(orderStatus);
            if (currentStatusIndex === -1) currentStatusIndex = 0;

            const interval = setInterval(() => {
                if (currentStatusIndex < statuses.length - 1) {
                    currentStatusIndex++;
                    setOrderStatus(statuses[currentStatusIndex]);
                    setProgress((currentStatusIndex / (statuses.length - 1)) * 100);
                } else {
                    clearInterval(interval);
                    setIsSimulating(false); 
                    if (statuses[currentStatusIndex] === 'ready_for_pickup') {
                        ToastAlerta('Seu pedido está pronto para retirada no balcão!', 'sucesso');
                    }
                }
            }, 5000); 

            return () => clearInterval(interval);
        }
    }, [orderData, navigate, isSimulating, orderStatus]);

    // Função para obter a animação Lottie e o texto do status
    const getStatusAnimation = useCallback((status: OrderStatus) => {
        switch (status) {
            case 'preparing': return { text: 'Preparando seu Pedido', animation: preparingFoodAnimation, loop: true };
            case 'ready_for_pickup': return { text: 'Pronto para Retirada', animation: preparingFoodAnimation, loop: true }; // Reutilizando animação
            case 'picked_up': return { text: 'Pedido Retirado!', animation: deliveredAnimation, loop: false }; 
            default: return { text: 'Desconhecido', animation: null, loop: false };
        }
    }, []);

    // Nova função para "receber" o código de retirada
    const handleReceiveCode = () => {
        if (orderStatus === 'ready_for_pickup' && !isCodeReceived) {
            const code = Math.floor(1000 + Math.random() * 9000).toString(); // Gera um código de 4 dígitos
            setPickupCode(code);
            setShowCodeSentMessage(true);
            setIsCodeReceived(true); // Habilita o botão de confirmar retirada
        } else if (orderStatus !== 'ready_for_pickup') {
            ToastAlerta('O pedido ainda não está pronto para o código de retirada.', 'info');
        } else if (isCodeReceived) {
            ToastAlerta('O código já foi enviado.', 'info');
        }
    };

    // Função para confirmar a retirada pelo usuário
    const handleConfirmPickup = () => {
        if (orderStatus === 'ready_for_pickup' && isCodeReceived) {
            setOrderStatus('picked_up');
            setIsSimulating(false);
            setProgress(100);
            ToastAlerta('Retirada confirmada com sucesso!', 'sucesso');
        } else if (orderStatus === 'picked_up') {
            ToastAlerta('Este pedido já foi retirado.', 'info');
        } else if (!isCodeReceived) {
            ToastAlerta('Por favor, receba o código de retirada primeiro.', 'erro');
        } else {
            ToastAlerta('O pedido ainda não está pronto para ser retirado.', 'erro');
        }
    };

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600 bg-gray-100">
                <p>Carregando confirmação do pedido de retirada...</p>
            </div>
        );
    }

    const currentAnimation = getStatusAnimation(orderStatus);

    // Habilita o botão de confirmar retirada apenas quando o pedido está pronto E o código foi recebido
    const isConfirmPickupButtonEnabled = orderStatus === 'ready_for_pickup' && isCodeReceived;
    const isReceiveCodeButtonEnabled = orderStatus === 'ready_for_pickup' && !isCodeReceived;

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center py-12 px-4 font-sans">
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 flex lg:flex-row flex-col gap-8 border border-gray-200">
                
                {/* Lado Esquerdo: Animação e Resumo do Pedido */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4">
                        Pedido de Retirada Confirmado! 🎉
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
                            {orderData.items.map((item: any) => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.nome} x {item.quantidade}</span>
                                    <span>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}</span>
                                </li>
                            ))}
                            <li className="text-xl font-bold text-orange-600 pt-2 border-t mt-2">
                                <span className="font-extrabold">Total Final:</span> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderData.totalFinal)}
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Lado Direito: Informações da Retirada e Botões de Ação */}
                <div className="lg:w-1/2 flex flex-col gap-6">
                    {/* Detalhes da Retirada */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex-grow">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3 border-gray-200">
                            Detalhes da Retirada <CheckCircle size={24} className="inline-block ml-2 text-orange-600"/>
                        </h2>
                        <div className="text-lg text-gray-700 space-y-2">
                            <p><span className="font-semibold">Tipo:</span> Retirada no Balcão</p>
                            <p><span className="font-semibold">Nome para Retirada:</span> {orderData.pickupName}</p>
                            <p><span className="font-semibold">Telefone de Contato:</span> {orderData.pickupPhone}</p>
                            <p><span className="font-semibold">Endereço de Retirada:</span> Rua do Ouvidor, 666 - Campinas/SP</p>
                            <p className="mt-4 text-green-600 font-semibold">Aguarde a confirmação de que seu pedido está pronto!</p>
                        </div>
                    </div>

                    {/* Botão para receber o código de retirada */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={handleReceiveCode}
                            disabled={!isReceiveCodeButtonEnabled}
                            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg 
                                       hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 
                                       cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Receber Código de Retirada
                        </button>
                    </div>

                    {/* Botão de Confirmar Retirada */}
                    <div className="flex flex-col md:flex-row justify-center gap-4 mt-auto"> 
                        <button
                            onClick={handleConfirmPickup}
                            disabled={!isConfirmPickupButtonEnabled} 
                            className="flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md 
                                       bg-green-600 text-white hover:bg-green-700 
                                       transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirmar Retirada
                        </button>
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
            {/* MessageBox para o código de retirada */}
            {showCodeSentMessage && (
                <MessageBox
                    message={`O código de retirada para o pedido #${orderId || 'N/A'} foi enviado para o celular cadastrado (${orderData?.pickupPhone}). Código: ${pickupCode}`}
                    onClose={() => setShowCodeSentMessage(false)}
                />
            )}
        </div>
    );
};

export default PickupConfirmation;

// src/carrinho/DeliveryVisualization.tsx
import React from 'react';

// Props para o componente DeliveryVisualization
interface DeliveryVisualizationProps {
    origin: string; 
    destination: string; 
    distance: string; 
    duration: string; 
}

const DeliveryVisualization: React.FC<DeliveryVisualizationProps> = ({ origin, destination, distance, duration }) => {
    return (
        <div className="mt-8 p-6 bg-gray-50 rounded-xl shadow-lg border border-gray-200 text-gray-800">
            <h3 className="text-xl font-bold text-center mb-4">Simulação de Entrega</h3>
            <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-full text-center">
                    <p className="text-lg font-semibold mb-2">Rota Estimada:</p>
                    <p className="text-sm">De: **{origin}**</p>
                    <p className="text-sm">Para: **{destination}**</p>
                </div>
                <div className="flex items-center justify-center space-x-4 w-full">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl" role="img" aria-label="Casa">🏠</span>
                        <p className="text-xs mt-1">Loja</p>
                    </div>
                    <div className="flex-grow h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl" role="img" aria-label="Caminhão de entrega">🚚</span>
                        <p className="text-xs mt-1">A Caminho</p>
                    </div>
                    <div className="flex-grow h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl" role="img" aria-label="Local de destino">📍</span>
                        <p className="text-xs mt-1">Destino</p>
                    </div>
                </div>
                <div className="w-full text-center mt-4">
                    <p className="text-lg font-semibold">Tempo Estimado: <span className="text-orange-600">{duration || 'Calculando...'}</span></p>
                    <p className="text-lg font-semibold">Distância: <span className="text-orange-600">{distance || 'Calculando...'}</span></p>
                </div>
            </div>
        </div>
    );
};

export default DeliveryVisualization;
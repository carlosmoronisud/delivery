// src/components/filtros/FiltroModal.tsx
import React from 'react';
import { X } from "@phosphor-icons/react";

interface FiltroModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; 
}

const FiltroModal: React.FC<FiltroModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-end items-center md:hidden">
            {/* Conteúdo do Modal (Painel Lateral) */}
            <div className="bg-white w-full max-w-sm h-full overflow-y-auto transform translate-x-0 transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Filtros</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Fechar filtros"
                    >
                        <X size={28} weight="bold" />
                    </button>
                </div>
                <div className="flex flex-col gap-8 p-6 text-gray-800">
                    {children} 
                </div>
                <div className="p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Aplicar Filtros
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FiltroModal;
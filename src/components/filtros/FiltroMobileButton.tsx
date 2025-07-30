// src/components/filtros/FiltroMobileButton.tsx
import React from 'react';
import { FunnelSimple } from "@phosphor-icons/react";

interface FiltroMobileButtonProps {
    onClick: () => void;
}

const FiltroMobileButton: React.FC<FiltroMobileButtonProps> = ({ onClick }) => {
    return (
        <div className="md:hidden fixed bottom-6 right-6 z-40">
            <button
                onClick={onClick}
                className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors duration-200"
                aria-label="Abrir filtros"
            >
                <FunnelSimple size={28} weight="bold" />
            </button>
        </div>
    );
};

export default FiltroMobileButton;
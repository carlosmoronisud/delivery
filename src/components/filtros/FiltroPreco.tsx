// src/components/filtros/FiltroPreco.tsx
import React from 'react';

interface FiltroPrecoProps {
    precoMin: string;
    precoMax: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FiltroPreco: React.FC<FiltroPrecoProps> = ({ precoMin, precoMax, onChange }) => {
    return (
        <div className="flex flex-col gap-3">
            <label htmlFor="precoMin" className="text-xl font-semibold">Preço (R$)</label>
            <div className="flex gap-4">
                <input
                    id="precoMin"
                    name="precoMin"
                    type="number"
                    onChange={onChange}
                    value={precoMin}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Mínimo"
                    step="0.01"
                />
                <input
                    id="precoMax"
                    name="precoMax"
                    type="number"
                    onChange={onChange}
                    value={precoMax}
                    className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Máximo"
                    step="0.01"
                />
            </div>
        </div>
    );
};

export default FiltroPreco;
// src/components/filtros/FiltroIngredientes.tsx
import React from 'react';

interface FiltroIngredientesProps {
    selectedIngrediente: string;
    excludeIngrediente: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    onToggleExclude: () => void; 
}

const FiltroIngredientes: React.FC<FiltroIngredientesProps> = ({
    selectedIngrediente,
    excludeIngrediente,
    onChange,
    onToggleExclude
}) => {
    return (
        <div className="flex flex-col gap-3">
            <label htmlFor="ingrediente" className="text-xl font-semibold">Ingredientes</label>
            <div className="flex flex-col sm:flex-row gap-2 items-center mb-2"> 
                <input
                    id="ingrediente"
                    name="ingrediente"
                    type="text"
                    onChange={onChange}
                    value={selectedIngrediente}
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 w-full sm:w-auto"
                    placeholder="Ex: alho, tomate..."
                />
                <button
                    type="button"
                    onClick={onToggleExclude}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto
                            ${excludeIngrediente ? "bg-red-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    title={excludeIngrediente ? "Excluindo produtos com este ingrediente" : "Incluindo produtos com este ingrediente"}
                >
                    {excludeIngrediente ? "EXCLUIR" : "INCLUIR"}
                </button>

            </div>
            <p className="text-xs text-gray-500 -mt-1">
                Use o botão ao lado para buscar produtos que contêm ou <strong>não </strong>contêm o ingrediente.
            </p>
        </div>
    );
};

export default FiltroIngredientes;
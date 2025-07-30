import React from 'react';
import { useSearchParams } from 'react-router-dom'; // Importar useSearchParams

interface FiltroIngredientesProps {
    selectedIngrediente: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    onApplyFilter: (include: boolean) => void; // Nova prop para aplicar o filtro
}

const FiltroIngredientes: React.FC<FiltroIngredientesProps> = ({
    selectedIngrediente,
    onChange,
    onApplyFilter 
}) => {
    const [params] = useSearchParams(); // Obter os parâmetros da URL
    const currentIngredienteParam = params.get("ingrediente") || "";
    const currentExcludeParam = params.get("excluirIngrediente") === 'true';

    // Verifica se o filtro de INCLUIR está ativo para o ingrediente atual
    const isIncludeActive = 
        currentIngredienteParam.toLowerCase() === selectedIngrediente.toLowerCase() && 
        !currentExcludeParam && 
        selectedIngrediente.trim() !== '';

    // Verifica se o filtro de EXCLUIR está ativo para o ingrediente atual
    const isExcludeActive = 
        currentIngredienteParam.toLowerCase() === selectedIngrediente.toLowerCase() && 
        currentExcludeParam && 
        selectedIngrediente.trim() !== '';

    return (
        <div className="flex flex-col gap-3">
            <label htmlFor="ingrediente" className="text-xl font-semibold">Ingredientes</label>
            <div className="flex flex-col gap-2 items-center mb-2"> 
                <input
                    id="ingrediente"
                    name="ingrediente"
                    type="text"
                    onChange={onChange}
                    value={selectedIngrediente}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                    placeholder="Ex: alho, tomate..."
                />
                <div className="flex w-full gap-2">
                    <button
                        type="button"
                        onClick={() => onApplyFilter(true)} // Botão INCLUIR
                        className={`w-1/2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md
                                    ${isIncludeActive 
                                        ? "bg-green-500 text-white" 
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
                                    ${selectedIngrediente.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                        title="Incluir produtos que contêm este ingrediente"
                        disabled={selectedIngrediente.trim() === ''}
                    >
                        INCLUIR
                    </button>
                    <button
                        type="button"
                        onClick={() => onApplyFilter(false)} // Botão EXCLUIR
                        className={`w-1/2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-md
                                    ${isExcludeActive 
                                        ? "bg-red-500 text-white" 
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }
                                    ${selectedIngrediente.trim() === '' ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                        title="Excluir produtos que contêm este ingrediente"
                        disabled={selectedIngrediente.trim() === ''}
                    >
                        EXCLUIR
                    </button>
                </div>
            </div>
            <p className="text-xs text-gray-500 -mt-1">
                Insira um ingrediente e clique em INCLUIR ou EXCLUIR para filtrar os produtos.
            </p>
        </div>
    );
};

export default FiltroIngredientes;

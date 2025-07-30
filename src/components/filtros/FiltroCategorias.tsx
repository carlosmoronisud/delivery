// src/components/filtros/FiltroCategorias.tsx
import React from 'react';
import type Categoria from '../../models/Categoria'; 

interface RestricaoAlimentar {
    id: string;
    nome: string;
    icone?: React.ReactNode;
}

interface FiltroCategoriasProps {
    categorias: Categoria[];
    selectedCategoria: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onSelectRestricao: (restricaoId: string) => void;
}

const restricoesAlimentares: RestricaoAlimentar[] = [
    { id: "8", nome: "Vegana" },
    { id: "15", nome: "Sem Glúten" },
    { id: "13", nome: "Vegetariano" },
    { id: "11", nome: "Sem Lactose" },
];

const FiltroCategorias: React.FC<FiltroCategoriasProps> = ({
    categorias,
    selectedCategoria,
    onChange,
    onSelectRestricao
}) => {
    return (
        <>
            {/* Categoria */}
            <div className="flex flex-col gap-3">
                <label htmlFor="categoriaId" className="text-xl font-semibold">Categoria</label>
                <select
                    id="categoriaId"
                    name="categoriaId"
                    value={selectedCategoria}
                    onChange={onChange}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                >
                    <option value="">Todas as categorias</option>
                    {categorias.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.descricao}
                        </option>
                    ))}
                </select>
            </div>

            {/* Botões de Restrição Alimentar */}
            <div className="flex flex-col gap-3">
                <label className="text-xl font-semibold">Restrições Comuns</label>
                <div className="flex flex-wrap gap-3">
                    {restricoesAlimentares.map((restricao) => {
                        const isSelected = String(selectedCategoria) === String(restricao.id);

                        return (
                            <button
                                key={restricao.id}
                                type="button"
                                onClick={() => onSelectRestricao(restricao.id)}
                                className={`py-2 px-4 rounded-full text-base font-medium transition-all duration-200
                                            ${isSelected ? "bg-orange-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                            >
                                {restricao.nome}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default FiltroCategorias;
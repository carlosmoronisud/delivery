// src/components/filtros/FiltroProduto.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type Categoria from "../../models/Categoria";
import { buscar } from "../../services/Service";

// Importando os novos componentes de filtro
import FiltroPreco from "./FiltroPreco";
import FiltroIngredientes from "./FiltroIngredientes";
import FiltroCategorias from "./FiltroCategorias";
import FiltroNutriScore from "./FiltroNutriScore";
import FiltroMobileButton from "./FiltroMobileButton";
import FiltroModal from "./FiltroModal";

export default function FiltroProduto() {
    const [params, setParams] = useSearchParams();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    //  parâmetros de URL
    const selectedPrecoMin = params.get("precoMin") || "";
    const selectedPrecoMax = params.get("precoMax") || "";
    const selectedIngrediente = params.get("ingrediente") || "";
    const excludeIngrediente = params.get("excluirIngrediente") === 'true';
    const selectedNutriScore = params.get("nutriScore");
    const selectedCategoria = params.get("categoriaId") || "";

    // Função de handler genérica para inputs (Preço, Ingrediente, Palavra-Chave, Categoria via select)
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newParams = new URLSearchParams(params);

        if (value === "") {
            newParams.delete(name);
        } else {
            newParams.set(name, value);
        }
        setParams(newParams);
    }, [params, setParams]);

    // Handler para NutriScore (toggle)
    const handleNutriScore = useCallback((value: string) => {
        const newParams = new URLSearchParams(params);
        if (newParams.get("nutriScore") === value) {
            newParams.delete("nutriScore");
        } else {
            newParams.set("nutriScore", value);
        }
        setParams(newParams);
    }, [params, setParams]);

    // Handler para o toggle de exclusão de ingrediente
    const handleToggleExcludeIngrediente = useCallback(() => {
        const newParams = new URLSearchParams(params);
        if (excludeIngrediente) {
            newParams.delete("excluirIngrediente");
        } else {
            newParams.set("excluirIngrediente", "true");
        }
        setParams(newParams);
    }, [params, setParams, excludeIngrediente]);

    // Handler para as Restrições Alimentares (que atuam como categorias)
    const handleRestricaoAsCategory = useCallback((restricaoId: string) => {
        const newParams = new URLSearchParams(params);
        if (String(selectedCategoria) === String(restricaoId)) {
            newParams.delete("categoriaId");
        } else {
            newParams.set("categoriaId", restricaoId);
        }
        setParams(newParams);
    }, [params, selectedCategoria, setParams]);


    // Efeito para buscar as categorias
    useEffect(() => {
        async function fetchCategorias() {
            try {
                await buscar("/categorias", (data: any) => {
                    if (Array.isArray(data)) {
                        setCategorias(data);
                    } else if (data && typeof data === 'object' && Array.isArray(data.content)) {
                        setCategorias(data.content);
                    } else {
                        console.error("Formato inesperado da resposta de categorias:", data);
                        setCategorias([]);
                    }
                });
            } catch (err: any) {
                console.error("Erro ao buscar categorias:", err);
                setCategorias([]);
            }
        }
        fetchCategorias();
    }, []);

    // Conteúdo comum dos filtros (será usado tanto no desktop quanto no modal mobile)
    const filtersContent = (
        <>
            {/* <FiltroPalavraChave // NOVO: Renderiza o filtro de palavra-chave
                selectedValue={selectedPalavraChave}
                onChange={handleChange}
            /> */}

            <FiltroPreco
                precoMin={selectedPrecoMin}
                precoMax={selectedPrecoMax}
                onChange={handleChange}
            />

            <FiltroIngredientes
                selectedIngrediente={selectedIngrediente}
                excludeIngrediente={excludeIngrediente}
                onChange={handleChange}
                onToggleExclude={handleToggleExcludeIngrediente}
            />

            <FiltroCategorias
                categorias={categorias}
                selectedCategoria={selectedCategoria}
                onChange={handleChange}
                onSelectRestricao={handleRestricaoAsCategory}
            />

            <FiltroNutriScore
                selectedNutriScore={selectedNutriScore}
                onSelect={handleNutriScore}
            />
        </>
    );

    return (
        <>
            {/* Botão de Filtro para Mobile */}
            <FiltroMobileButton onClick={() => setIsMobileFilterOpen(true)} />

            {/* Filtros para Desktop */}
            <div className="hidden md:block w-full max-w-xs">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 font-sans text-gray-800">
                    <h2 className="text-3xl font-bold border-b pb-4 border-gray-200 p-6">
                        Filtros Rápidos ✨
                    </h2>
                    <div className="p-6 flex flex-col gap-8"> {/* Adicionado p-6 e gap-8 para espaçamento */}
                        {filtersContent}
                    </div>
                </div>
            </div>

            {/* Modal de Filtros para Mobile */}
            <FiltroModal
                isOpen={isMobileFilterOpen}
                onClose={() => setIsMobileFilterOpen(false)}
            >
                {filtersContent}
            </FiltroModal>
        </>
    );
}
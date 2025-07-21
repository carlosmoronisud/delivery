/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import type Categoria from "../../models/Categoria";
import { buscar } from "../../services/Service";
import { FunnelSimple, X } from "@phosphor-icons/react";

interface RestricaoAlimentar {
  id: string; 
  nome: string;
  icone?: React.ReactNode;
}

export default function FiltroProduto() {
  const [params, setParams] = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 

  const selectedPrecoMin = params.get("precoMin") || "";
  const selectedPrecoMax = params.get("precoMax") || "";
  const selectedIngrediente = params.get("ingrediente") || "";
  const excludeIngrediente = params.get("excluirIngrediente") === 'true';
  const selectedNutriScore = params.get("nutriScore");
  const selectedCategoria = params.get("categoriaId") || "";

  const restricoesAlimentares: RestricaoAlimentar[] = [
    { id: "8", nome: "Vegana" }, 
    { id: "15", nome: "Sem Glúten" }, 
    { id: "13", nome: "Vegetariano" }, 
    { id: "11", nome: "Sem Lactose" }, 
  ];

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

  const handleNutriScore = useCallback((value: string) => {
    const newParams = new URLSearchParams(params);
    if (newParams.get("nutriScore") === value) {
      newParams.delete("nutriScore");
    } else {
      newParams.set("nutriScore", value);
    }
    setParams(newParams);
  }, [params, setParams]);

  const handleToggleExcludeIngrediente = useCallback(() => {
    const newParams = new URLSearchParams(params);
    if (excludeIngrediente) {
        newParams.delete("excluirIngrediente");
    } else {
        newParams.set("excluirIngrediente", "true");
    }
    setParams(newParams);
  }, [params, setParams, excludeIngrediente]);

  const handleRestricaoAsCategory = useCallback((restricaoId: string) => {
    const newParams = new URLSearchParams(params);
    if (String(selectedCategoria) === String(restricaoId)) { // Compara como string
      newParams.delete("categoriaId");
    } else {
      newParams.set("categoriaId", restricaoId);
    }
    setParams(newParams);
  }, [params, selectedCategoria, setParams]);


  useEffect(() => {
    async function fetchCategorias() {
      try {
        await buscar("/categorias", (data: any) => { // Callback para setDados
            // Verificação robusta para garantir que 'data' é um array ou tem uma propriedade 'content' que é um array
            if (Array.isArray(data)) {
                setCategorias(data);
            } else if (data && typeof data === 'object' && Array.isArray(data.content)) { 
                setCategorias(data.content);
            } else {
                console.error("Formato inesperado da resposta de categorias:", data);
                setCategorias([]); // Garante que é um array vazio
            }
        });
      } catch (err: any) { // Captura o erro para log
        console.error("Erro ao buscar categorias:", err);
        setCategorias([]); 
      }
    }
    fetchCategorias();
  }, []); // A dependência 'buscar' não é mais necessária se 'buscar' não mudar

  const filtersContent = (
    <div className="flex flex-col gap-8 p-6 text-gray-800">
      <h2 className="text-3xl font-bold border-b pb-4 border-gray-200">
        Filtros Rápidos ✨
      </h2>

      {/* Preço */}
      <div className="flex flex-col gap-3">
        <label htmlFor="precoMin" className="text-xl font-semibold">Preço (R$)</label>
        <div className="flex gap-4">
          <input
            id="precoMin"
            name="precoMin"
            type="number"
            onChange={handleChange}
            value={selectedPrecoMin}
            className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Mínimo"
            step="0.01"
          />
          <input
            id="precoMax"
            name="precoMax"
            type="number"
            onChange={handleChange}
            value={selectedPrecoMax}
            className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Máximo"
            step="0.01"
          />
        </div>
      </div>

      {/* Ingredientes com Toggle de Exclusão */}
      <div className="flex flex-col gap-3">
        <label htmlFor="ingrediente" className="text-xl font-semibold">Ingredientes</label>
        <div className="flex gap-2 items-center mb-2">
            <input
                id="ingrediente"
                name="ingrediente"
                type="text"
                onChange={handleChange}
                value={selectedIngrediente}
                className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                placeholder="Ex: alho, tomate..."
            />
            <button
                type="button"
                onClick={handleToggleExcludeIngrediente}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                            ${excludeIngrediente ? "bg-red-500 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                title={excludeIngrediente ? "Excluindo produtos com este ingrediente" : "Incluindo produtos com este ingrediente"}
            >
                {excludeIngrediente ? "EXCLUIR" : "INCLUIR"}
            </button>
        </div>
        <p className="text-xs text-gray-500 -mt-1">
            Use o botão ao lado para buscar produtos que contêm ou **não** contêm o ingrediente.
        </p>
      </div>

      {/* Categoria */}
      <div className="flex flex-col gap-3">
        <label htmlFor="categoriaId" className="text-xl font-semibold">Categoria</label>
        <select
          id="categoriaId"
          name="categoriaId"
          value={selectedCategoria}
          onChange={handleChange}
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

      {/* NutriScore */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-semibold">NutriScore</label>
        <div className="flex flex-wrap gap-3 justify-center">
          {["A", "B", "C", "D", "E"].map((score) => {
            const isSelected = selectedNutriScore?.toUpperCase() === score;

            const defaultColors = {
              A: "bg-green-100 text-green-700 hover:bg-green-200",
              B: "bg-lime-100 text-lime-700 hover:bg-lime-200",
              C: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
              D: "bg-orange-100 text-orange-700 hover:bg-orange-200",
              E: "bg-red-100 text-red-700 hover:bg-red-200",
            };

            const selectedColors = {
              A: "bg-green-500 text-white shadow-md",
              B: "bg-lime-500 text-white shadow-md",
              C: "bg-yellow-500 text-white shadow-md",
              D: "bg-orange-500 text-white shadow-md",
              E: "bg-red-500 text-white shadow-md",
            };

            const baseStyle = "w-12 h-12 rounded-full flex justify-center items-center text-lg font-bold transition-all duration-200 transform hover:scale-105 cursor-pointer";

            return (
              <button
                key={score}
                type="button"
                onClick={() => handleNutriScore(score)}
                className={`${baseStyle} ${isSelected ? selectedColors[score as keyof typeof selectedColors] : defaultColors[score as keyof typeof defaultColors]}`}
              >
                {score}
              </button>
            );
          })}
        </div>
      </div>

      {/* Botões de Restrição Alimentar (agora agem como seleção de categoria) */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-semibold">Restrições Comuns</label>
        <div className="flex flex-wrap gap-3">
          {restricoesAlimentares.map((restricao) => {
            const isSelected = String(selectedCategoria) === String(restricao.id); 

            return (
              <button
                key={restricao.id}
                type="button"
                onClick={() => handleRestricaoAsCategory(restricao.id)}
                className={`py-2 px-4 rounded-full text-base font-medium transition-all duration-200 
                            ${isSelected ? "bg-orange-600 text-white shadow-md" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              >
                {restricao.nome}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão de Filtro para Mobile (aparece apenas em telas pequenas) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button 
          onClick={() => setIsMobileFilterOpen(true)}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition-colors duration-200"
          aria-label="Abrir filtros"
        >
          <FunnelSimple size={28} weight="bold" />
        </button>
      </div>

      {/* Filtros para Desktop (sempre visíveis em telas maiores) */}
      <div className="hidden md:block w-full max-w-xs">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 font-sans text-gray-800">
            {filtersContent}
        </div>
      </div>

      {/* Modal de Filtros para Mobile (exibido condicionalmente) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-end items-center md:hidden">
          {/* Conteúdo do Modal (Painel Lateral) */}
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto transform translate-x-0 transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Filtros</h2>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Fechar filtros"
              >
                <X size={28} weight="bold" />
              </button>
            </div>
            {filtersContent} {/* Reutiliza o conteúdo dos filtros */}
            <div className="p-6 border-t border-gray-200">
                <button 
                    onClick={() => setIsMobileFilterOpen(false)} 
                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700 transition-colors"
                >
                    Aplicar Filtros
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
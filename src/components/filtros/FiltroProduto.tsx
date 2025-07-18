/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type Categoria from "../../models/Categoria";
import { buscar } from "../../services/Service"; // ou seu método para buscar categorias

export default function FiltroProduto() {
  const [params, setParams] = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  // Captura os valores dos filtros da URL para controlar os inputs
  const selectedPrecoMin = params.get("precoMin") || "";
  const selectedPrecoMax = params.get("precoMax") || "";
  const selectedIngrediente = params.get("ingrediente") || "";
  const selectedNutriScore = params.get("nutriScore"); // Mantido como string, pode ser null
  const selectedCategoria = params.get("categoriaId") || "";

  // Handler genérico para inputs de texto e select
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(params); // Cria uma nova instância de URLSearchParams

    if (value === "") {
      newParams.delete(name); // Remove o parâmetro se o valor estiver vazio
    } else {
      newParams.set(name, value); // Define ou atualiza o parâmetro
    }
    setParams(newParams); // Atualiza a URL
  }

  // Handler específico para os botões do NutriScore
  function handleNutriScore(value: string) {
    const newParams = new URLSearchParams(params); // Cria uma nova instância de URLSearchParams
    if (newParams.get("nutriScore") === value) {
      newParams.delete("nutriScore"); // Desseleciona se já estiver selecionado
    } else {
      newParams.set("nutriScore", value); // Seleciona o novo NutriScore
    }
    setParams(newParams); // Atualiza a URL
  }

  // Efeito para buscar as categorias ao montar o componente
  useEffect(() => {
    async function fetchCategorias() {
      try {
        await buscar("/categorias", setCategorias);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
        // ToastAlerta("Não foi possível carregar as categorias.", "erro"); // Opcional: mostrar alerta
      }
    }
    fetchCategorias();
  }, []); // Array de dependências vazio para rodar apenas uma vez ao montar

  return (
    <div className="flex flex-col gap-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 font-sans text-gray-800"> {/* Ajustes do container principal */}
      <h2 className="text-3xl font-bold border-b pb-4 border-gray-200">
        Filtros Rápidos ✨
      </h2>

      {/* Preço */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-semibold">Preço (R$)</label>
        <div className="flex gap-4">
          <input
            name="precoMin"
            type="number"
            onChange={handleChange}
            value={selectedPrecoMin} // Controla o input com o estado da URL
            className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Mínimo"
            step="0.01" // Permite decimais
          />
          <input
            name="precoMax"
            type="number"
            onChange={handleChange}
            value={selectedPrecoMax} // Controla o input com o estado da URL
            className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="Máximo"
            step="0.01" // Permite decimais
          />
        </div>
      </div>

      {/* Ingredientes */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-semibold">Ingredientes</label>
        <input
          name="ingrediente"
          type="text"
          onChange={handleChange}
          value={selectedIngrediente} // Controla o input com o estado da URL
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
          placeholder="Ex: alho, tomate, queijo..."
        />
      </div>

      {/* Categoria */}
      <div className="flex flex-col gap-3">
        <label className="text-xl font-semibold">Categoria</label>
        <select
          name="categoriaId"
          value={selectedCategoria} // Controla o select com o estado da URL
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
        <div className="flex flex-wrap gap-3 justify-center"> {/* flex-wrap para responsividade em mobile */}
          {["A", "B", "C", "D", "E"].map((score) => {
            const isSelected = selectedNutriScore?.toUpperCase() === score; // Comparação case-insensitive

            const defaultColors = {
              A: "bg-green-100 text-green-700 hover:bg-green-200", // Mais suave
              B: "bg-lime-100 text-lime-700 hover:bg-lime-200",   // Mais suave
              C: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200", // Mais suave
              D: "bg-orange-100 text-orange-700 hover:bg-orange-200", // Mais suave
              E: "bg-red-100 text-red-700 hover:bg-red-200",     // Mais suave
            };

            const selectedColors = {
              A: "bg-green-500 text-white shadow-md", // Mais forte quando selecionado
              B: "bg-lime-500 text-white shadow-md",
              C: "bg-yellow-500 text-white shadow-md",
              D: "bg-orange-500 text-white shadow-md",
              E: "bg-red-500 text-white shadow-md",
            };

            const baseStyle = "w-12 h-12 rounded-full flex justify-center items-center text-lg font-bold transition-all duration-200 transform hover:scale-105 cursor-pointer"; // Ajustei tamanho e adicionei scale

            return (
              <button
                key={score}
                type="button" // Importante: type="button" para não submeter o formulário
                onClick={() => handleNutriScore(score)}
                className={`${baseStyle} ${isSelected ? selectedColors[score as keyof typeof selectedColors] : defaultColors[score as keyof typeof defaultColors]}`}
              >
                {score}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
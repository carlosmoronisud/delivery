/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type Categoria from "../../models/Categoria";
import { buscar } from "../../services/Service"; // ou seu método para buscar categorias

export default function FiltroProduto() {
  const [params, setParams] = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const selectedNutriScore = params.get("nutriScore");
  const selectedCategoria = params.get("categoriaId") || "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (value === "") {
      params.delete(name);
    } else {
      params.set(name, value);
    }

    setParams(params);
  }

  function handleNutriScore(value: string) {
    if (params.get("nutriScore") === value) {
      params.delete("nutriScore");
    } else {
      params.set("nutriScore", value);
    }
    setParams(params);
  }

  useEffect(() => {
    async function buscarCategorias() {
      try {
        await buscar("/categorias", setCategorias);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    }
    buscarCategorias();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-2xl shadow-md font-poppins text-neutral-800">
      <h2 className="text-4xl font-semibold">Filtros</h2>

      {/* Preço */}
      <div className="flex flex-col gap-2">
        <label className="text-2xl">Preço</label>
        <div className="flex gap-4">
          <input
            name="precoMin"
            type="number"
            onChange={handleChange}
            className="w-full p-2 text-lg border rounded-lg bg-red-400 text-white placeholder-white"
            placeholder="De: 0"
          />
          <input
            name="precoMax"
            type="number"
            onChange={handleChange}
            className="w-full p-2 text-lg border rounded-lg bg-indigo-600 text-white placeholder-white"
            placeholder="Até: 0"
          />
        </div>
      </div>

      {/* Ingredientes */}
      <div>
        <label className="text-2xl mb-1 block">Ingredientes</label>
        <input
          name="ingrediente"
          type="text"
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          placeholder="Ex: tomate"
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="text-2xl mb-1 block">Categoria</label>
        <select
          name="categoriaId"
          value={selectedCategoria}
          onChange={handleChange}
          className="w-full p-2 border-2 border-orange-400 rounded-lg"
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
      {/* NutriScore */}
<div className="flex flex-col gap-2">
  <label className="text-2xl">NutriScore</label>
  <div className="flex gap-4">
    {["A", "B", "C", "D", "E"].map((score) => {
      const isSelected = selectedNutriScore === score;

      const defaultColors = {
        A: "bg-green-200 hover:bg-green-700 text-green-900",
        B: "bg-amber-200 hover:bg-amber-500 text-amber-900",
        C: "bg-yellow-200 hover:bg-yellow-600 text-yellow-900",
        D: "bg-red-200 hover:bg-red-500 text-red-900",
        E: "bg-red-300 hover:bg-red-800 text-red-900",
      };

      const selectedColors = {
        A: "bg-green-700 text-white",
        B: "bg-amber-500 text-white",
        C: "bg-yellow-600 text-white",
        D: "bg-red-500 text-white",
        E: "bg-red-800 text-white",
      };

      const baseStyle = "w-14 h-14 rounded-full flex justify-center items-center text-xl font-bold transition-colors duration-200";

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
    </div>
  );
}
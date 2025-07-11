// src/components/cards/CardProduto.tsx
import { ShoppingCart } from "lucide-react";

type CardProdutoCarrosselProps = {
  imagem: string;
  titulo: string;
  preco: string;
  nutriscore?: string;
};

const corNutriScore = (nota: string) => {
  switch (nota.toUpperCase()) {
    case "A": return "text-green-600";
    case "B": return "text-lime-600";
    case "C": return "text-yellow-500";
    case "D": return "text-orange-500";
    case "E": return "text-red-600";
    default: return "text-gray-500";
  }
};

export default function CardProdutoCarrossel({
  imagem,
  titulo,
  preco,
  nutriscore = "D",
}: CardProdutoCarrosselProps) {
  return (
    <div className="bg-white shadow-md rounded-xl w-[240px] h-[330px] flex flex-col justify-between p-4 hover:scale-105 transition duration-300">
      <img
        src={imagem}
        alt={titulo}
        className="w-full h-[150px] object-cover rounded-lg"
      />

      <div className="mt-3">
        <h3 className="text-base font-semibold text-zinc-700 truncate">{titulo}</h3>
        <p className="text-sm text-zinc-500 font-medium">{preco}</p>
      </div>

      <div className="flex items-center justify-between mt-4">
        <span
          className={`text-xl font-bold font-mono ${corNutriScore(nutriscore)}`}
        >
          {nutriscore.toUpperCase()}
        </span>

        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-full p-2 shadow-md transition duration-200"
          title="Adicionar ao carrinho"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

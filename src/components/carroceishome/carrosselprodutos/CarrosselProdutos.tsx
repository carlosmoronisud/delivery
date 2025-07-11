// src/components/carroceishome/carrosselprodutos/CarrosselProdutos.tsx
import { useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

import { buscar } from "../../../services/Service";
import CardProdutoCarrossel from "../cardprodutocarrossel/CardProdutoCarrssel";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
  nutriScore: string;
}

export default function CarrosselProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" });

  async function carregarProdutos() {
      await buscar("/produtos", setProdutos);
    
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div className="overflow-hidden w-full max-w-screen-xl mx-auto" ref={emblaRef}>
      <div className="flex gap-4 px-4">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="flex-[0_0_80%] sm:flex-[0_0_50%] md:flex-[0_0_33%] lg:flex-[0_0_25%]"
          >
            <CardProdutoCarrossel
              imagem={produto.imagem}
              titulo={produto.nome}
              preco={`R$ ${produto.preco.toFixed(2)}`}
              nutriscore={produto.nutriScore}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// src/components/carroceishome/carrocelmedio/CarrosselMedio.tsx
import { useEffect, useState} from "react";
import useEmblaCarousel from "embla-carousel-react";

import { buscar } from "../../../services/Service";

interface Produto {
  id: number;
  imagem: string;
}

export default function CarrosselMedio() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "center" });

  async function carregarProdutos() {
  
      await buscar("/produtos", setProdutos);
    
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  return (
    <div
      className="overflow-hidden w-full max-w-4xl h-[400px] lg:h-[500px] mx-auto rounded-xl"
      ref={emblaRef}
    >
      <div className="flex">
        {produtos
          .filter((p) => p.imagem)
          .map((produto) => (
            <div
              key={produto.id}
              className="flex-[0_0_100%] px-2 flex items-center justify-center"
            >
              <img
                src={produto.imagem}
                alt={`Produto ${produto.id}`}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

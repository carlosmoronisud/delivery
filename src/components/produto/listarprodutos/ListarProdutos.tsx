import { ToastAlerta } from "../../../utils/ToastAlerta";
import foodCarouselAnimation from '../../../assets/lottie-animations/FoodCarousel.json';
import CardProduto from "../cardproduto/CardProduto";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import type Produto from "../../../models/Produto"; 
import type Categoria from "../../../models/Categoria";
import { buscarProdutos } from "../../../services/ProdutoService";
import Lottie from "lottie-react";

function ListarProdutos() {
  const [searchParams] = useSearchParams();

  const filtros = {
    precoMin: searchParams.get("precoMin") || "",
    precoMax: searchParams.get("precoMax") || "",
    nutriScore: searchParams.get("nutriScore") || "",
    categoriaId: searchParams.get("categoriaId") || "",
    ingrediente: searchParams.get("ingrediente") || "",
    excluirIngrediente: searchParams.get("excluirIngrediente") === 'true', 
  };

  const {
    data: produtos = [],
    isLoading,
    error,
  } = useQuery<Produto[]>({
    queryKey: ["produtos", filtros],
    queryFn: async () => {
      const data = await buscarProdutos(); 

      // Lógica de filtro aplicada no lado do cliente
      return data.filter((produto) => {
        const preco = parseFloat(produto.preco?.toString() || '0'); 
        const precoMin = parseFloat(filtros.precoMin) || 0;
        const precoMax = parseFloat(filtros.precoMax) || Infinity;
        const matchPreco = preco >= precoMin && preco <= precoMax;
        
        // NutriScore filter
        const matchNutri =
          !filtros.nutriScore || (produto.nutriScore?.toUpperCase() === filtros.nutriScore.toUpperCase());

        // Category filter: Ensure produto.categoria is an object before accessing its id
        const matchCategoria =
          !filtros.categoriaId ||
          (typeof produto.id_categoria === "object" && produto.id_categoria !== null && 
           (produto.id_categoria as Categoria).id?.toString() === filtros.categoriaId); 
        
        // Lógica do filtro de ingrediente
        let matchIngrediente = true; 
        if (filtros.ingrediente) {           
          const produtoContemIngrediente = produto.ingrediente
            ?.toLowerCase()
            .includes(filtros.ingrediente.toLowerCase()) || false; 

          if (filtros.excluirIngrediente) {
            
            matchIngrediente = !produtoContemIngrediente;
          } else {
            
            matchIngrediente = produtoContemIngrediente;
          }
        }

        return matchPreco && matchNutri && matchCategoria && matchIngrediente;
      });
    },
    
    staleTime: 5 * 60 * 1000, 
  });

  if (error) {
    ToastAlerta("Erro ao carregar produtos. Tente novamente mais tarde.", "erro"); 
    console.error("Erro na consulta de produtos:", error); 
    return null; 
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 w-full"> 
        <Lottie 
          animationData={foodCarouselAnimation} 
          loop={true} 
          autoplay={true} 
          className="h-100"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full py-8 px-4"> 
      <div className="container mx-auto">
        {produtos.length === 0 ? (
          <div className="text-center my-12 p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <p className="text-3xl font-semibold text-gray-700 mb-4">
              Ops! 😟 Nenhum produto encontrado.
            </p>
            <p className="text-xl text-gray-500">
              Verifique os filtros ou tente buscar por algo diferente.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 p-4 md:p-0">
            {produtos.map((produto) =>
                produto?.id ? (
                <CardProduto key={produto.id} produto={produto} />
              ) : null
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListarProdutos;

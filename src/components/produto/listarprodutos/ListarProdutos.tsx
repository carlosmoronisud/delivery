import { ToastAlerta } from "../../../utils/ToastAlerta";
import { DNA } from "react-loader-spinner";
import CardProduto from "../cardproduto/CardProduto";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import type Produto from "../../../models/Produto"; 
import type Categoria from "../../../models/Categoria";
import { buscarProdutos } from "../../../services/ProdutoService";

function ListarProdutos() {
  const [searchParams] = useSearchParams();

  const filtros = {
    precoMin: searchParams.get("precoMin") || "",
    precoMax: searchParams.get("precoMax") || "",
    nutriScore: searchParams.get("nutriScore") || "",
    categoriaId: searchParams.get("categoriaId") || "",
    ingrediente: searchParams.get("ingrediente") || "",
  };

  const {
    data: produtos = [],
    isLoading,
    error,
  } = useQuery<Produto[]>({
    queryKey: ["produtos", filtros],
    queryFn: async () => {
      const data = await buscarProdutos();

      // Filter logic applied on the client-side
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
          (typeof produto.id_categoria === "object" && produto.id_categoria !== null && // Check for object and not null
           (produto.id_categoria as Categoria).id?.toString() === filtros.categoriaId); // Type assertion for safety
        
        // Ingredient filter
        const matchIngrediente =
          !filtros.ingrediente ||
          produto.ingrediente
            ?.toLowerCase()
            .includes(filtros.ingrediente.toLowerCase());

        return matchPreco && matchNutri && matchCategoria && matchIngrediente;
      });
    },
    
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (error) {
    ToastAlerta("Erro ao carregar produtos. Tente novamente mais tarde.", "erro"); 
    console.error("Erro na consulta de produtos:", error); // Log error for debugging
    return null; // Or render an error component
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 w-full"> {/* Center loader */}
        <DNA
          visible={true}
          height="120" // Consistent loader size with other components
          width="120"
          ariaLabel="Carregando produtos..."
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full py-8 px-4"> {/* Adjusted padding and centering */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 p-4 md:p-0"> {/* Responsive grid with gap */}
            {produtos.map((produto) =>
              // Render CardProduto only if product and its ID are valid
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
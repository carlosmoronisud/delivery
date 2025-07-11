import { ToastAlerta } from "../../../utils/ToastAlerta";
import { DNA } from "react-loader-spinner";
import CardProduto from "../cardproduto/CardProduto";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { buscarTodosProdutos } from "../../../services/Service";
import type Produto from "../../../models/Produto";

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
      const data = await buscarTodosProdutos();

      return data.filter((produto) => {
        const preco = parseFloat(produto.preco.toString());
        const precoMin = parseFloat(filtros.precoMin) || 0;
        const precoMax = parseFloat(filtros.precoMax) || Infinity;

        const matchPreco = preco >= precoMin && preco <= precoMax;
        const matchNutri =
          !filtros.nutriScore || produto.nutriScore === filtros.nutriScore;
        const matchCategoria =
          !filtros.categoriaId ||
          (typeof produto.categoria === "object" &&
            produto.categoria?.id?.toString() === filtros.categoriaId);
        const matchIngrediente =
          !filtros.ingrediente ||
          produto.ingrediente
            ?.toLowerCase()
            .includes(filtros.ingrediente.toLowerCase());

        return matchPreco && matchNutri && matchCategoria && matchIngrediente;
      });
    },
  });

  if (error) {
    ToastAlerta("Erro ao carregar produtos", "error");
    return null;
  }

  if (isLoading) {
    return (
      <DNA
        visible={true}
        height="200"
        width="200"
        ariaLabel="dna-loading"
        wrapperClass="dna-wrapper mx-auto"
      />
    );
  }

  return (
    <div className="flex justify-center w-full my-4">
      <div className="container flex flex-col mx-2">
        {produtos.length === 0 ? (
          <span className="text-3xl text-center my-8">
            Nenhum produto foi encontrado!
          </span>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

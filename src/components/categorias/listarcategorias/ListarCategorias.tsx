import type Categoria from "../../../models/Categoria";
import CardCategorias from "../cardcategorias/CardCategorias";
import { buscar } from "../../../services/Service";
import { DNA } from "react-loader-spinner";
import { useEffect, useState } from "react";

function ListarCategorias() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);  

  async function buscarCategorias() {
 
    setIsLoading(true);
    await buscar("/categorias", setCategorias)
    setIsLoading(false);
  }
  useEffect(() => {
    buscarCategorias();
  }, [categorias.length]);

  return (
    <section className="w-full min-h-screen  px-4 py-10">
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-bold text-center text-orange-900 mb-10">
          Categorias disponíveis
        </h2>
        {isLoading && (
          <DNA
            visible={true}
            height="200"
            width="200"
            ariaLabel="dna-loading"
            wrapperClass="mx-auto"
          />
        )}
        {!isLoading && categorias.length === 0 && (
          <p className="text-2xl text-center text-gray-600 mt-10">
            Nenhuma categoria foi encontrada.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-7xl">
          {categorias.map((categoria) => (
            <CardCategorias key={categoria.id} categoria={categoria} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ListarCategorias;

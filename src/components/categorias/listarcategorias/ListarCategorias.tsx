/* eslint-disable @typescript-eslint/no-explicit-any */
import type Categoria from "../../../models/Categoria";
import CardCategorias from "../cardcategorias/CardCategorias";
import { buscar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner"; 
import { useEffect, useState } from "react";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function ListarCategorias() {
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  async function buscarCategorias() {
    setIsLoading(true);
    try {
      
      await buscar("/categorias", setCategorias);
    } catch (error: any) { 
      console.error("Erro ao carregar categorias:", error);
      ToastAlerta("Erro ao carregar as categorias. Tente novamente mais tarde.", "erro");
      setCategorias([]); 
    } finally {
      setIsLoading(false);
    }
  }

 
  useEffect(() => {
    buscarCategorias();
  }, []);

  return (
    <section className="w-full min-h-screen bg-gray-100 py-12 px-4 font-sans"> 
      <div className="container mx-auto flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12 leading-tight">
          Explore Nossas Categorias de Sabor! 🍕
        </h2>

        {/* Loader de carregamento */}
        {isLoading && (
          <div className="flex justify-center items-center py-20 w-full"> 
            <RotatingLines
              strokeColor="#F97316"
              strokeWidth="5"
              animationDuration="0.75"
              width="96" 
              visible={true}
            />
          </div>
        )}

        {/* Mensagem de Categoria Vazia */}
        {!isLoading && categorias.length === 0 && (
          <div className="text-center my-12 p-6 bg-white rounded-lg shadow-md border border-gray-200 w-full max-w-md">
            <p className="text-3xl font-semibold text-gray-700 mb-4">
              Nenhuma categoria encontrada. 😟
            </p>
            <p className="text-xl text-gray-500">
              Estamos trabalhando para trazer mais opções!
            </p>
          </div>
        )}

        {/* Grid de Categorias */}
        {!isLoading && categorias.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 md:gap-8 justify-items-center w-full max-w-7xl"> {/* Grid responsivo e espaçamento */}
            {categorias.map((categoria) => (
              <CardCategorias key={categoria.id} categoria={categoria} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ListarCategorias;
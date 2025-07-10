/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";

import { ToastAlerta } from "../../../utils/ToastAlerta";
import { DNA } from "react-loader-spinner";
import type Produto from "../../../models/Produto";
import CardProduto from "../cardproduto/CardProduto";
import { buscarTodosProdutos} from "../../../services/Service";


function ListarProdutos() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario.token;

async function buscarProdutos() {
  try {
    setIsLoading(true);
    await buscarTodosProdutos(setProdutos, {
      headers: { Authorization: token },
    });
  } catch (error: any) {
    if (error.toString().includes("401")) {
      handleLogout();
    }
  } finally {
    setIsLoading(false);
  }
}


  useEffect(() => {
    if (token === "") {
      ToastAlerta("Você precisa estar logado!", "info");
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    buscarProdutos();
  }, []);

  return (
    <>
      {isLoading && (
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper mx-auto"
        />
      )}

      <div className="flex justify-center w-full my-4">
        <div className="container flex flex-col mx-2">
          {!isLoading && produtos.length === 0 && (
            <span className="text-3xl text-center my-8">
              Nenhum produto foi encontrado!
            </span>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {produtos.map((produto) => (
              <CardProduto key={produto.id} produto={produto} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ListarProdutos;

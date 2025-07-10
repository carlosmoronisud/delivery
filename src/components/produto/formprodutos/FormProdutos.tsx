/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar, cadastrar, atualizar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";


import type Categoria from "../../../models/Categoria";

import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";

function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario.token;

  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [produto, setProduto] = useState<any>({
    nome: "",
    preco: 0,
    imagem: "",
    nutriScore: "",
    ingrediente: "",
    id_categoria: {
      id: "",
    },
    id_usuario: {
      id: 1,
    },
  });

  async function buscarCategorias() {
    try {
      await buscar("/categorias", setCategorias, {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) handleLogout();
    }
  }

  async function buscarProdutoPorId(id: string) {
    try {
      await buscar(`/produtos/${id}`, setProduto, {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      if (error.toString().includes("401")) handleLogout();
    }
  }

  useEffect(() => {
    if (token === "") {
      ToastAlerta("Você precisa estar logado!", "info");
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    buscarCategorias();
    if (id) {
      buscarProdutoPorId(id);
    }
    
  }, [id]);
  useEffect(() => {
  if (usuario && usuario.id) {
    setProduto((prev: any) => ({
      ...prev,
      id_usuario: { id: usuario.id },
    }));
  }
}, [usuario]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setProduto({
      ...produto,
      [e.target.name]: e.target.value,
    });
  }

  function handleCategoriaChange(e: ChangeEvent<HTMLSelectElement>) {
    const categoriaId = Number(e.target.value);
    setProduto({
      ...produto,
      id_categoria: {
        id: categoriaId,
      },
    });
  }

  async function enviarProduto(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setIsLoading(true);

  console.log("Dados enviados para o backend:", JSON.stringify(produto, null, 2));

  try {
    if (id) {
      await atualizar("/produtos", produto, setProduto, {
        headers: { Authorization: token },
      });
      ToastAlerta("Produto atualizado com sucesso!", "sucesso");
    } else {
      await cadastrar("/produtos", produto, setProduto, {
        headers: { Authorization: token },
      });
      ToastAlerta("Produto cadastrado com sucesso!", "sucesso");
    }

    navigate("/produtos");
  } catch (error: any) {
    console.error(error);
    if (error.toString().includes("401")) {
      handleLogout();
    } else {
      ToastAlerta("Erro ao salvar o produto!", "erro");
    }
  } finally {
    setIsLoading(false);
  }
}


  return (
    <div className="container flex flex-col items-center justify-center mx-auto">
      <h1 className="text-4xl text-center my-8">
        {id ? "Editar Produto" : "Cadastrar Produto"}
      </h1>

      <form className="w-2/3 flex flex-col gap-4" onSubmit={enviarProduto}>
        <input
          type="text"
          name="nome"
          placeholder="Nome do Produto"
          value={produto.nome}
          onChange={atualizarEstado}
          className="border-2 border-slate-700 rounded p-2"
        />

        <input
          type="number"
          name="preco"
          placeholder="Preço"
          value={produto.preco}
          onChange={atualizarEstado}
          className="border-2 border-slate-700 rounded p-2"
        />

        <input
          type="text"
          name="imagem"
          placeholder="URL da Imagem"
          value={produto.imagem}
          onChange={atualizarEstado}
          className="border-2 border-slate-700 rounded p-2"
        />

        <input
          type="text"
          name="nutriScore"
          placeholder="NutriScore (opcional)"
          value={produto.nutriScore}
          onChange={atualizarEstado}
          className="border-2 border-slate-700 rounded p-2"
        />

        <input
          type="text"
          name="ingrediente"
          placeholder="Ingredientes"
          value={produto.ingredientes}
          onChange={atualizarEstado}
          className="border-2 border-slate-700 rounded p-2"
        />

        <select
          name="id_categoria"
          value={produto.id_categoria?.id || ""}
          onChange={handleCategoriaChange}
          className="border-2 border-slate-700 rounded p-2"
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.descricao}
            </option>
          ))}
        </select>


        <button
          className="rounded text-white bg-indigo-500 hover:bg-indigo-700 w-1/2 py-2 mx-auto flex justify-center"
          type="submit"
        >
          {isLoading ? (
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            />
          ) : (
            <span>{id ? "Atualizar" : "Cadastrar"}</span>
          )}
        </button>
      </form>
    </div>
  );
}

export default FormProduto;

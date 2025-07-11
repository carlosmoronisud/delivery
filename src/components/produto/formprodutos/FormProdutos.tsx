/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar, cadastrar, atualizar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import type Categoria from "../../../models/Categoria";
import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft } from "@phosphor-icons/react";

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
    id_categoria: { id: "" },
    id_usuario: { id: 1 },
  });

  useEffect(() => {
    if (token === "") {
      ToastAlerta("Você precisa estar logado!", "info");
      navigate("/");
    }
  }, [token]);

  useEffect(() => {
    buscarCategorias();
    if (id) buscarProdutoPorId(id);
  }, [id]);

  useEffect(() => {
    if (usuario && usuario.id) {
      setProduto((prev: any) => ({
        ...prev,
        id_usuario: { id: usuario.id },
      }));
    }
  }, [usuario]);

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
      id_categoria: { id: categoriaId },
    });
  }

  async function enviarProduto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

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
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F4BF4F] to-[#F1EDD2] px-4 flex justify-center items-start py-10">

      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-6 flex flex-col gap-4">
        
        {/* Botão de voltar */}
        <div className="flex justify-start">
          <Link
            to="/produtos"
            className="flex items-center text-[#262401] hover:text-indigo-800 hover:scale-110 transition"
          >
            <ArrowLeft size={24} />
            <span className="ml-2">Voltar</span>
          </Link>
        </div>

        <h1 className="text-3xl text-center font-bold">
          {id ? "Editar Produto" : "Cadastrar Produto"}
        </h1>

        <form className="flex flex-col gap-4" onSubmit={enviarProduto}>
  <div className="flex flex-col gap-1">
    <label htmlFor="nome" className="text-lg font-semibold text-[#262401]">Nome do Produto</label>
    <input
      type="text"
      name="nome"
      id="nome"
      placeholder="Digite o nome do produto"
      value={produto.nome}
      onChange={atualizarEstado}
      className="border border-gray-400 rounded px-4 py-2"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="preco" className="text-lg font-semibold text-[#262401]">Preço</label>
    <input
      type="number"
      name="preco"
      id="preco"
      placeholder="Digite o preço (ex: 19.90)"
      value={produto.preco}
      onChange={atualizarEstado}
      className="border border-gray-400 rounded px-4 py-2"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="imagem" className="text-lg font-semibold text-[#262401]">Imagem (URL)</label>
    <input
      type="text"
      name="imagem"
      id="imagem"
      placeholder="Insira a URL da imagem do produto"
      value={produto.imagem}
      onChange={atualizarEstado}
      className="border border-gray-400 rounded px-4 py-2"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="nutriScore" className="text-lg font-semibold text-[#262401]">NutriScore</label>
    <input
      type="text"
      name="nutriScore"
      id="nutriScore"
      placeholder="NutriScore (ex: A, B, C...)"
      value={produto.nutriScore}
      onChange={atualizarEstado}
      className="border border-gray-400 rounded px-4 py-2"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="ingrediente" className="text-lg font-semibold text-[#262401]">Ingredientes</label>
    <input
      type="text"
      name="ingrediente"
      id="ingrediente"
      placeholder="Liste os ingredientes do produto"
      value={produto.ingrediente}
      onChange={atualizarEstado}
      className="border border-gray-400 rounded px-4 py-2"
    />
  </div>

  <div className="flex flex-col gap-1">
    <label htmlFor="categoria" className="text-lg font-semibold text-[#262401]">Categoria</label>
    <select
      id="categoria"
      name="id_categoria"
      value={produto.id_categoria?.id || ""}
      onChange={handleCategoriaChange}
      className="border border-gray-400 rounded px-4 py-2 text-gray-700"
    >
      <option value="">Selecione uma categoria</option>
      {categorias.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.descricao}
        </option>
      ))}
    </select>
  </div>

  <button
    className="rounded text-white bg-[#262401] hover:bg-green-700 w-full py-2 flex justify-center mt-4"
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
    </div>
  );
}

export default FormProduto;

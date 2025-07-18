/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, type ChangeEvent, type FormEvent, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { atualizar, buscar, cadastrar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import BotaoVoltar from "../../botaovoltar/BotaoVoltar"; 
import type Categoria from "../../../models/Categoria"; // Certifique-se de que este import está correto

function FormCategoria() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [categoria, setCategoria] = useState<Categoria>({
    id: undefined, 
    descricao: "",
    palavraChave: "",
    imagem: "",
  });

  const { usuario, handleLogout } = useContext(AuthContext);
  const token = usuario.token;
  const { id } = useParams<{ id: string }>(); 

  // --- Authentication Check ---
  useEffect(() => {
    if (token === '') {
      ToastAlerta("Você precisa estar logado para gerenciar categorias!", "info");
      navigate('/login');
    }
  }, [token, navigate]);

  // --- Fetch Category Data if Editing ---
  // A função buscarCategoriaPorId foi renomeada para ser interna ao useEffect para evitar recriação desnecessária
  useEffect(() => {
    async function fetchCategoriaData(categoryId: string) { // Nome mais descritivo para o parâmetro
      try {
        // *** AQUI É A MUDANÇA: Chamar buscar() com o setter e o header ***
        await buscar(`/categorias/${categoryId}`, setCategoria, );
      } catch (error: any) {
        if (error.toString().includes("401")) {
          ToastAlerta("Sessão expirada! Faça login novamente.", "info");
          handleLogout();
        } else if (error.response?.status === 404) {
          ToastAlerta("Categoria não encontrada!", "erro");
          navigate('/categorias'); 
        } else {
          ToastAlerta("Erro ao carregar os dados da categoria.", "erro");
          console.error(error);
        }
      }
    }

    if (id !== undefined) { // Se há um ID na URL, estamos editando
      fetchCategoriaData(id); // Chama a função para buscar os dados da categoria
    } else { // Se não há ID, estamos cadastrando uma nova categoria
      setCategoria({ // Reseta o formulário
        id: undefined,
        descricao: "",
        palavraChave: "",
        imagem: "",
      });
    }
  }, [id, token, navigate, handleLogout]); // Adicionado dependências necessárias

  // --- Input Change Handler ---
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  }

  // --- Form Submission Handler ---
  async function gerarNovaCategoria(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (!categoria.descricao || !categoria.palavraChave || !categoria.imagem) {
        ToastAlerta("Por favor, preencha todos os campos obrigatórios.", "erro");
        setIsLoading(false);
        return;
    }

    try {
      const header = { headers: { Authorization: token } };
      
      if (id !== undefined) {
        // Update existing category
        // *** AQUI TAMBÉM: Chamar atualizar() com o setter e o header ***
        await atualizar("/categorias", categoria, setCategoria, header); 
        ToastAlerta("A categoria foi atualizada com sucesso! ✨", "sucesso");
      } else {
        // Create new category
        // *** E AQUI: Chamar cadastrar() com o setter e o header ***
        await cadastrar("/categorias", categoria, setCategoria, header); 
        ToastAlerta("A categoria foi cadastrada com sucesso! 🎉", "sucesso");
      }
      navigate("/categorias"); 
    } catch (error: any) {
      if (error.toString().includes("401")) {
        ToastAlerta("Sessão expirada! Por favor, faça login novamente.", "info");
        handleLogout();
      } else {
        ToastAlerta("Erro ao salvar a categoria! 😥", "erro");
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-12 px-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-200">
        
        {/* Botão de voltar */}
        <div className="flex justify-start">
          <BotaoVoltar />
        </div>

        {/* Título do formulário */}
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-4">
          {id === undefined ? "Cadastrar Categoria ➕" : "Editar Categoria ✍️"}
        </h1>

        {/* Formulário */}
        <form onSubmit={gerarNovaCategoria} className="flex flex-col gap-5">
          {/* Campo Descrição */}
          <div className="flex flex-col gap-2">
            <label htmlFor="descricao" className="text-lg font-semibold text-gray-700">Descrição da Categoria</label>
            <input
              type="text"
              name="descricao"
              id="descricao"
              placeholder="Ex: Pizzas, Lanches, Sobremesas..."
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={categoria.descricao}
              onChange={atualizarEstado}
              required
            />
          </div>

          {/* Campo Palavras-chave */}
          <div className="flex flex-col gap-2">
            <label htmlFor="palavraChave" className="text-lg font-semibold text-gray-700">Palavras-chave (para busca)</label>
            <input
              type="text"
              name="palavraChave"
              id="palavraChave"
              placeholder="Ex: pizza, italiana, tradicional"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={categoria.palavraChave}
              onChange={atualizarEstado}
            />
          </div>

          {/* Campo Link da Imagem */}
          <div className="flex flex-col gap-2">
            <label htmlFor="imagem" className="text-lg font-semibold text-gray-700">URL da Imagem da Categoria</label>
            <input
              type="text"
              name="imagem"
              id="imagem"
              placeholder="https://suaimagem.com/categoria.jpg"
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              value={categoria.imagem}
              onChange={atualizarEstado}
              required
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg 
                       hover:bg-orange-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer 
                       flex justify-center items-center mt-6"
            disabled={isLoading}
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="28"
                visible={true}
              />
            ) : (
              <span>{id === undefined ? "Cadastrar Categoria" : "Atualizar Categoria"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormCategoria;
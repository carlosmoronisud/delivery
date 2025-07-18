/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams, Link } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar, cadastrar, atualizar } from "../../../services/Service"; 
import { RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { ArrowLeft } from "@phosphor-icons/react";
import type Produto from "../../../models/Produto";
import type Categoria from "../../../models/Categoria";
import type Usuario from "../../../models/Usuario";

function FormProduto() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const { usuario, handleLogout } = useContext(AuthContext); 
  const token = usuario.token;

  const [isLoading, setIsLoading] = useState(false); 
  const [categorias, setCategorias] = useState<Categoria[]>([]); 

  

  // State for the product being edited/created
  const [produto, setProduto] = useState<Produto>({ 
    id: 0, 
    nome: "",
    preco: 0,
    imagem: "",
    nutriScore: "",
    ingrediente: "",
    id_categoria: { id: undefined, descricao: "", palavraChave: "", imagem: "" }, 
    usuario: { id: null, nome: "", usuario: "", senha: "", foto: "" }, 
  });

  // --- Auth Check ---
  useEffect(() => {
    if (token === "") {
      ToastAlerta("Você precisa estar logado!", "info");
      navigate("/login"); 
    }
  }, [token, navigate]);

  // --- Data Loading: Categories and Product (if editing) ---
  useEffect(() => {
    // Function to fetch all categories
    async function fetchCategorias() {
      try {
        await buscar("/categorias", setCategorias, );
      } catch (error: any) {
        // Handle 401 specifically for logout
        if (error.toString().includes("401")) {
          ToastAlerta("Sessão expirada! Por favor, faça login novamente.", "info");
          handleLogout();
        } else {
          ToastAlerta("Erro ao carregar categorias.", "erro");
        }
      }
    }

    // Function to fetch product by ID if 'id' is present in URL (editing mode)
    async function fetchProdutoById(productId: string) {
  try {
    await buscar(`/produtos/${productId}`, (data: Produto) => {
      const fetchedProduct = data;
      // Ensure category and user are properly formatted for the state
      setProduto({
        ...fetchedProduct,
        id_categoria: typeof fetchedProduct.id_categoria === 'object' ? fetchedProduct.id_categoria : { id: fetchedProduct.id_categoria as undefined, descricao: "", palavraChave: "", imagem: "" },
        usuario: {
          id: fetchedProduct.usuario ? fetchedProduct.usuario.id : null,
          nome: "",
          usuario: "",
          senha: "",
          foto: ""
        }
      });
    });
  } catch (error: any) {
        if (error.toString().includes("401")) {
          ToastAlerta("Sessão expirada! Por favor, faça login novamente.", "info");
          handleLogout();
        } else {
          ToastAlerta("Erro ao carregar o produto.", "erro");
        }
      }
    }

    fetchCategorias();
    if (id) {
      fetchProdutoById(id);
    }
  }, [id, token, handleLogout]); // Add dependencies for useEffect

  // --- Set User ID for Product ---
  useEffect(() => {
    if (usuario && usuario.id !== null && usuario.id !== undefined) {
      setProduto((prev: Produto) => ({
        ...prev,
        // Ensure 'usuario' is an object with 'id' for the backend
        usuario: { ...(prev.usuario as Usuario), id: usuario.id } as Usuario, 
      }));
    }
  }, [usuario]); // Dependency: re-run if usuario changes

  // --- Form Input Handlers ---
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setProduto((prev: Produto) => ({
      ...prev,
      [e.target.name]: e.target.value,
      // Special handling for price to ensure it's a number
      preco: e.target.name === 'preco' ? parseFloat(e.target.value) || 0 : prev.preco,
    }));
  }

  function handleCategoriaChange(e: ChangeEvent<HTMLSelectElement>) {
    const categoriaId = Number(e.target.value);
    setProduto((prev: Produto) => ({
      ...prev,
      // Store category as an object with its ID
      categoria: { ...(prev.id_categoria as Categoria), id: categoriaId } as Categoria,
    }));
  }

  // --- Form Submission ---
  async function enviarProduto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation (can be expanded)
    if (!produto.nome || !produto.preco || !produto.ingrediente || !produto.id_categoria?.id || !produto.usuario?.id) {
        ToastAlerta("Por favor, preencha todos os campos obrigatórios.", "erro");
        setIsLoading(false);
        return;
    }

    try {
      const header = { headers: { Authorization: token } };
      // Prepare product data for backend (ensure IDs are numbers if backend expects that)
      const produtoParaEnvio = {
          ...produto,
          categoria: produto.id_categoria.id, // Backend likely expects just the ID here
          usuario: produto.usuario.id,     // Backend likely expects just the ID here
      };

      if (id) {
        // Updating an existing product
        await atualizar("/produtos", produtoParaEnvio, (data: Produto) => data, header);
        ToastAlerta("Produto atualizado com sucesso!", "sucesso");
      } else {
        // Creating a new product
        await cadastrar("/produtos", produtoParaEnvio, (data: Produto) => data, header);
        ToastAlerta("Produto cadastrado com sucesso!", "sucesso");
      }

      navigate("/produtos"); // Redirect after successful submission
    } catch (error: any) {
      if (error.toString().includes("401")) {
        ToastAlerta("Sessão expirada! Por favor, faça login novamente.", "info");
        handleLogout();
      } else {
        ToastAlerta("Erro ao salvar o produto! Verifique se os dados estão corretos.", "erro");
        console.error("Erro ao salvar produto:", error); // Log detailed error
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-12 px-4 font-sans"> {/* Fundo e padding */}

      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-200">
        
        {/* Botão de voltar */}
        <div className="flex justify-start">
          <Link
            to="/produtos"
            className="flex items-center text-gray-600 hover:text-orange-600 hover:scale-105 transition-all duration-200 cursor-pointer text-lg font-medium"
          >
            <ArrowLeft size={28} weight="bold" className="mr-2" />
            Voltar para Produtos
          </Link>
        </div>

        {/* Título do formulário */}
        <h1 className="text-4xl text-center font-bold text-gray-800 mb-4">
          {id ? "Editar Produto ✏️" : "Cadastrar Novo Produto 🍔"}
        </h1>

        {/* Formulário */}
        <form className="flex flex-col gap-5" onSubmit={enviarProduto}>
          {/* Campo Nome do Produto */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="text-lg font-semibold text-gray-700">Nome do Produto</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Ex: Pizza Calabresa, Hamburguer Vegano..."
              value={produto.nome}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required // Campo obrigatório
            />
          </div>

          {/* Campo Preço */}
          <div className="flex flex-col gap-2">
            <label htmlFor="preco" className="text-lg font-semibold text-gray-700">Preço (R$)</label>
            <input
              type="number"
              name="preco"
              id="preco"
              placeholder="Ex: 29.90"
              value={produto.preco}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              step="0.01" // Permite valores decimais
              required // Campo obrigatório
            />
          </div>

          {/* Campo Imagem (URL) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="imagem" className="text-lg font-semibold text-gray-700">URL da Imagem</label>
            <input
              type="text"
              name="imagem"
              id="imagem"
              placeholder="https://suaimagem.com/produto.jpg"
              value={produto.imagem}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Campo NutriScore */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nutriScore" className="text-lg font-semibold text-gray-700">NutriScore (A-E)</label>
            <input
              type="text"
              name="nutriScore"
              id="nutriScore"
              placeholder="Ex: A, B, C, D ou E"
              value={produto.nutriScore}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              maxLength={1} // Limita a 1 caractere
            />
          </div>

          {/* Campo Ingredientes */}
          <div className="flex flex-col gap-2">
            <label htmlFor="ingrediente" className="text-lg font-semibold text-gray-700">Ingredientes</label>
            <textarea // Usando textarea para múltiplos ingredientes
              name="ingrediente"
              id="ingrediente"
              placeholder="Ex: Tomate, mussarela, manjericão, azeite..."
              value={produto.ingrediente}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => atualizarEstado(e as any)} // Cast para any ou criar handler específico para textarea
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px] resize-y" // Min-height e resize
              required // Campo obrigatório
            />
          </div>

          {/* Campo Categoria */}
          <div className="flex flex-col gap-2">
            <label htmlFor="categoria" className="text-lg font-semibold text-gray-700">Categoria</label>
            <select
              id="categoria"
              name="id_categoria"
              value={produto.id_categoria?.id || ""} // Handle optional id safely
              onChange={handleCategoriaChange}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700 cursor-pointer"
              required // Campo obrigatório
            >
              <option value="" disabled>Selecione uma categoria</option> {/* Placeholder */}
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Botão de Envio */}
          <button
            className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-orange-700 
                       transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer 
                       flex justify-center items-center mt-6"
            type="submit"
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="28" // Increased size for visibility
                visible={true}
              />
            ) : (
              <span>{id ? "Atualizar Produto" : "Cadastrar Produto"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormProduto;
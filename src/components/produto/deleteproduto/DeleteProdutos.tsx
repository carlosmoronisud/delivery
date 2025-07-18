/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

import type Produto from '../../../models/Produto'; // Importação do modelo Produto

import { AuthContext } from '../../../contexts/AuthContext';
import { ToastAlerta } from '../../../utils/ToastAlerta';
import type Categoria from '../../../models/Categoria'; // Importação do modelo Categoria
import type Usuario from '../../../models/Usuario';     // Importação do modelo Usuario

// Importa as funções da sua Service.ts (sem alterações na Service.ts)
import { buscar, deletar } from '../../../services/Service'; 

function DeletarProduto() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Inicializa produto como um objeto vazio do tipo Produto
    const [produto, setProduto] = useState<Produto>({} as Produto); 

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    const { id } = useParams<{ id: string }>();

    // --- Authentication Check ---
    useEffect(() => {
        if (token === '') {
            ToastAlerta('Você precisa estar logado para acessar esta página!', 'info');
            navigate('/login');
        }
    }, [token, navigate]);

    // --- Fetch Product Data ---
    useEffect(() => {
        if (id !== undefined && token) { // Garante que ID e token existam antes de buscar
            const fetchProduct = async () => {
                try {
                    // *** AQUI É O AJUSTE PARA COMPATIBILIDADE COM A SUA SERVICE.TS ***
                    // A função 'buscar' na sua Service.ts espera um setter como 2º arg.
                    // Para adaptar o dado ao nosso modelo 'Produto', buscaremos e depois adaptaremos.
                    
                    // Chamada à função buscar da Service.ts
                    await buscar(`/produtos/${id}`, (data: any) => {
                        // Quando 'buscar' chama o setter, 'data' é o que vem da API.
                        // Precisamos adaptar 'data' para o nosso modelo 'Produto' aqui.
                        setProduto({
                            ...data, // Espalha as propriedades que já batem
                            // Adaptação de categoria: se for objeto, usa; se for ID, cria objeto básico
                            categoria: typeof data.categoria === 'object' && data.categoria !== null 
                                ? data.categoria 
                                : { 
                                    id: data.categoria as number | undefined, // Converte para number | undefined
                                    descricao: data.categoria_descricao || "Desconhecida", 
                                    palavraChave: data.categoria_palavraChave || "N/A", 
                                    imagem: data.categoria_imagem || "N/A"
                                  } as Categoria,
                            // Adaptação de usuário: se for objeto, usa; se for ID, cria objeto básico
                            usuario: typeof data.usuario === 'object' && data.usuario !== null 
                                ? data.usuario 
                                : { 
                                    id: data.usuario as number | null, // Converte para number | null
                                    nome: data.usuario_nome || "Desconhecido", 
                                    usuario: data.usuario_email || "", 
                                    senha: "", // Senha nunca deve vir do backend
                                    foto: data.usuario_foto || ""
                                  } as Usuario,
                        });
                    },  ); // Passa o header de autorização

                } catch (error: any) {
                    if (error.toString().includes('401')) {
                        ToastAlerta('Sessão expirada! Faça login novamente.', 'info');
                        handleLogout();
                    } else if (error.response?.status === 404) {
                        ToastAlerta('Produto não encontrado!', 'erro');
                        navigate('/produtos'); // Redireciona se o produto não for encontrado
                    } else {
                        ToastAlerta('Erro ao carregar os detalhes do produto!', 'erro');
                        console.error(error);
                    }
                }
            };
            fetchProduct();
        }
    }, [id, token, handleLogout, navigate]); // Dependências do useEffect

    // --- Delete Product Logic ---
    async function deletarProduto() {
        setIsLoading(true);
        try {
            await deletar(`/produtos/${id}`, {
                headers: { Authorization: token },
            });
            ToastAlerta('Produto excluído com sucesso! 👋', 'sucesso'); 
            retornar(); // Redireciona após exclusão bem-sucedida
        } catch (error: any) {
            if (error.toString().includes('401')) {
                ToastAlerta('Sessão expirada! Faça login novamente.', 'info');
                handleLogout();
            } else {
                ToastAlerta('Erro ao excluir o produto! 😥', 'erro'); 
                console.error(error);
            }
        } finally { 
            setIsLoading(false);
        }
    }

    // --- Navigation ---
    function retornar() {
        navigate('/produtos');
    }

    // --- Render Logic ---
    // Exibe um spinner de carregamento se os dados do produto ainda não foram carregados
    // 'produto.id' será 0 (ou null) inicialmente e depois o ID real se for carregado.
    // Usamos 'produto.nome' também, pois um produto carregado deve ter um nome.
    if (!produto.nome && !isLoading) { 
        return (
            <div className="min-h-screen w-full flex justify-center items-center bg-gray-100 font-sans">
                <RotatingLines
                    strokeColor="#F97316" // Cor laranja da paleta do seu app
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={true}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-12 px-4 font-sans"> 
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 gap-6 border border-gray-200">
                
                <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
                    Excluir Produto 🗑️
                </h1>

                {/* Card de Visualização do Produto */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
                    <img
                        src={produto.imagem || "https://placehold.co/150x150?text=Produto"}
                        alt={produto.nome}
                        className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-lg border border-gray-300 shadow-sm"
                    />
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{produto.nome}</h2>
                        <p className="text-xl font-extrabold text-orange-600">
                            R$ {produto.preco?.toFixed(2).replace('.', ',') || '0,00'}
                        </p>
                        {produto.nutriScore && (
                            <p className="text-base font-semibold text-gray-700 mt-2">
                                NutriScore: <span className={`inline-flex items-center px-2 py-1 rounded-full font-bold ${getNutriScoreClasses(produto.nutriScore)}`}>
                                    {produto.nutriScore}
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12 pt-6 w-full">
                    <button
                        onClick={retornar}
                        className="w-full md:w-auto px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg text-lg shadow-md hover:bg-gray-300 
                                   transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={deletarProduto}
                        className="w-full md:w-auto px-8 py-3 bg-red-600 text-white font-bold rounded-lg text-lg shadow-md hover:bg-red-700 
                                   transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex items-center justify-center"
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
                            <span>Excluir</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletarProduto;

// Helper function from CardProduto for NutriScore colors - can be moved to a utilities file
const getNutriScoreClasses = (score: string | undefined): string => {
    switch (score?.toUpperCase()) {
      case 'A':
        return 'bg-green-500 text-white'; 
      case 'B':
        return 'bg-lime-500 text-white'; 
      case 'C':
        return 'bg-yellow-500 text-gray-800'; 
      case 'D':
        return 'bg-orange-500 text-white'; 
      case 'E':
        return 'bg-red-500 text-white'; 
      default:
        return 'bg-gray-300 text-gray-700'; 
    }
  };
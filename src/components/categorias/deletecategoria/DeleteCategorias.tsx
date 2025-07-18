/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

import type Categoria from '../../../models/Categoria'; // Certifique-se de que este import está correto
import { buscar, deletar } from '../../../services/Service'; // Importa as funções da Service.ts
import { AuthContext } from '../../../contexts/AuthContext';
import { ToastAlerta } from '../../../utils/ToastAlerta';

function DeletarCategoria() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false); // Para o carregamento da ação de deletar
    // Inicializa categoria como um objeto vazio do tipo Categoria
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria); 

    const { usuario, handleLogout } = useContext(AuthContext);
    const token = usuario.token;

    const { id } = useParams<{ id: string }>(); // ID da categoria da URL

    // --- Authentication Check ---
    useEffect(() => {
        if (token === '' || usuario.id === null) { // Adicionado verificação de usuario.id
            ToastAlerta('Você precisa estar logado para acessar esta página!', 'info');
            navigate('/login'); // Redireciona para /login
        }
    }, [token, usuario.id, navigate]); // Adicionadas dependências

    // --- Fetch Category Data ---
    useEffect(() => {
        if (id !== undefined && token) { 
            const fetchCategory = async () => {
                try {
                    
                    await buscar(`/categorias/${id}`, setCategoria);
                } catch (error: any) {
                    if (error.toString().includes('401')) {
                        ToastAlerta('Sessão expirada! Faça login novamente.', 'info');
                        handleLogout();
                    } else if (error.response?.status === 404) {
                        ToastAlerta('Categoria não encontrada!', 'erro');
                        navigate('/categorias'); // Redireciona se a categoria não for encontrada
                    } else {
                        ToastAlerta('Erro ao carregar os detalhes da categoria!', 'erro');
                        console.error(error);
                    }
                }
            };
            fetchCategory();
        }
    }, [id, token, handleLogout, navigate]); // Adicionadas dependências

    // --- Delete Category Logic ---
    async function deletarCategoria() {
        setIsLoading(true);
        try {
            await deletar(`/categorias/${id}`, {
                headers: { Authorization: token },
            });

            ToastAlerta('Categoria excluída com sucesso! 👋', 'sucesso'); 
            retornar(); // Redireciona após exclusão bem-sucedida
        } catch (error: any) {
            if (error.toString().includes('401')) {
                ToastAlerta('Sessão expirada! Faça login novamente.', 'info');
                handleLogout();
            } else {
                ToastAlerta('Erro ao excluir a categoria! 😥', 'erro'); 
                console.error(error);
            }
        } finally { // Usa finally para garantir que isLoading seja resetado
            setIsLoading(false);
        }
    }

    // --- Navigation ---
    function retornar() {
        navigate('/categorias');
    }

    // --- Render Logic ---
    // Exibe um spinner de carregamento se os dados da categoria ainda não foram carregados
    // 'categoria.descricao' será vazio inicialmente e depois o valor real se for carregado.
    if (!categoria.descricao && !isLoading && id !== undefined) { 
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
        <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-12 px-4 font-sans"> {/* Fundo consistente */}
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl flex flex-col items-center p-8 gap-6 border border-gray-200"> {/* Estilo do card */}
                
                <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
                    Excluir Categoria 🗑️
                </h1>
                

                {/* Card de Visualização da Categoria */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full p-4 border border-gray-200 rounded-xl bg-gray-50 shadow-md">
                    <img
                        src={categoria.imagem || "https://placehold.co/150x150?text=Categoria"}
                        alt={categoria.descricao}
                        className="w-36 h-36 md:w-48 md:h-48 object-cover rounded-full border border-gray-300 shadow-sm"
                    />
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
                        <h2 className="text-2xl font-bold text-gray-900 leading-tight">{categoria.descricao}</h2>
                        <p className="text-base font-medium text-gray-700">Palavra-chave: {categoria.palavraChave}</p>
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
                        onClick={deletarCategoria}
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

export default DeletarCategoria;
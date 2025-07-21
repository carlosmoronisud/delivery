import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext';
import type Produto from '../../../models/Produto';

import { PencilSimpleLine, Trash, ShoppingCartSimple } from '@phosphor-icons/react';

interface CardProdutoProps {
    produto: Produto;
}

const getNutriScoreClasses = (score: string | undefined): string => {
    switch (score?.toUpperCase()) {
        case 'A': return 'bg-green-500 text-white'; 
        case 'B': return 'bg-lime-500 text-white'; 
        case 'C': return 'bg-yellow-500 text-gray-800'; 
        case 'D': return 'bg-orange-500 text-white'; 
        case 'E': return 'bg-red-500 text-white'; 
        default: return 'bg-gray-300 text-gray-700'; 
    }
};

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
    const { usuario: loggedInUser, isBackendUser } = useContext(AuthContext); // Obter isBackendUser
    const { adicionarProduto } = useContext(CartContext);

    let isDono = false;

    // Lógica para verificar se o usuário logado é o dono do produto
    // Condições:
    // 1. Usuário precisa estar logado (ter um token)
    // 2. Usuário logado DEVE ser um usuário do backend (não Google)
    // 3. O produto deve ter um objeto 'id_usuario' e um 'id' dentro dele
    // 4. O ID do usuário logado deve ser igual ao ID do usuário do produto
    if (loggedInUser?.token && isBackendUser) {
        const produtoUserId = produto?.id_usuario?.id; // <--- CORRIGIDO PARA 'id_usuario'
        const loggedInUserId = loggedInUser.id;

        // Compara os IDs, convertendo ambos para string para garantir compatibilidade
        // (importante pois ID do backend pode ser number e do Google string, embora agora Google seja filtrado por isBackendUser)
        if (produtoUserId !== undefined && produtoUserId !== null && String(produtoUserId) === String(loggedInUserId)) {
            isDono = true;
        }
    }

    return (
        <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                         flex flex-col justify-between items-start overflow-hidden 
                         w-full h-[420px] p-4 border border-gray-200 cursor-pointer">

            <img
                className="w-full h-40 object-cover rounded-xl mb-3 border border-gray-100" 
                src={produto.imagem || 'https://placehold.co/256x160/F0F0F0/ADADAD?text=Sem+Imagem'} 
                alt={produto.nome}
            />

            <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                {produto.nome}
            </h3>

            <p className="text-2xl font-extrabold text-orange-600 mb-2">
                R$ {produto.preco ? produto.preco.toFixed(2).replace('.', ',') : '0,00'}
            </p>
            
            {produto.id_categoria && (
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Categoria:</span> {typeof produto.id_categoria === 'object' ? produto.id_categoria.descricao : 'N/A'}
                </p>
            )}

            {produto.ingrediente && (
                <p className="text-sm text-gray-700 leading-snug flex-grow overflow-hidden text-ellipsis"> 
                    <span className="font-semibold">Ingredientes:</span> {produto.ingrediente}
                </p>
            )}

            <div className="w-full flex-shrink-0 flex justify-center items-center py-2 mt-auto">
                {isDono && ( // Renderiza os botões de edição/exclusão APENAS se isDono for true
                    <div className="flex gap-2 z-10"> 
                        <Link 
                            to={`/editarproduto/${produto.id}`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full 
                                        shadow-md transition-all duration-300 transform hover:scale-110 
                                        flex items-center justify-center cursor-pointer"
                            title="Editar produto"
                        >
                            <PencilSimpleLine size={20} weight="bold" /> 
                        </Link>
                        <Link 
                            to={`/deletarproduto/${produto.id}`}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full 
                                        shadow-md transition-all duration-300 transform hover:scale-110 
                                        flex items-center justify-center cursor-pointer"
                            title="Deletar produto"
                        >
                            <Trash size={20} weight="bold" />
                        </Link>
                    </div>
                )}
            </div>

            {produto.nutriScore && ( 
                <div 
                    className={`absolute top-4 left-4 flex items-center justify-center 
                                 w-10 h-10 rounded-full font-bold text-lg shadow-md z-10 
                                 ${getNutriScoreClasses(produto.nutriScore)}`}
                    title={`NutriScore: Nível de nutrição ${produto.nutriScore}`}
                >
                    {produto.nutriScore}
                </div>
            )}

            <button
                onClick={() => adicionarProduto(produto)}
                className="absolute top-4 right-4 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full 
                           shadow-lg transition-all duration-300 transform hover:scale-110 focus:outline-none 
                           focus:ring-2 focus:ring-green-400 cursor-pointer z-10" 
                title="Adicionar ao carrinho"
            >
                <ShoppingCartSimple size={24} weight="bold" />
            </button>
        </div>
    );
};

export default CardProduto;
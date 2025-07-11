import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Usar Link para navegação de rotas
import { AuthContext } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext'; // Importar CartContext
import type Produto from '../../../models/Produto';
import type Usuario from '../../../models/Usuario'; // Importar Usuario para tipagem de produto.usuario
import { PencilSimpleLine, Trash, ShoppingCartSimple } from '@phosphor-icons/react'; // Ajuste dos ícones
import type Categoria from '../../../models/Categoria';

interface CardProdutoProps {
  produto: Produto;
}
function isCategoria(categoria: number | Categoria): categoria is Categoria {
  return typeof categoria === 'object';
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  // Não precisamos de `useNavigate` aqui se usarmos `Link` para os botões de edição/exclusão.
  // const navigate = useNavigate();

  const { usuario: loggedInUser } = useContext(AuthContext); // Renomeado para evitar conflito
  const { adicionarProduto } = useContext(CartContext); // Obter a função adicionarProduto do CartContext

  // Lógica para verificar se o usuário logado é o "dono" do produto
  // Garante que produto.usuario seja um objeto antes de acessar .id
  const isDono = loggedInUser?.id &&
                 typeof produto.usuario !== 'number' &&
                 (produto.usuario as Usuario).id === loggedInUser.id; // Type assertion para segurança

  return (
    <div className="h-80 w-2/3 bg-white p-3 rounded-xl flex flex-col justify-between items-start gap-1.5 shadow-md hover:shadow-lg transition-all relative">

      {/* Imagem do produto */}
      <img
        className="w-56 h-48 object-cover rounded-xl"
        src={produto.imagem || 'https://placehold.co/231x193'} // Usando produto.imagem
        alt={produto.nome}
      />

      {/* Nome e preço */}
      <div className="text-black/60 font-poppins">
        <div className="font-bold">{produto.nome}</div>
        <div>R$ {produto.preco.toFixed(2)}</div>
      </div>

      {/* Categoria do produto (Adicionado do código do professor) */}
      {produto.categoria && isCategoria(produto.categoria) && (
      <p className="text-sm italic text-gray-700">
      Categoria: {produto.categoria.descricao}
        </p>
      )}

      {/* Nutriscore */}
      <div className="text-red-800 text-3xl font-ibm">
        {produto.nutriScore}
      </div>

      {/* Botão de carrinho de compras */}
      <button
        onClick={() => adicionarProduto(produto)} // Chamada à função do CartContext
        className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow transition"
        title="Adicionar ao carrinho"
      >
        <ShoppingCartSimple size={20} weight="bold" />
      </button>

      {/* Botões de edição/exclusão se for dono */}
      {isDono && (
        <div className="flex gap-2 mt-2">
          {/* Usando Link para navegação */}
          <Link to={`/editarproduto/${produto.id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm flex items-center justify-center">
            <PencilSimpleLine size={16} /> {/* Ícone ajustado */}
          </Link>
          <Link to={`/deletarproduto/${produto.id}`}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm flex items-center justify-center">
            <Trash size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardProduto;
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import type Produto from '../../../models/Produto';
import { Pencil, Trash, ShoppingCartSimple } from '@phosphor-icons/react';

interface CardProdutoProps {
  produto: Produto    
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  const isDono = typeof produto.usuario !== 'number' && usuario?.id === produto.usuario.id;

  return (
    <div className="h-80 w-2/3 bg-white p-3 rounded-xl flex flex-col justify-between items-start gap-1.5 shadow-md hover:shadow-lg transition-all relative">

      {/* Imagem do produto */}
      <img className="w-56 h-48 object-cover rounded-xl" src={produto.imagem || 'https://placehold.co/231x193'} alt={produto.nome} />

      {/* Nome e preço */}
      <div className="text-black/60 font-poppins">
        <div className="font-bold">{produto.nome}</div>
        <div>R$ {produto.preco.toFixed(2)}</div>
      </div>

      {/* Nutriscore */}
      <div className="text-red-800 text-3xl font-ibm">
        {produto.nutriScore}
      </div>

      {/* Botão de carrinho de compras */}
      <button
        onClick={() => console.log('Adicionar ao carrinho (futuro)')}
        className="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow transition"
        title="Adicionar ao carrinho"
      >
        <ShoppingCartSimple size={20} weight="bold" />
      </button>

      {/* Botões de edição/exclusão se for dono */}
      {isDono && (
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => navigate(`/editarproduto/${produto.id}`)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-sm"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => navigate(`/deletarproduto/${produto.id}`)}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
          >
            <Trash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CardProduto;

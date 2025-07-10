import React from 'react';
import { ShoppingCart, Trash2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type Produto from '../../../models/Produto';

interface CardProdutoProps {
  produto: Produto;
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-white p-4 hover:shadow-xl transition flex flex-col justify-between">
      {produto.imagem && (
        <img
          className="w-full h-48 object-cover rounded-xl"
          src={produto.imagem}
          alt={produto.nome}
        />
      )}

      <div className="py-4 flex-1">
        <h2 className="font-bold text-xl mb-2 text-gray-900">{produto.nome}</h2>
        <p className="text-gray-700 text-base mb-1">
          <strong>Preço:</strong> R$ {produto.preco.toFixed(2)}
        </p>
        {produto.nutriScore && (
          <p className="text-sm text-green-600 mb-1">
            NutriScore: <span className="font-medium">{produto.nutriScore}</span>
          </p>
        )}
        <p className="text-gray-600 text-sm mb-2">
          <strong>Ingredientes:</strong> {produto.ingrediente}
        </p>
        <div className="text-sm text-gray-500">
          <p>
            <strong>Categoria:</strong>{' '}
            {typeof produto.categoria === 'number'
              ? `ID ${produto.categoria}`
              : produto.categoria.id}
          </p>
          <p>
            <strong>Usuário:</strong>{' '}
            {typeof produto.usuario === 'number'
              ? `ID ${produto.usuario}`
              : produto.usuario.id}
          </p>
        </div>
      </div>

      {/* Botão adicionar ao carrinho */}
      <button
        className="mt-4 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={() => console.log('Adicionar ao carrinho (não implementado ainda)')}
      >
        <ShoppingCart size={18} />
        Adicionar ao carrinho
      </button>

      {/* Botões de editar e deletar */}
      <div className="flex mt-4 gap-2">
        <button
          onClick={() => navigate(`/editarproduto/${produto.id}`)}
          className="flex-1 flex items-center justify-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded-lg transition"
        >
          <Pencil size={16} />
          Editar
        </button>
        <button
          onClick={() => navigate(`/deletarproduto/${produto.id}`)}
          className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg transition"
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>
    </div>
  );
};

export default CardProduto;

import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/AuthContext';
import { CartContext } from '../../../contexts/CartContext';
import type Produto from '../../../models/Produto';

import { PencilSimpleLine, Trash, ShoppingCartSimple } from '@phosphor-icons/react';

interface CardProdutoProps {
  produto: Produto;
}



const getNutriScoreDescricao = (score: string | undefined): { titulo: string; descricao: string } => {
 switch (score?.toUpperCase()) {
  case 'A':
   return { titulo: 'NutriScore A', descricao: 'Alimento com excelente valor nutricional.' };
  case 'B':
   return { titulo: 'NutriScore B', descricao: 'Alimento com bom valor nutricional.' };
  case 'C':
   return { titulo: 'NutriScore C', descricao: 'Alimento com valor nutricional moderado.' };
  case 'D':
   return { titulo: 'NutriScore D', descricao: 'Alimento com baixo valor nutricional.' };
  case 'E':
   return { titulo: 'NutriScore E', descricao: 'Alimento com muito baixo valor nutricional.' };
  default:
   return { titulo: 'NutriScore', descricao: 'Classificação nutricional indisponível.' };
 }
};


// Função para mapear NutriScore para classes Tailwind
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

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { usuario: loggedInUser } = useContext(AuthContext);
  const { adicionarProduto } = useContext(CartContext);
  const [showInfo, setShowInfo] = useState(false);
  console.log('Usuário logado:', loggedInUser);
  console.log('Produto recebido:', produto);

  let isDono = false;

  if (loggedInUser?.id !== null && loggedInUser?.id !== undefined) {
    const produtoUserId = produto?.id_usuario?.id;
    console.log('ID do usuário do produto:', produtoUserId);
    console.log('ID do usuário logado:', loggedInUser.id);

    if (produtoUserId !== null && produtoUserId !== undefined && produtoUserId === loggedInUser.id) {
      isDono = true;
    }
  }

  // console.log('isDono:', isDono);

  

useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
      setShowInfo(false);
    }
  }

  if (showInfo) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showInfo]);

  return (
    <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 
                    flex flex-col justify-start items-start overflow-visible
                    w-64 h-96 p-4 border border-gray-200 cursor-pointer">

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
      
      {produto.ingrediente && (
        <p className="text-sm text-gray-700 leading-snug max-h-16 overflow-hidden text-ellipsis flex-grow"> 
          <span className="font-semibold">Ingredientes:</span> {produto.ingrediente}
        </p>
      )}

      <div className="w-full flex-shrink-0 flex justify-center items-center py-2">
        {isDono && (
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
  <>
    <button
      onClick={() => setShowInfo(!showInfo)}
      className={`transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:border-2 border-orange-400 cursor-pointer absolute top-4 left-4 flex items-center justify-center
        w-10 h-10 rounded-full font-bold text-lg shadow-md
        ${getNutriScoreClasses(produto.nutriScore)} transition duration-200 z-20`}
      title="Clique para saber mais sobre o NutriScore"
    >
      {produto.nutriScore}
    </button>

    {showInfo && (
      <div
        ref={tooltipRef}
        className="absolute top-20 left-4 w-60 p-3 bg-white text-gray-800 border border-gray-300 
                    rounded-lg shadow-xl text-sm z-40 origin-top-left 
                    transform scale-95 opacity-0 transition-all duration-200 ease-out 
                    animate-[fadeIn_0.2s_ease-out_forwards]
                    before:content-[''] before:absolute before:-top-2 before:left-6 
                    before:border-8 before:border-transparent before:border-b-white"


  >

        <strong className="block text-base mb-1">{getNutriScoreDescricao(produto.nutriScore).titulo}</strong>
        <p>{getNutriScoreDescricao(produto.nutriScore).descricao}</p>
      </div>
    )}
  </>
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

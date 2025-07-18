import { Link } from 'react-router-dom';
import type Categoria from '../../../models/Categoria';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { PencilSimpleLine, Trash } from '@phosphor-icons/react';

interface CardCategoriaProps {
  categoria: Categoria;
}

function CardCategorias({ categoria }: CardCategoriaProps) {
  const { usuario } = useContext(AuthContext);
  const isDono = usuario?.token !== undefined && usuario?.token !== ""; 

  return (
    <div className='flex flex-col items-center justify-start gap-2 md:gap-3 
                    w-40 h-52 md:w-48 md:h-60 rounded-xl md:rounded-2xl 
                    p-2 md:p-4 text-center 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-amber-200 
                    cursor-pointer relative overflow-hidden '> 

      {/* Imagem da categoria - AGORA CIRCULAR E MAIS PROEMINENTE */}
      <div className="bg-amber-100 relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden hover:bg-white
                      border-4 border-orange-400 shadow-md flex-shrink-0 mb-2"> {/* Moldura para a imagem circular */}
        <img
          src={categoria.imagem || 'https://placehold.co/144x144/F0F0F0/ADADAD?text=Cat'} // Placeholder circular
          alt={`Imagem da categoria ${categoria.descricao}`}
          className="w-full h-full object-cover" 
        />
        {/* Overlay sutil no hover para interação */}
        <div className="absolute inset-0  bg-opacity-10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Descrição da categoria - Abaixo da imagem circular */}
      <div className='flex-grow flex items-center justify-center py-1 px-2'> {/* Permite que o texto cresça e centraliza */}
        <p className='font-bold text-base md:text-lg text-gray-800 leading-tight'>
          {categoria.descricao}
        </p>
      </div>

      {/* Botões de edição/exclusão (apenas se for "dono") - NOVO POSICIONAMENTO: CANTO SUPERIOR DIREITO */}
      {isDono && (
        <div className="absolute top-2 right-2 flex gap-1 bg-white rounded-full p-1 shadow-lg z-10"> {/* Posicionado no canto superior direito */}
          <Link
            to={`/editarcategoria/${categoria.id}`}
            className='p-1 rounded-full bg-yellow-500 text-white 
                       hover:bg-yellow-600 hover:scale-110 transition-all duration-200 
                       flex items-center justify-center'
            title="Editar Categoria"
          >
            <PencilSimpleLine size={16} weight="bold" /> {/* Ícone ligeiramente menor */}
          </Link>

          <Link
            to={`/deletarcategoria/${categoria.id}`}
            className='p-1 rounded-full bg-red-500 text-white 
                       hover:bg-red-600 hover:scale-110 transition-all duration-200 
                       flex items-center justify-center'
            title="Deletar Categoria"
          >
            <Trash size={16} weight="bold" /> {/* Ícone ligeiramente menor */}
          </Link>
        </div>
      )}
    </div>
  );
}

export default CardCategorias;
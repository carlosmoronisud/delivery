import { Link } from 'react-router-dom';
import type Categoria from '../../../models/Categoria';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';
import { Pencil, Trash } from '@phosphor-icons/react';


interface CardCategoriaProps {
  categoria: Categoria;
}

function CardCategorias({ categoria }: CardCategoriaProps) {
  const { usuario } = useContext(AuthContext);
  const token = usuario?.token;

  const isDono = token !== undefined && token !== "";

  return (
    <div className='w-65 flex flex-col rounded-2xl overflow-hidden bg-[#FEF8EA] hover:scale-105 hover:shadow-2xl hover:cursor-pointer transition duration-200'>

      <img
        src={categoria.imagem}
        alt={`Foto de ${categoria.descricao}`}
        className="w-60 h-60 mx-auto mb-4 object-cover rounded-xl mt-4"
      />

      <div className='font-bold text-xl flex items-center justify-center pb-2 text-center px-4'>
        {categoria.descricao}
      </div>

      {isDono && (
        <div className="flex justify-between px-14 py-3">
          <Link
            to={`/editarcategoria/${categoria.id}`}
            className='hover:scale-125 transition duration-200 flex items-center hover:text-red-950'
          >
            <Pencil />
          </Link>

          <Link
            to={`/deletarcategoria/${categoria.id}`}
            className='hover:scale-125 transition duration-200 flex items-center hover:text-red-950'
          >
            <Trash />
          </Link>
        </div>
      )}
    </div>
  );
}

export default CardCategorias;

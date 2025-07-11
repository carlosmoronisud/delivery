import { Link } from 'react-router-dom';
import ListarCategorias from '../../components/categorias/listarcategorias/ListarCategorias';
import { GrAdd } from "react-icons/gr";

function Categorias() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#F4BF4F] via-[#F7E8B8] to-[#F1EDD2] flex flex-col gap-10 py-10'>

      {/* Cabeçalho */}
      <div className='flex flex-col items-center justify-center gap-4 px-4' >
        <h1 className='text-4xl md:text-6xl font-bold text-neutral-800 text-center'>
          Categorias
        </h1>

        {/* Botão Nova Categoria */}
        <div className='w-full flex justify-center md:justify-end md:pr-16'>
          <Link to="/cadastrarcategoria">
            <button
              className="w-44 md:w-48 bg-[#262401] text-white py-3 px-4 flex items-center justify-center gap-2 rounded-lg 
                         hover:scale-105 hover:shadow-lg transition duration-200"
            >
              <p className="text-sm md:text-base">Nova Categoria</p>
              <GrAdd size={20} />
            </button>
          </Link>
        </div>
      </div>

      {/* Lista de Categorias */}
      <div className='px-4 md:px-16'>
        <ListarCategorias />
      </div>
    </div>
  );
}

export default Categorias;

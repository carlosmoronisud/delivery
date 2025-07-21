import { Link } from 'react-router-dom';
import ListarCategorias from '../../components/categorias/listarcategorias/ListarCategorias'; 
import { PlusCircle } from "@phosphor-icons/react"; 
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

function Categorias() {
    const { usuario, isBackendUser } = useContext(AuthContext); 

    const shouldShowAddCategoryButton = usuario.token && isBackendUser;

    return (
        // Adicionado pt-16 (padding-top de 64px) para mobile e pt-20 (80px) para desktop
        // para compensar a altura da Navbar fixa/pegajosa.
        <div className='min-h-screen bg-gray-50 flex flex-col font-sans pt-16 md:pt-20'> 

            {/* Header Section: Title and Add Category Button */}
            <div className='w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12 md:py-20 shadow-lg'>
                <h1 className='text-4xl md:text-6xl font-extrabold leading-tight text-center md:text-left drop-shadow-md mb-6 md:mb-0'>
                    Todas as Categorias <br className="hidden md:inline"/>Culinárias! 🍽️
                </h1>

                {/* "Nova Categoria" Button */}
                <div className='flex justify-center md:justify-end'>
                    {shouldShowAddCategoryButton && ( 
                        <Link to="/cadastrarcategoria">
                            <button
                                className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg md:text-xl shadow-xl 
                                          hover:scale-105 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                                          flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Nova Categoria
                                <PlusCircle size={24} weight="bold" /> 
                            </button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Category List Section */}
            <div className='px-6 md:px-16 py-12'> 
                <ListarCategorias />
            </div>
        </div>
    );
}

export default Categorias;
import { Link } from 'react-router-dom';
import FiltroProduto from '../../components/filtros/FiltroProduto'; 
import ListarProdutos from '../../components/produto/listarprodutos/ListarProdutos'; 
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { PlusCircle } from "@phosphor-icons/react"; 

function Produtos() {
  const { usuario, isBackendUser } = useContext(AuthContext); 

  const shouldShowAddProductButton = usuario.token && isBackendUser;

  return (
    // Adicionado pt-16 (padding-top de 64px) para mobile e pt-20 (80px) para desktop
    // para compensar a altura da Navbar fixa/pegajosa.
    // Isso empurra o conteúdo da página para baixo da Navbar.
    <div className="w-full bg-gray-100 min-h-screen flex flex-col font-sans pt-16 md:pt-20"> 

      {/* Banner Principal de Produtos - Este header não é a navbar, mas o banner da página de produtos */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12 md:py-20 shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-center md:text-left drop-shadow-md mb-6 md:mb-0">
          Encontre seu <br className="hidden md:inline"/>Prato Perfeito! ✨
        </h1>
        
        <div className="flex justify-center md:justify-end">
          {shouldShowAddProductButton && ( 
            <Link to="/cadastrarproduto">
              <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg md:text-xl shadow-xl 
                                 hover:scale-105 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                                 flex items-center justify-center gap-2 cursor-pointer">
                Adicionar Produto
                <PlusCircle size={24} weight="bold" /> 
              </button>
            </Link> 
          )}
        </div>
      </div>

      {/* Conteúdo principal - Layout responsivo com filtros e produtos */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12 px-6 md:px-16 py-12">
        <FiltroProduto />

        <section className="flex-1">
          <ListarProdutos />
        </section>
      </div>
    </div>
  );
}

export default Produtos;
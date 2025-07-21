// src/pages/produtos/Produtos.tsx
import { Link } from 'react-router-dom';
import FiltroProduto from '../../components/filtros/FiltroProduto'; 
import ListarProdutos from '../../components/produto/listarprodutos/ListarProdutos'; 
import { useContext } from 'react'; // Importar useContext
import { AuthContext } from '../../contexts/AuthContext'; // Importar AuthContext

function Produtos() {
  const { usuario, isGoogleUser } = useContext(AuthContext); // Obter usuario e isGoogleUser do contexto

  // Condição para exibir o botão: usuário logado E NÃO é usuário Google
  const shouldShowAddProductButton = usuario.token && !isGoogleUser;

  return (
    <div className="w-full bg-gray-100 min-h-screen flex flex-col font-sans"> 

      {/* Cabecalho principal */}
      <div className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white flex flex-col md:flex-row justify-between items-center px-6 md:px-16 py-12 md:py-20 shadow-lg">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-center md:text-left drop-shadow-md mb-6 md:mb-0">
          Encontre seu <br className="hidden md:inline"/>Prato Perfeito! ✨
        </h1>
        
        <div className="flex justify-center md:justify-end">
          {shouldShowAddProductButton && ( // Renderiza o botão condicionalmente
            <Link to="/cadastrarproduto">
              <button className="bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg md:text-xl shadow-xl 
                                 hover:scale-105 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                                 flex items-center justify-center gap-2 cursor-pointer">
                Adicionar Produto
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-88H136V96a8,8,0,0,0-16,0v32H88a8,8,0,0,0,0,16h32v32a8,8,0,0,0,16,0V144h32a8,8,0,0,0,0-16Z"/></svg>
              </button>
            </Link> 
          )}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-col lg:flex-row justify-between gap-8 md:gap-12 px-6 md:px-16 py-12">
        <aside className="w-full lg:w-1/3 p-6 bg-white rounded-xl shadow-lg border border-gray-100 h-fit sticky top-4">
          <FiltroProduto />
        </aside>

        {/* Produtos à direita - Grid dinâmico */}
        <section className="flex-1">
          <ListarProdutos />
        </section>
      </div>
    </div>
  );
}

export default Produtos;
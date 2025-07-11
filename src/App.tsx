import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Componentes da sua versão (priorizados para páginas principais)
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/homePage'; // Renomeado para Home no App.tsx
import Produtos from './pages/produtos/Produtos'; // Sua página de produtos
import Categorias from './pages/categorias/Categorias'; // Sua página de categorias
import Sobre from './pages/sobre/Sobre';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import Usuarios from './pages/usuarios/Usuarios';


// Componentes de formulário/deleção (usando os nomes e caminhos que você já tinha ou os mais completos)
import FormCategoria from './components/categorias/formcategorias/FormCategorias'; // Seu FormCategoria
import DeletarCategoria from './components/categorias/deletecategoria/DeleteCategorias'; // Seu DeletarCategoria
import FormProduto from './components/produto/formprodutos/FormProdutos'; // Seu FormProduto
import DeletarProduto from './components/produto/deleteproduto/DeleteProdutos'; // Seu DeletarProduto

// Componentes do professor que você precisa integrar


// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Utilitários
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importar CSS do Toastify
import RotaPrivada from './contexts/RotaPrivada';
import Cart from './carrinho/Cart';
import FormUsuario from './components/formusuario/FormUsuario';


/**
 * Tipo (type) para controlar o estado do Menu Mobile (aberto ou fechado)
 */
type MenuState = 'closed' | 'open';

function App() {
  // Estado para controlar se o Menu Mobile está aberto ou fechado (do código do professor)
  const [menuState, setMenuState] = useState<MenuState>('closed');

  // Função para alternar o estado do Menu Mobile (abrir/fechar) (do código do professor)
  const toggleMenu = (): void => {
    setMenuState(prevState => prevState === 'closed' ? 'open' : 'closed');
  };

  // Função para fechar o Menu Mobile (usada em eventos de navegação ou clique fora) (do código do professor)
  const closeMenu = (): void => {
    setMenuState('closed');
  };

  // Função para verificar se o Footer deve ser exibido (só aparece quando o Menu Mobile está fechado) (do código do professor)
  const shouldShowFooter = (): boolean => menuState === 'closed';

  return (
    // Ordem dos Providers: GoogleOAuthProvider -> AuthProvider -> CartProvider -> BrowserRouter
    // Isso garante que todos os contextos estejam disponíveis para os componentes internos.
    <GoogleOAuthProvider clientId="323883270092-ke6bscn6njau06ssposa02vtsto0rdv7.apps.googleusercontent.com">
      <AuthProvider>
        <CartProvider> {/* CartProvider deve estar dentro de AuthProvider se usar dados de usuário */}
          <ToastContainer /> {/* ToastContainer para notificações */}
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              {/* Navbar fixa no topo em mobile, relativa no desktop */}
              <div className="md:relative">
                <Navbar
                  menuState={menuState} // Estado do menu mobile
                  onMenuToggle={toggleMenu} // Alterna menu mobile
                  onMenuClose={closeMenu} // Fecha menu mobile
                />
              </div>

              {/* Conteúdo principal da página, com rotas e responsividade */}
              {/* Ajuste de classes para o conteúdo principal */}
              <div className="flex-1 bg-slate-100 md:pt-0 md:pb-0 max-h-[calc(100vh-64px)] overflow-auto md:max-h-full">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} /> {/* Mantido para compatibilidade */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/usuarios/cadastrar" element={<Cadastro />} /> {/* Rota de cadastro de usuário */}
                  <Route path="/sobre" element={<Sobre />} />

                  {/* Rotas de listagem de produtos e categorias (suas páginas) */}
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/categorias" element={<Categorias />} />

                  {/* Rotas protegidas (somente usuário logado) */}
                  <Route path="/usuarios" element={<RotaPrivada><Usuarios /></RotaPrivada>} />
                  <Route path="/perfil/:id" element={<RotaPrivada><FormUsuario /></RotaPrivada>} /> {/* Rota de atualização de perfil */}

                  {/* Rotas de Categoria (Formulários e Deletar) */}
                  <Route path="/cadastrarcategoria" element={<RotaPrivada><FormCategoria /></RotaPrivada>} /> {/* Sua rota de cadastro */}
                  <Route path="/editarcategoria/:id" element={<RotaPrivada><FormCategoria /></RotaPrivada>} />
                  <Route path="/deletarcategoria/:id" element={<RotaPrivada><DeletarCategoria /></RotaPrivada>} />

                  {/* Rotas de Produto (Formulários e Deletar) */}
                  <Route path="/cadastrarproduto" element={<RotaPrivada><FormProduto /></RotaPrivada>} /> {/* Sua rota de cadastro */}
                  <Route path="/editarproduto/:id" element={<RotaPrivada><FormProduto /></RotaPrivada>} />
                  <Route path="/deletarproduto/:id" element={<RotaPrivada><DeletarProduto /></RotaPrivada>} />

                  {/* Rota do Carrinho de Compras */}
                  <Route path="/cart" element={<Cart />} />
                </Routes>
              </div>

              {/* Footer só aparece quando o menu mobile está fechado */}
              <div className={`${shouldShowFooter() ? 'block' : 'hidden'} md:static`}>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Componentes da sua versão
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './pages/home/homePage';
import Produtos from './pages/produtos/Produtos';
import Categorias from './pages/categorias/Categorias';
import Sobre from './pages/sobre/Sobre';
import Login from './pages/login/Login';
import Cadastro from './pages/cadastro/Cadastro';
import Usuarios from './pages/usuarios/Usuarios';

// Componentes de formulário/deleção
import FormCategoria from './components/categorias/formcategorias/FormCategorias';
import DeletarCategoria from './components/categorias/deletecategoria/DeleteCategorias';
import FormProduto from './components/produto/formprodutos/FormProdutos';
import DeletarProduto from './components/produto/deleteproduto/DeleteProdutos';

// Componentes do carrinho e finalização
import FormUsuario from './components/formusuario/FormUsuario'; 
import OrderTracking from './components/carrinho/cart/OrderTraking';


// Contextos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Utilitários
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RotaPrivada from './contexts/RotaPrivada';
import CadastroRestaurante from './pages/cadastro/RestauranteCadastro';
import CadastroEntregador from './pages/cadastro/EntregadoresCadastro';
import OrderConfirmation from './components/carrinho/cart/OrderConfirmation';
import { Cart } from './components/carrinho/cart/Cart';
import { UserLocationProvider } from './contexts/userLocation';


type MenuState = 'closed' | 'open';

function App() {
  const [menuState, setMenuState] = useState<MenuState>('closed');

  const toggleMenu = (): void => {
    setMenuState(prevState => prevState === 'closed' ? 'open' : 'closed');
  };

  const closeMenu = (): void => {
    setMenuState('closed');
  };

  const shouldShowFooter = (): boolean => menuState === 'closed';
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <UserLocationProvider>
        <CartProvider>
          <ToastContainer />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <div className="md:relative">
                <Navbar
                  menuState={menuState}
                  onMenuToggle={toggleMenu}
                  onMenuClose={closeMenu}
                />
              </div>

              <div className="flex-1 bg-slate-100 md:pt-0 md:pb-0 max-h-[calc(100vh-64px)] overflow-auto md:max-h-full">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/" element={<Home />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/usuarios/cadastrar" element={<Cadastro />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/cadastro-restaurante" element={<CadastroRestaurante />} />
                  <Route path="/cadastro-entregador" element={<CadastroEntregador />} />


                  {/* Rotas de listagem de produtos e categorias */}
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/categorias" element={<Categorias />} />

                  {/* Rota do Carrinho de Compras */}
                  <Route path="/cart" element={<Cart />} />

                  {/* NOVO: Rota de Confirmação de Pedido */}
                  <Route path="/order-confirmation" element={<RotaPrivada><OrderConfirmation /></RotaPrivada>}/>

                  {/* Rota de Acompanhamento de Pedido (agora pode receber um ID) */}
                  <Route path="/order-tracking/:orderId?" element={<RotaPrivada><OrderTracking /></RotaPrivada>} />

                  {/* Rotas protegidas (somente usuário logado) */}
                  <Route path="/usuarios" element={<RotaPrivada><Usuarios /></RotaPrivada>} />
                  <Route path="/perfil/:id" element={<RotaPrivada><FormUsuario /></RotaPrivada>} />

                  {/* Rotas de Categoria (Formulários e Deletar) */}
                  <Route path="/cadastrarcategoria" element={<RotaPrivada><FormCategoria /></RotaPrivada>} />
                  <Route path="/editarcategoria/:id" element={<RotaPrivada><FormCategoria /></RotaPrivada>} />
                  <Route path="/deletarcategoria/:id" element={<RotaPrivada><DeletarCategoria /></RotaPrivada>} />

                  {/* Rotas de Produto (Formulários e Deletar) */}
                  <Route path="/cadastrarproduto" element={<RotaPrivada><FormProduto /></RotaPrivada>} />
                  <Route path="/editarproduto/:id" element={<RotaPrivada><FormProduto /></RotaPrivada>} />
                  <Route path="/deletarproduto/:id" element={<RotaPrivada><DeletarProduto /></RotaPrivada>} />
                </Routes>
              </div>

              {/* Footer só aparece quando o menu mobile está fechado */}
              <div className={`${shouldShowFooter() ? 'block' : 'hidden'} md:static`}>
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </CartProvider>
        </UserLocationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
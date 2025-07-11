import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Sobre from "./pages/sobre/Sobre";
import Produtos from "./pages/produtos/Produtos";
import Home from "./pages/home/homePage";
import Footer from "./components/footer/Footer";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/login/Login";
import { ToastContainer } from "react-toastify";
import Cadastro from "./pages/cadastro/Cadastro";
import FormCategoria from "./components/categorias/formcategorias/FormCategorias";
import DeletarCategoria from "./components/categorias/deletecategoria/DeleteCategorias";
import RotaPrivada from "./contexts/RotaPrivada";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Usuarios from "./pages/usuarios/Usuarios";
import Categorias from "./pages/categorias/Categorias";
import FormProduto from "./components/produto/formprodutos/FormProdutos";
import DeletarProduto from "./components/produto/deleteproduto/DeleteProdutos";



function App() {
  return (
    
    <GoogleOAuthProvider clientId="323883270092-ke6bscn6njau06ssposa02vtsto0rdv7.apps.googleusercontent.com">
    <AuthProvider>
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <div className="flex flex-col min-h-screen">
          <div className="flex-1">
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/usuarios/cadastrar" element={<Cadastro />} />
              <Route path="/home" element={<Home />} />
              <Route path="/produtos" element={<Produtos />} />
              <Route path="/categorias" element={<Categorias />} />
              <Route path="/sobre" element={<Sobre />} />

              {/* Rotas protegidas (somente usuário logado) */}
              <Route path="/usuarios"
                element={<RotaPrivada>
                  <Usuarios />
                  </RotaPrivada>  
                } />

              <Route
                path="/cadastrarcategoria"
                element={
                  <RotaPrivada>
                    <FormCategoria />
                  </RotaPrivada>
                }
              />
              <Route
                path="/editarcategoria/:id"
                element={
                  <RotaPrivada>
                    <FormCategoria />
                  </RotaPrivada>
                }
              />
              <Route path="/deletarcategoria/:id"element={<RotaPrivada><DeletarCategoria /></RotaPrivada>}/>

              {/* Se tiver: */}
              <Route path="/cadastrarproduto" element={<RotaPrivada><FormProduto /></RotaPrivada>} /> 
              <Route path="/editarproduto/:id" element={<RotaPrivada><FormProduto /></RotaPrivada>} />
              <Route path="/editarproduto/:id" element={<RotaPrivada><FormProduto /></RotaPrivada>} />
              <Route path="/deletarproduto/:id" element={<RotaPrivada><DeletarProduto /></RotaPrivada>} />

            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;

// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

import Sobre from "./pages/sobre/Sobre";
import Categorias from "./pages/categorias/Categorias";
import Produtos from "./pages/produtos/Produtos";
import Home from "./pages/home/homePage";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        { <Route path="/categorias" element={<Categorias />} />}
        {<Route path="/oportunidades" element={<Produtos />} />}
        {<Route path="/sobre" element={<Sobre />} />}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

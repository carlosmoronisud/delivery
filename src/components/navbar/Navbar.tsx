import { List, ShoppingCartSimple, User, X } from "@phosphor-icons/react"; // MagnifyingGlass removido
import { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";

type MenuState = 'closed' | 'open';

interface NavbarProps {
  menuState: MenuState;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

function Navbar({ menuState, onMenuToggle, onMenuClose }: Readonly<NavbarProps>) {
  const navigate = useNavigate();
  const { quantidadeItems } = useContext(CartContext);
  const { usuario, handleLogout } = useContext(AuthContext);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = (): void => {
    onMenuToggle();
  };

  const handleMenuClose = (): void => {
    onMenuClose();
  };

  function logout() {
    handleLogout();
    ToastAlerta("O usuário foi desconectado com sucesso!", 'info');
    navigate("/login");
  }

  let navPerfil;

  if (usuario.token) {
    navPerfil = (
      <>
        <Link to={`/perfil/${usuario.id}`} className="flex items-center">
          {usuario.foto ? (
            <img
              src={usuario.foto}
              alt="Foto de perfil"
              className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400 cursor-pointer"
              title={usuario.nome || "Meu Perfil"}
            />
          ) : (
            <User size={32} weight="bold" className="text-gray-700 hover:text-yellow-300 transition-transform cursor-pointer" />
          )}
        </Link>
        <button
          onClick={logout}
          className="hover:underline text-red-600 font-medium hover:text-yellow-300 transition-transform cursor-pointer"
        >
          Sair
        </button>
      </>
    );
  } else {
    navPerfil = (
      <Link to='/login'>
        <User size={32} weight='bold' className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer" aria-label="Login" />
      </Link>
    );
  }

  return (
    <>
      <div className='fixed md:relative top-0 left-0 z-50 w-full bg-gray-50 text-black flex justify-center py-4 md:py-2'>
        <div className="container mx-6 mt-2 md:mt-0 flex items-center justify-between text-lg pr-10 pl-10">
          <Link to='/home'>
            <img
              src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
              alt="Logo"
              className='h-20 rounded-full'
            />
          </Link>

          {/* Barra de busca removida aqui */}

          <div className='hidden md:flex items-center gap-8 py-4'>
            <Link to='/home' className='hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer'>Home</Link>
            <Link to='/produtos' className='hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer'>Produtos</Link>
            <Link to='/categorias' className='hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer'>Categorias</Link>
            <Link to='/sobre' className='hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer'>Sobre</Link>
            {/* Links para Usuários visíveis apenas para usuários logados com token */}
            {usuario.token && (
              <Link to="/usuarios" className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer">Usuários</Link>
            )}

            <div className="flex items-center gap-4">
              {navPerfil}
              <Link to="/cart" className="relative flex items-center hover:scale-115 hover:text-yellow-300 transition-transform cursor-pointer">
                <ShoppingCartSimple size={32} weight="bold" />
                {quantidadeItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {quantidadeItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {menuState === 'closed' && (
            <button className="p-2 md:hidden cursor-pointer text-gray-700" onClick={handleMenuToggle} aria-label="Abrir menu">
              <List size={32} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {menuState === 'open' && (
        <div
          ref={menuRef}
          className="fixed top-0 left-0 z-50 h-full w-full bg-gray-900 bg-opacity-95 md:hidden transition-all duration-300 ease-in-out animate-fade-in animate-slide-in"
          style={{ animation: 'fade-in 0.3s, slide-in 0.3s' }}
        >
          <div className="relative flex flex-col items-start justify-start gap-2 p-6 text-left text-lg text-white">
            <div className="flex w-full items-center justify-between mb-4">
              <img
                src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
                alt="Logo"
                className='h-20 rounded-full'
              />
              <button
                type="button"
                aria-label="Fechar menu"
                className="text-white hover:text-gray-300 mr-2 cursor-pointer"
                onClick={handleMenuClose}
              >
                <X size={32} weight="bold" />
              </button>
            </div>

            {/* Barra de busca mobile removida aqui */}

            <Link to='/home' onClick={handleMenuClose} className="py-2 text-white hover:text-yellow-300">Home</Link>
            <Link to='/produtos' onClick={handleMenuClose} className="py-2 text-white hover:text-yellow-300">Produtos</Link>
            <Link to='/categorias' onClick={handleMenuClose} className="py-2 text-white hover:text-yellow-300">Categorias</Link>
            <Link to='/sobre' onClick={handleMenuClose} className="py-2 text-white hover:text-yellow-300">Sobre</Link>
            {/* Links de cadastro no mobile, se o usuário estiver logado */}
            {usuario.token && (
              <Link to="/usuarios" onClick={handleMenuClose} className="py-2 text-white hover:text-yellow-300">Usuários</Link>
            )}

            <div className='mt-4 flex gap-6 items-center'>
              {usuario.token ? (
                <>
                  <Link to={`/perfil/${usuario.id}`} onClick={handleMenuClose} className="flex items-center">
                    {usuario.foto ? (
                      <img
                        src={usuario.foto}
                        alt="Foto de perfil"
                        className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400"
                      />
                    ) : (
                      <User size={32} weight="bold" className="text-white" />
                    )}
                  </Link>
                  <button
                    onClick={() => { handleMenuClose(); logout(); }}
                    className="text-red-600 font-medium hover:text-yellow-300"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link to='/login' onClick={handleMenuClose}>
                  <User size={32} weight='bold' className="text-white" />
                </Link>
              )}

              <Link to='/cart' onClick={handleMenuClose} className="relative flex items-center">
                <ShoppingCartSimple size={32} weight='bold' className="text-white" />
                {quantidadeItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {quantidadeItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
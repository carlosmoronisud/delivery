import { List, ShoppingCartSimple, User, X } from "@phosphor-icons/react";
import { useContext, useRef, useState } from "react"; // useRef já importado aqui!
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

  // Estado para gerenciar a visibilidade do menu dropdown do perfil
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Ref para o menu dropdown do perfil (para cliques fora, se implementado)
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // *** AQUI ESTÁ A CORREÇÃO: DECLARAÇÃO DE menuRef ***
  const menuRef = useRef<HTMLDivElement>(null); // Declarando e inicializando menuRef

  const handleMenuToggle = (): void => {
    onMenuToggle();
    setIsProfileMenuOpen(false); // Fecha o menu de perfil se o menu principal é alternado
  };

  const handleMenuClose = (): void => {
    onMenuClose();
    setIsProfileMenuOpen(false); // Fecha o menu de perfil se o menu principal é fechado
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(prev => !prev);
  };

  const closeProfileMenu = () => {
    setIsProfileMenuOpen(false);
  };


  function logout() {
    handleLogout();
    ToastAlerta("O usuário foi desconectado com sucesso!", 'info');
    navigate("/login");
    closeProfileMenu(); // Fecha o dropdown após o logout
  }

  // Lógica do conteúdo do perfil (ícone/foto e dropdown)
  let navPerfilContent; 

  if (usuario.token) {
    navPerfilContent = (
      <div className="relative" ref={profileMenuRef}> {/* Container para o ícone de perfil e dropdown */}
        <button
          onClick={toggleProfileMenu}
          className="flex items-center focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full transition-transform transform hover:scale-105 cursor-pointer"
          title={usuario.nome || "Meu Perfil"}
          aria-label="Abrir menu de perfil"
        >
          {usuario.foto ? (
            <img
              src={usuario.foto}
              alt="Foto de perfil"
              className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400"
            />
          ) : (
            <User size={32} weight="bold" className="text-gray-700 hover:text-yellow-300" />
          )}
        </button>

        {/* Menu Dropdown do Perfil */}
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
            <Link
              to={`/perfil/${usuario.id}`}
              onClick={closeProfileMenu} // Fecha o dropdown ao clicar
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-600 transition-colors duration-150 text-base"
            >
              Meu Perfil
            </Link>
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 text-base"
            >
              Sair
            </button>
          </div>
        )}
      </div>
    );
  } else {
    // Se não estiver logado, mostra um link/ícone de login simples
    navPerfilContent = (
      <Link to='/login' className="flex items-center">
        <User size={32} weight='bold' className="text-gray-700 hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer" aria-label="Login" />
      </Link>
    );
  }

  return (
    <>
      {/* Navbar Principal (Cabeçalho Desktop e Mobile) */}
      <div className='fixed md:relative top-0 left-0 z-50 w-full bg-gray-50 text-gray-800 flex justify-center py-4 shadow-md'>
        <div className="container mx-auto px-6 md:px-8 flex items-center justify-between text-lg font-medium">
          
          {/* Logo */}
          <Link to='/home'>
            <img
              src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
              alt="Logo do Delivery"
              className='h-16 md:h-20 rounded-full object-cover'
            />
          </Link>

          {/* Links de Navegação Desktop */}
          <div className='hidden md:flex items-center gap-8'>
            <Link to='/home' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Home</Link>
            <Link to='/produtos' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Produtos</Link>
            <Link to='/categorias' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Categorias</Link>
            <Link to='/sobre' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Sobre</Link>
            {usuario.token && (
              <Link to="/usuarios" className="hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer">Usuários</Link>
            )}

            {/* Ícones de Perfil e Carrinho - Desktop */}
            <div className="flex items-center gap-6 pl-4 border-l border-gray-200">
              {navPerfilContent} {/* Renderiza o ícone/dropdown do perfil */}
              <Link to="/cart" className="relative flex items-center hover:scale-115 hover:text-orange-600 transition-transform cursor-pointer">
                <ShoppingCartSimple size={30} weight="bold" />
                {quantidadeItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {quantidadeItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Botão para Abrir Menu Mobile */}
          {menuState === 'closed' && (
            <button className="p-2 md:hidden cursor-pointer text-gray-700 hover:text-orange-600 transition-colors" onClick={handleMenuToggle} aria-label="Abrir menu">
              <List size={32} weight="bold" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Lateral Mobile */}
      {menuState === 'open' && (
        <div
          ref={menuRef} // Uso do menuRef aqui!
          className="fixed top-0 left-0 z-50 h-full w-full bg-gray-900 bg-opacity-95 md:hidden transition-all duration-300 ease-in-out transform translate-x-0"
          style={{ animation: 'fade-in 0.3s forwards, slide-in 0.3s forwards' }}
        >
          <div className="relative flex flex-col items-start justify-start gap-4 p-6 text-left text-lg text-white">
            <div className="flex w-full items-center justify-between mb-6">
              <img
                src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
                alt="Logo do Delivery"
                className='h-16 rounded-full object-cover'
              />
              <button
                type="button"
                aria-label="Fechar menu"
                className="text-white hover:text-orange-400 cursor-pointer p-2 rounded-full"
                onClick={handleMenuClose}
              >
                <X size={32} weight="bold" />
              </button>
            </div>

            {/* Links de Navegação Mobile */}
            <Link to='/home' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Home</Link>
            <Link to='/produtos' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Produtos</Link>
            <Link to='/categorias' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Categorias</Link>
            <Link to='/sobre' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Sobre</Link>
            {usuario.token && (
              <Link to="/usuarios" onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Usuários</Link>
            )}
            
            {/* Ícones de Perfil e Carrinho - Mobile */}
            <div className='mt-8 flex flex-col w-full gap-4 pt-4 border-t border-gray-700'>
              {usuario.token ? (
                <>
                  <Link to={`/perfil/${usuario.id}`} onClick={handleMenuClose} className="flex items-center text-white hover:text-orange-400">
                    {usuario.foto ? (
                      <img
                        src={usuario.foto}
                        alt="Foto de perfil"
                        className="h-10 w-10 rounded-full object-cover border-2 border-yellow-400 mr-3"
                      />
                    ) : (
                      <User size={32} weight="bold" className="text-white mr-3" />
                    )}
                    Meu Perfil
                  </Link>
                  <button
                    onClick={() => { handleMenuClose(); logout(); }}
                    className="w-full text-left text-red-400 font-medium hover:text-red-500 py-2"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link to='/login' onClick={handleMenuClose} className="flex items-center text-white hover:text-orange-400">
                  <User size={32} weight='bold' className="text-white mr-3" />
                  Login
                </Link>
              )}

              <Link to='/cart' onClick={handleMenuClose} className="relative flex items-center text-white hover:text-orange-400">
                <ShoppingCartSimple size={32} weight='bold' className="text-white mr-3" />
                Carrinho
                {quantidadeItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white transform translate-x-1/2 -translate-y-1/2">
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
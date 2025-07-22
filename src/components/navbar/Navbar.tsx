import { List, ShoppingCartSimple, User, X, MagnifyingGlass } from "@phosphor-icons/react";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { AuthContext } from "../../contexts/AuthContext";
import { ToastAlerta } from "../../utils/ToastAlerta";
import LocationButton from "../botaolocalozacao/LocationButton";


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

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleMenuToggle = (): void => {
        onMenuToggle();
        setIsProfileMenuOpen(false);
    };

    const handleMenuClose = (): void => {
        onMenuClose();
        setIsProfileMenuOpen(false);
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
        closeProfileMenu();
    }

    let navPerfilContent; 

    if (usuario.token) {
        navPerfilContent = (
            <div className="relative" ref={profileMenuRef}>
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

                {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 animate-fade-in-down">
                        <Link
                            to={`/perfil/${usuario.id}`}
                            onClick={closeProfileMenu}
                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-600 transition-colors duration-150 text-base"
                        >
                            Meu Perfil
                        </Link>
                        {usuario.token && ( // Renderiza "Usuários" dentro do dropdown se logado
                            <Link 
                                to="/usuarios" 
                                onClick={closeProfileMenu} 
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-orange-600 transition-colors duration-150 text-base"
                            >
                                Usuários
                            </Link>
                        )}
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
        navPerfilContent = (
            <Link to='/login' className="flex items-center">
                <User size={32} weight='bold' className="text-gray-700 hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer" aria-label="Login" />
            </Link>
        );
    }

    return (
        <>
            <div className='fixed md:relative top-0 left-0 z-50 w-full bg-gray-50 text-gray-800 flex justify-center py-4 shadow-md'>
                <div className="container mx-auto px-6 md:px-8 flex items-center justify-between text-lg font-medium">
                    
                    {/* Logo */}
                    <Link to='/home' className="flex-shrink-0">
                        <img
                            src="https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2021,%202025,%2008_36_03%20PM.png?updatedAt=1753140984875"
                            alt="Logo do Delivery"
                            className='h-16 md:h-20 rounded-full object-cover'
                        />
                    </Link>

                    {/* Seção Central: Localização e Busca (Desktop Only) */}
                    <div className="hidden md:flex flex-grow items-center justify-center gap-4 mx-8">
                        {/* Botão de Localização (Desktop) */}
                        <LocationButton /> {/* Usa o componente LocationButton que consome o contexto */}

                        {/* Campo de Busca (Desktop) */}
                        <div className="relative flex-grow max-w-md">
                            <input 
                                type="text" 
                                placeholder="Buscar itens ou lojas..." 
                                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-800 text-base"
                            />
                            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                        </div>
                    </div>

                    {/* Ícones de Ação (Desktop) */}
                    <div className='hidden md:flex items-center gap-6'>
                        <Link to='/produtos' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Produtos</Link>
                        <Link to='/categorias' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Categorias</Link>
                        <Link to='/sobre' className='hover:scale-105 hover:text-orange-600 transition-transform cursor-pointer'>Sobre</Link> {/* Restaurado o link "Sobre" */}
                        
                        <div className="flex items-center gap-6 pl-4 border-l border-gray-200">
                            {navPerfilContent}
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

                    {/* Botão para Abrir Menu Mobile (e ícones importantes para Mobile) */}
                    <div className="flex items-center md:hidden gap-4">
                        {/* Campo de Busca Mobile */}
                        <button className="p-2 rounded-full bg-gray-100 text-gray-700 hover:text-orange-600 transition-colors" aria-label="Buscar">
                            <MagnifyingGlass size={24} weight="bold" />
                        </button>
                        {/* Carrinho Mobile */}
                        <Link to="/cart" className="relative flex items-center hover:scale-115 hover:text-orange-600 transition-transform cursor-pointer">
                            <ShoppingCartSimple size={24} weight="bold" />
                            {quantidadeItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                                    {quantidadeItems}
                                </span>
                            )}
                        </Link>
                        {/* Botão do Hambúrguer */}
                        {menuState === 'closed' && (
                            <button className="p-2 cursor-pointer text-gray-700 hover:text-orange-600 transition-colors" onClick={handleMenuToggle} aria-label="Abrir menu">
                                <List size={32} weight="bold" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Menu Lateral Mobile */}
            {menuState === 'open' && (
                <div
                    ref={menuRef}
                    className="fixed top-0 left-0 z-50 h-full w-full bg-gray-900 bg-opacity-95 md:hidden transition-all duration-300 ease-in-out transform translate-x-0"
                    style={{ animation: 'fade-in 0.3s forwards, slide-in-from-left 0.3s forwards' }}
                >
                    <div className="relative flex flex-col items-start justify-start gap-4 p-6 text-left text-lg text-white">
                        <div className="flex w-full items-center justify-between mb-6">
                            <img
                                src="https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2021,%202025,%2008_36_03%20PM.png?updatedAt=1753140984875"
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

                        {/* Botão de Localização no Menu Mobile */}
                        <LocationButton /> {/* <--- RENDERIZADO AQUI NO MOBILE */}

                        {/* Campo de Busca Mobile dentro do menu lateral */}
                        <div className="relative w-full mb-4">
                            <input 
                                type="text" 
                                placeholder="Buscar itens ou lojas..." 
                                className="w-full pl-12 pr-4 py-2 rounded-full bg-gray-600 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white placeholder-gray-300 text-base"
                            />
                            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>

                        {/* Links de Navegação Mobile */}
                        <Link to='/home' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Home</Link>
                        <Link to='/produtos' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Produtos</Link>
                        <Link to='/categorias' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Categorias</Link>
                        <Link to='/sobre' onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Sobre</Link>
                        {usuario.token && (
                            // O link "Usuários" é movido para o dropdown do perfil, não aqui no menu principal mobile
                            // <Link to="/usuarios" onClick={handleMenuClose} className="py-2 w-full text-white hover:text-orange-400 border-b border-gray-700">Usuários</Link>
                            null // Renderiza nulo aqui para não duplicar
                        )}
                        
                        {/* Ícones de Perfil e Carrinho - Mobile (no final do menu) */}
                        <div className='mt-8 flex flex-col w-full gap-4 pt-4 border-t border-gray-700'>
                            {navPerfilContent}
                            {/* O link do carrinho principal já está no cabeçalho mobile */}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
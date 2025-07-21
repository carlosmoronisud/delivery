/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { AuthContext } from '../../contexts/AuthContext';
import { RotatingLines } from "react-loader-spinner"; // Import RotatingLines


import type Usuario from "../../models/Usuario";
import CardUsuario from "../../components/cardusuario/CardUsuario"; // Assume this component exists and is styled
import { ToastAlerta } from "../../utils/ToastAlerta";
import { buscarTodosUsuarios, buscarUsuarioPorEmail, buscarUsuarioPorId, buscarUsuariosPorNome } from "../../services/UsuarioService";

function Usuarios() {
  const { usuario: loggedInUser, handleLogout } = useContext(AuthContext);
  const token = loggedInUser.token;

  const [filtro, setFiltro] = useState("");
  const [usuariosExibidos, setUsuariosExibidos] = useState<Usuario[]>([]);
  const [tipoBusca, setTipoBusca] = useState("meuPerfil"); // Default to 'meuPerfil'
  const [isLoadingContent, setIsLoadingContent] = useState(true); // Loader for content fetch

  // Admin ID is 7
  const isAdmin = loggedInUser.id === 7;

  // --- Initial Load: Fetch current user's profile ---
  useEffect(() => {
    if (loggedInUser.id !== null && loggedInUser.id !== undefined && token) { // Ensure ID and token exist
      // If admin, default to showing all users. Otherwise, show only own profile.
      if (isAdmin) {
          setTipoBusca("todos"); // Default admin view to 'todos'
          buscar(); // Trigger initial search for all users
      } else {
          setTipoBusca("meuPerfil"); // Default regular user view
          buscarMeuPerfil(); // Trigger initial search for own profile
      }
    } else {
        // Handle case where user is not logged in or token is missing
        ToastAlerta("Você precisa estar logado para ver usuários.", "info");
        handleLogout(); // Log out and redirect if not properly logged in
    }
  }, [loggedInUser.id, isAdmin, token]); // Add token to dependencies to re-run if it changes

  // --- Search for current user's profile ---
  async function buscarMeuPerfil() {
    if (loggedInUser.id === null || loggedInUser.id === undefined || !token) {
      ToastAlerta("ID do usuário ou token não encontrado para carregar o perfil.", "erro");
      setIsLoadingContent(false);
      return;
    }
    setIsLoadingContent(true);
    try {
      await buscarUsuarioPorId(loggedInUser.id, (res: Usuario) => setUsuariosExibidos([res]), { headers: { Authorization: token } });
    } catch (error: any) {
      console.error("Erro ao buscar seu perfil", error);
      ToastAlerta("Erro ao carregar seu perfil.", "erro");
      if (error.response?.status === 403 || error.response?.status === 401) {
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout();
      }
    } finally {
      setIsLoadingContent(false);
    }
  }

  // --- Generic Search Function (for Admin) ---
  async function buscar() {
    if (!isAdmin) { // Double check admin permission
      ToastAlerta("Apenas administradores podem buscar outros usuários.", "info");
      setFiltro("");
      setTipoBusca("meuPerfil");
      buscarMeuPerfil();
      return;
    }

    setIsLoadingContent(true);
    try {
      const authHeader = { headers: { Authorization: token } };
      switch (tipoBusca) {
        case "id":
          if (!filtro.trim()) {
            ToastAlerta("Por favor, digite um ID para buscar.", "info");
            setIsLoadingContent(false);
            return;
          }
          await buscarUsuarioPorId(Number(filtro), (res: Usuario) => setUsuariosExibidos([res]), authHeader);
          break;
        case "usuario": // Email
          if (!filtro.trim()) {
            ToastAlerta("Por favor, digite um email para buscar.", "info");
            setIsLoadingContent(false);
            return;
          }
          // Assuming buscarUsuarioPorEmail returns an array or you handle conversion
          await buscarUsuarioPorEmail(filtro, setUsuariosExibidos, authHeader);
          break;
        case "nome":
          if (!filtro.trim()) {
            ToastAlerta("Por favor, digite um nome para buscar.", "info");
            setIsLoadingContent(false);
            return;
          }
          await buscarUsuariosPorNome(filtro, setUsuariosExibidos, authHeader);
          break;
        case "todos":
          await buscarTodosUsuarios(setUsuariosExibidos, authHeader);
          break;
        case "meuPerfil": // If admin switches to 'meuPerfil' option
            buscarMeuPerfil();
            return; // Exit to avoid double loading state
        default:
          ToastAlerta("Tipo de busca inválido.", "erro");
          break;
      }
    } catch (error: any) {
      console.error("Erro ao buscar usuários", error);
      ToastAlerta("Erro ao buscar usuários.", "erro");
      if (error.response?.status === 403 || error.response?.status === 401) {
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout();
      }
    } finally {
      setIsLoadingContent(false);
    }
  }

  // --- Render ---
  return (
    <motion.div
      className="p-6 bg-gray-100 min-h-screen font-sans flex flex-col items-center" // Consistent background and centering
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl text-gray-800 font-bold mb-8 text-center" // Professional title
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Gerenciar Usuários 👥
      </motion.h2>

      {/* Admin Search Controls */}
      {isAdmin && (
        <div className="flex flex-col md:flex-row gap-4 mb-8 w-full max-w-2xl bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <select
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTipoBusca(e.target.value)}
            value={tipoBusca}
            className="border border-gray-300 p-3 rounded-lg bg-gray-50 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors cursor-pointer w-full md:w-auto flex-shrink-0"
          >
            <option value="todos">Todos os Usuários</option>
            <option value="meuPerfil">Meu Perfil</option> {/* Option for admin to view own profile */}
            <option value="id">Buscar por ID</option>
            <option value="usuario">Buscar por Email</option>
            <option value="nome">Buscar por Nome</option>
          </select>

          {tipoBusca !== "todos" && tipoBusca !== "meuPerfil" && ( // Input only for specific search types
            <input
              type={tipoBusca === "id" ? "number" : "text"} // Type number for ID
              placeholder={`Digite o ${tipoBusca === "id" ? "ID" : tipoBusca === "usuario" ? "Email" : "Nome"}`}
              className="border border-gray-300 p-3 rounded-lg flex-1 bg-white text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
              value={filtro}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFiltro(e.target.value)}
            />
          )}

          <button
            onClick={buscar}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 font-bold text-lg shadow-md transition-all duration-300 transform hover:-translate-y-1 cursor-pointer w-full md:w-auto flex-shrink-0"
          >
            Buscar
          </button>
        </div>
      )}
      
      {/* Content Loader */}
      {isLoadingContent && (
        <div className="flex justify-center items-center py-20 w-full">
          <RotatingLines
            strokeColor="#F97316"
            strokeWidth="5"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      )}

      {/* User Cards Grid */}
      {!isLoadingContent && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl px-4" // Added px-4
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {usuariosExibidos.length === 0 ? (
            <p className="text-xl text-gray-600 col-span-full text-center py-12 bg-white rounded-lg shadow-md border border-gray-200">
              {isAdmin ? "Nenhum usuário encontrado para a busca." : "Carregando seu perfil..."}
            </p>
          ) : (
            usuariosExibidos.map((usuario) => (
              <motion.div
                key={usuario.id || usuario.usuario} // Use email as fallback key for safety
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <CardUsuario usuario={usuario} />
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default Usuarios;
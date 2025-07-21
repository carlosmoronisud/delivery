/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent, type FormEvent, useEffect, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom'; // Import Link for 'Voltar' button
import { RotatingLines } from 'react-loader-spinner';
import { ToastAlerta } from '../../utils/ToastAlerta';
import type Usuario from '../../models/Usuario'; // Assuming this is correct
import { atualizar,  } from '../../services/Service'; // Ensure types are correct in Service.ts
import { AuthContext } from '../../contexts/AuthContext'; // Ensure this is correct
import { ArrowLeft } from '@phosphor-icons/react'; // For a professional back icon
import { buscarUsuarioPorId } from '../../services/UsuarioService';

function FormUsuario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL parameters
  const { usuario: loggedInUser, handleLogout } = useContext(AuthContext); // Get logged-in user from context

  const [isLoading, setIsLoading] = useState<boolean>(false); // For form submission loading
  // State for the user profile data being edited
  const [usuario, setUsuario] = useState<Usuario>({
    id: null, // Initialize with null as per your Usuario interface
    nome: '',
    usuario: '', // This is the email
    senha: '', // Note: password is usually not displayed/edited directly for security
    foto: '',
  });

  const token = loggedInUser.token;

  // --- Authentication Check ---
  useEffect(() => {
    if (token === '' || loggedInUser.id === null) { // Also check if loggedInUser.id is null
      ToastAlerta('Você precisa estar logado para editar seu perfil!', 'info');
      navigate('/login');
    }
  }, [token, loggedInUser.id, navigate]); // Added loggedInUser.id to dependencies

  // --- Fetch User Data for Editing ---
  useEffect(() => {
    // Only fetch user data if ID is present in URL and matches the logged-in user's ID
    if (id && loggedInUser.id !== null && loggedInUser.id !== undefined && loggedInUser.id === Number(id)) {
      buscarUsuario(Number(id));
    } else if (id && loggedInUser.id !== null && loggedInUser.id !== undefined && loggedInUser.id !== Number(id)) {
      // If ID in URL exists but doesn't match logged-in user's ID
      ToastAlerta('Você não tem permissão para editar este perfil.', 'erro');
      navigate('/home'); // Redirect to home or products page instead of /usuarios
    } else if (!id && loggedInUser.id !== null && loggedInUser.id !== undefined) {
      // If no ID in URL but logged in, it's a profile page, so load logged-in user's data
      buscarUsuario(loggedInUser.id);
    }
  }, [id, loggedInUser.id, navigate, token, handleLogout]); 

  async function buscarUsuario(userId: number) {
    try {
      // Pass the setter function as the second argument, as per your Service.ts signature
      await buscarUsuarioPorId(userId, (data: Usuario) => setUsuario(data), {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        ToastAlerta('Sua sessão expirou! Faça login novamente.', 'erro');
        handleLogout();
      } else {
        ToastAlerta('Erro ao buscar dados do usuário.', 'erro');
        console.error(error);
      }
    }
  }

  // --- Input Change Handler ---
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  }

  // --- Form Submission Handler ---
  async function atualizarUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure the ID is correctly set for the update request.
      // Use usuario.id directly from state if it's already populated,
      // otherwise use id from params (if it's an update).
      const userIdToSend = usuario.id || (id ? Number(id) : null);

      if (userIdToSend === null) {
          ToastAlerta('Erro: ID do usuário não encontrado para atualização.', 'erro');
          setIsLoading(false);
          return;
      }

      const updatedUsuario = { ...usuario, id: userIdToSend }; // Ensure ID is part of the object for the backend

      await atualizar(
        '/usuarios/atualizar', // Endpoint para atualização de usuário
        updatedUsuario,
        setUsuario, // Pass setUsuario as per Service.ts signature
        { headers: { Authorization: token } }
      );

      ToastAlerta('Perfil atualizado com sucesso! 🎉', 'sucesso');
      // After update, navigate back to the profile page or a confirmation page
      navigate(`/usuarios/`); 
    } catch (error: any) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        ToastAlerta('Sua sessão expirou! Faça login novamente.', 'erro');
        handleLogout();
      } else {
        ToastAlerta('Erro ao atualizar o perfil. Tente novamente.', 'erro');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex justify-center items-center py-12 px-4 font-sans">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-2xl p-8 flex flex-col gap-6 border border-gray-200">
        
        {/* Botão de voltar */}
        <div className="flex justify-start">
          <Link
            to={id ? `/usuarios/` : '/home'} 
            className="flex items-center text-gray-600 hover:text-orange-600 hover:scale-105 transition-all duration-200 cursor-pointer text-lg font-medium"
          >
            <ArrowLeft size={28} weight="bold" className="mr-2" />
            Voltar
          </Link>
        </div>

        {/* Título do formulário */}
        <h1 className="text-4xl md:text-5xl text-center font-bold text-gray-800 mb-4">
          Atualizar Perfil 👤
        </h1>

        <form className="flex flex-col gap-5" onSubmit={atualizarUsuario}>
          {/* Campo Nome */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="text-lg font-semibold text-gray-700">Nome Completo</label>
            <input
              type="text"
              name="nome"
              id="nome"
              placeholder="Digite seu nome completo"
              value={usuario.nome}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              required
            />
          </div>

          {/* Campo Email (Usuário) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="usuario" className="text-lg font-semibold text-gray-700">Email (Usuário)</label>
            <input
              type="email" // Use type="email" for email fields
              name="usuario"
              id="usuario"
              placeholder="seuemail@exemplo.com"
              value={usuario.usuario}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm bg-gray-100 cursor-not-allowed focus:outline-none"
              disabled // Email/username usually not editable after creation
            />
          </div>

          {/* Campo Foto (URL) */}
          <div className="flex flex-col gap-2">
            <label htmlFor="foto" className="text-lg font-semibold text-gray-700">URL da Foto de Perfil</label>
            <input
              type="text"
              name="foto"
              id="foto"
              placeholder="https://suaimagem.com/perfil.jpg"
              value={usuario.foto}
              onChange={atualizarEstado}
              className="border border-gray-300 rounded-lg px-4 py-3 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Consider adding separate fields for password change if needed,
              but usually it's handled on a dedicated secure page. */}

          <div className="flex flex-col md:flex-row justify-between gap-4 md:gap-8 mt-6">
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={() => navigate(-1)} // Go back to the previous page
              className="w-full md:w-1/2 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg text-xl shadow-md 
                         hover:bg-gray-400 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="w-full md:w-1/2 bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg 
                         hover:bg-orange-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer 
                         flex justify-center items-center"
              disabled={isLoading} 
            >
              {isLoading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="28"
                  visible={true}
                />
              ) : (
                <span>Atualizar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormUsuario;
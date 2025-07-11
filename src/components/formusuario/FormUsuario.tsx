/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, type ChangeEvent, type FormEvent, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';
import { ToastAlerta } from '../../utils/ToastAlerta';
import type Usuario from '../../models/Usuario';
import { atualizar, buscarUsuarioPorId } from '../../services/Service'; // Import atualizar and buscarUsuarioPorId
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

function FormUsuario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL parameters
  const { usuario: loggedInUser, handleLogout } = useContext(AuthContext); // Get logged-in user from context

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<Usuario>({
    id: null,
    nome: '',
    usuario: '',
    senha: '',
    foto: '',
  });

  const token = loggedInUser.token;

  useEffect(() => {
    if (token === '') {
      ToastAlerta('Você precisa estar logado!', 'erro');
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    // Only fetch user data if ID is present and matches the logged-in user's ID
    if (id && loggedInUser.id === Number(id)) {
      buscarUsuario(Number(id));
    } else if (id && loggedInUser.id !== Number(id)) {
      // Prevent updating other users' profiles
      ToastAlerta('Você não tem permissão para editar este perfil.', 'erro');
      navigate('/usuarios'); // Redirect to users list or home
    }
  }, [id, loggedInUser.id, navigate]);

  async function buscarUsuario(id: number) {
    try {
      await buscarUsuarioPorId(id, (res: Usuario) => setUsuario(res), {
        headers: { Authorization: token },
      });
    } catch (error: any) {
      // Handle 403 or other unauthorized errors specifically
      if (error.response?.status === 403) {
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout(); // Log out if session expired
      } else {
        ToastAlerta('Erro ao buscar usuário.', 'erro');
        console.error(error);
      }
    }
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  }

  async function atualizarUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure the ID is correctly set for the update request
      const updatedUsuario = { ...usuario, id: Number(id) };

      await atualizar(
        '/usuarios/atualizar', // Assuming this is your update endpoint
        updatedUsuario,
        setUsuario,
        { headers: { Authorization: token } }
      );

      ToastAlerta('Usuário atualizado com sucesso!', 'sucesso');
      navigate('/usuarios'); // Redirect after successful update
    } catch (error: any) {
      if (error.response?.status === 403) {
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout();
      } else {
        ToastAlerta('Erro ao atualizar o usuário.', 'erro');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 bg-[#FEF8EA] lg:grid-cols-2 h-screen place-items-center font-bold">
      <div className="fundoCadastro hidden lg:flex w-4/5 h-[80%] items-center justify-center rounded-3xl shadow-lg" />

      <form
        className="flex justify-center items-center flex-col w-2/3 gap-3"
        onSubmit={atualizarUsuario}
      >
        <h2 className="text-slate-900 text-5xl">Atualizar Perfil</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Nome"
            className="border-2 border-slate-700 rounded p-2 bg-white"
            value={usuario.nome}
            onChange={atualizarEstado}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="usuario">Email (Usuário)</label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            placeholder="Usuário"
            className="border-2 border-slate-700 rounded p-2 bg-white"
            value={usuario.usuario}
            onChange={atualizarEstado}
            disabled // Often email/username is not directly editable after creation
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="foto">Foto (URL)</label>
          <input
            type="text"
            id="foto"
            name="foto"
            placeholder="Foto (URL)"
            className="border-2 border-slate-700 rounded p-2 bg-white"
            value={usuario.foto}
            onChange={atualizarEstado}
          />
        </div>

        {/* Password fields for updating password can be added here,
            but typically require current password verification for security.
            For simplicity, I'm omitting direct password change here, assuming
            it might be handled on a separate "Change Password" page. */}

        <div className="flex justify-around w-full gap-8">
          <button
            type="button" // Use type="button" to prevent form submission
            className="rounded text-white bg-red-700 hover:bg-red-900 w-1/2 py-2"
            onClick={() => navigate(-1)} // Go back to the previous page
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="rounded text-white bg-[#453E00] hover:bg-[#262401] w-1/2 py-2 flex justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <RotatingLines
                strokeColor="white"
                strokeWidth="5"
                animationDuration="0.75"
                width="24"
                visible={true}
              />
            ) : (
              <span>Atualizar</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormUsuario;
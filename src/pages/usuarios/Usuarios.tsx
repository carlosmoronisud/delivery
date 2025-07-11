/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from '../../contexts/AuthContext';

import {
  buscarTodosUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail, // Manter se necessário para o admin buscar por email
  buscarUsuariosPorNome, // Manter se necessário para o admin buscar por nome
} from '../../services/Service'; // Mantenha estas funções na Service

import type Usuario from "../../models/Usuario";
import CardUsuario from "../../components/cardusuario/CardUsuario";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Usuarios() {
  const { usuario: loggedInUser, handleLogout } = useContext(AuthContext); // Renomeado para evitar conflito
  const header = {
    headers: {
      Authorization: loggedInUser.token
    }
  };

  const [filtro, setFiltro] = useState("");
  const [usuariosExibidos, setUsuariosExibidos] = useState<Usuario[]>([]); // Renomeado para evitar conflito com 'usuario' do AuthContext
  const [tipoBusca, setTipoBusca] = useState("meuPerfil"); // Default para 'meuPerfil'

  useEffect(() => {
    // Ao carregar a página, sempre busca e exibe o perfil do usuário logado
    if (loggedInUser.id) { // Garante que o ID do usuário logado existe
      buscarMeuPerfil();
    }
  }, [loggedInUser.id]); // Adiciona loggedInUser.id como dependência

  async function buscarMeuPerfil() {
    if (!loggedInUser.id) {
      ToastAlerta("ID do usuário não encontrado para carregar o perfil.", "erro");
      return;
    }
    try {
      // Usa a função buscarUsuarioPorId para buscar o próprio perfil
      // A função setUsuariosExibidos precisa receber um array
      await buscarUsuarioPorId(loggedInUser.id, (res: Usuario) => setUsuariosExibidos([res]), header);
    } catch (error: any) {
      console.error("Erro ao buscar seu perfil", error);
      ToastAlerta("Erro ao carregar seu perfil.", "erro");
      if (error.response?.status === 403) { // Exemplo: se o token expirou
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout();
      }
    }
  }

  async function buscar() {
    // Permissão para buscar outros usuários apenas se for o admin (ID 1)
    if (loggedInUser.id !== 7) {
      ToastAlerta("Apenas administradores podem buscar outros usuários.", "aviso");
      setFiltro(""); // Limpa o filtro
      setTipoBusca("meuPerfil"); // Volta para o modo de buscar apenas o próprio perfil
      buscarMeuPerfil(); // Recarrega o próprio perfil
      return;
    }

    try {
      // Lógica de busca para o admin
      switch (tipoBusca) {
        case "id":
          if (filtro.trim() === "") {
            ToastAlerta("Por favor, digite um ID para buscar.", "aviso");
            return;
          }
          await buscarUsuarioPorId(Number(filtro), (res: Usuario) => setUsuariosExibidos([res]), header);
          break;
        case "usuario":
          if (filtro.trim() === "") {
            ToastAlerta("Por favor, digite um email para buscar.", "aviso");
            return;
          }
          await buscarUsuarioPorEmail(filtro, (res: Usuario) => setUsuariosExibidos([res]), header);
          break;
        case "nome":
          if (filtro.trim() === "") {
            ToastAlerta("Por favor, digite um nome para buscar.", "aviso");
            return;
          }
          await buscarUsuariosPorNome(filtro, setUsuariosExibidos, header);
          break;
        case "todos": // "Buscar todos" para o admin
          await buscarTodosUsuarios(setUsuariosExibidos, header);
          break;
        default: // Caso padrão (meu perfil) para outros usuários
          buscarMeuPerfil();
          break;
      }
    } catch (error: any) {
      console.error("Erro ao buscar usuários", error);
      ToastAlerta("Erro ao buscar usuários.", "erro");
      if (error.response?.status === 403) {
        ToastAlerta('Sua sessão expirou!', 'erro');
        handleLogout();
      }
    }
  }

  return (
    <motion.div
      className="p-6 bg-[#FEF8EA] min-h-screen font-poppins"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-4xl text-[#453E00] font-bold mb-6"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Usuários
      </motion.h2>

      {loggedInUser.id === 7 && ( // Exibe os controles de busca apenas para o admin (ID 1)
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <select
            onChange={(e) => setTipoBusca(e.target.value)}
            value={tipoBusca} // Garante que o select exibe o valor atual do estado
            className="border-2 border-[#453E00] p-2 rounded-md bg-white text-[#453E00]"
          >
            <option value="todos">Todos</option>
            <option value="id">Buscar por ID</option>
            <option value="usuario">Buscar por Email</option>
            <option value="nome">Buscar por Nome</option>
          </select>

          <input
            type="text"
            placeholder="Digite o valor"
            className="border-2 border-[#453E00] p-2 rounded-md flex-1 bg-white"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />

          <button
            onClick={buscar}
            className="bg-[#453E00] text-white px-6 py-2 rounded-md hover:bg-[#262401] font-bold transition"
          >
            Buscar
          </button>
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
        {usuariosExibidos.length === 0 && (loggedInUser.id === 1 ?
          <p className="text-gray-600">Nenhum usuário encontrado para o filtro.</p> :
          <p className="text-gray-600">Carregando seu perfil...</p>
        )}

        {usuariosExibidos.map((usuario) => (
          <motion.div
            key={usuario.id || usuario.usuario}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <CardUsuario usuario={usuario} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default Usuarios;
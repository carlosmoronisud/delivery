import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from '../../contexts/AuthContext';

import {
  buscarTodosUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  buscarUsuariosPorNome,
} from '../../services/Service';

import type Usuario from "../../models/Usuario";
import CardUsuario from "../../components/cardusuario/CardUsuario";
import { ToastAlerta } from "../../utils/ToastAlerta";

function Usuarios() {
  const { usuario } = useContext(AuthContext);
  const header = {
    headers: {
      Authorization: usuario.token
    }
  };

  const [filtro, setFiltro] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [tipoBusca, setTipoBusca] = useState("todos");

  useEffect(() => {
    buscar();
  }, []);

  async function buscar() {
    try {
      switch (tipoBusca) {
        case "id":
          await buscarUsuarioPorId(Number(filtro), (res: Usuario) => setUsuarios([res]), header);
          break;
        case "usuario":
          await buscarUsuarioPorEmail(filtro, (res: Usuario) => setUsuarios([res]), header);
          break;
        case "nome":
          await buscarUsuariosPorNome(filtro, setUsuarios, header);
          break;
        default:
          await buscarTodosUsuarios(setUsuarios, header);
          break;
      }
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
      ToastAlerta("Erro ao buscar usuários", "erro");
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

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          onChange={(e) => setTipoBusca(e.target.value)}
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
        {usuarios.map((usuario) => (
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

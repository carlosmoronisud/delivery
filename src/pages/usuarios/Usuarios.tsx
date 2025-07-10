/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

import {
  buscarTodosUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  buscarUsuariosPorNome,
} from '../../services/Service'

import type Usuario from "../../models/Usuario"
import CardUsuario from "../../components/cardusuario/CardUsuario"
import { ToastAlerta } from "../../utils/ToastAlerta"



function Usuarios() {
useEffect(() => {
  buscar()
}, [])

const { usuario } = useContext(AuthContext)
const header = {
  headers: {
    Authorization: usuario.token
  }
}

  const [filtro, setFiltro] = useState("")
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [tipoBusca, setTipoBusca] = useState("todos")

  async function buscar() {
      

    try {
      switch (tipoBusca) {
        case "id":
            await buscarUsuarioPorId(Number(filtro), (res: Usuario) => setUsuarios([res]), header)
            break
        case "usuario":
            await buscarUsuarioPorEmail(filtro, (res: Usuario) => setUsuarios([res]), header)
            break
        case "nome":
            await buscarUsuariosPorNome(filtro, setUsuarios, header)
            break
        default:
            await buscarTodosUsuarios(setUsuarios, header)
            break
      }

    } catch (error) {
      console.error("Erro ao buscar usuários", error)
      ToastAlerta("Erro ao buscar usuários", "erro")
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Usuários</h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        <select
          onChange={(e) => setTipoBusca(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="todos">Todos</option>
          <option value="id">Buscar por ID</option>
          <option value="usuario">Buscar por Email</option>
          <option value="nome">Buscar por Nome</option>
        </select>

        <input
          type="text"
          placeholder="Digite o valor"
          className="border p-2 flex-1 rounded"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />

        <button
          onClick={buscar}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800"
        >
          Buscar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {usuarios.map((usuario) => (
          <CardUsuario key={usuario.id || usuario.usuario} usuario={usuario} />
        ))}
      </div>
    </div>
  )
}

export default Usuarios

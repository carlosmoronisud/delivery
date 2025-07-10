import { PencilSimpleLine } from "@phosphor-icons/react"
import type Usuario from "../../models/Usuario"


interface Props {
  usuario: Usuario
}

function CardUsuario({ usuario }: Props) {
  return (
    <div className="border rounded shadow p-4 flex flex-col items-center bg-white">
      <img
        src={usuario.foto || "https://via.placeholder.com/100"}
        alt={usuario.nome}
        className="w-24 h-24 rounded-full object-cover mb-2 border-2 border-yellow-400"
      />
      <h3 className="text-xl font-bold">{usuario.nome}</h3>
      <p className="text-sm text-gray-600">{usuario.usuario}</p>

      <button className="mt-4 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-700 flex items-center gap-2">
        <PencilSimpleLine size={16} /> Atualizar
      </button>
    </div>
  )
}

export default CardUsuario

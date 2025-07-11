import { PencilSimpleLine } from "@phosphor-icons/react";
import type Usuario from "../../models/Usuario";

interface Props {
  usuario: Usuario;
}

function CardUsuario({ usuario }: Props) {
  return (
    <div className="border rounded-xl shadow-md p-6 flex flex-col items-center bg-[#FEF8EA] w-full max-w-sm">
      <img
        src={usuario.foto || "https://via.placeholder.com/100"}
        alt={usuario.nome}
        className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-yellow-400 shadow"
      />
      <h3 className="text-2xl font-bold text-[#453E00]">{usuario.nome}</h3>
      <p className="text-sm text-gray-700">{usuario.usuario}</p>

      <button className="mt-5 bg-[#453E00] hover:bg-[#262401] text-white px-5 py-2 rounded-full flex items-center gap-2 transition font-bold shadow">
        <PencilSimpleLine size={18} /> Atualizar
      </button>
    </div>
  );
}

export default CardUsuario;

// src/components/ui/BotaoVoltar.tsx
import { ArrowLeft } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';


export default function BotaoVoltar() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded-xl transition duration-200"
    >
      <ArrowLeft size={18} />
      Voltar
    </button>
  );
}

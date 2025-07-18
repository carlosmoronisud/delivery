import { LinkedinLogo } from '@phosphor-icons/react'; // Importando o ícone do LinkedIn

interface ColaboradorProps {
  nome: string;
  cargo: string;
  linkedin: string;
  imagem?: string; 
}

export default function ColaboradorCard({ nome, cargo, linkedin, imagem }: ColaboradorProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-xs mx-auto text-center 
                    transform transition-all duration-300 hover:scale-105 hover:shadow-xl 
                    flex flex-col items-center justify-between border border-gray-100 cursor-pointer"> {/* Estilo aprimorado para o card */}
      
      {/* Imagem do colaborador ou fallback com inicial */}
      {imagem ? (
        <img
          src={imagem}
          alt={`Foto de ${nome}`}
          className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border-4 border-orange-400 shadow-md" // Borda colorida e maior, sombra
        />
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-200 mx-auto mb-4 
                        flex items-center justify-center text-4xl font-bold text-gray-600 
                        border-4 border-orange-400 shadow-md"> {/* Borda colorida e maior, sombra */}
          {nome.charAt(0).toUpperCase()} {/* Garante que a inicial seja maiúscula */}
        </div>
      )}

      {/* Nome e Cargo */}
      <div className="flex-grow flex flex-col justify-center items-center mb-4"> {/* Flex-grow para centralizar e ocupar espaço */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{nome}</h2> {/* Mais destaque para o nome */}
        <p className="text-sm text-gray-700 mt-1">{cargo}</p> {/* Cor mais escura para o cargo */}
      </div>
      
      {/* Link do LinkedIn */}
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white 
                   rounded-full font-semibold text-sm shadow-md 
                   hover:bg-blue-700 hover:scale-105 transition-all duration-200 cursor-pointer" 
        aria-label={`Ver perfil de ${nome} no LinkedIn`}
      >
        <LinkedinLogo size={20} weight="fill" /> {/* Ícone Phosphor de preenchimento */}
        LinkedIn
      </a>
    </div>
  );
}
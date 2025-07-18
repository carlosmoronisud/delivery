import { FacebookLogo, GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import React from 'react'; // Import React

function Footer() {
  const currentYear = new Date().getFullYear(); // Use a constante para o ano atual

  return (
    <footer className="bg-gray-800 text-white py-12 px-6 font-sans"> {/* Fundo mais sóbrio e fonte padrão */}
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 md:gap-16">

        {/* Coluna 1 - Logo, Endereço e Contato */}
        <div className="flex flex-col gap-5 min-w-[280px] md:min-w-[300px]"> {/* Aumenta a largura mínima */}
          <div className="flex items-center gap-4">
            <img 
              src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
              alt="Logo do Delivery"
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <p className="text-2xl font-bold leading-tight"> {/* Mais destaque para o nome/endereço */}
              Seu Delivery <br />Na Sua Porta!
            </p>
          </div>
          <p className="text-base text-gray-300">Rua do Ouvidor, 666 - Centro</p>
          <p className="text-base text-gray-300">Campinas - SP, Brasil</p>
          <p className="text-base text-gray-300">+55 (19) 4992-8922</p>
          <p className="text-base text-gray-300">contato@seudelivery.com</p> {/* E-mail mais profissional */}
        </div>

        {/* Coluna 2 - Navegação (Mapa do Site) */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Navegação</h3> {/* Título mais profissional */}
          {[
            { text: "Home", to: "/home" },
            { text: "Produtos", to: "/produtos" },
            { text: "Categorias", to: "/categorias" },
            { text: "Sobre Nós", to: "/sobre" } // Mais formal
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="text-gray-300 hover:text-orange-500 hover:underline transition-colors duration-200 text-base" // Cores consistentes
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Coluna 3 - Redes Sociais */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Conecte-se</h3> {/* Título mais convidativo */}
          <div className="flex gap-4"> {/* Ícones lado a lado */}
            <a href="https://www.linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinLogo size={32} weight='fill' className="text-gray-300 hover:text-orange-500 transition-colors duration-200 cursor-pointer" /> {/* Tamanho e cor consistentes */}
            </a>
            <a href="https://www.instagram.com/seu-perfil" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramLogo size={32} weight='fill' className="text-gray-300 hover:text-orange-500 transition-colors duration-200 cursor-pointer" />
            </a>
            <a href="https://www.facebook.com/seu-perfil" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookLogo size={32} weight='fill' className="text-gray-300 hover:text-orange-500 transition-colors duration-200 cursor-pointer" />
            </a>
            <a href="https://github.com/seu-perfil" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GithubLogo size={32} weight='fill' className="text-gray-300 hover:text-orange-500 transition-colors duration-200 cursor-pointer" />
            </a>
          </div>
        </div>
      </div>

      {/* Rodapé Inferior - Direitos Autorais */}
      <div className="mt-10 text-center text-sm text-gray-400 border-t border-gray-700 pt-6"> {/* Linha separadora e fonte mais suave */}
        <p>&copy; {currentYear} Seu Delivery. Todos os direitos reservados.</p> {/* Nome genérico do app */}
        <p className="mt-1">Desenvolvido com 🧡 para a Comunidade.</p> {/* Toque pessoal */}
      </div>
    </footer>
  );
}

export default Footer;
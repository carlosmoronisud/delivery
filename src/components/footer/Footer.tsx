import { FacebookLogo, GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-10 md:gap-16">

        {/* Coluna 1 - Logo, Endereço e Contato */}
        <div className="flex flex-col gap-5 min-w-[280px] md:min-w-[300px]">
          <div className="flex items-center gap-4">
            <img 
              src="https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2021,%202025,%2008_36_03%20PM.png?updatedAt=1753140984875"
              alt="Logo do Delivery"
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
            <p className="text-2xl font-bold leading-tight"> 
              Seu Delivery <br />Na Sua Porta!
            </p>
          </div>
          <p className="text-base text-gray-300">Rua do Ouvidor, 666 - Centro</p>
          <p className="text-base text-gray-300">Campinas - SP, Brasil</p>
          <p className="text-base text-gray-300">+55 (19) 4992-8922</p>
          <p className="text-base text-gray-300">contato@seudelivery.com</p> 
        </div>

        {/* Coluna 2 - Navegação (Mapa do Site) */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Navegação</h3>
          {[
            { text: "Home", to: "/home" },
            { text: "Produtos", to: "/produtos" },
            { text: "Categorias", to: "/categorias" },
            { text: "Sobre Nós", to: "/sobre" }
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="text-gray-300 hover:text-orange-500 hover:underline transition-colors duration-200 text-base"
            >
              {item.text}
            </Link>
          ))}
        </div>

        {/* Coluna 3 - Redes Sociais */}
        <div className="flex flex-col gap-3 min-w-[150px]">
          <h3 className="text-lg font-bold mb-3">Conecte-se</h3>
          <div className="flex gap-4"> 
            <a href="https://www.linkedin.com/in/seu-perfil" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedinLogo size={32} weight='fill' className="text-gray-300 hover:text-orange-500 transition-colors duration-200 cursor-pointer" />
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

        {/* NOVA COLUNA 4 - Baixe o Aplicativo */}
        <div className="flex flex-col gap-3 min-w-[180px]">
          <h3 className="text-lg font-bold mb-3">Baixe o App</h3>
          <div className="flex flex-col gap-4">
            {/* Link para Google Play Store - Mock */}
            <a 
              href="https://play.google.com/store/apps/details?id=com.seudelivery.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Download no Google Play"
              className="block w-full max-w-[150px] transform transition-transform duration-200 hover:scale-105"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Google Play Store" 
                className="w-full h-auto object-contain"
              />
            </a>
            {/* Link para Apple App Store - Mock */}
            <a 
              href="https://apps.apple.com/us/app/seu-delivery-app/id1234567890" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Download na App Store"
              className="block w-full max-w-[150px] transform transition-transform duration-200 hover:scale-105"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="App Store" 
                className="w-full h-auto object-contain"
              />
            </a>
            {/* Opcional: QR Code para download */}
            <div className="mt-2 text-center">
                <p className="text-xs text-gray-400 mb-1">Ou aponte a câmera:</p>
                <img 
                    src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://www.seudelivery.com/download-app" 
                    alt="QR Code para Download do App" 
                    className="w-20 h-20 mx-auto rounded-md shadow-sm"
                />
            </div>
          </div>
        </div>

      </div>

      {/* Rodapé Inferior - Direitos Autorais e Dados da Empresa (Alinhado com iFood/Rappi) */}
      <div className="mt-10 text-center text-sm text-gray-400 border-t border-gray-700 pt-6"> 
        <p>&copy; {currentYear} Seu Delivery. Todos os direitos reservados. RAPPI BRASIL INTERMEDIAÇÃO DE NEGÓCIOS LTDA., empresa com sede social na R Haddock Lobo, 595, 9 andar, conj. 91, Lado A, Cerqueira Cesar, São Paulo/SP CEP. 01414-905, CNPJ/MF n° 26.900.161/0001-25.</p>
        <p className="mt-2">Desenvolvido com 🧡 para a Comunidade.</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-xs">
            <Link to="/termos-de-uso" className="text-gray-400 hover:text-orange-500 hover:underline">Termos e Condições de Uso</Link>
            <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-orange-500 hover:underline">Política de Privacidade</Link>
            <Link to="/codigo-de-conduta" className="text-gray-400 hover:text-orange-500 hover:underline">Código de Conduta</Link>
            <Link to="/dicas-de-seguranca" className="text-gray-400 hover:text-orange-500 hover:underline">Dicas de Segurança</Link>
            <Link to="/fale-conosco" className="text-gray-400 hover:text-orange-500 hover:underline">Fale Conosco</Link>
            <Link to="/ajuda" className="text-gray-400 hover:text-orange-500 hover:underline">Ajuda / FAQ</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
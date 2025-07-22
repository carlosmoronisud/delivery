import { motion } from "framer-motion";
import ColaboradorCard from "../../components/colaborador/Colaborador";
import Lottie from 'lottie-react';
import innovationAnimation from '../../assets/lottie-animations/innovation.json';
import uxuiAnimation from '../../assets/lottie-animations/designthinking.json';
import developmentAnimation from '../../assets/lottie-animations/developmentprocess.json';
import marketStudyAnimation from '../../assets/lottie-animations/marketresearch.json';

// Ícones das tecnologias (usando react-icons)
import { 
  SiReact, SiTypescript, SiTailwindcss, SiSpringboot, 
  SiAxios, SiReactrouter, SiVite, SiGoogle, 
  SiJavascript,SiFramer 
} from 'react-icons/si';
import { FaGoogle, FaMapMarkedAlt, FaShoppingCart, FaLock } from 'react-icons/fa';

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function SobreProjetoPage() {
  const membros = [
    {
      nome: 'Carlos Moroni',
      cargo: 'Desenvolvedor Fullstack Jr',
      linkedin: 'https://www.linkedin.com/in/carlosmoroni/',
      imagem: 'https://github.com/carlosmoronisud.png',
    },
  ];

  const tecnologias = [
    { nome: "React", uso: "Interface do usuário", icon: <SiReact className="text-blue-500 text-3xl" /> },
    { nome: "TypeScript", uso: "Tipagem estática", icon: <SiTypescript className="text-blue-600 text-3xl" /> },
    { nome: "Tailwind CSS", uso: "Estilização", icon: <SiTailwindcss className="text-cyan-400 text-3xl" /> },
    { nome: "Spring Boot", uso: "Backend", icon: <SiSpringboot className="text-green-500 text-3xl" /> },
    { nome: "Axios", uso: "Consumo de API", icon: <SiAxios className="text-purple-600 text-3xl" /> },
    { nome: "React Router", uso: "Navegação", icon: <SiReactrouter className="text-pink-600 text-3xl" /> },
    { nome: "Vite", uso: "Bundler", icon: <SiVite className="text-yellow-500 text-3xl" /> },
    { nome: "Google Auth", uso: "Autenticação", icon: <SiGoogle className="text-red-500 text-3xl" /> },
    { nome: "Google Maps", uso: "Geolocalização", icon: <FaMapMarkedAlt className="text-blue-400 text-3xl" /> },
    { nome: "Lottie", uso: "Animações", icon: <SiFramer className="text-orange-500 text-3xl" /> },
    { nome: "React Query", uso: "Cache de API", icon: <SiReact className="text-blue-500 text-3xl" /> },
    { nome: "Zod", uso: "Validação", icon: <SiJavascript className="text-yellow-400 text-3xl" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans overflow-x-hidden">
      {/* 🌟 Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-orange-600 to-yellow-500 text-white py-16 md:py-24 px-6 md:px-16 shadow-lg overflow-hidden"
      >
        {/* Background animation */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Lottie 
            animationData={innovationAnimation} 
            loop={true} 
            autoplay={true} 
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-md"
          >
            Desvendando o Universo <br className="md:hidden"/>
            <span className="text-yellow-100">do Delivery Digital!</span> 🚀
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white/90 text-gray-900 px-6 py-4 rounded-xl text-lg md:text-xl font-medium leading-relaxed mb-6 inline-block shadow-lg max-w-2xl">
              O <strong className="text-orange-600">Delivery</strong> não é apenas mais um aplicativo. É o resultado de uma imersão no mundo da entrega, combinando as melhores práticas do mercado.
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-black/20 backdrop-blur-sm rounded-xl p-6 inline-block"
          >
            <p className="text-lg md:text-xl font-medium leading-relaxed text-white">
              Foi uma experiência pensada nos mínimos detalhes, onde a tecnologia encontra a praticidade para levar o sabor até você!
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 💡 Project Core - Two Columns Layout */}
      <motion.article 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="px-6 md:px-16 py-16 w-full"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Image and Auth Card */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col gap-8 sticky top-8"
          >
            <motion.img
              whileHover={{ scale: 1.03 }}
              className="rounded-2xl border-4 border-orange-400 h-auto w-full object-cover shadow-xl hover:shadow-2xl hover:shadow-orange-600 transition-all duration-300"
              src="https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2021,%202025,%2008_36_03%20PM.png?updatedAt=1753140984875"
              alt="Imagem ilustrativa do projeto de delivery"
            />
            
            {/* Google Auth Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-200"
            >
              <h1 className="text-2xl font-bold text-gray-800 pb-8">Desafios</h1>
              <div className="flex items-center gap-4 mb-4">
                
                <FaGoogle className="text-4xl text-blue-500" />
                <h3 className="text-2xl font-bold text-blue-800">Google Authentication</h3>
              </div>
              <p className="text-gray-700 pb-8">
                Integração com a Api do google para o Login simplificado com OAuth 2.0 do Google, proporcionando segurança e praticidade aos usuários, lí e aprendi na plataforma do google como realizar a integração.
              </p>
              <div className="flex items-center gap-4 mb-4">
                
                <FaGoogle className="text-4xl text-blue-500" />
                <h3 className="text-2xl font-bold text-blue-800">Google Maps</h3>
              </div>
              <p className="text-gray-700">
                Integração com a Api do google para geolocalização, foi desafiador encontrar os meios de fazer funcionar a integração da api do google, porém eu lí e aprendi como fazer a integração e como realizar a geolocalização.
              </p>
              <div className="mt-12">
                <Lottie 
                  animationData={uxuiAnimation} 
                  loop={true} 
                  autoplay={true} 
                  className="h-42"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.section variants={fadeInUp} className="flex flex-col gap-8 text-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 border-b pb-4 border-gray-200">
              O Coração do Delivery ❤️
            </h2>

            <div className="flex flex-col gap-8">
              <p className="text-lg leading-relaxed">
                O <strong className="text-orange-500">Delivery</strong> é uma plataforma frontend robusta e responsiva, desenvolvida com <strong>React</strong> e <strong>TypeScript</strong>. Ela se conecta a um backend <strong>Spring Boot</strong> para orquestrar toda a magia por trás dos seus pedidos.
              </p>
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-yellow-50 rounded-xl shadow-sm border border-yellow-200"
              >
                <Lottie 
                  animationData={marketStudyAnimation} 
                  loop={true} 
                  autoplay={true} 
                  className="w-56 h-56"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Pesquisa e Design</h3>
                  <p className="text-base md:text-lg leading-relaxed">
                    A jornada começou com uma análise profunda do mercado e das interfaces de sucesso. Cada pixel foi cuidadosamente planejado aplicando princípios de <strong>UX/UI</strong> para criar uma experiência intuitiva e agradável.
                  </p>
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-gray-800 mt-4">✨ Funcionalidades Principais</h3>
              
              <motion.ul 
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {[
                  { icon: <FaMapMarkedAlt className="text-blue-500" />, text: "Busca Inteligente: Filtros por preço, NutriScore, categoria e restrições alimentares" },
                  { icon: <FaGoogle className="text-red-500" />, text: "Autenticação Flexível: Login tradicional ou via Google OAuth" },
                  { icon: <FaShoppingCart className="text-green-500" />, text: "Carrinho Intuitivo: Gerenciamento fácil de itens selecionados" },
                  { icon: <FaLock className="text-purple-500" />, text: "Controle de Acesso: Diferenciação entre usuários e administradores" },
                  { icon: <SiReact className="text-blue-400" />, text: "Interface Responsiva: Adaptável a qualquer dispositivo" },
                  { icon: <SiFramer className="text-orange-500" />, text: "Animações Fluidas: Experiência visual agradável com Lottie" }
                ].map((item, index) => (
                  <motion.li 
                    key={index}
                    variants={fadeInUp}
                    className="flex items-start gap-4 text-lg bg-white/50 p-4 rounded-lg border border-gray-100"
                  >
                    <span className="mt-1 text-2xl">{item.icon}</span>
                    <div>
                      <strong>{item.text.split(':')[0]}:</strong>
                      <span className="text-gray-700"> {item.text.split(':')[1]}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-blue-50 rounded-xl shadow-sm border border-blue-200"
              >
                <div className="w-full sm:w-1/2">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Tecnologia e Performance</h3>
                  <p className="text-base md:text-lg leading-relaxed">
                    O desenvolvimento priorizou código limpo e alta performance, utilizando as melhores práticas do mercado. O resultado é uma aplicação rápida, segura e escalável.
                  </p>
                </div>
                <Lottie 
                  animationData={developmentAnimation} 
                  loop={true} 
                  autoplay={true} 
                  className="w-56 h-56"
                />
              </motion.div>
            </div>
          </motion.section>
        </div>
      </motion.article>

      {/* 🛠️ Tech Stack */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="bg-gray-100 py-16 px-6 md:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Tecnologias Utilizadas 🛠️
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {tecnologias.map((tech) => (
              <motion.div
                key={tech.nome}
                variants={fadeInUp}
                whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center gap-3"
              >
                {tech.icon}
                <h3 className="text-lg font-bold text-gray-800">{tech.nome}</h3>
                <p className="text-sm text-gray-600">{tech.uso}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* 🧑‍💻 Team Section */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 md:px-16 py-16"
      >
        <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          O Desenvolvedor 🧑‍💻
        </motion.h1>

        <motion.div variants={fadeInUp} className="grid grid-cols-1 justify-items-center">
          {membros.map((membro) => (
            <ColaboradorCard
              key={membro.nome}
              nome={membro.nome}
              cargo={membro.cargo}
              linkedin={membro.linkedin}
              imagem={membro.imagem}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* 🚀 Call to Action */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16 px-6 text-center overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <Lottie 
            animationData={innovationAnimation} 
            loop={true} 
            autoplay={true} 
            className="w-full h-full"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para explorar?</h2>
          <p className="text-xl mb-8">Acesse agora mesmo e experimente a plataforma!</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://delivery-ten-iota.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <SiReact className="text-lg" />
              Acessar Frontend
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://delivery-hzm2.onrender.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <SiSpringboot className="text-lg" />
              Ver Backend
            </motion.a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default SobreProjetoPage;
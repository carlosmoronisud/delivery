import ColaboradorCard from "../../components/colaborador/Colaborador"; 

function SobreProjetoPage() {
  const membros = [
    {
      nome: 'Carlos Moroni',
      cargo: 'Desenvolvedor Fullstack Jr',
      linkedin: 'https://www.linkedin.com/in/carlosmoroni/',
      imagem: 'https://github.com/carlosmoronisud.png',
    },
    {
      nome: 'Bruno',
      cargo: 'Designer UI/UX',
      linkedin: 'https://www.linkedin.com/in/bruno-exemplo', 
      imagem: 'https://github.com/BrunoAlves-tech.png',
    },
    {
      nome: 'Luiz',
      cargo: 'Dev Fullstack',
      linkedin: 'https://www.linkedin.com/in/luizhenrique-dev/',
      imagem: 'https://github.com/luizsantos7.png',
    },
    {
      nome: 'Murilo',
      cargo: 'Product Owner',
      linkedin: 'https://www.linkedin.com/in/murilomattosm/',
      imagem: 'https://github.com/Matttosz.png',
    },
    {
      nome: 'Natan',
      cargo: 'QA Tester',
      linkedin: 'https://www.linkedin.com/in/natan-macedo/',
      imagem: 'https://github.com/natanmac.png',
    },
    {
      nome: 'Pablo',
      cargo: 'Scrum Master',
      linkedin: 'https://github.com/Pablo-Casagrande',
      imagem: 'https://github.com/Pablo-Casagrande.png',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans"> {/* Consistent light background */}

      {/* 🌟 Section 1: About the Delivery - Hero */}
      <section className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-16 md:py-24 px-6 md:px-16 shadow-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-md">
            Sobre <br className="md:hidden"/>Nosso Delivery 🚀
          </h1>
          <p className="text-xl md:text-2xl font-light leading-relaxed opacity-90">
            O **Delivery Valor** é uma plataforma inovadora criada para transformar sua experiência em pedidos de alimentos. Conectamos você aos melhores sabores, com praticidade e transparência.
          </p>
        </div>
      </section>

      {/* 🚀 Section 2: Key Features & Benefits */}
      <article className="px-6 md:px-16 py-16 w-full flex flex-col items-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 max-w-6xl w-full">
          {/* Logo do Delivery - Lado esquerdo */}
          <img
            className="rounded-full border-4 border-orange-400 h-64 w-64 md:h-80 md:w-80 object-cover shadow-xl hover:scale-105 hover:shadow-2xl hover:shadow-orange-600 transition-all duration-300 transform hover:-translate-y-2"
            src="https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2021,%202025,%2008_36_03%20PM.png?updatedAt=1753140984875"
            alt="Logo do Delivery"
          />

          {/* Descrição das funcionalidades - Lado direito */}
          <section className="flex flex-col gap-6 w-full max-w-2xl text-gray-800">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 border-b pb-4 border-gray-200">
              O que oferecemos? ✨
            </h2>

            <div className="flex flex-col gap-5 text-justify">
              <p className="text-lg leading-relaxed">
                <strong className="text-orange-600">Cadastro de categorias e produtos:</strong> Organize seus itens por tipo, facilitando a navegação e a localização. Registre detalhes como nome, descrição, preço, imagem e disponibilidade.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-orange-600">Painel de administração intuitivo:</strong> Uma interface amigável para gerenciar facilmente produtos, atualizar preços, adicionar novas categorias e controlar o estoque de forma prática e eficiente.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-orange-600">Classificação NutriScore integrada:</strong> Avaliamos automaticamente os produtos com base em sua composição nutricional (de A a E). Promovemos escolhas mais saudáveis e aumentamos a transparência para você, consumidor.
              </p>
              <p className="text-lg leading-relaxed">
                <strong className="text-orange-600">Filtros Avançados:</strong> Encontre exatamente o que busca com filtros por restrição alimentar, palavras-chave e faixas de preço. Sua dieta e suas preferências, no controle.
              </p>
            </div>
          </section>
        </div>
      </article>

      {/* 🤝 Section 3: Our Team */}
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12">
          Conheça Nossa Equipe 🧑‍💻
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center"> 
          {membros.map((membro) => (
            <ColaboradorCard
              key={membro.nome}
              nome={membro.nome}
              cargo={membro.cargo}
              linkedin={membro.linkedin}
              imagem={membro.imagem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SobreProjetoPage;
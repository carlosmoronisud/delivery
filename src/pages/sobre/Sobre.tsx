import ColaboradorCard from "../../components/colaborador/Colaborador";

function SobreProjetoPage() {
  const membros = [
    {
      nome: 'Carlos Moroni',
      cargo: 'Desenvolvedor Front-end',
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
    <div className="bg-gradient-to-b from-[#F4BF4F] via-[#FDF5D4] to-white min-h-screen w-full">

      <section className="flex items-center justify-center font-bold text-4xl pt-12 text-[#5A4000]">
        <h1>Sobre o Delivery</h1>
      </section>

      <article className="px-6 md:px-20 w-full">
        <section className="flex pt-6 pb-10 justify-center">
          <p className="font-light text-xl px-6 text-center text-[#1B1B1B] max-w-3xl">
            O Delivery Valor é uma plataforma para pedidos de alimentos.
          </p>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-center gap-14 pb-10">
          <img
            className="rounded-full border-2 border-yellow-400 h-[300px] w-[300px] md:h-[450px] md:w-[450px] object-cover hover:scale-105 hover:shadow-2xl hover:shadow-yellow-600 transition duration-300"
            src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
            alt="logo do delivery"
          />

          <section className="flex flex-col gap-4 w-full max-w-2xl justify-center text-[#1B1B1B]">
            <h2 className="text-xl font-semibold text-[#5A4000]">Ele oferece:</h2>

            <div className="flex flex-col gap-3 text-justify">
              <p>
                <strong>Cadastro de categorias e produtos:</strong> Permite organizar os itens por tipo, facilitando a navegação e localização dentro do sistema. 
                O software registra informações como nome, descrição, preço, imagem e disponibilidade de cada produto.
              </p>

              <p>
                <strong>Painel de administração intuitivo:</strong> Oferece uma interface amigável para gerenciar facilmente os produtos, 
                atualizar preços, adicionar novas categorias e controlar o estoque de forma prática.
              </p>

              <p>
                <strong>Classificação NutriScore integrada:</strong> Avalia automaticamente os produtos com base em sua composição nutricional e atribui uma nota de A a E. 
                Isso facilita a promoção de escolhas mais saudáveis e aumenta a transparência para o consumidor.
              </p>
            </div>
          </section>
        </div>
      </article>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-[#5A4000] mb-8">
          Equipe Desenvolvedora do Projeto
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
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

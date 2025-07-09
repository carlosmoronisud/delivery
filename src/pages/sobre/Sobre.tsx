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
    <div className="">
      <section className="flex items-center justify-center font-semibold text-4xl">
        <h1>Sobre o Connect</h1>
      </section>

      <article className="px-20 w-full">

        <section className="flex pt-2 pb-8 justify-center">
          <p className="font-light text-xl px-6">
            O CRM Connect é uma plataforma para gerenciar clientes e impulsionar resultados.
          </p>
        </section>

        <div className="flex justify-center gap-35">
          <img
            className="rounded-full border-2 hover:scale-105 border-green-800 h-[450px] w-[450px] object-cover hover:shadow-2xl hover:shadow-green-900 transition duration-400"
            src="https://ik.imagekit.io/gqta2uhtht/CnP_07072025_120113.png?updatedAt=1751900551928"
            alt="logo"
          />

          <section className="flex flex-col gap-3 w-[650px] justify-center">
            <h2 className="text-xl font-semibold">Ele oferece:</h2>

            <div className="flex flex-col gap-3">
              <p>
                <strong>Gestão inteligente de clientes:</strong> Centraliza informações
                essenciais dos clientes, histórico de interações e dados de contato
                para um atendimento personalizado.
              </p>

              <p>
                <strong>Gestão de oportunidades:</strong> Permite registrar e
                acompanhar cada etapa do funil de vendas, transformando leads em
                negócios concretos.
              </p>

              <p>
                <strong>Simplicidade, agilidade e eficiência:</strong> Desenvolvido com
                tecnologias modernas para otimizar o tempo, reduzir tarefas repetitivas
                e aumentar a produtividade de equipes comerciais e gestores.
              </p>
            </div>
          </section>
        </div>
      </article>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center  mb-8">
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
  )
}

export default SobreProjetoPage
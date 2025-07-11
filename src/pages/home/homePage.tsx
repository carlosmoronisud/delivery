import CarrosselMedio from '../../components/carroceishome/carrocelmedio/CarrocelMedio';
import CarrosselProdutos from '../../components/carroceishome/carrosselprodutos/CarrosselProdutos';

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 pb-20 bg-[#F1EDD2]">

      {/* Seção Hero / Carrossel Principal */}
      <article className="bg-gradient-to-b from-[#F4BF4F] from-50% to-[#F1EDD2] to-95% w-full px-4">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-7 py-10">
          <section className="flex flex-col justify-center gap-4 max-w-xl text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A]">Bem-vindo ao Delivery</h1>
            <p className="text-4xl md:text-5xl text-[#1A1A1A]">você pede,</p>
            <p className="text-4xl md:text-5xl text-[#1A1A1A]">nós entregamos!</p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <button className="border border-[#FAEB20] shadow-xl py-3 px-8 rounded-md text-2xl bg-[#FAEB20] hover:scale-105 transition">
                Peça Aqui!
              </button>
            </div>
          </section>

          <section className="pt-6">
            <img
              className="w-[300px] md:w-[400px] lg:w-[50vh] h-auto animate-float-custom"
              src="https://ik.imagekit.io/gqta2uhtht/um-delicioso-hamburguer-no-estudio-removebg-preview%201%20(1).png?updatedAt=1752104960964"
              alt="hamburguer"
            />
          </section>
        </div>
      </article>

      {/* Carrossel de Pizzarias */}
      <div className="w-full max-w-screen-xl px-4 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-poppins font-semibold text-lime-950 text-center py-4">Os mais pedidos</h2>
        <CarrosselMedio />
      </div>

      {/* Carrossel de Produtos */}
      <div className="w-full max-w-screen-xl px-4 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-poppins font-semibold text-center text-black/60 py-4">Peça aqui!</h2>
        <CarrosselProdutos />
      </div>

    </div>
  );
}

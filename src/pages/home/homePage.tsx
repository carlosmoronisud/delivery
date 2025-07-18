import { Link } from 'react-router-dom';
import CarrosselMedio from '../../components/carroceishome/carrocelmedio/CarrocelMedio';
import CarrosselProdutos from '../../components/carroceishome/carrosselprodutos/CarrosselProdutos';

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8 pb-24 bg-gray-50 font-sans">
      {/* Banner Principal - Cores mais ousadas e gradiente suave */}
      <article className="bg-gradient-to-br from-orange-500 via-yellow-400 to-yellow-200 w-full px-4 py-12 md:py-16 shadow-lg">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 md:gap-12 max-w-7xl mx-auto">
          <section className="flex flex-col justify-center gap-5 max-w-xl text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight drop-shadow-md">
              Bem-vindo ao <br className="hidden md:inline"/> Seu Delivery!
            </h1>
            <p className="text-4xl md:text-5xl font-semibold text-white/90 drop-shadow-sm">
              você pede,
            </p>
            <p className="text-4xl md:text-5xl font-semibold text-white/90 drop-shadow-sm">
              <strong>nós entregamos!</strong>
            </p>

            <div className="pt-6 flex justify-center lg:justify-start">
              <Link
                to="/produtos"
                className="bg-white text-orange-600 font-bold py-4 px-10 rounded-full text-xl md:text-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
              >
                Peça Agora!
              </Link>
            </div>
          </section>

          <section className="pt-8 lg:pt-0">
            <img
              className="w-[320px] md:w-[450px] lg:w-[500px] h-auto object-contain animate-float-custom drop-shadow-2xl" // animate-float-custom está aqui!
              src="https://ik.imagekit.io/gqta2uhtht/um-delicioso-hamburguer-no-estudio-removebg-preview%201%20(1).png?updatedAt=1752104960964"
              alt="hamburguer"
            />
          </section>
        </div>
      </article>

      {/* Seção de Destaque - Mais Populares/Os Queridinhos */}
      <div className="w-full max-w-screen-xl px-4 mt-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          😋 Deliciosas promoções
        </h2>
        <CarrosselMedio />
      </div>

      {/* Seção de Produtos em Destaque */}
      <div className="w-full max-w-screen-xl px-4 mt-12">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
          🍔 Explore Nossas Delícias
        </h2>
        <CarrosselProdutos />
      </div>

    </div>
  );
}
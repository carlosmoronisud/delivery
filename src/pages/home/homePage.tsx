import CarrosselMedio from "../../components/carroceishome/carrocelmedio/CarrocelMedio";
import CarrosselPrincipal from "../../components/carroceishome/carrocelprincipal/CarrosselPrincipal";
import CarrosselProdutos from "../../components/carroceishome/carrosselprodutos/CarrosselProdutos";


export default function Home() {
  return (
    <main className="w-full flex flex-col items-center gap-16 bg-[#f3e2bc] pb-16">
     
      <div className="w-full">
        <CarrosselPrincipal />
      </div>

     
      <div className="w-full max-w-screen-xl px-4">
        <h2 className="text-4xl font-poppins font-semibold text-lime-950 text-center py-4">Destaques das Pizzarias</h2>
        <CarrosselMedio />
      </div>

      <div className="w-full max-w-screen-xl px-4">
        <h2 className="text-4xl font-poppins font-semibold text-center text-black/60 py-4">Conheça nossa linha de produtos</h2>
        <CarrosselProdutos />
      </div>
    </main>
  );
}


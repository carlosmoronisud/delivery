
export default function Slide01() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-orange-400 via-yellow-300 to-yellow-700 flex flex-col lg:flex-row items-center justify-between p-46 gap-8">
      <div className="flex flex-col gap-4 max-w-xl text-black">
        <h2 className="text-6xl lg:text-6xl font-bold font-poppins">Bem vindo ao Delivery</h2>
        <p className="text-2xl lg:text-4xl font-poppins">
          Você pede, <br />
          <span className="font-bold font-hand">nós entregamos!</span>
        </p>
        <button className="w-fit bg-yellow-400 text-lg lg:text-2xl font-hand px-6 py-3 rounded-xl shadow-md">
          Peça aqui!
        </button>
      </div>
      <img
        className="w-64 h-[400px] lg:w-96 lg:h-[567px] object-cover rounded-xl"
        src="https://ik.imagekit.io/8h7kfljfc/imgs/um-delicioso-hamburguer-no-estudio-removebg-preview.png?updatedAt=1752066426155"
        alt="Imagem destaque"
      />
    </div>
  );
}

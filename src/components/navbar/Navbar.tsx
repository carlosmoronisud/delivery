import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <div className='flex px-15 py-6 justify-between bg-gray-50'>
      <div className="pl-10">
        <Link to="/">
          <img
            src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
            alt="logo"
            className="h-20 rounded-full"
          />
        </Link>
      </div>

      <div className="flex justify-between items-center gap-8 text-xl pr-10">
        <Link to="/" className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer">Home</Link>
        <Link to="/clientes" className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer">Categorias</Link>
        <Link to="/oportunidades" className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer">Produtos</Link>
        <Link to="/sobre" className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer">Sobre</Link>
        
      </div>
    </div>
  );
}

export default Navbar;
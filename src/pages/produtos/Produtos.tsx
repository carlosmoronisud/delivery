import { Link } from 'react-router-dom';
import ListarProdutos from '../../components/produto/listarprodutos/ListarProdutos';


function Produtos() {
  return (
    <div>
      <Link
        to="/cadastrarproduto"
        className="text-indigo-800 hover:underline"
      >
        <button
          className="rounded bg-indigo-400 flex justify-center hover:bg-indigo-900 text-white w-1/2 py-2"
        >
          <span>Cadastrar Produto</span>
        </button>
      </Link>

      <ListarProdutos />
    </div>
  );
}

export default Produtos;


import { Link } from 'react-router-dom'
import ListarCategorias from '../../components/categorias/listarcategorias/ListarCategorias'

function Categorias() {


  return (
    <div>
      <Link
						to="/cadastrarcategoria"
						className="text-indigo-800 hover:underline"
					>
						<button
					className="rounded bg-indigo-400 flex justify-center hover:bg-indigo-900 text-white w-1/2 py-2"
				>
					<span>Cadastrar Categorias</span>
				</button>
			</Link>
      <ListarCategorias />
    </div>
    
  )
}

export default Categorias
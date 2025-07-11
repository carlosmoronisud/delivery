/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RotatingLines } from 'react-loader-spinner';

import type Produto from '../../../models/Produto';
import { buscar, deletar } from '../../../services/Service';
import { AuthContext } from '../../../contexts/AuthContext';
import { ToastAlerta } from '../../../utils/ToastAlerta';

function DeletarProduto() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [produto, setProduto] = useState<Produto>({} as Produto);

	const { usuario, handleLogout } = useContext(AuthContext);
	const token = usuario.token;

	const { id } = useParams<{ id: string }>();

	async function buscarProdutoPorId(id: string) {
		try {
			await buscar(`/produtos/${id}`, setProduto, {
				headers: { Authorization: token },
			});
		} catch (error: any) {
			if (error.toString().includes('401')) {
				handleLogout();
			}
		}
	}

	useEffect(() => {
		if (token === '') {
			ToastAlerta('Você precisa estar logado!', 'info');
			navigate('/');
		}
	}, [token]);

	useEffect(() => {
		if (id !== undefined) {
			buscarProdutoPorId(id);
		}
	}, [id]);

	async function deletarProduto() {
		setIsLoading(true);
		try {
			await deletar(`/produtos/${id}`, {
				headers: { Authorization: token },
			});
			ToastAlerta('Produto excluído com sucesso!', 'sucesso');
		} catch (error: any) {
			if (error.toString().includes('401')) {
				handleLogout();
			} else {
				ToastAlerta('Erro ao excluir o produto!', 'erro');
				console.error(error);
			}
		}
		setIsLoading(false);
		retornar();
	}

	function retornar() {
		navigate('/produtos');
	}

	return (
		<div className="min-h-screen w-full bg-gradient-to-b from-[#F4BF4F] to-[#F1EDD2] flex justify-center items-center px-4">
			<div className="max-w-md w-full bg-white border-2 border-[#F4BF4F] rounded-2xl shadow-xl flex flex-col items-center p-6 gap-4 hover:scale-105 transition duration-300">
				
				<h1 className="text-4xl font-bold text-center text-gray-800">Deletar Produto</h1>
				<p className="text-lg text-center text-gray-600">
					Você tem certeza que deseja excluir o produto a seguir?
				</p>

				{/* Card do Produto */}
				<div className="flex flex-col items-center gap-4 w-full">
					<img
						src={produto.imagem || "https://placehold.co/250x250?text=Produto"}
						alt={produto.nome}
						className="w-52 h-52 object-cover rounded-xl"
					/>
					<h2 className="text-xl font-semibold text-black">{produto.nome}</h2>
					<p className="text-base font-medium text-gray-700">
						R$ {produto.preco?.toFixed(2)}
					</p>
					<p className="text-base font-bold text-red-800 text-center">NutriScore: {produto.nutriScore}</p>
				</div>

				{/* Botões */}
				<div className="flex justify-center gap-12 pt-4 w-full">
					<button
						onClick={retornar}
						className="text-lg text-red-600 hover:scale-110 transition duration-150"
					>
						Não
					</button>

					<button
						onClick={deletarProduto}
						className="text-lg text-green-700 hover:scale-110 transition duration-150 flex items-center justify-center"
					>
						{isLoading ? (
							<RotatingLines
								strokeColor="green"
								strokeWidth="4"
								animationDuration="0.75"
								width="24"
								visible={true}
							/>
						) : (
							<span>Sim</span>
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

export default DeletarProduto;
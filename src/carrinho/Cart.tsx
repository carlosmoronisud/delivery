import { useContext } from 'react'

import CardCart from './CartCard'
import { CartContext, type Items } from '../contexts/CartContext'


// Componente principal do Carrinho de Compras
function Cart() {
	// Consome o contexto do carrinho para acessar itens, quantidade, valor total e funções
	const { items, quantidadeItems, valorTotal, limparCart } =
		useContext(CartContext)

	return (
		// Container principal: ocupa toda a tela, fundo cinza, padding responsivo
		<div className="min-h-screen flex justify-center bg-slate-200 pt-4 px-2 mt-22 md:mt-0 md:px-8">
			{/* Limita a largura máxima e centraliza o conteúdo */}
			<div className="w-full max-w-7xl flex flex-col mx-auto">
				{/* Título do carrinho, responsivo */}
				<h1 className="text-3xl md:text-4xl text-center my-4">
					Carrinho de Compras
				</h1>

				{/* Mensagem de carrinho vazio, responsiva */}
				{items.length === 0 && (
					<span className="my-8 text-xl md:text-3xl text-center block w-full">O Carrinho está vazio!</span>
				)}

				{/* Grid de cards do carrinho: sempre 2 colunas, espaçamento responsivo */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-2 px-2 md:px-8 py-4">
					{items.map((produto: Items) => (
						<CardCart key={produto.id} item={produto} />
					))}
				</div>

				{/* Se houver itens, exibe o resumo da compra */}
				{quantidadeItems > 0 && (
					// Resumo da compra: responsivo, centralizado, com grid para separar detalhes e botão
					<div className="container mx-auto my-12 py-4 w-full md:w-2/3 lg:w-1/2 grid grid-cols-1 md:grid-cols-2 border rounded-lg bg-white text-lg gap-4">
						{/* Detalhes do resumo */}
						<div className="w-full flex flex-col px-4 md:px-8">
							<h2 className="text-lg md:text-2xl text-center font-bold py-2">
								Resumo da Compra
							</h2>
							<p className="pb-2">
								<span className="font-semibold">
									Total de items adicionados:{' '}
								</span>
								{quantidadeItems}
							</p>
							<p>
								<span className="font-semibold">
									Subtotal:{' '}
								</span>
								{Intl.NumberFormat('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								}).format(valorTotal)}
							</p>
							<p>
								<span className="font-semibold">
									Desconto:{' '}
								</span>
								{Intl.NumberFormat('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								}).format(0.0)}
							</p>
							<p>
								<span className="font-semibold">Frete: </span>
								{Intl.NumberFormat('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								}).format(0.0)}
							</p>
							<hr className="border-xl border-slate-800 py-1" />
							<p>
								<span className="font-semibold">Total: </span>
								{Intl.NumberFormat('pt-BR', {
									style: 'currency',
									currency: 'BRL',
								}).format(valorTotal)}
							</p>
						</div>
						{/* Botão de finalizar compra, responsivo */}
						<div className="flex justify-center items-center px-4 md:px-8">
							<button
								className="rounded text-slate-100 bg-slate-400 hover:bg-slate-800 w-full md:w-1/2 lg:w-2/3 xl:w-3/4 py-2 mx-auto flex justify-center my-4"
								type="submit"
								disabled={items.length === 0}
								onClick={limparCart}
							>
								Finalizar Compra
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Cart
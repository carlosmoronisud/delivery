import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import { useContext } from "react"
import type { Items } from "../contexts/CartContext"
import { CartContext } from '../contexts/CartContext';

// Props esperadas pelo CardCart: um item do carrinho
interface CardProdutosProps {
    item: Items
}

// CardCart exibe informações de um produto no carrinho e permite alterar quantidade
function CardCart({ item }: Readonly<CardProdutosProps>) {

    // Consome funções do contexto para adicionar/remover itens
    const { adicionarItem, removerItem } = useContext(CartContext)

    return (
        // Card principal com imagem, detalhes e botões
        <div className='flex flex-col rounded-lg overflow-hidden justify-between bg-white'>
            <div className='py-4'>
                {/* Imagem do produto */}
                <img src={item.imagem} className='mt-1 h-40 max-w-75 mx-auto' alt={item.nome} />
                <div className='p-4'>
                    {/* Nome, preço e categoria */}
                    <p className='text-sm text-center uppercase'>{item.nome}</p>
                    <h3 className='text-xl text-center font-bold uppercase'>
                        {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(item.preco)}
                    </h3>
                    {item.categoria && typeof item.categoria === 'object' && (
                    <p className='text-sm italic text-center'>Categoria: {item.categoria.descricao} </p>
                    )}
                    {/* Quantidade do item */}
                    <h4 className='my-2 text-center'>
                        <span className="font-semibold">Quantidade:</span> {item.quantidade} 
                    </h4>
                </div>
            </div>
            {/* Botões para adicionar/remover quantidade */}
            <div className="flex flex-wrap">
                <button className='w-1/2 text-slate-100 bg-blue-500 hover:bg-blue-700 
                                   flex items-center justify-center py-2'
                    onClick={() => adicionarItem(item.id)}>
                    <PlusIcon size={32} />
                </button>
                <button className='w-1/2 text-slate-100 bg-red-500 hover:bg-red-700 
                                   flex items-center justify-center py-2'
                    onClick={() => removerItem(item.id)}>
                    <MinusIcon size={32} />
                </button>
            </div>
        </div >
    )
}

export default CardCart
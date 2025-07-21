import { MinusCircle, PlusCircle, XCircle } from "@phosphor-icons/react"; 
import { useContext } from "react";
import type { Items } from "../contexts/CartContext";
import { CartContext } from '../contexts/CartContext';
import { ToastAlerta } from "../utils/ToastAlerta"; 

// Props esperadas pelo CardCart: um item do carrinho
interface CardProdutosProps {
    item: Items;
}

// CardCart exibe informações de um produto no carrinho e permite alterar quantidade
function CardCart({ item }: Readonly<CardProdutosProps>) {
    const { adicionarItem, removerItem, removerProdutoDoCarrinho } = useContext(CartContext);

    // Função para remover completamente o item do carrinho
    const handleRemoverCompletamente = () => {
        removerProdutoDoCarrinho(item.id);
        ToastAlerta(`${item.nome} removido do carrinho.`, 'info');
    };

    return (
        // Card principal com imagem, detalhes e botões
        <div className='relative flex flex-col rounded-xl overflow-hidden justify-between
                                 bg-white shadow-md border border-gray-200
                                 transform transition-transform duration-300 hover:scale-[1.02]'> 
            
            {/* Botão de remover item completamente - posicionado no canto superior direito */}
            <button
                onClick={handleRemoverCompletamente}
                className="absolute top-2 right-2 z-10 p-1 rounded-full bg-red-500 text-white
                                hover:bg-red-600 shadow-sm transition-all duration-200 cursor-pointer"
                title="Remover item do carrinho"
            >
                <XCircle size={20} weight="bold" /> 
            </button>

            <div className='flex flex-col flex-grow'> 
                <div className="flex justify-center items-center p-4 bg-gray-50 border-b border-gray-100">
                    <img src={item.imagem || 'https://placehold.co/120x120?text=Produto'}
                              className='h-32 w-32 object-contain rounded-lg' 
                              alt={item.nome} />
                </div>

                <div className='p-4 flex flex-col gap-1 text-gray-800'>
                    <p className='text-base font-semibold text-center leading-tight'>{item.nome}</p>
                    <h3 className='text-xl text-center font-bold text-orange-600 mb-2'>
                        {Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                        }).format(item.preco * item.quantidade)}
                    </h3>
                    
                    {/* Categoria do item  */}
                    {item.id_categoria && typeof item.id_categoria === 'object' && 'descricao' in item.id_categoria && ( // Mais checks de segurança
                        <p className='text-xs italic text-gray-600 text-center'>
                            Categoria: {item.id_categoria.descricao}
                        </p>
                    )}
                    
                    {/* Quantidade do item */}
                    <h4 className='my-2 text-center text-gray-700'>
                        <span className="font-semibold">Quantidade:</span> {item.quantidade}
                    </h4>
                </div>
            </div>

            {/* Botões para adicionar/remover quantidade */}
            <div className="flex w-full border-t border-gray-200">
                <button
                    className='w-1/2 p-3 bg-green-500 text-white font-bold
                                rounded-bl-lg hover:bg-green-600 transition-colors duration-200
                                flex items-center justify-center cursor-pointer'
                    onClick={() => adicionarItem(item.id)}>
                    <PlusCircle size={24} weight="bold" />
                </button>
                <button
                    className='w-1/2 p-3 bg-red-500 text-white font-bold
                                rounded-br-lg hover:bg-red-600 transition-colors duration-200
                                flex items-center justify-center cursor-pointer'
                    onClick={() => removerItem(item.id)}>
                    <MinusCircle size={24} weight="bold" />
                </button>
            </div >
        </div >
    );
}

export default CardCart;
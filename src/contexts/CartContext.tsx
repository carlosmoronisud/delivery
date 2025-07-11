/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext,  useState, useMemo, type ReactNode } from "react";
import type Produto from "../models/Produto";


// Cria o tipo Items, como uma herança do tipo Produto, adicionando quantidade
export interface Items extends Produto{
    quantidade: number;
}

// Define os atributos, estados e funções compartilhados pelo contexto do carrinho
interface CartContextProps {
    adicionarProduto: (produto: Produto) => void;
    adicionarItem: (id: number) => void;
    removerItem: (id: number) => void;
    limparCart: () => void;
    items: Items[];
    quantidadeItems: number;
    valorTotal: number;
}

// Props do provider do contexto
interface CartProviderProps {
    children: ReactNode;
}

// Criação do contexto do carrinho
export const CartContext = createContext({} as CartContextProps);

// Provider do contexto do carrinho, envolve a aplicação
export function CartProvider({ children }: Readonly<CartProviderProps>) {
    
    // Estado que armazena os produtos adicionados ao carrinho
    const [items, setItems] = useState<Items[]>([]);

    // Calcula o número total de itens no carrinho (quantidade acumulada)
    const quantidadeItems = items.reduce((acc, item) => acc + item.quantidade, 0);

    // Calcula o valor total da compra em Reais
    const valorTotal = items.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    // Adiciona um produto ao carrinho (ou incrementa quantidade se já existir)
    function adicionarProduto(produto: Produto) {
        // Localiza o produto no array items e guarda o indice
        const itemIndex = items.findIndex(item => item.id === produto.id);
        
        if (itemIndex !== -1) {
            // Produto já está no carrinho, aumenta a quantidade
            const novoCart = [...items];
            novoCart[itemIndex].quantidade += 1;
            setItems(novoCart);
           alert('01 item adicionado!');
        } else {
            // Produto não está no carrinho, adiciona novo item
            setItems(itensAtuais => [...itensAtuais, { ...produto, quantidade: 1 }]);
           alert('Produto adicionado ao carrinho!');
        }
    }

    // Incrementa a quantidade de um item já presente no carrinho
    function adicionarItem(id: number) {
        // Localiza o produto no array items e guarda o indice
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            const novoCart = [...items];
            novoCart[itemIndex].quantidade += 1;
            setItems(novoCart);
           alert('01 item adicionado!');
        } else {
           alert('Produto não encontrado no carrinho!');
        }
    }

    // Remove um item do carrinho (decrementa quantidade ou remove se for o último)
    function removerItem(id: number) {
       // Localiza o produto no array items e guarda o indice
        const itemIndex = items.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
            const novoCart = [...items];
            
            if (novoCart[itemIndex].quantidade > 1) {
                // Reduz a quantidade do produto
                novoCart[itemIndex].quantidade -= 1;
                setItems(novoCart);
               alert('01 Item removido!');
            } else {
                // Remove o produto se a quantidade for 1
                novoCart.splice(itemIndex, 1);
                setItems(novoCart);
               alert('Produto removido!');
            }
        }
    }

    // Limpa o carrinho
    function limparCart() {
       alert('Compra efetuada com sucesso!');
        setItems([]);
    }

    // Memoiza o valor do contexto para evitar recriação desnecessária
    const contextValue = useMemo(() => ({
        adicionarProduto,
        adicionarItem,
        removerItem,
        limparCart,
        items,
        quantidadeItems,
        valorTotal
    }), [items, quantidadeItems, valorTotal]);

    // Retorna o provider envolvendo os filhos
    return (
        <CartContext.Provider 
            value={contextValue}
        >
            {children}
        </CartContext.Provider>
    );
}
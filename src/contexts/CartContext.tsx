/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useMemo, type ReactNode, useContext } from "react";
import type Produto from "../models/Produto"; // Make sure this path is correct
import { ToastAlerta } from "../utils/ToastAlerta"; // Ensure this path is correct and ToastAlerta is updated

// Cria o tipo Items, como uma herança do tipo Produto, adicionando quantidade
export interface Items extends Produto {
  quantidade: number;
}

// Define os atributos, estados e funções compartilhados pelo contexto do carrinho
interface CartContextProps {
  adicionarProduto: (produto: Produto) => void;
  adicionarItem: (id: number) => void;
  removerItem: (id: number) => void;
  removerProdutoDoCarrinho: (id: number) => void; 
  limparCart: () => void;
  items: Items[];
  quantidadeItems: number;
  valorTotal: number;
}

// Props do provider do contexto
interface CartProviderProps {
  children: ReactNode;
}
export const CartContext = createContext({} as CartContextProps);

// Crie o hook useCart aqui, antes do Provider
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}

// Criação do contexto do carrinho


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
    const itemIndex = items.findIndex(item => item.id === produto.id);

    if (itemIndex !== -1) {
      // Produto já está no carrinho, aumenta a quantidade
      const novoCart = [...items];
      novoCart[itemIndex].quantidade += 1;
      setItems(novoCart);
      ToastAlerta('Mais 01 item adicionado ao carrinho!', 'info'); 
    } else {
      // Produto não está no carrinho, adiciona novo item
      setItems(itensAtuais => [...itensAtuais, { ...produto, quantidade: 1 }]);
      ToastAlerta('Produto adicionado ao carrinho!', 'sucesso'); 
    }


  }

  // Incrementa a quantidade de um item já presente no carrinho
  function adicionarItem(id: number) {
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      const novoCart = [...items];
      novoCart[itemIndex].quantidade += 1;
      setItems(novoCart);
      ToastAlerta('Quantidade aumentada em 01!', 'info'); 
    } else {
      // Isso não deveria acontecer se a lógica de UI for correta, mas é um fallback
      ToastAlerta('Produto não encontrado no carrinho para adicionar!', 'erro'); 
    }
  }

  // Decrementa a quantidade de um item já presente no carrinho
  function removerItem(id: number) {
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex !== -1) {
      const novoCart = [...items];

      if (novoCart[itemIndex].quantidade > 1) {
        // Reduz a quantidade do produto
        novoCart[itemIndex].quantidade -= 1;
        setItems(novoCart);
        ToastAlerta('Quantidade diminuída em 01!', 'info');
      } else {
        // Remove o produto se a quantidade for 1 (com feedback específico)
        novoCart.splice(itemIndex, 1);
        setItems(novoCart);
        ToastAlerta('Item removido do carrinho!', 'sucesso'); 
      }
    }
  }

  // Função para remover completamente um produto do carrinho (todas as suas quantidades)
  function removerProdutoDoCarrinho(id: number) {
    setItems(currentItems => {
      const updatedItems = currentItems.filter(item => item.id !== id);
  
      return updatedItems;
    });
  }


  // Limpa o carrinho
  function limparCart() {
    if (quantidadeItems > 0) { 
      ToastAlerta('Compra efetuada com sucesso! ✨', 'sucesso'); 
      setItems([]);
    } else {
      ToastAlerta('Seu carrinho já está vazio!', 'info');
    }
  }

  // Memoiza o valor do contexto para evitar recriação desnecessária
  const contextValue = useMemo(() => ({
    adicionarProduto,
    adicionarItem,
    removerItem,
    removerProdutoDoCarrinho, 
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
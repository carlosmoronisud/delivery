// src/components/produto/listarprodutos/ListarProdutos.tsx
import { useEffect, useState,  } from 'react';
import { useSearchParams } from 'react-router-dom';
import type Produto from '../../../models/Produto'; // Caminho para o seu modelo Produto
import { buscar } from '../../../services/Service'; // Seu serviço para buscar produtos

import { ToastAlerta } from '../../../utils/ToastAlerta'; // Para alertas


import Lottie from 'lottie-react'; // Para animação de loading
import loadingSpinner from '../../../assets/lottie-animations/FoodCarousel.json';
import emptyStateAnimation from '../../../assets/lottie-animations/cancelled_order.json'; 
import { filtrarProdutos } from '../../../utils/FilterLogic';
import CardProduto from '../cardproduto/CardProduto';

export default function ListarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [params] = useSearchParams(); // Pega os parâmetros da URL para filtrar

  // Contexto para obter o token se necessário para a busca


  // Função para buscar todos os produtos do backend
  async function fetchProdutos() {
    setIsLoading(true);
    try {
      // Adapte a rota e o método de busca conforme sua API
      // Se sua API de busca de produtos precisa de um token, adicione-o aqui.
      // Ex: await buscar('/produtos', setProdutos, { headers: { Authorization: `Bearer ${token}` } });
      await buscar('/produtos', setProdutos); 
      ToastAlerta('Produtos carregados com sucesso!', 'sucesso');
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      ToastAlerta("Não foi possível carregar os produtos.", "erro");
    } finally {
      setIsLoading(false);
    }
  }

  // Efeito para buscar os produtos UMA VEZ ao montar o componente
  useEffect(() => {
    fetchProdutos();
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Efeito para aplicar os filtros sempre que os produtos originais ou os parâmetros da URL mudarem
  useEffect(() => {
    // Aplica a função de filtro importada aos produtos
    const produtosAposFiltro = filtrarProdutos(produtos, params);
    setProdutosFiltrados(produtosAposFiltro);
  }, [produtos, params]); // Depende da lista de produtos e dos parâmetros da URL

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <Lottie animationData={loadingSpinner} loop={true} autoplay={true} style={{ width: 150, height: 150 }} />
      </div>
    );
  }

  if (produtosFiltrados.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-600">
        <Lottie animationData={emptyStateAnimation} loop={true} autoplay={true} style={{ width: 200, height: 200 }} />
        <p className="text-xl mt-4 font-semibold">Nenhum produto encontrado com os filtros aplicados.</p>
        <button onClick={() => setProdutos([])} className="mt-4 text-orange-600 hover:underline">Limpar filtros</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {produtosFiltrados.map((produto) => (
        <CardProduto key={produto.id} produto={produto} />
      ))}
    </div>
  );
}
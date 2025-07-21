/* eslint-disable @typescript-eslint/no-unsafe-function-type */

import type Produto from "../models/Produto";
import { api } from "./Service";


export const buscarProdutos = async (): Promise<Produto[]> => {
  const resposta = await api.get("/produtos");
  return resposta.data; 
};

// Buscar produto por ID
export const buscarProdutoPorId = async (id: number, setDados: Function, ) => {
  const resposta = await api.get(`/produtos/${id}`,);
  setDados(resposta.data);
};

// Buscar produtos por preço (menor que)
export const buscarProdutoPorPrecoMenorQue = async (preco: string, setDados: Function, ) => {
  const resposta = await api.get(`/produtos/precoMenorQue/${preco}`, );
  setDados(resposta.data); 
};

// Buscar produtos por preço (maior que)
export const buscarProdutoPorPrecoMaiorQue = async (preco: string, setDados: Function, ) => {
  const resposta = await api.get(`/produtos/precoMaiorQue/${preco}`, );
  setDados(resposta.data); 
};

// Buscar Produtos por nome
export const buscarProdutosPorNome = async (nomeProduto: string, setDados: Function, ) => {
  const resposta = await api.get(`/produtos/nomeProduto/${nomeProduto}`, );
  setDados(resposta.data); 
}

// Buscar Produtos por ingrediente
export const buscarProdutosPorIngrediente = async (ingrediente: string, setDados: Function, ) => {
  const resposta = await api.get(`/produtos/ingrediente/${ingrediente}`, );
  setDados(resposta.data); 
};
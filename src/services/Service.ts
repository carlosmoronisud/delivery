/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import axios from "axios";



const api = axios.create({
    //baseURL: import.meta.env.VITE_API_URL,
    baseURL: 'https://delivery-hzm2.onrender.com',
})

export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

export const login = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

export const buscar = async (url: string, setDados: Function, header: object) => {
    const resposta = await api.get(url, header)
    setDados(resposta.data)
}

export const cadastrar = async (url: string, dados: Object, setDados: Function, header: object) => {
    const resposta = await api.post(url, dados, header)
    setDados(resposta.data)
}

export const atualizar = async (url: string, dados: Object, setDados: Function, header: object) => {
    const resposta = await api.put(url, dados, header)
    setDados(resposta.data)
}

export const deletar = async(url: string, header: object) => {
    await api.delete(url, header)
}
{/*Usuarios*/}
// Buscar todos os usuários
export const buscarTodosUsuarios = async (setDados: Function, header: object) => {
  const resposta = await api.get("/usuarios", header);
  setDados(resposta.data);
};

// Buscar usuário por ID
export const buscarUsuarioPorId = async (id: number, setDados: Function, header: object) => {
  const resposta = await api.get(`/${id}`, header)
  setDados(resposta.data)
}


// Buscar usuário por email
export const buscarUsuarioPorEmail = async (usuario: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/usuario/${usuario}`, header);
  setDados([resposta.data]); // array para exibir como lista
};

// Buscar usuários por nome
export const buscarUsuariosPorNome = async (nome: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/usuarios/${nome}`, header);
  setDados(resposta.data);
};

// Buscar todos os Produtos
export const buscarProdutos = async (setDados: Function, header: object) => {
  const resposta = await api.get("/produtos/", header);
  setDados(resposta.data); 
};

// Buscar produto por ID
export const buscarProdutoPorId = async (id: number, setDados: Function, header: object) => {
  const resposta = await api.get(`/produtos/${id}`, header);
  setDados(resposta.data);
};

// Buscar produtos por preço (menor que)
export const buscarProdutoPorPrecoMenorQue = async (preco: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/produtos/precoMenorQue/${preco}`, header);
  setDados(resposta.data); 
};

// Buscar produtos por preço (maior que)
export const buscarProdutoPorPrecoMaiorQue = async (preco: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/produtos/precoMaiorQue/${preco}`, header);
  setDados(resposta.data); 
};

// Buscar Produtos por nome
export const buscarProdutosPorNome = async (nomeProduto: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/produtos/nomeProduto/${nomeProduto}`, header);
  setDados(resposta.data); 
}

// Buscar Produtos por ingrediente
export const buscarProdutosPorIngrediente = async (ingrediente: string, setDados: Function, header: object) => {
  const resposta = await api.get(`/produtos/ingrediente/${ingrediente}`, header);
  setDados(resposta.data); 
};
// Service.ts (no final do arquivo)
import type Produto from "../models/Produto";

export const buscarTodosProdutos = async (
  setDados: Function,
  header: object
) => {
  const resposta = await api.get("/produtos", header);

  const adaptados: Produto[] = resposta.data.map((item: any) => ({
    id: item.id,
    nome: item.nome,
    preco: item.preco,
    imagem: item.imagem,
    nutriScore: item.nutriScore,
    ingredientes: item.ingrediente, // conversão aqui
    categoria: item.id_categoria,
    usuario: item.id_usuario,
  }));

  setDados(adaptados);
};


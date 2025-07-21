/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import { api } from "./Service";

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

// Cadastrar usuário
export const cadastrarUsuario = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}

// Login
export const login = async (url: string, dados: Object, setDados: Function) => {
    const resposta = await api.post(url, dados)
    setDados(resposta.data)
}
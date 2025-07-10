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



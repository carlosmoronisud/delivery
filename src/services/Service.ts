/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import axios from "axios";


const BASE_URL = import.meta.env.VITE_APP_BACKEND_URL;

console.log("Axios BASE_URL configurada:", BASE_URL);

export const api = axios.create({
    baseURL: BASE_URL,

});

export const buscar = async (url: string, setDados: Function, ) => {
    const resposta = await api.get(url)
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



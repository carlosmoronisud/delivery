import type Categoria from "./Categoria";


export default interface Produto{
    id: number;
    nome: string;
    preco: number;
    imagem?: string;
    nutriScore?: string;
    ingredientes: string;
    categoria: Categoria | null;
}
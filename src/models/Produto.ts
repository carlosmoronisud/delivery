import type Categoria from "./Categoria";
import type Usuario from "./Usuario";


export default interface Produto{
    id: number;
    nome: string;
    preco: number;
    imagem?: string;
    nutriScore?: string;
    ingrediente: string;
    categoria: Categoria | number;
    usuario: Usuario | number
}
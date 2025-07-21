// src/models/Produto.ts
import type Categoria from "./Categoria";
import type Usuario from "./Usuario";
import type UsuarioLogin from "./UsuarioLogin"; // Use UsuarioLogin para o tipo de usuário associado ao produto

export default interface Produto {
    id: number;
    nome: string;
    preco: number;
    imagem: string;
    nutriScore?: string;
    ingrediente?: string;
    categoria?: Categoria;
    usuario?: Usuario;
    id_categoria?: Categoria;
    id_usuario?: UsuarioLogin|null; 
}
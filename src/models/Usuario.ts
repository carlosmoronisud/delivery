import type Produto from "./Produto";

export default interface Usuario {
  id: null | number;
  nome: string;
  usuario: string;
  senha: string;
  foto: string;
  produto?: Produto[] | null;
}

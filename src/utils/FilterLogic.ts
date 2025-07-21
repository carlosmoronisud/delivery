/* eslint-disable @typescript-eslint/no-unused-vars */
// src/utils/filterLogic.ts
import type Produto from "../models/Produto";

const RESTRICOES_TO_EXCLUSAO: { [key: string]: string[] } = {
    "vegano": ["carne", "frango", "porco", "peixe", "ovos", "leite", "queijo", "mel"],
    "sem-gluten": ["trigo", "cevada", "centeio", "malte"],
    "vegetariano": ["carne", "frango", "porco", "peixe"],
    "sem-lactose": ["leite", "queijo", "manteiga", "creme"],
};

export function filtrarProdutos(produtos: Produto[], params: URLSearchParams): Produto[] {
    let produtosFiltrados = [...produtos];

    const precoMin = parseFloat(params.get("precoMin") || '0');
    const precoMax = parseFloat(params.get("precoMax") || String(Number.MAX_SAFE_INTEGER));
    const ingredienteBusca = params.get("ingrediente")?.toLowerCase().trim() || '';
    const excluirIngrediente = params.get("excluirIngrediente") === 'true';
    const nutriScore = params.get("nutriScore")?.toUpperCase() || '';
    const categoriaId = params.get("categoriaId");

    produtosFiltrados = produtosFiltrados.filter(produto => {
        return produto.preco >= precoMin && produto.preco <= precoMax;
    });

    if (ingredienteBusca) {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            // Usando 'produto.ingrediente' (singular) e tratando como opcional
            const produtoIngredientes = produto.ingrediente?.toLowerCase() || ''; 
            
            if (excluirIngrediente) {
                return !produtoIngredientes.includes(ingredienteBusca);
            } else {
                return produtoIngredientes.includes(ingredienteBusca);
            }
        });
    }

    if (nutriScore) {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            return produto.nutriScore?.toUpperCase() === nutriScore;
        });
    }

    if (categoriaId) {
        produtosFiltrados = produtosFiltrados.filter(produto => {
            return (typeof produto.id_categoria === 'object' && String(produto.id_categoria?.id) === categoriaId) ||
                   (typeof produto.id_categoria === 'number' && String(produto.id_categoria) === categoriaId);
        });
    }

    return produtosFiltrados;
}
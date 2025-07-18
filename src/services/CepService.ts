// src/utils/cepService.ts

import type { EnderecoData } from "../models/EnderecoData";


/**
 * Busca dados de endereço na API ViaCEP a partir de um CEP.
 * @param cep O CEP a ser pesquisado (apenas números).
 * @returns Promise<Partial<EnderecoData> | null> Retorna um objeto EnderecoData parcial
 * ou null se o CEP não for encontrado/válido.
 */
export async function buscarEnderecoPorCep(cep: string): Promise<Partial<EnderecoData> | null> {
    // Remove qualquer caractere não numérico do CEP
    const cepLimpo = cep.replace(/\D/g, '');

    // Valida se o CEP tem 8 dígitos
    if (cepLimpo.length !== 8) {
        console.warn("CEP inválido (deve ter 8 dígitos).");
        return null;
    }

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (!response.ok) {
            console.error(`Erro ao buscar CEP ${cepLimpo}: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        // Verifica se a API retornou um erro (ex: CEP não encontrado)
        if (data.erro) {
            console.warn(`CEP ${cepLimpo} não encontrado.`);
            return null;
        }

        // Mapeia os dados da ViaCEP para a sua interface EnderecoData
        const endereco: Partial<EnderecoData> = {
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            cep: data.cep || '',
            // Número e complemento não vêm da ViaCEP, então não os preenchemos aqui
            // E também não alteramos a rua para "Logradouro"
        };
        
        return endereco;

    } catch (error) {
        console.error("Erro na requisição da ViaCEP:", error);
        return null;
    }
}
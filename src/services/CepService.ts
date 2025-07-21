// src/utils/cepService.ts
import type { EnderecoData } from "../models/EnderecoData";



export async function buscarEnderecoPorCep(cep: string): Promise<Partial<EnderecoData> | null> {
    const cepLimpo = cep.replace(/\D/g, '');

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

        if (data.erro) {
            console.warn(`CEP ${cepLimpo} não encontrado.`);
            return null;
        }

        const endereco: Partial<EnderecoData> = {
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            cep: data.cep ? data.cep.replace('-', '') : '', // Garante CEP limpo
        };
        
        return endereco;

    } catch (error) {
        console.error("Erro na requisição da ViaCEP:", error);
        return null;
    }
}
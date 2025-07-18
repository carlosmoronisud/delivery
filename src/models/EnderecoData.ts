// src/types/EnderecoData.ts

export interface EnderecoData {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    complemento?: string;
    cep?: string;
}
// src/models/EnderecoData.ts

export interface EnderecoData {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    complemento?: string;
    cep?: string;
    latitude?: number; 
    longitude?: number; 
    estado?: string;
}
export interface EnderecoData {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
  cep?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  enderecoCompleto?: string; // Adicionado para armazenar o endereço formatado
}
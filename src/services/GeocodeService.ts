export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
}

export async function geocodeAddress(addressText: string): Promise<GeocodeResult | null> {
  // Verifica se a chave de API existe
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('Chave da API do Google Maps não configurada');
    return null;
  }

  // Verifica se o endereço é válido
  if (!addressText?.trim()) {
    console.warn('Endereço vazio fornecido para geocodificação');
    return null;
  }

  try {
    // Faz a requisição para a API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressText)}&key=${apiKey}`
    );

    // Verifica se a resposta é válida
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }

    const data = await response.json();

    // Verifica o status da resposta
    if (data.status !== 'OK' || !data.results?.[0]) {
      console.warn('Geocodificação falhou:', data.status, data.error_message);
      return null;
    }

    // Extrai os dados necessários
    const location = data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: data.results[0].formatted_address
    };

  } catch (error) {
    console.error('Erro ao geocodificar endereço:', error);
    return null;
  }
}
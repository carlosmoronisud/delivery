// src/utils/geocodingService.ts

import type { EnderecoData } from "../models/EnderecoData"; 

const Maps_API_KEY = "AIzaSyCo7TSp3iHMUWOq6eKwcFAxlJoXPAILKTI"; 

console.log("GeocodingService: Chave de API do Google Maps:", Maps_API_KEY ? Maps_API_KEY.substring(0, 5) + '...' : "NÃO CONFIGURADA");

export async function geocodeAddress(addressText: string): Promise<Pick<EnderecoData, 'latitude' | 'longitude'> | null> {
    if (!Maps_API_KEY) {
        console.error("GeocodingService: Maps_API_KEY não está configurada.");
        return null;
    }
    if (!addressText) {
        return null;
    }

    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressText)}&key=${Maps_API_KEY}`
        );

        if (!response.ok) {
            console.error(`Erro na requisição de geocodificação: ${response.status} - ${response.statusText}`);
            return null;
        }

        const data = await response.json();

        if (data.status !== 'OK' || data.results.length === 0) {
            console.warn(`Geocodificação falhou para o endereço "${addressText}": ${data.status}`);
            return null;
        }

        const location = data.results[0].geometry.location;
        return { latitude: location.lat, longitude: location.lng };

    } catch (error) {
        console.error("Erro ao geocodificar endereço:", error);
        return null;
    }
}
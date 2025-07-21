import { useState, useRef } from "react";
import axios from "axios";
import { MapPin } from "@phosphor-icons/react";

export default function LocationButton() {
    const [cepInput, setCepInput] = useState("");
    const [cidade, setCidade] = useState("");
    const cepInputRef = useRef<HTMLInputElement>(null);

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
        setCepInput(cep);

        if (cep.length === 9) {
            buscarCidadePorCep(cep);
        }
    };

    const buscarCidadePorCep = async (cep: string) => {
        try {
            const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            if (!response.data.erro) {
                setCidade(response.data.localidade);
            } else {
                setCidade("");
            }
        } catch (error) {
            console.error("Erro ao buscar cidade:", error);
            setCidade("");
        }
    };

    return (
        <div className="flex items-center gap-2">
            {cidade ? (
                <div className="flex items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors cursor-pointer">
                    <MapPin size={20} className="text-orange-500" />
                    <span className="text-sm">{cidade}</span>
                </div>
            ) : (
                <input
                    type="text"
                    id="cep"
                    name="cep"
                    placeholder="Digite seu CEP"
                    className="border border-gray-300 bg-white text-gray-800 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm placeholder-gray-500 transition-all duration-200 w-40"
                    value={cepInput}
                    onChange={handleCepChange}
                    maxLength={9}
                    ref={cepInputRef}
                />
            )}
        </div>
    );
}

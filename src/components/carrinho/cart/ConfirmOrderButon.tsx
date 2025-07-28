import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../../contexts/AuthContext';

interface ConfirmOrderButtonProps {
  isConfirmButtonDisabled: boolean;
  handleFinalizarPedido: () => void;
  deliveryOption: 'none' | 'pickup' | 'delivery';
  enderecoData: {
    rua: string;
    numero: string;
    cidade: string;
    latitude?: number;
    longitude?: number;
  };
  isFreteCalculated: boolean;
}

export const ConfirmOrderButton = ({
  isConfirmButtonDisabled,
  handleFinalizarPedido,
  deliveryOption,
  enderecoData,
  isFreteCalculated
}: ConfirmOrderButtonProps) => {
  const { usuario } = useContext(AuthContext);

  const shouldShowConfirmButton = () => {
    return (
      (deliveryOption === 'pickup' && usuario?.token) ||
      (deliveryOption === 'delivery' && isFreteCalculated && 
       enderecoData.rua && enderecoData.numero && 
       enderecoData.cidade && enderecoData.latitude !== undefined && 
       enderecoData.longitude !== undefined && usuario?.token)
    );
  };

  return (
    <div className="flex justify-center flex-col items-center mt-4">
      {shouldShowConfirmButton() ? (
        <button
          className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          type="button"
          onClick={handleFinalizarPedido}
          disabled={isConfirmButtonDisabled}
        >
          Confirmar Pedido
        </button>
      ) : (
        <div className="text-sm text-red-500 mt-2 text-center">
          {!usuario?.token && (
            <p className="mb-2">
              Para confirmar o pedido, você precisa estar <Link to="/login" className="font-bold underline">logado</Link>!
            </p>
          )}
          {usuario?.token && deliveryOption === 'none' && (
            <p className="mb-2">Selecione uma opção de entrega/retirada para continuar.</p>
          )}
          {usuario?.token && deliveryOption === 'delivery' && 
            (!enderecoData.rua || !enderecoData.numero || !enderecoData.cidade || 
             !isFreteCalculated || enderecoData.latitude === undefined || 
             enderecoData.longitude === undefined) && (
            <p className="mb-2">Preencha o endereço, confirme no mapa e aguarde o cálculo do frete para finalizar.</p>
          )}
        </div>
      )}
    </div>
  );
};
/* eslint-disable react-hooks/rules-of-hooks */
// src/components/carrinho/cart/OrderSummary.tsx

import { DeliveryOptions } from './DeliveryOptions';
import { ToastAlerta } from '../../../utils/ToastAlerta';
import { useCart } from '../../../contexts/CartContext';

interface OrderSummaryProps {
  deliveryOption: 'none' | 'pickup' | 'delivery';
  setDeliveryOption: (option: 'none' | 'pickup' | 'delivery') => void;
  setShowAddressForm: (show: boolean) => void;
  frete: number;
  deliveryTime: string;
  distance: string;
}

export const OrderSummary = ({
  deliveryOption,
  setDeliveryOption,
  setShowAddressForm,
  frete,
  deliveryTime,
  distance
}: OrderSummaryProps) => {
  try {
    const { quantidadeItems, valorTotal } = useCart();
    
    // Calcula o valor total com frete localmente
    const valorTotalComFrete = valorTotal + (frete || 0);

    const formatCurrency = (value: number) => {
      return Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    };

    return (
      <div className="p-6 bg-gray-50 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 border-b pb-4 border-gray-200">
          Resumo do Pedido ✨
        </h2>

        <div className="flex flex-col gap-3 text-lg text-gray-700 mb-8">
          <p className="flex justify-between">
            <span className="font-semibold">Items:</span>
            <span>{quantidadeItems || 0}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Subtotal:</span>
            <span>{formatCurrency(valorTotal)}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold">Frete:</span>
            <span>{formatCurrency(frete)}</span>
          </p>
          
          {deliveryTime && deliveryOption === 'delivery' && (
            <p className="flex justify-between text-base text-gray-600 italic">
              <span className="font-semibold">Tempo estimado:</span>
              <span>{deliveryTime}</span>
            </p>
          )}
          
          {distance && deliveryOption === 'delivery' && (
            <p className="flex justify-between text-base text-gray-600 italic">
              <span className="font-semibold">Distância:</span>
              <span>{distance}</span>
            </p>
          )}
          
          <hr className="border-t-2 border-gray-300 my-2" />
          
          <p className="flex justify-between text-xl font-bold text-orange-600">
            <span className="text-xl font-extrabold">Total Final:</span>
            <span>{formatCurrency(valorTotalComFrete)}</span>
          </p>
        </div>

        <DeliveryOptions 
          deliveryOption={deliveryOption}
          setDeliveryOption={setDeliveryOption}
          setShowAddressForm={setShowAddressForm}
        />
      </div>
    );
  } catch (error) {
    console.error("Error in OrderSummary:", error);
    ToastAlerta('Ocorreu um erro ao carregar o resumo do pedido', 'erro');
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded-lg">
        Ocorreu um erro ao carregar o resumo do pedido. Por favor, tente novamente.
      </div>
    );
  }
};
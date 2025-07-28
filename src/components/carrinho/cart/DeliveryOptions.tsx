interface DeliveryOptionsProps {
  deliveryOption: 'none' | 'pickup' | 'delivery';
  setDeliveryOption: (option: 'none' | 'pickup' | 'delivery') => void;
  setShowAddressForm: (show: boolean) => void;
}

export const DeliveryOptions = ({
  deliveryOption,
  setDeliveryOption,
  setShowAddressForm
}: DeliveryOptionsProps) => {
  return (
    <div className="mb-6 border-t pt-6 border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Como deseja receber seu pedido?</h3>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <button 
          onClick={() => { setDeliveryOption('pickup'); setShowAddressForm(false); }} 
          className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md ${deliveryOption === 'pickup' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200 cursor-pointer`}
        >
          Retirar no Balcão
        </button>
        <button 
          onClick={() => { setDeliveryOption('delivery'); setShowAddressForm(true); }} 
          className={`flex-1 px-6 py-3 rounded-lg text-lg font-semibold shadow-md ${deliveryOption === 'delivery' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors duration-200 cursor-pointer`}
        >
          Entrega (Delivery)
        </button>
      </div>
    </div>
  );
};
import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { RotatingLines } from 'react-loader-spinner';

interface PickupDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
  initialName?: string;
  initialPhone?: string;
}

const PickupDetailsModal: React.FC<PickupDetailsModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialName = '',
  initialPhone = '',
}) => {
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState(initialPhone);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || phone.trim() === '') {
      alert('Por favor, preencha o nome e o telefone.');
      return;
    }

    setIsLoading(true);
    // Simula um atraso para a "confirmação"
    await new Promise(resolve => setTimeout(resolve, 500)); 
    setIsLoading(false);
    onConfirm(name, phone);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Detalhes para Retirada
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="pickupName" className="block text-lg font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="pickupName"
              name="pickupName"
              placeholder="Nome de quem irá retirar"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="pickupPhone" className="block text-lg font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              type="tel"
              id="pickupPhone"
              name="pickupPhone"
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-red-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex justify-center items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <RotatingLines
                  strokeColor="white"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="28"
                  visible={true}
                />
              ) : (
                <span>Confirmar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickupDetailsModal;

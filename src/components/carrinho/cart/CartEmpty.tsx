import { Link } from 'react-router-dom';
import { ShoppingCart } from '@phosphor-icons/react';

export const CartEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-600">
      <ShoppingCart size={80} className="mb-4 text-gray-400" />
      <span className="text-2xl md:text-3xl text-center font-semibold mb-4">
        O seu carrinho está vazio!
      </span>
      <p className="text-lg md:text-xl text-center">
        Que tal explorar nossos <Link to="/produtos" className="text-orange-600 hover:underline font-bold">produtos deliciosos</Link>?
      </p>
    </div>
  );
};
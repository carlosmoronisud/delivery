// // src/components/filtros/FiltroPalavraChave.tsx
// import React from 'react';
// import { Sparkle } from '@phosphor-icons/react';

// interface FiltroPalavraChaveProps {
//     selectedValue: string;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const FiltroPalavraChave: React.FC<FiltroPalavraChaveProps> = ({ selectedValue, onChange }) => {
//     return (
//         <div className="flex flex-col gap-3">
//             <label htmlFor="palavraChave" className="text-xl font-semibold flex items-center gap-2">
//                 Palavra-chave <Sparkle size={20} className="text-purple-600" />
//             </label>
//             <input
//                 id="palavraChave"
//                 name="palavraChave"
//                 type="text"
//                 onChange={onChange}
//                 value={selectedValue}
//                 className="w-full p-3 text-lg border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
//                 placeholder="Ex: vegano, salmão, café..."
//             />
//             <p className="text-xs text-gray-500 -mt-1">
//                 Busca por nome do produto, ingrediente ou palavra-chave da categoria.
//             </p>
//         </div>
//     );
// };

// export default FiltroPalavraChave;
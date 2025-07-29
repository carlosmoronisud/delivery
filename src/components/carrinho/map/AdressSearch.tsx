// import React, { useEffect, useRef } from 'react';

// interface AddressSearchProps {
//   onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
//   value: string;
//   onChange: (value: string) => void;
// }

// const AddressSearch: React.FC<AddressSearchProps> = ({ 
//   onPlaceSelected, 
//   value, 
//   onChange 
// }) => {
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     // Verifica se o Google Maps está carregado e se temos um input
//     if (!inputRef.current || !window.google?.maps?.places?.Autocomplete) {
//       return;
//     }

//     // Configurações do autocomplete
//     const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
//       fields: ['address_components', 'geometry', 'formatted_address'],
//       types: ['address']
//     });

//     // Quando um lugar é selecionado
//     const listener = autocomplete.addListener('place_changed', () => {
//       const place = autocomplete.getPlace();
      
//       // Verifica se tem localização
//       if (place?.geometry?.location) {
//         onPlaceSelected(place);
//       }
//     });

//     // Limpeza quando o componente é desmontado
//     return () => {
//       google.maps.event.removeListener(listener);
//     };
//   }, [onPlaceSelected]);

//   return (
//     <input
//       ref={inputRef}
//       type="text"
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
//       placeholder="Digite o endereço completo"
//     />
//   );
// };

// export default AddressSearch;
/* eslint-disable react-refresh/only-export-components */
// src/contexts/UserLocationContext.tsx
import React, { createContext, useState, useContext,  useCallback, type ReactNode } from 'react';
import type { EnderecoData } from '../models/EnderecoData';


interface UserLocationContextProps {
    userAddress: EnderecoData | null;
    setUserAddress: (address: EnderecoData | null) => void;
    formattedAddress: string; // Endereço formatado para exibição na Navbar
}

export const UserLocationContext = createContext<UserLocationContextProps>({} as UserLocationContextProps);

export const UserLocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userAddress, setUserAddressState] = useState<EnderecoData | null>(() => {
        // Tenta carregar o endereço do localStorage ao iniciar
        const storedAddress = localStorage.getItem('userAddress');
        return storedAddress ? JSON.parse(storedAddress) : null;
    });

    const setUserAddress = useCallback((address: EnderecoData | null) => {
        setUserAddressState(address);
        if (address) {
            localStorage.setItem('userAddress', JSON.stringify(address));
        } else {
            localStorage.removeItem('userAddress');
        }
    }, []);

    // Formata o endereço para exibição na Navbar
    const formattedAddress = React.useMemo(() => {
        if (userAddress) {
            if (userAddress.rua && userAddress.numero) {
                return `${userAddress.rua}, ${userAddress.numero}, ${userAddress.cidade}`;
            } else if (userAddress.cidade) {
                return userAddress.cidade;
            }
        }
        return 'Definir endereço';
    }, [userAddress]);

    return (
        <UserLocationContext.Provider value={{ userAddress, setUserAddress, formattedAddress }}>
            {children}
        </UserLocationContext.Provider>
    );
};

export const useUserLocation = () => useContext(UserLocationContext);
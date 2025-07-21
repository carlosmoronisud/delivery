// src/contexts/AuthContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";
import type UsuarioLogin from "../models/UsuarioLogin";
import { login } from "../services/Service";
import { ToastAlerta } from "../utils/ToastAlerta";


interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuarioLoginData: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    setUsuario(usuario: UsuarioLogin): void;
    isGoogleUser: boolean; 
    isBackendUser: boolean; 
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
    const [usuario, setUsuarioState] = useState<UsuarioLogin>(() => {
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            try {
                const parsedUser: UsuarioLogin = JSON.parse(storedUser);
                if (parsedUser.token) {
                    return parsedUser;
                }
            } catch (error) {
                console.error("Erro ao fazer parse do usuário do localStorage:", error);
            }
        }
        return { id: 0, nome: '', usuario: '', senha: '', foto: '', token: '' };
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Lógica ROBUSTA para determinar o tipo de usuário
    // isGoogleUser: verifica se a URL da foto vem de 'googleusercontent.com'
    const isGoogleUser = !!usuario.foto && usuario.foto.includes('googleusercontent.com');
    
    // isBackendUser: usuário tem token E NÃO é um usuário Google
    const isBackendUser = !!usuario.token && !isGoogleUser;


    async function handleLogin(usuarioLoginData: UsuarioLogin) {
        setIsLoading(true);
        try {
            await login("/usuarios/logar", usuarioLoginData, (responseUser: UsuarioLogin) => {
                setUsuarioState(responseUser);
                localStorage.setItem('usuario', JSON.stringify(responseUser));
            });
            ToastAlerta("O Usuário foi autenticado com sucesso!", 'sucesso');
        } catch (error) {
            ToastAlerta("Os dados do Usuário estão incorretos!", 'erro');
            console.error("Erro no login:", error);
        } finally {
            setIsLoading(false);
        }
    }

    function handleLogout() {
        setUsuarioState({ id: 0, nome: '', usuario: '', senha: '', foto: '', token: '' });
        localStorage.removeItem('usuario');
        ToastAlerta("Logout realizado com sucesso!", 'info');
    }

    function setUsuario(user: UsuarioLogin) {
        setUsuarioState(user);
        localStorage.setItem('usuario', JSON.stringify(user));
    }

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading, setUsuario, isGoogleUser, isBackendUser }}>
            {children}
        </AuthContext.Provider>
    );
}
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from "react";

import { ToastAlerta } from "../utils/ToastAlerta";
import type UsuarioLogin from "../models/UsuarioLogin"; 
import { login } from "../services/UsuarioService";

// Interface para as propriedades do contexto de autenticação
interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuarioLoginData: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    setUsuario(usuario: UsuarioLogin): void;
    isGoogleUser: boolean; 
    isBackendUser: boolean;
}

// Interface para as props do provedor de autenticação
interface AuthProviderProps {
    children: ReactNode;
}

// Criação do contexto de autenticação
export const AuthContext = createContext({} as AuthContextProps);

// Provedor do contexto de autenticação
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

    // Função para fazer login
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

    // Função para fazer logout
    function handleLogout() {
        setUsuarioState({ id: 0, nome: '', usuario: '', senha: '', foto: '', token: '' });
        localStorage.removeItem('usuario');
        ToastAlerta("Logout realizado com sucesso!", 'info');
    }

    // Função para atualizar o usuário diretamente 
    function setUsuario(user: UsuarioLogin) {
        setUsuarioState(user);
        localStorage.setItem('usuario', JSON.stringify(user));
    }
    
    const isGoogleUser = !!usuario.foto && usuario.foto.includes('googleusercontent.com');
    const isBackendUser = !!usuario.token && !isGoogleUser;

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading, setUsuario, isGoogleUser, isBackendUser }}>
            {children}
        </AuthContext.Provider>
    );
}
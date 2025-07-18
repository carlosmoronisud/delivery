/* eslint-disable react-refresh/only-export-components */
// src/contexts/AuthContext.tsx
import { createContext, useState, type ReactNode } from "react";

import { ToastAlerta } from "../utils/ToastAlerta";
import type UsuarioLogin from "../models/UsuarioLogin"; // Assumindo que este modelo existe
import { login } from "../services/Service";

// Interface para as propriedades do contexto de autenticação
interface AuthContextProps {
    usuario: UsuarioLogin; // O usuário logado ou um objeto vazio se não logado
    handleLogout(): void;
    handleLogin(usuarioLoginData: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    setUsuario(usuario: UsuarioLogin): void; // Adicionado para permitir atualização direta do usuário se necessário
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
        // Tenta carregar o usuário do localStorage ao iniciar
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            try {
                const parsedUser: UsuarioLogin = JSON.parse(storedUser);
                // Verifica se o token não está vazio para considerar logado
                if (parsedUser.token) {
                    return parsedUser;
                }
            } catch (error) {
                console.error("Erro ao fazer parse do usuário do localStorage:", error);
            }
        }
        // Retorna um objeto UsuarioLogin vazio se não houver usuário no localStorage ou se for inválido
        return { id: 0, nome: '', usuario: '', senha: '', foto: '', token: '' };
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Função para fazer login
    async function handleLogin(usuarioLoginData: UsuarioLogin) {
        setIsLoading(true);
        try {
            // Supondo que 'login' atualiza o estado do usuário e armazena no localStorage internamente
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

    // Função para atualizar o usuário diretamente (ex: edição de perfil)
    function setUsuario(user: UsuarioLogin) {
        setUsuarioState(user);
        localStorage.setItem('usuario', JSON.stringify(user));
    }

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading, setUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}
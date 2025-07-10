import { createContext, useState, type ReactNode } from "react";
import { login } from "../services/Service";
import { ToastAlerta } from "../utils/ToastAlerta";
import type UsuarioLogin from "../models/UsuarioLogin";

interface AuthContextProps {
    usuario: UsuarioLogin;
    handleLogout(): void;
    handleLogin(usuario: UsuarioLogin): Promise<void>;
    isLoading: boolean;
    setUsuario(usuario: UsuarioLogin): void;
}

interface AuthProviderProps {
    children: ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextProps)

export function AuthProvider({ children }: AuthProviderProps){

    const [usuario, setUsuario] = useState<UsuarioLogin>({
        id: 0,
        nome: '',
        usuario: '',
        senha: '',
        foto: '',
        token: '',
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)

    async function handleLogin(UsuarioLogin: UsuarioLogin){
        setIsLoading(true)

        try {
            await login("/usuarios/logar", UsuarioLogin, setUsuario)
            ToastAlerta("O Usuário foi autenticado com sucesso!", 'sucesso')
        } catch (error) {
            ToastAlerta("Os dados do Usuário estão incorretos!", 'erro')
            console.error(error)
        }

        setIsLoading(false)
    }

    function handleLogout(){
        setUsuario({
            id: 0,
            nome: '',
            usuario: '',
            senha: '',
            foto: '',
            token: '',
        })
    }

    return(
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout, isLoading, setUsuario }}>
            {children}
        </AuthContext.Provider>
    )

}
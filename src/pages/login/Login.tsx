/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import type UsuarioLogin from '../../models/UsuarioLogin'
import { AuthContext } from '../../contexts/AuthContext'
import { GoogleLogin } from '@react-oauth/google'
import { RotatingLines } from 'react-loader-spinner'

function Login() {
  const navigate = useNavigate()

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
    {} as UsuarioLogin
  )

  const { usuario, handleLogin, isLoading, handleLogout, setUsuario } =
    useContext(AuthContext)

  useEffect(() => {
    if (usuario.token !== '') {
      navigate('/home')
    }
  }, [usuario.token, navigate])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value,
    })
  }

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    handleLogin(usuarioLogin)
  }

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded = JSON.parse(
      atob(credentialResponse.credential.split('.')[1])
    )
    const usuarioGoogle = {
      id: decoded.sub,
      nome: decoded.name,
      usuario: decoded.email,
      senha: decoded.sub,
      foto: decoded.picture,
      token: credentialResponse.credential,
    }

    setUsuario(usuarioGoogle)
    navigate('/home')
  }

  return (
    <div className="grid grid-cols-1 bg-[#FEF8EA] lg:grid-cols-2 h-screen place-items-center font-bold">
      <form
        className="flex justify-center items-center flex-col w-4/5 lg:w-1/2 gap-4"
        onSubmit={login}
      >
        <h2 className="text-slate-900 text-5xl">Entrar</h2>

        <div className="flex flex-col w-full">
          <label htmlFor="usuario" className="text-left mb-1">
            Usuário
          </label>
          <input
            type="text"
            id="usuario"
            name="usuario"
            placeholder="Digite seu usuário"
            className="border-2 border-slate-700 rounded p-2 bg-white"
            value={usuarioLogin.usuario}
            onChange={atualizarEstado}
          />
        </div>

        <div className="flex flex-col w-full">
          <label htmlFor="senha" className="text-left mb-1">
            Senha
          </label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            className="border-2 border-slate-700 rounded p-2 bg-white"
            value={usuarioLogin.senha}
            onChange={atualizarEstado}
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#453E00] flex justify-center items-center hover:bg-[#262401] text-white w-1/2 py-3 text-lg transition-all duration-300"
        >
          {isLoading ? (
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            />
          ) : (
            <span>Entrar</span>
          )}
        </button>

        <hr className="border-slate-800 w-full" />

        <p className="text-center text-sm">
          Ainda não tem uma conta?{' '}
          <Link
            to="/usuarios/cadastrar"
            className="text-[#453E00] hover:underline"
          >
            Cadastre-se
          </Link>
        </p>

        <div className="w-full flex justify-center items-center pt-2">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Login Failed')}
            theme="outline"
            size="large"
            shape="pill"
            width="280"
          />
        </div>
      </form>

      <div className="fundoLogin hidden lg:flex w-4/5 h-[80%] items-center justify-center" />

    </div>
  )
}

export default Login

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router-dom';
// import './Login.css'; // Não precisamos mais deste CSS puro, exceto pela animação customizada se for em outro componente
import {
  useContext,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import type UsuarioLogin from '../../models/UsuarioLogin';
import { AuthContext } from '../../contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { RotatingLines } from 'react-loader-spinner';

function Login() {
  const navigate = useNavigate();

  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin>(
    {} as UsuarioLogin
    
  );
 

  const { usuario, handleLogin, isLoading, setUsuario } =
    useContext(AuthContext); 

  useEffect(() => {
    if (usuario.token !== '') {
      navigate('/home');
    }
  }, [usuario.token, navigate]);

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuarioLogin({
      ...usuarioLogin,
      [e.target.name]: e.target.value,
    });
  }

  function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleLogin(usuarioLogin);
  }

  const handleGoogleSuccess = (credentialResponse: any) => {
    const decoded = JSON.parse(
      atob(credentialResponse.credential.split('.')[1])
    );
    const usuarioGoogle = {
      id: decoded.sub,
      nome: decoded.name,
      usuario: decoded.email,
      senha: decoded.sub, // A senha é o 'sub' do Google, como no seu original
      foto: decoded.picture,
      token: credentialResponse.credential,
    };

    setUsuario(usuarioGoogle);
    navigate('/home');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-100 font-sans">
      {/* Container Principal do Login - Card grande e responsivo */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        {/* Seção da Imagem de Fundo (mantendo a URL e adicionando o overlay e texto que tínhamos) */}
        <div 
          className="w-full lg:w-1/2 flex items-center justify-center p-8 text-white relative 
                     bg-[url('https://ik.imagekit.io/8h7kfljfc/imgs/2150857908.jpg?updatedAt=1752066425064')] 
                     bg-cover bg-center bg-no-repeat rounded-3xl lg:rounded-l-3xl lg:rounded-r-none"
        >
          {/* Overlay para melhorar contraste do texto */}
          {/* <div className="absolute inset-0 bg-black bg-opacity-40 rounded-3xl lg:rounded-l-3xl lg:rounded-r-none"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Bem-Vindo de Volta!
            </h2>
            <p className="text-xl md:text-2xl font-light leading-relaxed">
              Descubra seus pratos favoritos e tenha a entrega mais rápida.
            </p>
          </div> */}
        </div>

        {/* Seção do Formulário de Login */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
            Entrar
          </h2>
          
          <form className="w-full max-w-sm space-y-6" onSubmit={login}>
            <div>
              <label htmlFor="usuario" className="block text-lg font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="Digite seu usuário"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuarioLogin.usuario}
                onChange={atualizarEstado}
              />
            </div>

            <div>
              <label htmlFor="senha" className="block text-lg font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                placeholder="********"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuarioLogin.senha}
                onChange={atualizarEstado}                
              />
            </div>

            <div className="flex items-center justify-between text-md">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded text-orange-500 focus:ring-orange-500 cursor-pointer" />
                Lembrar-me
              </label>
              <Link
                to="/usuarios/cadastrar"
                className="text-orange-600 hover:text-orange-700 font-medium transition duration-200 cursor-pointer"
              >
                Esqueceu a senha?
              </Link>
            </div> 

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-4 rounded-lg text-xl shadow-lg hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
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
                <span>Entrar</span>
              )}
            </button>
          </form>

          {/* Separador "Ou" para Social Login */}
          <div className="relative my-6 w-full max-w-sm">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500 font-medium">Ou continue com</span>
            </div>
          </div>

          {/* Botão de Login com Google - Integrado com GoogleLogin do @react-oauth/google */}    
          <div className="w-full flex flex-col justify-center items-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="filled_blue" 
              size="large" 
              shape="pill" 
              width="280" 
            />
            <p className='p-4 text-center text-orange-600  font-' >Respeitando a LGPD, não iremos coletar seus dados pessoais, nem guardar seus dados de login, eles permanecem no seu navegador e são apagados assim que fechar o navegador ou sair da aplicação</p>
          </div>

          <p className="mt-8 text-gray-700 text-center text-lg">
            Ainda não tem uma conta?{' '}
            <Link
              to="/usuarios/cadastrar"
              className="text-orange-600 hover:text-orange-700 font-bold transition duration-200 cursor-pointer"
            >
              Cadastre-se aqui!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
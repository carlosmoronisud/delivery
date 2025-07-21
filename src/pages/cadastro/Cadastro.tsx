import { useState, type ChangeEvent, type FormEvent } from 'react';
import type Usuario from '../../models/Usuario';
import { Link, useNavigate } from 'react-router-dom';
import { cadastrarUsuario } from '../../services/Service';
import { RotatingLines } from 'react-loader-spinner';
import { ToastAlerta } from '../../utils/ToastAlerta';

function Cadastro() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmaSenha, setConfirmaSenha] = useState<string>('');

  const [usuario, setUsuario] = useState<Usuario>({
    id: null,
    nome: '',
    usuario: '',
    senha: '',
    foto: '',
  });

  function retornar() {
    navigate('/login');
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  }

  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value);
  }

  async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      confirmaSenha === usuario.senha &&
      usuario.senha.length >= 8
    ) {
      setIsLoading(true);

      try {
        await cadastrarUsuario(
          '/usuarios/cadastrar',
          usuario,
          setUsuario
        );
        ToastAlerta('Usuário cadastrado com sucesso!', "sucesso");
        retornar();
      } catch (error) {
        ToastAlerta('Erro ao cadastrar o usuário', "erro");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      ToastAlerta('Dados do usuário inconsistentes! Verifique as informações do cadastro', "erro");
      setUsuario({
        ...usuario,
        senha: '',
      });
      setConfirmaSenha("");
      setIsLoading(false); 
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-100 font-sans">
      {/* Container Principal do Cadastro - Card grande e responsivo */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        {/* Seção do Formulário de Cadastro */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center">
            Cadastre-se
          </h2>

          <form className="w-full max-w-sm space-y-5" onSubmit={cadastrarNovoUsuario}>
            <div>
              <label htmlFor="nome" className="block text-lg font-medium text-gray-700 mb-2">
                Nome
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome completo"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuario.nome}
                onChange={atualizarEstado}
              />
            </div>

            <div>
              <label htmlFor="usuario" className="block text-lg font-medium text-gray-700 mb-2">
                Usuário (E-mail)
              </label>
              <input
                type="text"
                id="usuario"
                name="usuario"
                placeholder="seuemail@exemplo.com"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuario.usuario}
                onChange={atualizarEstado}
              />
            </div>

            <div>
              <label htmlFor="foto" className="block text-lg font-medium text-gray-700 mb-2">
                Link da Foto de Perfil (URL)
              </label>
              <input
                type="text"
                id="foto"
                name="foto"
                placeholder="https://suafoto.com/perfil.jpg"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuario.foto}
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
                placeholder="Mínimo 8 caracteres"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={usuario.senha}
                onChange={atualizarEstado}
              />
            </div>

            <div>
              <label htmlFor="confirmarSenha" className="block text-lg font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                placeholder="Confirme sua senha"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={confirmaSenha}
                onChange={handleConfirmarSenha}
              />
            </div>

            <div className="flex justify-between w-full gap-4 pt-4"> 
              <button
                type="button" 
                onClick={retornar}
                className="w-1/2 bg-red-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-red-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="w-1/2 bg-orange-600 text-white font-bold py-3 rounded-lg text-xl shadow-lg hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer flex justify-center items-center"
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
                  <span>Cadastrar</span>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-gray-700 text-center text-lg">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="text-orange-600 hover:text-orange-700 font-bold transition duration-200 cursor-pointer"
            >
              Faça login aqui!
            </Link>
          </p>
        </div>

        {/* Seção da Imagem de Fundo */}
        <div
          className="w-full lg:w-1/2 hidden lg:flex items-center justify-center p-8 text-white relative 
                     bg-[url('https://ik.imagekit.io/8h7kfljfc/imgs/2151989794.jpg?updatedAt=1752706340278')] 
                     bg-cover bg-center bg-no-repeat rounded-3xl lg:rounded-r-3xl lg:rounded-l-none"
        >
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
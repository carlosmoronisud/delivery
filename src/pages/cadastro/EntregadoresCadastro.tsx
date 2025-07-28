import { useState, type ChangeEvent, type FormEvent } from 'react';
import { RotatingLines } from 'react-loader-spinner';
import { FaMotorcycle } from 'react-icons/fa'; // Ícone para entregador
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import BotaoVoltar from '../../components/botaovoltar/BotaoVoltar';

// Componente MessageBox para exibir mensagens ao usuário
const MessageBox = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center relative">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Atenção!</h3>
        <p className="text-gray-700 mb-6">{message}</p>
        <button
          onClick={onClose}
          className="bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-orange-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1"
        >
          Entendi
        </button>
      </div>
    </div>
  );
};

function CadastroEntregador() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmaSenha, setConfirmaSenha] = useState<string>('');
  const [showMessageBox, setShowMessageBox] = useState<boolean>(false);
  const [messageBoxContent, setMessageBoxContent] = useState<string>(''); 

  const navigate = useNavigate(); 

  // Estado para os dados do entregador (apenas para simulação)
  const [entregador, setEntregador] = useState({
    nome: '',
    email: '',
    senha: '',
    foto: '',
    cpf: '',
    cnh: '',
    modeloMoto: '',
  });

  // Função para simular o retorno 
  function retornar() {
    setShowMessageBox(false);
    setMessageBoxContent(''); 
    setEntregador({
      nome: '',
      email: '',
      senha: '',
      foto: '',
      cpf: '',
      cnh: '',
      modeloMoto: '',
    });
    setConfirmaSenha('');
    navigate('/login'); 
  }

  // Atualiza o estado dos campos do formulário
  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setEntregador({
      ...entregador,
      [e.target.name]: e.target.value,
    });
  }

  // Lida com a confirmação de senha
  function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value);
  }

  // Simula o processo de cadastro
  async function simularCadastro(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      confirmaSenha === entregador.senha &&
      entregador.senha.length >= 8 &&
      entregador.nome.length > 0 &&
      entregador.email.length > 0 &&
      entregador.cpf.length > 0 &&
      entregador.cnh.length > 0 &&
      entregador.modeloMoto.length > 0
    ) {
      setIsLoading(true);

      // Simula um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      setIsLoading(false);
      setMessageBoxContent("Este é um formulário de cadastro de entregadores para fins de simulação. Seus dados NÃO serão armazenados em conformidade com a Lei Geral de Proteção de Dados (LGPD). Esta página serve apenas como uma demonstração.");
      setShowMessageBox(true); // Exibe a mensagem de simulação
    } else {
      // Mensagem de erro para dados inconsistentes
      setMessageBoxContent('Dados do entregador inconsistentes! Verifique as informações do cadastro e se todos os campos estão preenchidos.');
      setShowMessageBox(true);
      setEntregador({
        ...entregador,
        senha: '',
      });
      setConfirmaSenha("");
    }
  }

  // Função para exibir a mensagem de login simulado
  const handleLoginSimulado = () => {
    setMessageBoxContent('Esta é uma página de simulação. Não há login real, nem armazenamento de dados, devido a LGPD.');
    setShowMessageBox(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-8 bg-gray-100 font-sans">
      {/* Container Principal do Cadastro - Card grande e responsivo */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">

        {/* Seção do Formulário de Cadastro */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center flex items-center gap-3">
            <FaMotorcycle className="text-orange-600" /> Cadastre-se como Entregador
          </h2>

          <form className="w-full max-w-sm space-y-5" onSubmit={simularCadastro}>
            <div>
              <label htmlFor="nome" className="block text-lg font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Seu nome completo"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.nome}
                onChange={atualizarEstado}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.email}
                onChange={atualizarEstado}
                required
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-lg font-medium text-gray-700 mb-2">
                CPF
              </label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                placeholder="000.000.000-00"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.cpf}
                onChange={atualizarEstado}
                required
              />
            </div>

            <div>
              <label htmlFor="cnh" className="block text-lg font-medium text-gray-700 mb-2">
                CNH
              </label>
              <input
                type="text"
                id="cnh"
                name="cnh"
                placeholder="00000000000"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.cnh}
                onChange={atualizarEstado}
                required
              />
            </div>

            <div>
              <label htmlFor="modeloMoto" className="block text-lg font-medium text-gray-700 mb-2">
                Modelo da Moto
              </label>
              <input
                type="text"
                id="modeloMoto"
                name="modeloMoto"
                placeholder="Ex: Honda CG 160"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.modeloMoto}
                onChange={atualizarEstado}
                required
              />
            </div>

            <div>
              <label htmlFor="foto" className="block text-lg font-medium text-gray-700 mb-2">
                Link da Foto de Perfil (URL)
              </label>
              <input
                type="url" 
                id="foto"
                name="foto"
                placeholder="https://suafoto.com/perfil.jpg"
                className="w-full px-5 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg cursor-text"
                value={entregador.foto}
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
                value={entregador.senha}
                onChange={atualizarEstado}
                required
                minLength={8}
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
                required
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
                disabled={isLoading} 
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
            <a
              href="#" // Alterado para '#' pois não há navegação real
              className="text-orange-600 hover:text-orange-700 font-bold transition duration-200 cursor-pointer"
              onClick={handleLoginSimulado} // Usa a nova função para exibir o modal
            >
              Faça login aqui!
            </a>
          </p>
          <BotaoVoltar/>
        </div>

        {/* Seção da Imagem de Fundo */}
        <div
          className="w-full lg:w-1/2 hidden lg:flex items-center justify-center p-8 text-white relative 
                     bg-[url('https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2023,%202025,%2002_26_34%20PM.png?updatedAt=1753291666462')] 
                     bg-cover bg-center bg-no-repeat rounded-3xl lg:rounded-r-3xl lg:rounded-l-none"
        >
          {/* Você pode adicionar um overlay ou texto aqui se desejar */}
          <div className="absolute inset-0 bg-black opacity-40 rounded-3xl lg:rounded-r-3xl lg:rounded-l-none"></div>
          <div className="relative z-10 text-center p-4">
            <h3 className="text-3xl font-bold mb-4">Seja um Entregador Parceiro!</h3>
            <p className="text-lg">
              Faça parte da nossa equipe e leve sabor e alegria para milhares de pessoas.
              Flexibilidade, autonomia e ótimos ganhos esperam por você.
            </p>
          </div>
        </div>
      </div>
      
      {/* MessageBox condicional */}
      {showMessageBox && (
        <MessageBox
          message={messageBoxContent} 
          onClose={retornar}
        />
      )}
    </div>
  );
}

export default CadastroEntregador;

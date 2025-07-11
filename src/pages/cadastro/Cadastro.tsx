import {   useState, type ChangeEvent, type FormEvent } from 'react'
import './Cadastro.css'
import type Usuario from '../../models/Usuario'
import { useNavigate } from 'react-router-dom'
import { cadastrarUsuario } from '../../services/Service'
import { RotatingLines } from 'react-loader-spinner'
import { ToastAlerta } from '../../utils/ToastAlerta'

function Cadastro() {
	const navigate = useNavigate()

	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [confirmaSenha, setConfirmaSenha] = useState<string>('')

	const [usuario, setUsuario] = useState<Usuario>({
		id: null,
		nome: '',
		usuario: '',
		senha: '',
		foto: '',
	})		

	function retornar() {
		navigate('/login')
	}

	function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
		setUsuario({
			...usuario,
			[e.target.name]: e.target.value,
		})
	}

	function handleConfirmarSenha(e: ChangeEvent<HTMLInputElement>) {
		setConfirmaSenha(e.target.value)
	}

	async function cadastrarNovoUsuario(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		if (
			confirmaSenha === usuario.senha &&
			usuario.senha.length >= 8
		) {
			setIsLoading(true)

			try {
				await cadastrarUsuario(
					'/usuarios/cadastrar',
					usuario,
					setUsuario
				)
				ToastAlerta('Usuário cadastrado com sucesso!', "sucesso")
				retornar()
			} catch (error) {
				ToastAlerta('Erro ao cadastrar o usuário', "erro")
				console.error(error)
			}
		} else {
			ToastAlerta('Dados do usuário inconsistentes! Verifique as informações do cadastro', "erro")
			setUsuario({
				...usuario,
				senha: '',
			})
			setConfirmaSenha("")
		}

		setIsLoading(false)
	}

	return (
		<>
			<div className="grid grid-cols-1 bg-[#FEF8EA] lg:grid-cols-2 h-screen place-items-center font-bold">
  <div className="fundoCadastro hidden lg:flex w-4/5 h-[80%] items-center justify-center rounded-3xl shadow-lg" />

  <form
    className="flex justify-center items-center flex-col w-2/3 gap-3"
    onSubmit={cadastrarNovoUsuario}
  >
    <h2 className="text-slate-900 text-5xl">Cadastrar</h2>

    <div className="flex flex-col w-full">
      <label htmlFor="nome">Nome</label>
      <input
        type="text"
        id="nome"
        name="nome"
        placeholder="Nome"
        className="border-2 border-slate-700 rounded p-2 bg-white"
        value={usuario.nome}
        onChange={atualizarEstado}
      />
    </div>

    <div className="flex flex-col w-full">
      <label htmlFor="usuario">Usuário</label>
      <input
        type="text"
        id="usuario"
        name="usuario"
        placeholder="Usuário"
        className="border-2 border-slate-700 rounded p-2 bg-white"
        value={usuario.usuario}
        onChange={atualizarEstado}
      />
    </div>

    <div className="flex flex-col w-full">
      <label htmlFor="foto">Foto</label>
      <input
        type="text"
        id="foto"
        name="foto"
        placeholder="Foto (URL)"
        className="border-2 border-slate-700 rounded p-2 bg-white"
        value={usuario.foto}
        onChange={atualizarEstado}
      />
    </div>

    <div className="flex flex-col w-full">
      <label htmlFor="senha">Senha</label>
      <input
        type="password"
        id="senha"
        name="senha"
        placeholder="Senha"
        className="border-2 border-slate-700 rounded p-2 bg-white"
        value={usuario.senha}
        onChange={atualizarEstado}
      />
    </div>

    <div className="flex flex-col w-full">
      <label htmlFor="confirmarSenha">Confirmar Senha</label>
      <input
        type="password"
        id="confirmarSenha"
        name="confirmarSenha"
        placeholder="Confirmar Senha"
        className="border-2 border-slate-700 rounded p-2 bg-white"
        value={confirmaSenha}
        onChange={handleConfirmarSenha}
      />
    </div>

    <div className="flex justify-around w-full gap-8">
      <button
        type="reset"
        className="rounded text-white bg-red-700 hover:bg-red-900 w-1/2 py-2"
        onClick={retornar}
      >
        Cancelar
      </button>

      <button
        type="submit"
        className="rounded text-white bg-[#453E00] hover:bg-[#262401] w-1/2 py-2 flex justify-center"
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
          <span>Cadastrar</span>
        )}
      </button>
    </div>
  </form>
</div>

		</>
	)
}

export default Cadastro
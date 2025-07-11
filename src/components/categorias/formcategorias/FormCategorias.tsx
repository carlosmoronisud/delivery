/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, type ChangeEvent, type FormEvent, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import type Categoria from "../../../models/Categoria"
import { atualizar, buscar, cadastrar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"
import { ToastAlerta } from "../../../utils/ToastAlerta"
import BotaoVoltar from "../../botaovoltar/BotaoVoltar"

function FormCategoria() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [categoria, setCategoria] = useState<Categoria>({} as Categoria)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token
  const { id } = useParams<{ id: string }>()

  async function buscarCategoriaPorId(id: string) {
    
      await buscar(`/categorias/${id}`, setCategoria)   
  }
  useEffect(() => {
    if (id !== undefined) {
      buscarCategoriaPorId(id)
    } else {
      setCategoria({
        id: undefined,
        descricao: "",
        palavraChave: "",
        imagem: "",
      })
    }
  }, [id])

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    })
  }

  async function gerarNovaCategoria(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (id !== undefined) {
        await atualizar("/categorias", categoria, setCategoria, {
          headers: { Authorization: token },
        })
        ToastAlerta("A categoria foi atualizada com sucesso!", "sucesso")
      } else {
        await cadastrar("/categorias", categoria, setCategoria, {
          headers: { Authorization: token },
        })
        ToastAlerta("A categoria foi cadastrada com sucesso!", "sucesso")
      }
    } catch (error: any) {
      if (error.toString().includes("401")) handleLogout()
      else ToastAlerta("Erro ao salvar a categoria!", "erro")
    }

    setIsLoading(false)
    retornar()
  }

  function retornar() {
    navigate("/categorias")
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#F4BF4F] from-4% to-[#F1EDD2] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-screen-sm p-6 sm:p-10">
        <div className="w-full max-w-2xl flex justify-start mb-4">
        <BotaoVoltar />
      </div>
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-8">
          {id === undefined ? "Cadastrar Categoria" : "Editar Categoria"}
        </h1>

        <form onSubmit={gerarNovaCategoria} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="descricao" className="text-lg font-medium text-gray-700 text-center">
              Descrição da Categoria
            </label>
            <input
              type="text"
              name="descricao"
              placeholder="Descreva aqui sua categoria"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300"
              value={categoria.descricao}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="palavraChave" className="text-lg font-medium text-gray-700 text-center">
              Palavras-chave da Categoria
            </label>
            <input
              type="text"
              name="palavraChave"
              placeholder="Palavras-chave separadas por vírgula"
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300"
              value={categoria.palavraChave}
              onChange={atualizarEstado}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="imagem" className="text-lg font-medium text-gray-700 text-center">
              Link da Imagem
            </label>
            <input
              type="text"
              name="imagem"
              placeholder="https://..."
              className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300"
              value={categoria.imagem}
              onChange={atualizarEstado}
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl text-white bg-orange-900 hover:scale-105 hover:shadow-2xl transition duration-300 px-6 py-3 mx-auto w-2/3 sm:w-1/2 flex justify-center items-center"
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
              <span>{id === undefined ? "Cadastrar" : "Atualizar"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default FormCategoria

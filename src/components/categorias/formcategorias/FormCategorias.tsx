/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useContext, type ChangeEvent, type FormEvent, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { AuthContext } from "../../../contexts/AuthContext"
import type Categoria from "../../../models/Categoria"
import { atualizar, buscar, cadastrar } from "../../../services/Service"
import { RotatingLines } from "react-loader-spinner"
import { ToastAlerta } from "../../../utils/ToastAlerta"

function FormCategoria() {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const [categoria, setCategoria] = useState<Categoria>({} as Categoria)

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    const { id } = useParams<{ id: string }>()

    async function buscarCategoriaPorId(id: string){
        try{   
            await buscar(`/categorias/${id}`, setCategoria, {
                headers: { Authorization: token}
            })
    
        } catch (error: any){
            if(error.toString().includes("401")){
                handleLogout()
            }
        }
    }

    useEffect(()=>{
        if (token === ""){
            ToastAlerta("Você precisa estar logado!", 'info')
            navigate("/")
        }
    }, [token])

    useEffect(()=>{
        if(id !== undefined){
            buscarCategoriaPorId(id)
        }else{
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

    async function gerarNovaCategoria(e: FormEvent<HTMLFormElement>){
        
        e.preventDefault()
        setIsLoading(true)

        if (id !== undefined){
            try{
                await atualizar("/categorias", categoria, setCategoria, {
                    headers: { Authorization: token }
                })

                ToastAlerta("A categoria foi atualizado com sucesso!", 'sucesso')
            }catch(error: any){
                if(error.toString().includes("401")){
                    handleLogout()
                } else {
                    ToastAlerta("Erro ao atualizar a categoria!", 'erro')
                    console.error(error)
                }
            }
        }else{
            try{
                await cadastrar("/categorias", categoria, setCategoria, {
                    headers: { Authorization: token }
                })

                ToastAlerta("A categoria foi cadastrado com sucesso!", '')
            }catch(error: any){
                if(error.toString().includes("401")){
                    handleLogout()
                } else {
                    ToastAlerta("Erro ao cadastrar a categoria!", 'erro')
                    console.error(error)
                }
            }
        }

        setIsLoading(false)
        retornar()
    }

    function retornar(){
        navigate("/categorias")
    }

    return (
        <div className="container flex flex-col items-center justify-center mx-auto">
            <h1 className="text-4xl text-center my-8">
                {id === undefined ? "Cadastrar Categoria" : "Editar Categoria"}
            </h1>

            <form 
                className="w-1/2 flex flex-col gap-4" 
                onSubmit={gerarNovaCategoria}
            >
                <div className="flex flex-col gap-2">
                    <label htmlFor="descricao">Descrição da Categoria</label>
                    <input
                        type="text"
                        placeholder="Descreva aqui sua categoria"
                        name='descricao'
                        className="border-2 border-slate-700 rounded p-2"
                        value={categoria.descricao}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="palavraChave">Defina palavras chaves para essa Categoria</label>
                    <input
                        type="text"
                        placeholder="Palavras Chave"
                        name='palavraChave'
                        className="border-2 border-slate-700 rounded p-2"
                        value={categoria.palavraChave}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="imagem">Defina imagem para essa Categoria</label>
                    <input
                        type="text"
                        placeholder="Link da imagem"
                        name="imagem"
                        className="border-2 border-slate-700 rounded p-2"
                        value={categoria.imagem}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
                    />
                </div>
                <button
                    className="rounded text-slate-100 bg-indigo-400 
                               hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
                    type="submit">
                    
                     {
                        isLoading ? 

                        <RotatingLines
                            strokeColor="white"
                            strokeWidth="5"
                            animationDuration="0.75"
                            width="24"
                            visible={true}
                        />
                        :
                        <span>{id === undefined ? "Cadastrar" : "Atualizar"}</span>
                        
                    } 
                    <span>{id === undefined ? "Cadastrar" : "Atualizar"}</span>
                </button>
            </form>
        </div>
    );
}

export default FormCategoria;
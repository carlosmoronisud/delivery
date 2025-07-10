/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import CardCategorias from "../cardcategorias/CardCategorias"
import { useContext, useEffect, useState } from "react";
import type Categoria from "../../../models/Categoria";
import { AuthContext } from "../../../contexts/AuthContext";
import { buscar } from "../../../services/Service";
import { ToastAlerta } from "../../../utils/ToastAlerta";
import { DNA } from "react-loader-spinner";

function ListarCategorias() {

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const { usuario, handleLogout } = useContext(AuthContext)
    const token = usuario.token

    async function buscarCategorias(){
        try{
            setIsLoading(true)
            await buscar("/categorias", setCategorias, {
                headers: { Authorization: token}
            })

        } catch (error: any){
            if(error.toString().includes("401")){
                handleLogout()
            }
        } finally{
            setIsLoading(false)
        }
    }

    useEffect(()=>{
        if (token === ""){
            ToastAlerta("Você precisa estar logado!", 'info')
            navigate("/")
        }
    },[token])

    useEffect(() => {
        buscarCategorias()
    }, [categorias.length])

    return (
        <>
            {isLoading && (
                <DNA
					visible={true}
					height="200"
					width="200"
					ariaLabel="dna-loading"
					wrapperStyle={{}}
					wrapperClass="dna-wrapper mx-auto"
				/>
            )

            }
            <div className="flex justify-center w-full my-4">
                <div className="container flex flex-col mx-2">

                    {
                        (!isLoading && categorias.length === 0) && (
                            <span className="text-3xl text-center my-8">
                                Nenhuma Caetgoria foi encontrada!
                            </span>
                        )
                    }

                    <div className="grid grid-cols-1 md:grid-cols-2 
                                    lg:grid-cols-3 gap-8">
                        {
                            categorias.map((categoria) => (
                                <CardCategorias key={categoria.id} categoria={categoria}/>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListarCategorias;
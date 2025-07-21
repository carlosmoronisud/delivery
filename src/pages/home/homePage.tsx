import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, type ChangeEvent } from 'react';

import CarrosselProdutos from '../../components/carroceishome/carrosselprodutos/CarrosselProdutos';
import { MapPinLine, Storefront, ShoppingBag, BeerBottle, Package, ShoppingCartSimple } from '@phosphor-icons/react'; // Removido 'UserCircle' e 'Bike'
import { ToastAlerta } from '../../utils/ToastAlerta';
import type { EnderecoData } from '../../models/EnderecoData';

import { useUserLocation } from '../../contexts/UserLocationContext'; // Importe o hook de contexto
import { buscarEnderecoPorCep } from '../../services/CepService';
import CarrosselMedio from '../../components/carroceishome/carrocelmedio/CarrocelMedio';


export default function Home() {
    const { userAddress, setUserAddress } = useUserLocation(); 
    
    // Inicializa cepInput com o CEP do contexto, se existir
    const [cepInput, setCepInput] = useState<string>(userAddress?.cep || ''); 
    // Inicializa addressFound com o endereço do contexto, se existir
    const [addressFound, setAddressFound] = useState<EnderecoData | null>(userAddress || null); 
    const [isSearchingCep, setIsSearchingCep] = useState(false);
    // REMOVER: isGettingLocation e qualquer lógica associada a ele.

    const cepInputRef = useRef<HTMLInputElement>(null);

    const handleCepChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
        const cep = e.target.value;
        setCepInput(cep);
        // Reseta o endereço encontrado ao digitar, mas mantém o CEP digitado no objeto temporário
        setAddressFound(null); // Limpa o endereço visualmente enquanto busca

        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            setIsSearchingCep(true);
            const endereco = await buscarEnderecoPorCep(cepLimpo);
            setIsSearchingCep(false);

            if (endereco && endereco.rua && endereco.cidade) {
                // Ao encontrar, define o endereço completo e o CEP no estado
                const fullAddress: EnderecoData = {
                  ...endereco,
                  rua: endereco.rua ?? '',
                  bairro: endereco.bairro ?? '',
                  cidade: endereco.cidade ?? '',
                  numero: '', // ViaCEP não retorna número
                  complemento: '', // ViaCEP não retorna complemento
                  cep: cepLimpo // Garante que o CEP no estado é o limpo
                };
                setAddressFound(fullAddress);
                setUserAddress(fullAddress); // Atualiza o contexto com o endereço real
                ToastAlerta(`Endereço encontrado: ${fullAddress.rua}, ${fullAddress.bairro} - ${fullAddress.cidade}`, 'sucesso');
            } else {
                ToastAlerta('CEP não encontrado ou inválido. Por favor, verifique o CEP.', 'erro');
                // Limpa o endereço encontrado, mas mantém o CEP digitado no input
                setAddressFound(null); 
                setUserAddress(null); // Limpa o contexto
            }
        } else {
            // Se o CEP não tem 8 dígitos ou foi apagado, limpa o endereço encontrado
            setAddressFound(null);
            setUserAddress(null);
        }
    }, [setUserAddress]); // A dependência de setUserAddress é importante aqui

    // REMOVER: handleUseLocation e sua lógica
    // A funcionalidade "Usar minha localização" será removida conforme solicitado.

    const handleSearchClick = () => {
        if (addressFound && addressFound.rua && addressFound.cidade) { // Verifica se addressFound não é null e tem rua/cidade
            ToastAlerta(`Buscando opções para: ${addressFound.rua}, ${addressFound.cidade}`, 'info');
            // Aqui você redirecionaria para uma página de resultados de busca
            // Ex: navigate(`/search?cep=${addressFound.cep}&rua=${addressFound.rua}`);
        } else if (cepInput.replace(/\D/g, '').length === 8 && !addressFound) {
            ToastAlerta('Por favor, aguarde a busca do CEP ou digite um CEP válido.', 'info');
        } else {
            ToastAlerta('Por favor, digite seu CEP para encontrar lojas próximas.', 'info');
        }
    };

    useEffect(() => {
        if (cepInputRef.current && !cepInput && !userAddress) { // Foca se o input e o endereço no contexto estiverem vazios
            cepInputRef.current.focus();
        }
    }, [cepInput, userAddress]);

    return (
        <div className="w-full flex flex-col items-center justify-center bg-gray-50 font-sans">
            {/* Hero Section: Proposta de Valor e Busca de Endereço */}
            <article className="bg-gradient-to-br from-orange-500 via-yellow-400 to-yellow-200 w-full px-4 py-16 md:py-20 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-overlay opacity-10 pointer-events-none"></div>
                
                <div className="flex flex-col lg:flex-row justify-center items-center gap-10 md:gap-16 max-w-7xl mx-auto relative z-10">
                    <section className="flex flex-col justify-center items-center lg:items-start gap-5 max-w-2xl text-center lg:text-left">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-lg animate-fade-in-down">
                            Seu Delivery, <br className="hidden md:inline"/>Na Sua Porta!
                        </h1>
                        <p className="text-xl md:text-2xl font-semibold text-white/90 drop-shadow-md animate-fade-in-up">
                            Comida, mercados, farmácias e muito mais. Tudo o que você precisa, onde você estiver.
                        </p>

                        <div className="pt-8 w-full max-w-md flex flex-col gap-4 animate-fade-in">
                            <label htmlFor="cep" className="sr-only">Digite seu CEP</label>
                            <div className="relative flex w-full">
                                <input
                                    type="text"
                                    id="cep"
                                    name="cep"
                                    placeholder="Digite seu CEP para encontrar lojas"
                                    className="flex-1 border-2 border-white/50 bg-white/80 text-gray-800 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-4 focus:ring-white focus:border-white/90 shadow-lg placeholder-gray-500 transition-all duration-200"
                                    value={cepInput}
                                    onChange={handleCepChange}
                                    maxLength={9}
                                    ref={cepInputRef}
                                    // isGettingLocation não existe mais, então removemos a prop disabled
                                />
                                <button
                                    onClick={handleSearchClick}
                                    className="absolute right-0 top-0 h-full bg-orange-600 text-white rounded-full px-6 text-xl font-bold hover:bg-orange-700 transition-colors duration-200 shadow-lg disabled:opacity-50"
                                    // Desabilita se estiver buscando ou se não houver um endereço encontrado válido
                                    disabled={isSearchingCep || !addressFound?.rua} 
                                >
                                    {isSearchingCep ? 'Buscando CEP...' : 'Buscar'}
                                </button>
                            </div>
                            {addressFound && addressFound.rua && addressFound.cidade && (
                                <p className="text-sm text-white/90 text-center lg:text-left drop-shadow-md">
                                    Localização: **{addressFound.rua}** - **{addressFound.cidade}**
                                    {addressFound.bairro && ` (${addressFound.bairro})`}
                                    {addressFound.cep && ` - CEP: ${addressFound.cep}`}
                                </p>
                            )}
                            {/* REMOVER O BOTÃO "Usar minha localização" conforme solicitado */}
                        </div>
                    </section>

                    <section className="pt-8 lg:pt-0 flex justify-center items-center">
                        <img
                            className="w-[300px] md:w-[400px] lg:w-[550px] h-auto object-contain animate-float-custom drop-shadow-2xl"
                            src="https://ik.imagekit.io/gqta2uhtht/um-delicioso-hamburguer-no-estudio-removebg-preview%201%20(1).png?updatedAt=1752104960964"
                            alt="Hambúrguer delicioso com elementos de delivery"
                        />
                    </section>
                </div>
            </article>

            {/* Seção de Categorias de Serviços */}
            <div className="w-full max-w-7xl px-4 py-12 bg-white rounded-lg shadow-xl -mt-16 relative z-20 md:-mt-24 lg:-mt-32">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                    O que você precisa está aqui
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <Storefront size={48} weight="fill" className="text-green-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Restaurantes</span>
                    </Link>
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <ShoppingBag size={48} weight="fill" className="text-blue-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Supermercados</span>
                    </Link>
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <BeerBottle size={48} weight="fill" className="text-purple-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Bebidas</span>
                    </Link>
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <Package size={48} weight="fill" className="text-red-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Farmácia</span>
                    </Link>
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <MapPinLine size={48} weight="fill" className="text-teal-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Lojas</span>
                    </Link>
                    <Link to="/produtos" className="flex flex-col items-center gap-2 p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full max-w-[120px]">
                        <ShoppingCartSimple size={48} weight="fill" className="text-yellow-600" />
                        <span className="text-base font-semibold text-gray-700 text-center">Shopping</span>
                    </Link>
                </div>
            </div>

            {/* Seção de Promoções */}
            <div className="w-full max-w-7xl px-4 mt-12 md:mt-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                    😋 Deliciosas promoções
                </h2>
                <CarrosselMedio />
            </div>

            {/* Seção de Produtos em Destaque */}
            <div className="w-full max-w-7xl px-4 mt-12 md:mt-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8">
                    🍔 Explore Nossas Delícias
                </h2>
                <CarrosselProdutos />
            </div>

            {/* Seções de Chamada à Ação: Junte-se a Nós (Alinhado com Rappi/iFood/Deliveroo) */}
            <div className="w-full max-w-7xl px-4 py-16 mt-12 md:mt-16 bg-gradient-to-r from-orange-400 to-yellow-300 rounded-xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-white text-center lg:text-left">
                <div className="lg:w-1/2 flex flex-col gap-4">
                    <h3 className="text-3xl md:text-4xl font-extrabold drop-shadow-md">
                        Faça parte do nosso time!
                    </h3>
                    <p className="text-lg md:text-xl font-medium opacity-90">
                        Tenha acesso a milhões de usuários e aumente suas vendas sem sair da sua loja.
                    </p>
                    <Link to="/cadastro-restaurante" className="mt-4 bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        Registre seu Negócio
                    </Link>
                </div>
                <div className="lg:w-1/2 flex flex-col gap-4 mt-8 lg:mt-0">
                    <h3 className="text-3xl md:text-4xl font-extrabold drop-shadow-md">
                        Seja um entregador!
                    </h3>
                    <p className="text-lg md:text-xl font-medium opacity-90">
                        Ganhe dinheiro extra fazendo entregas flexíveis. Receba 100% de suas gorjetas.
                    </p>
                    <Link to="/cadastro-entregador" className="mt-4 bg-white text-orange-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out">
                        Comece a Entregar
                    </Link>
                </div>
            </div>

           
        </div>
    );
}
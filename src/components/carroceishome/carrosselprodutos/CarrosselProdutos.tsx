/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; 
import { motion } from "framer-motion";
import foodCarouselAnimation from '../../../assets/lottie-animations/FoodCarousel.json';

import CardProduto from "../../produto/cardproduto/CardProduto"; 
import type Produto from "../../../models/Produto"; 
import { buscarProdutos } from "../../../services/ProdutoService";
import Lottie from "lottie-react";
 

export default function CarrosselProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta: Produto[] = await buscarProdutos();
        const produtosComFallbacks = resposta.map(produto => ({
            ...produto,
            imagem: produto.imagem || "https://placehold.co/231x193?text=Sem+Imagem",
            nome: produto.nome || "Produto sem nome",
            preco: produto.preco || 0,
            id: produto.id || Math.random(), 
        }));
        setProdutos(produtosComFallbacks);

      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        setProdutos([
          {
              id: 1, 
              nome: "Pizza Frango c/ Catupiry", 
              preco: 45.00, 
              imagem: "https://placehold.co/256x160/F0F0F0/ADADAD?text=Pizza+Frango", 
              nutriScore: "C", 
              ingrediente: "Frango, catupiry, molho de tomate, mussarela", 
              id_categoria: { id: 1, descricao: "Pizzas", palavraChave: "pizza", imagem: "url_pizza_categoria" }, 
              id_usuario: { id: null, nome: "Admin do Sabor", usuario: "admin@delivery.com", senha: "senhaSegura123", foto: "url_admin_foto" }
          },
          {
              id: 2, 
              nome: "Pizza Calabresa", 
              preco: 40.00, 
              imagem: "https://placehold.co/256x160/F0F0F0/ADADAD?text=Pizza+Calabresa", 
              nutriScore: "D", 
              ingrediente: "Calabresa, cebola, molho de tomate, mussarela", 
              id_categoria: { id: 1, descricao: "Pizzas", palavraChave: "pizza", imagem: "url_pizza_categoria" }, 
              id_usuario: { id: null, nome: "Admin do Sabor", usuario: "admin@delivery.com", senha: "senhaSegura123", foto: "url_admin_foto" }
          },
          {
              id: 3, 
              nome: "Salada Caesar", 
              preco: 30.00, 
              imagem: "https://placehold.co/256x160/F0F0F0/ADADAD?text=Salada+Caesar", 
              nutriScore: "B", 
              ingrediente: "Alface, frango grelhado, croutons, molho caesar", 
              id_categoria: { id: 2, descricao: "Saladas", palavraChave: "saudavel", imagem: "url_salada_categoria" }, 
              id_usuario: { id: null, nome: "Restaurante Sabor Verde", usuario: "saborverde@delivery.com", senha: "senhaRestaurante123", foto: "url_restaurante_foto" }
          },
          {
              id: 4, 
              nome: "Hambúrguer Artesanal", 
              preco: 35.00, 
              imagem: "https://placehold.co/256x160/F0F0F0/ADADAD?text=Hamburguer", 
              nutriScore: "E", 
              ingrediente: "Pão brioche, carne, queijo, bacon, alface, tomate", 
              id_categoria: { id: 3, descricao: "Lanches", palavraChave: "lanche", imagem: "url_lanche_categoria" }, 
              id_usuario: { id: null, nome: "Admin do Sabor", usuario: "admin@delivery.com", senha: "senhaSegura123", foto: "url_admin_foto" }
          },
          {
              id: 5, 
              nome: "Brownie c/ Sorvete", 
              preco: 22.00, 
              imagem: "https://placehold.co/256x160/F0F0F0/ADADAD?text=Brownie", 
              nutriScore: "C", 
              ingrediente: "Brownie de chocolate, sorvete de creme, calda de chocolate", 
              id_categoria: { id: 4, descricao: "Sobremesas", palavraChave: "doce", imagem: "url_doce_categoria" }, 
              id_usuario: { id: null, nome: "Restaurante Sabor Verde", usuario: "saborverde@delivery.com", senha: "senhaRestaurante123", foto: "url_restaurante_foto" }
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    carregarProdutos();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <Lottie 
          animationData={foodCarouselAnimation} 
          loop={true} 
          autoplay={true} 
          className="h-60"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-screen-xl relative px-4" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute -left-12 top-1/2 z-20 -translate-y-1/2 hidden lg:block"> 
        <button
          ref={prevRef}
          className="bg-white text-orange-500 hover:bg-orange-100 rounded-full p-3 md:p-4 shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 cursor-pointer"
        >
          <span className="text-2xl font-bold">❮</span> 
        </button>
      </div>

      <div className="absolute -right-12 top-1/2 z-20 -translate-y-1/2 hidden lg:block"> 
        <button
          ref={nextRef}
          className="bg-white text-orange-500 hover:bg-orange-100 rounded-full p-3 md:p-4 shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200 cursor-pointer"
        >
          <span className="text-2xl font-bold">❯</span> 
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]} 
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          if (prevRef.current && nextRef.current) {
            (swiper.params.navigation as any).prevEl = prevRef.current;
            (swiper.params.navigation as any).nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }
        }}
        loop={true}
        
        spaceBetween={30} 
        breakpoints={{
          320: {
            slidesPerView: 1.5, 
            spaceBetween: 230, 
          },
          480: {
            slidesPerView: 2,
            spaceBetween: 235, 
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 230, 
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 235, 
          }
          // 1280: {
          //   slidesPerView: 5,
          //   spaceBetween: 230, 
          // },
          // 1536: {
          //   slidesPerView: 6, 
          //   spaceBetween: 225, 
          // },
        }}
        className="py-8 md:py-12 w-full h-full" 
      >
        {produtos.map((produto) => (
          <SwiperSlide key={produto.id || produto.nome} className="flex justify-center"> 
            <CardProduto produto={produto} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}
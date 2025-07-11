/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { DNA } from "react-loader-spinner";

import CardProdutoCarrossel from "../cardprodutocarrossel/CardProdutoCarrssel";
import { buscarTodosProdutos } from "../../../services/Service";
import type Produto from "../../../models/Produto";

export default function CarrosselProdutos() {
  const [produtos, setProdutos] = useState<{ imagem: string; titulo: string; preco: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const resposta = await buscarTodosProdutos();
        const adaptados = resposta.map((produto: Produto) => ({
          imagem: produto.imagem || "https://placehold.co/231x193",
          titulo: produto.nome,
          // Assuming produto.id exists, otherwise consider a more robust unique key generation
          // id: produto.id,
          preco: `R$ ${produto.preco.toFixed(2)}`,
        }));
        setProdutos(adaptados);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        // Fallback data for development/error handling
        setProdutos([
          {
            imagem: "https://placehold.co/231x193?text=Pizza+Frango",
            titulo: "Pizza Frango com catupiry",
            preco: "R$ 45,00",
          },
          {
            imagem: "https://placehold.co/231x193?text=Calabresa",
            titulo: "Pizza Calabresa",
            preco: "R$ 40,00",
          },
          {
            imagem: "https://placehold.co/231x193?text=Marguerita",
            titulo: "Pizza Marguerita",
            preco: "R$ 42,00",
          },
          {
            imagem: "https://placehold.co/231x193?text=Portuguesa",
            titulo: "Pizza Portuguesa",
            preco: "R$ 47,00",
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
      <div className="w-full flex justify-center py-10">
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperClass="dna-wrapper"
        />
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-screen-xl relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Botões de navegação responsivos */}
      <div className="absolute left-2 md:-left-14 top-1/2 z-10 -translate-y-1/2">
        <button
          ref={prevRef}
          className="bg-gray-100 hover:bg-gray-300 rounded-full p-2 md:p-3 shadow-md"
        >
          ⬅
        </button>
      </div>

      <div className="absolute right-2 md:-right-14 top-1/2 z-10 -translate-y-1/2">
        <button
          ref={nextRef}
          className="bg-gray-100 hover:bg-gray-300 rounded-full p-2 md:p-3 shadow-md"
        >
          ➡
        </button>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          // Forçar reatribuição após refs estarem disponíveis
          (swiper.params.navigation as any).prevEl = prevRef.current;
          (swiper.params.navigation as any).nextEl = nextRef.current;
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        pagination={{ clickable: true }}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 5 }, // Smaller space for small screens
          640: { slidesPerView: 2, spaceBetween: 10 },
          1024: { slidesPerView: 3, spaceBetween: 10 },
          1280: { slidesPerView: 4, spaceBetween: 15 }, // Slightly more space for large screens
          1536: { slidesPerView: 5, spaceBetween: 15 },
          1920: { slidesPerView: 6, spaceBetween: 20 }, // Even more space for very large screens
          2560: { slidesPerView: 7, spaceBetween: 20 },
        }}
        className="py-10 gap-2 md:gap-2.5 w-full h-full"
      >
        {produtos.map((produto, i) => (
          // Consider using a unique 'id' from 'produto' if available instead of 'i'
          <SwiperSlide key={i} className="flex justify-center">
            <CardProdutoCarrossel {...produto} />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}
// src/components/carrossel/CarrosselProdutos.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CardProduto from "../cardproduto/CardProduto";


git 
export default function CarrosselProdutos() {
  const produtos = [
    {
      imagem: "https://placehold.co/231x193",
      titulo: "Pizza Frango com catupiri",
      preco: "R$ 45,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Calabresa",
      titulo: "Pizza Calabresa",
      preco: "R$ 40,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Marguerita",
      titulo: "Pizza Marguerita",
      preco: "R$ 42,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Portuguesa",
      titulo: "Pizza Portuguesa",
      preco: "R$ 47,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Calabresa",
      titulo: "Pizza Calabresa",
      preco: "R$ 40,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Marguerita",
      titulo: "Pizza Marguerita",
      preco: "R$ 42,00"
    },
    {
      imagem: "https://placehold.co/231x193?text=Portuguesa",
      titulo: "Pizza Portuguesa",
      preco: "R$ 47,00"
    }
  ];

  return (
    <div className="w-full max-w-screen-xl">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={10}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
          1536: { slidesPerView: 5 }
        }}
        className="py-10"
      >
        {produtos.map((produto, i) => (
          <SwiperSlide key={i} className="flex justify-center">
            <CardProduto {...produto} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

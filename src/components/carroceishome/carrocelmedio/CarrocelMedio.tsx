// src/components/carrossel/CarrosselMedio.tsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";


export default function CarrosselMedio() {
  const imagens = [
    "https://placehold.co/1000x800",
    "https://placehold.co/1000x800?text=Promoção",
    "https://placehold.co/1000x800?text=Pizza+do+Dia"
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination]}
      autoplay={{ delay: 5000 }}
      pagination={{ clickable: true }}
      loop={true}
      slidesPerView={1}
      className="max-w-2/3  h-[400px] lg:h-[500px] rounded-xl"
    >
      {imagens.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} alt={`Destaque ${i}`} className="w-full h-full object-cover rounded-xl" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

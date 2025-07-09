// src/components/carrossel/CarrosselPrincipal.tsx
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Slide01 from "../slides/Slide01";


export default function CarrosselPrincipal() {
  return (
    
    <Swiper 
      slidesPerView={1}
      loop={true}
      navigation={false}
      pagination={{ clickable: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      modules={[Autoplay, Pagination, Navigation]}
      className="w-screen h-[500px]  shadow-[0_16px_6px_-1px_rgba(0,0,0,0.1)]" 
    >
      <SwiperSlide>
        <Slide01 />
      </SwiperSlide>
      <SwiperSlide>
        <img
          className="w-full h-full object-cover"
          src="https://ik.imagekit.io/vzr6ryejm/games/slide_03.jpg?updatedAt=1717248886808"
          alt="Carrossel - Slide 02"
        />
      </SwiperSlide>
      <SwiperSlide>
        <img
          className="w-full h-full object-cover"
          src="https://ik.imagekit.io/vzr6ryejm/games/slide_04.jpg?updatedAt=1717248886688"
          alt="Carrossel - Slide 03"
        />
      </SwiperSlide>
    </Swiper>
  );
}

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion"; // Animação com Framer Motion

// Array de URLs das imagens de banners de promoção

const bannerPromocoes = [
  "https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2016,%202025,%2008_30_48%20PM.png?updatedAt=1752708739819", 
  "https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2016,%202025,%2008_38_40%20PM.png?updatedAt=1752709165673", 
  "https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2016,%202025,%2008_41_29%20PM.png?updatedAt=1752709330388", // Exemplo: Imagem de promoção de sobremesa
  "https://ik.imagekit.io/8h7kfljfc/imgs/ChatGPT%20Image%20Jul%2016,%202025,%2008_54_50%20PM.png?updatedAt=1752710134648"  // Exemplo: Imagem de promoção de bebida
];

export default function CarrosselMedio() {
  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000, 
          disableOnInteraction: false, 
        }}
        pagination={{ clickable: true }} 
        loop={true} 
        slidesPerView={1} 
        className="rounded-3xl shadow-xl border-2 border-gray-100" 
      >
        {bannerPromocoes.map((imagem, i) => (
        <SwiperSlide
          key={i}
          className="relative flex items-center justify-center w-full h-[400px] md:h-[450px] overflow-hidden rounded-3xl"
        >
          <img
            src={imagem}
            alt={`Promoção ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </SwiperSlide>

        ))}
      </Swiper>
    </motion.div>
  );
}
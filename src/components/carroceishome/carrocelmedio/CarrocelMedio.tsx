import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion } from "framer-motion"; // 👈 animação
import { buscarTodosProdutos } from "../../../services/Service";
import type Produto from "../../../models/Produto";
import Loader from "../../ui/Loader";


export default function CarrosselMedio() {
  const [banners, setBanners] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarBanners() {
      try {
        const produtos: Produto[] = await buscarTodosProdutos();
        const imagensValidas = produtos
          .map((produto) => produto.imagem)
          .filter((url): url is string => !!url);

        setBanners(
          imagensValidas.length > 0
            ? imagensValidas
            : [
                "https://placehold.co/1000x800?text=Fallback+1",
                "https://placehold.co/1000x800?text=Fallback+2"
              ]
        );
      } catch (error) {
        console.error("Erro ao carregar imagens dos produtos:", error);
        setBanners([
          "https://placehold.co/1000x800?text=Fallback+1",
          "https://placehold.co/1000x800?text=Fallback+2"
        ]);
      } finally {
        setCarregando(false);
      }
    }

    carregarBanners();
  }, []);

  if (carregando) return <Loader />;

  return (
    <motion.div
      className="w-full max-w-6xl mx-auto px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView={1}
        className="rounded-xl"
      >
        {banners.map((imagem, i) => (
          <SwiperSlide key={i}>
            <img
              src={imagem}
              alt={`Destaque ${i}`}
              className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover rounded-xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
}

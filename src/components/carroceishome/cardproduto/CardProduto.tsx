// src/components/cards/CardProduto.tsx
type CardProdutoProps = {
  imagem: string;
  titulo: string;
  preco: string;
  nutriscore?: string;
};

export default function CardProduto({ imagem, titulo, preco, nutriscore = "D" }: CardProdutoProps) {
  return (
    <div className="h-80 w-0 p-3 bg-orange-100 rounded-xl flex flex-col justify-start items-start gap-1.5 min-w-[230px]">
      <img className="w-56 h-48 rounded-xl object-cover" src={imagem} alt={titulo} />
      <div className="text-black/60 text-base font-bold font-poppins">{titulo}</div>
      <div className="text-black/60 text-base font-normal font-poppins">{preco}</div>
      <div className="text-red-800 text-3xl font-bold font-['IBM Plex Mono']">{nutriscore}</div>
    </div>
  );
}

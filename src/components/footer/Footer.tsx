import { FacebookLogo, GithubLogo, InstagramLogo, LinkedinLogo } from '@phosphor-icons/react'

function Footer() {

    // eslint-disable-next-line prefer-const
    let data = new Date().getFullYear()



    return <footer className="bg-[#453E00] text-white py-14 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-12">

          {/* Coluna 1 - Logo + Endereço */}
          <div className="flex flex-col gap-6 min-w-[250px]">
            <div className="flex items-center gap-4">
              <img 
                src="https://ik.imagekit.io/8h7kfljfc/imgs/deliverylogo.png?updatedAt=1752066792229"
                alt="Logo"
                className="w-16 h-16 rounded-full"
              />
              <p className="text-xl font-semibold">
                Rua do Ouvidor 666<br />Campinas - SP
              </p>
            </div>
            <p className="text-sm">+55 (19) 4992-8922</p>
            <p className="text-sm">contact@delivery.com</p>
          </div>

          {/* Coluna 2 - Navegação */}
          <div className="flex flex-col gap-3 min-w-[150px]">
            <h3 className="text-lg font-semibold mb-2">Mapa do Site</h3>
            {["Home", "Sobre", "Produtos", "Categorias"].map((item, i) => (
              <p
                key={i}
                className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>

          {/* Coluna 3 - Social */}
          <div className="flex flex-col gap-3 min-w-[150px]">
            <h3 className="text-lg font-semibold mb-2">Social</h3>
            {[ <LinkedinLogo size={48} weight='bold' />,
              <InstagramLogo size={48} weight='bold' />,
              <FacebookLogo size={48} weight='bold' />,
              <GithubLogo size={48} weight='bold' />].map((item, i) => (
              <p
                key={i}
                className="hover:scale-105 hover:text-yellow-300 transition-transform cursor-pointer"
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* Rodapé inferior */}
        <div className="mt-10 text-center text-xs opacity-60">
          © { data} Delivery Company - Todos os direitos reservados.
        </div>
      </footer>
        
    }



export default Footer;

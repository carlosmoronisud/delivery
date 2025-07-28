# 🚀 Seo Delivery - Frontend 🍽️

<div align="center">
  <img src="https://ik.imagekit.io/8h7kfljfc/imagem/reac.png?updatedAt=1749471195419" title="React" width="25%"/>
</div>

<div align="center">
  <img src="https://img.shields.io/github/languages/top/carlosmoronisud/delivery_react?style=flat-square" alt="Linguagem Top"/>
  <img src="https://img.shields.io/github/repo-size/carlosmoronisud/delivery_react?style=flat-square" alt="Tamanho do Repositório"/>
  <img src="https://img.shields.io/github/languages/count/carlosmoronisud/delivery_react?style=flat-square" alt="Contagem de Linguagens"/>
  <img src="https://img.shields.io/github/last-commit/carlosmoronisud/delivery_react?style=flat-square" alt="Último Commit"/>
  <img src="https://img.shields.io/github/issues/carlosmoronisud/delivery_react?style=flat-square" alt="Issues Abertas"/>
  <img src="https://img.shields.io/github/issues-pr/carlosmoronisud/delivery_react?style=flat-square" alt="Pull Requests Abertos"/>
  <img src="https://img.shields.io/badge/status-pronto%20para%20saciar%20sua%20fome-green?style=flat-square" alt="Status: Pronto para Saciar sua Fome"/>
</div>

---

## 🌟 Bem-vindo ao Seo Delivery - Frontend!

Projeto desenvolvido com **React** e **TypeScript** para proporcionar uma experiência completa de delivery.

### 🍕 Funcionalidades:

- **Cadastro e Login Rápido:** Inclui login via Google OAuth.
- **Cardápio Interativo:** Produtos filtráveis por preço, NutriScore, categoria e restrições alimentares.
- **Busca por CEP e Geolocalização:** Integração com Google Maps (em implementação).
- **Carrinho Intuitivo:** Com gerenciamento prático.
- **Rastreamento de Pedidos com Lottie:** Animações e status em tempo real.
- **Controle de Acesso:** Separação clara entre usuários e administradores.
- **Navegação:** React Router DOM.
- **API Consumo:** Axios.
- **Design:** Tailwind CSS inspirado em apps como iFood e Rappi.

---

## 🔐 Autenticação e Permissões

### Fluxo de Autenticação:
- Cadastro via email/senha ou Google OAuth.
- Token JWT salvo via Context API e localStorage.
- Expirou? Volta pro login.

### Controle por Perfil:
- **Admin:** CRUD de produtos e categorias.
- **Usuário Google:** Apenas consumo (compra, carrinho, etc).

---

## 🚀 Tecnologias Utilizadas

| Tecnologia                 | Finalidade                           |
|-----------------------------|--------------------------------------|
| React                       | UI                                    |
| TypeScript                  | Tipagem                               |
| Tailwind CSS                | Estilização                           |
| Axios                       | Consumo de API                        |
| React Router DOM            | Navegação                             |
| Vite                        | Bundler                               |
| Zod                         | Validação                             |
| React Hook Form             | Formulários                           |
| Phosphor Icons              | Ícones                                |
| React Toastify              | Alertas                               |
| Lottie-React                | Animações                             |
| @react-google-maps/api      | Mapa                                  |
| use-places-autocomplete     | Autocomplete endereços                |
| @tanstack/react-query       | Cache API                             |

---

## 🎒 Pré-requisitos

- Node.js (16+)
- Yarn
- Git
- Visual Studio Code
- Backend rodando com Spring Boot.

### Google Maps API:
- Habilitar Maps JavaScript API, Geocoding API, Places API.
- Configurar chave de API e faturamento.

---

## 🏃‍♀️ Como Rodar Localmente

```bash
# Clone o repositório:
git clone https://github.com/carlosmoronisud/delivery_react.git

# Acesse a pasta:
cd delivery_react

# Instale dependências:
yarn

# Variáveis de ambiente:
touch .env
# Edite o .env com:
VITE_GOOGLE_CLIENT_ID=SUA_CHAVE_CLIENTE_GOOGLE_AQUI
VITE_APP_BACKEND_URL=http://localhost:8080
VITE_GOOGLE_MAPS_API_KEY=SUA_CHAVE_GOOGLE_MAPS_AQUI

# Rode a aplicação:
yarn dev


```

🤝 Integração com Backend

## Certifique-se de que o backend Spring Boot esteja rodando.
```bash
🔗  Seu Delivery - Spring Boot https://delivery-hzm2.onrender.com
```

# 🌳 Estrutura de Diretórios

```bash

src/
├── assets/         # Imagens e animações
├── components/     # UI (carrossel, categorias, mapa, etc.)
├── contexts/       # Estado global
├── models/         # Tipagens
├── pages/          # Páginas (carrinho, produtos, etc.)
├── services/       # Comunicação com APIs
├── utils/          # Utils e helpers
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Ideias Futuras

- Múltiplos endereços.

- Upload de imagens.

- Histórico de pedidos.

- Avaliações e comentários.

- Pagamento online.

- Notificações push.

- Testes automatizados.

- Internacionalização.

## 💖 Contribuição

Contribuições são bem-vindas!

# Agradecimentos a Rafael Queiroz e Aimee Thompson. 🙏

Abra uma issue.

Faça um Pull Request.

Compartilhe com amigos!

# 📧 Contato
Desenvolvido por Carlos Moroni
GitHub - Carlos Moroni


>Se quiser posso te entregar já com `.md` pronto, só me pedir. 🚀


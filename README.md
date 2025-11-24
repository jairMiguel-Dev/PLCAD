# ProGLES - Plataforma de Ensino Gamificada

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Novas Implementações (v2.0)](#novas-implementações-v20)
  - [Relógio de Missões](#relógio-de-missões)
  - [Novo Perfil (Hub de Carreira)](#novo-perfil-hub-de-carreira)
  - [Grimório de Código](#grimório-de-código)
  - [Nova Loja](#nova-loja)
  - [Sistema de Missões e Economia](#sistema-de-missões-e-economia)
  - [Framework Choice](#framework-choice)
- [Tecnologias](#tecnologias)
- [Instalação e Execução](#instalação-e-execução)
- [Configuração](#configuração)
- [API Documentation](#api-documentation)
- [Guia de Deploy](#guia-de-deploy)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Sobre o Projeto

**ProGLES** é uma plataforma educacional gamificada que combina ensino de programação e inglês técnico através de uma experiência interativa estilo Duolingo. O sistema inclui:

- Sistema de vidas (hearts)
- XP e níveis
- Conquistas (achievements)
- Missões diárias (quests)
- Sistema freemium + premium
- Sincronização automática de progresso
- Integração com Stripe para pagamentos

---

## ✨ Funcionalidades Principais

### 🎮 Sistema de Gamificação
- **Vidas (Hearts)**: 5 vidas, regenera 1 a cada 30 minutos
- **XP e Níveis**: Sistema de progressão
- **Conquistas**: Desbloqueie achievements completando objetivos
- **Missões Diárias**: 3 quests renovadas diariamente
- **Streak**: Mantenha sua sequência de dias

### 👤 Sistema de Usuários
- **Cadastro e Login** com autenticação JWT
- **Perfil Personalizável**: Altere seu nome de usuário
- **Progresso Sincronizado**: Dados salvos no PostgreSQL
- **Exclusão de Conta**: Delete sua conta permanentemente

### 💎 Sistema Premium
- **Vidas Infinitas**: Jogue sem limites
- **Sem Anúncios**: Experiência premium
- **Suporte Prioritário**: Atendimento diferenciado
- **Badge Especial**: Mostre seu status premium

### 📊 Recursos Educacionais
- **Módulos**: Inglês, Lógica, ou Combo
- **Tipos de Questões**: Teoria, Múltipla Escolha, Construtor de Código, Tradução, Pair Matching, Drag & Drop, Preencher Lacunas, Listening
- **Smart Workout**: Sistema adaptativo que foca em conceitos com menor domínio

---

## 🚀 Novas Implementações (v2.0)

### ⏰ Relógio de Missões
Adicionado um **relógio de contagem regressiva** no widget de Missões Diárias que mostra o tempo restante até o reset (meia-noite).
- **Visual**: Ícone de relógio animado (pulsando).
- **Funcionalidade**: Atualiza a cada segundo, formato HH:MM:SS.

### 👤 Novo Perfil (Hub de Carreira)
O perfil foi transformado em um **Hub de Carreira Gamificado**.
- **Header Profissional**: Avatar com glassmorphism, badge de nível e data de entrada.
- **Progresso de Carreira**: Barra de XP visual com níveis (Estagiário, Júnior, Pleno, Sênior).
- **Grid de Estatísticas**: Ofensiva, Total XP, Lições e Precisão.
- **Heatmap de Atividade**: Gráfico estilo GitHub contribution.
- **Conquistas Otimizadas**: Visualização compacta e clara.

### 📖 Grimório de Código
A tela de revisão evoluiu para um **Grimório de Conhecimento**.
- **Biblioteca Interativa**: Consulte, filtre e aprofunde o entendimento sobre conceitos.
- **Categorias**: Lógica (Azul), Sintaxe (Roxo), Inglês (Vermelho).
- **Níveis de Maestria**: Novato, Aprendiz, Avançado, Mestre.
- **Flashcards**: Definições, exemplos de código e áudio.

### 🏪 Nova Loja
Redesenhada com foco em organização visual e hierarquia clara.
- **Seções**: Premium, Power-Ups, Utilidades, Banco de Gemas.
- **Novos Itens**:
  - **Pular Questão (50💎)**: Pule uma questão difícil sem perder combo.
  - **Reset de Missões (150💎)**: Gere 3 novas missões imediatamente.
- **Design**: Cards com gradientes premium e microinterações.

### 🎯 Sistema de Missões e Economia
- **Expansão**: De 5 para 16 tipos de missões diversificadas.
- **Balanceamento**: Recompensas por lição reduzidas para valorizar as missões.
- **Reset Individual**: Possibilidade de resetar uma única missão por 50 gemas.
- **Streak Quests**: Missões focadas em manter a ofensiva.

### ⚡ Framework Choice
Feature exclusiva para usuários Premium que completam a Unidade 1.
- **Escolha de Caminho**: React (Frontend) ou Node.js (Backend).
- **Fluxo**: Automático após completar nível 110.
- **Visual**: Tela animada com partículas e glassmorphism.

---

## 🛠️ Tecnologias

### Frontend
- **React** 18 com TypeScript
- **Vite** - Build tool
- **Framer Motion** - Animações
- **Lucide React** - Ícones
- **Stripe.js** - Pagamentos
- **Tailwind CSS** - Estilização

### Backend
- **Node.js** com Express
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **Stripe** - Processamento de pagamentos
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Autenticação JWT

---

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- PostgreSQL 12+
- Conta Stripe (para pagamentos)
- Stripe CLI (para webhooks locais)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/progles.git
cd progles
```

### 2. Instale as Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Configure o Banco de Dados
Crie um banco PostgreSQL chamado `proglesDB`:
```sql
CREATE DATABASE proglesDB;
```

### 4. Iniciar o Projeto

**Backend:**
```bash
cd backend
node server.js
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Webhook Stripe (Opcional):**
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Acesse: http://localhost:3000

---

## ⚙️ Configuração (.env)

### Backend (`backend/.env`)
```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=proglesDB
DB_PASSWORD=sua_senha
DB_PORT=5432
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/proglesDB?schema=public"
JWT_SECRET=seu_secret_super_seguro
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env`)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📡 API Documentation

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `DELETE /api/auth/account` - Excluir conta

### Progresso
- `POST /api/auth/progress` - Salvar progresso
- `GET /api/auth/progress` - Carregar progresso

### Premium
- `PUT /api/auth/premium` - Atualizar status premium

### Pagamentos
- `POST /api/payments/create-checkout-session` - Criar sessão Stripe
- `POST /api/payments/webhook` - Webhook Stripe

---

## 🚢 Guia de Deploy (Render)

1. **Crie um Web Service** no Render conectado ao seu GitHub.
2. **Configurações**:
   - Runtime: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
3. **Variáveis de Ambiente**: Adicione `DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `NODE_ENV=production`.
4. **Banco de Dados**: Use o PostgreSQL gerenciado do Render ou outro provedor.

---

## 🐛 Troubleshooting

### Correção Urgente (App.tsx)
Se houver problemas com logout ou funções duplicadas no `App.tsx`:
1. Verifique se `handleLogout`, `handleCancelPremium`, `handleDeleteAccount` estão no mesmo nível de escopo.
2. Certifique-se de que não há funções aninhadas incorretamente.

### Banco de Dados
- Erro "database does not exist": Crie o banco manualmente via `psql`.
- Erro de migração: Rode `npx prisma migrate dev`.

---

## 👨‍💻 Desenvolvido por

**Jair Miguel**
- GitHub: [@jairMiguel-Dev](https://github.com/jairMiguel-Dev)

---

**Made with ❤️ and ☕**

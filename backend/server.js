const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS (libera o frontend hospedado separadamente)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// Stripe webhook (precisa vir antes)
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON padrão para o resto
app.use(express.json());

// Rotas básicas
app.get('/', (req, res) => {
  res.send('MicroSaaS Backend is running!');
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Rotas de pagamento
const paymentRoutes = require('./routes/payments');
app.use('/api/payments', paymentRoutes);

// Rotas de autenticação
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// 404 final
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.listen(port, () => console.log(`Server running on port ${port}`));

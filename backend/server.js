const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// CORS (libera o frontend hospedado separadamente)
// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://frontend-ypac.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
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

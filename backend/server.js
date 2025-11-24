const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

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

// Test database connection
app.get('/api/db-test', async (req, res) => {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    res.json({
      status: 'Database connected!',
      userCount,
      database: process.env.DATABASE_URL ? 'configured' : 'NOT configured'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({
      error: 'Database connection failed',
      message: error.message,
      code: error.code
    });
  } finally {
    await prisma.$disconnect();
  }
});

// Run migrations endpoint (for free tier without shell access)
app.get('/api/migrate', async (req, res) => {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);

  try {
    console.log('🔄 Starting database migration...');

    // Execute prisma migrate deploy (no cd needed, already in correct directory)
    const { stdout, stderr } = await execPromise('npx prisma migrate deploy');

    console.log('Migration stdout:', stdout);
    if (stderr) console.error('Migration stderr:', stderr);

    res.json({
      success: true,
      message: 'Migrations executed successfully!',
      output: stdout,
      stderr: stderr || 'No errors'
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message,
      stdout: error.stdout,
      stderr: error.stderr
    });
  }
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

const express = require('express');
const router = express.Router();
const {
    register,
    login,
    saveProgress,
    getProgress,
    updatePremiumStatus,
    deleteAccount,
    authenticateToken
} = require('../controllers/authController');

// Rotas públicas
router.post('/register', register);
router.post('/login', login);

// Rotas protegidas (requerem autenticação)
router.post('/progress', authenticateToken, saveProgress);
router.get('/progress', authenticateToken, getProgress);
router.put('/premium', authenticateToken, updatePremiumStatus);
router.delete('/account', authenticateToken, deleteAccount);

module.exports = router;

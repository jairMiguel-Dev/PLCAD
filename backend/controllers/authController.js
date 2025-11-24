const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        req.user = user;
        next();
    });
};

// Registrar novo usuário
const register = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validações
        if (!email || !username || !password) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
        }

        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }

        // Hash da senha
        const passwordHash = await bcrypt.hash(password, 10);

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                email,
                username,
                passwordHash,
                isPremium: false,
                progress: null
            }
        });

        // Gerar token
        const token = jwt.sign(
            { id: user.id, email: user.email, isPremium: user.isPremium },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validações
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Gerar token
        const token = jwt.sign(
            { id: user.id, email: user.email, isPremium: user.isPremium },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isPremium: user.isPremium,
                progress: user.progress
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

// Salvar progresso (para todos os usuários)
const saveProgress = async (req, res) => {
    try {
        const { progress } = req.body;
        const userId = req.user.id;

        // Atualizar progresso para qualquer usuário
        await prisma.user.update({
            where: { id: userId },
            data: { progress }
        });

        res.json({ message: 'Progresso salvo com sucesso' });
    } catch (error) {
        console.error('Erro ao salvar progresso:', error);
        res.status(500).json({ error: 'Erro ao salvar progresso' });
    }
};

// Obter progresso
const getProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                progress: true,
                isPremium: true
            }
        });

        res.json({
            progress: user.progress,
            isPremium: user.isPremium
        });
    } catch (error) {
        console.error('Erro ao obter progresso:', error);
        res.status(500).json({ error: 'Erro ao obter progresso' });
    }
};

// Atualizar status premium
const updatePremiumStatus = async (req, res) => {
    try {
        const { isPremium } = req.body;
        const userId = req.user.id;

        // Atualizar apenas o status isPremium
        // O progresso é MANTIDO como snapshot até o momento do cancelamento
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isPremium }
        });

        res.json({
            message: isPremium
                ? 'Status premium ativado. Progresso será sincronizado.'
                : 'Assinatura cancelada. Progresso mantido até este momento.',
            isPremium: user.isPremium
        });
    } catch (error) {
        console.error('Erro ao atualizar status premium:', error);
        res.status(500).json({ error: 'Erro ao atualizar status premium' });
    }
};

// Excluir conta permanentemente
const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        // Deletar usuário e todos os dados associados
        await prisma.user.delete({
            where: { id: userId }
        });

        res.json({
            message: 'Conta excluída permanentemente com sucesso'
        });
    } catch (error) {
        console.error('Erro ao excluir conta:', error);
        res.status(500).json({ error: 'Erro ao excluir conta' });
    }
};

module.exports = {
    register,
    login,
    saveProgress,
    getProgress,
    updatePremiumStatus,
    deleteAccount,
    authenticateToken
};

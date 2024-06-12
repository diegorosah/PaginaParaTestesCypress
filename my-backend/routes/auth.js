const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth'); // Importe o middleware de autenticação
const Account = require('../models/Account'); // Importe o modelo de conta

const jwtSecret = process.env.JWT_SECRET || 'S3gr3d0JW7!par4Pr07ege3rT0k3ns'; // Use uma variável de ambiente para armazenar a chave secreta JWT ou uma string padrão

// Rota de Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Procura pelo usuário no banco de dados
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ success: false, message: 'Usuário não encontrado' });

        // Verifica se a senha está correta
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ success: false, message: 'Senha incorreta' });

        // Gera um token JWT
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

        // Verifica se o usuário já tem uma conta
        let account = await Account.findOne({ userId: user._id });
        if (!account) {
            // Se não tiver, cria uma conta associada ao usuário
            account = new Account({ userId: user._id, token: token });
            await account.save();
        }

        res.json({ success: true, token });
    } catch (err) {
        console.error('Erro no login:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

// Rota de Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Verificar se o usuário já existe
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ success: false, message: 'Usuário já existe' });
        }

        // Criar o usuário
        user = new User({ username, password });
        await user.save();

        // Criar um token JWT para o usuário
        const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });

        // Criar e associar a conta do usuário
        const account = new Account({ userId: user._id, token: token });
        await account.save();

        res.json({ success: true, token });
    } catch (err) {
        console.error('Erro no registro:', err);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
});

module.exports = router;

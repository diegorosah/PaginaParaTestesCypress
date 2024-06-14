const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const authMiddleware = require('../middleware/auth');

// Adicionar saldo à conta
router.post('/add-saldo', authMiddleware, async (req, res) => {
    const { valor } = req.body;
    const userId = req.userId;

    try {
        let account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Conta não encontrada' });
        }

        account.saldo += parseFloat(valor);
        account.extrato.push({ descricao: 'Depósito', valor: parseFloat(valor) });
        await account.save();

        res.json({ success: true, message: 'Saldo adicionado com sucesso', saldo: account.saldo });
    } catch (err) {
        console.error('Erro ao adicionar saldo:', err);
        res.status(500).json({ success: false, message: 'Erro ao adicionar saldo' });
    }
});

// Cobrar conta da conta
router.post('/cobrar-conta', authMiddleware, async (req, res) => {
    const { valor, descricao } = req.body;
    const userId = req.userId;

    try {
        let account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Conta não encontrada' });
        }

        if (valor > account.saldo) {
            return res.status(400).json({ success: false, message: 'Saldo insuficiente' });
        }

        account.saldo -= parseFloat(valor);
        account.extrato.push({ descricao: descricao, valor: -parseFloat(valor) });
        await account.save();

        res.json({ success: true, message: 'Conta cobrada com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao cobrar conta' });
    }
});

// Obter extrato da conta
router.get('/extrato', authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Conta não encontrada' });
        }

        res.json({ success: true, extrato: account.extrato });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao obter extrato da conta' });
    }
});

// Obter saldo da conta
router.get('/saldo', authMiddleware, async (req, res) => {
    const userId = req.userId;

    try {
        const account = await Account.findOne({ userId });
        if (!account) {
            return res.status(404).json({ success: false, message: 'Conta não encontrada' });
        }

        res.json({ success: true, saldo: account.saldo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao obter saldo da conta' });
    }
});

module.exports = router;

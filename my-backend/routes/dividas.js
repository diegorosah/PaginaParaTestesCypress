const express = require('express');
const router = express.Router();
const Divida = require('../models/dividas');
const authMiddleware = require('../middleware/auth');

// Rota para adicionar uma nova dívida
router.post('/adicionar', authMiddleware, async (req, res) => {
    try {
        const novaDivida = await Divida.create({
            userId: req.userId, // Usuário autenticado
            status: req.body.status,
            valorTotal: req.body.valorTotal,
            valorParcela: req.body.valorParcela,
            dataInicial: req.body.dataInicial,
            dataFinal: req.body.dataFinal,
            qtdParcelas: req.body.qtdParcelas
        });
        res.status(201).json({ success: true, data: novaDivida });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao adicionar uma nova dívida' });
    }
});

// Rota para remover uma dívida
router.delete('/remover/:id', authMiddleware, async (req, res) => {
    try {
        const dividaRemovida = await Divida.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!dividaRemovida) {
            return res.status(404).json({ success: false, message: 'Dívida não encontrada' });
        }
        res.json({ success: true, data: dividaRemovida });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao remover a dívida' });
    }
});

module.exports = router;

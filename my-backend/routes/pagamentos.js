const express = require('express');
const router = express.Router();
const Pagamento = require('../models/pagamentos');
const authMiddleware = require('../middleware/auth');

// Rota para buscar os pagamentos do usuário
router.get('/pagamentos', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        // Buscar os pagamentos do usuário logado
        const pagamentos = await Pagamento.find({ userId });

        res.json({ success: true, pagamentos });
    } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar pagamentos.' });
    }
});


// Rota para criar um novo pagamento
router.post('/pagamentos', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        // Extrair os dados do corpo da requisição
        const { descricao, valor, vencimento } = req.body;

        // Criar um novo pagamento
        const novoPagamento = new Pagamento({
            descricao,
            valor,
            vencimento,
            userId: userId
        });

        // Salvar o novo pagamento no banco de dados
        await novoPagamento.save();

        res.status(201).json({ success: true, message: 'Pagamento agendado com sucesso!' });
    } catch (error) {
        console.error('Erro ao agendar pagamento:', error);
        res.status(500).json({ success: false, message: 'Erro ao agendar pagamento. Por favor, tente novamente.' });
    }
});


module.exports = router;

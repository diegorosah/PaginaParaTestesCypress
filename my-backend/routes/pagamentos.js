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

router.post('/pagamentos/:id/pagar', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const pagamentoId = req.params.id;

    try {
        const pagamento = await Pagamento.findOne({ _id: pagamentoId, userId });

        if (!pagamento) {
            return res.status(404).json({ success: false, message: 'Pagamento não encontrado' });
        }

        if (pagamento.pago) {
            return res.status(400).json({ success: false, message: 'Pagamento já foi realizado' });
        }

        // Chamar a rota de cobrança para debitar o valor da conta do usuário
        const response = await fetch('http://localhost:3000/api/account/cobrar-conta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': req.header('Authorization')
            },
            body: JSON.stringify({
                valor: pagamento.valor,
                descricao: `Pagamento de ${pagamento.descricao}`
            })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            return res.status(response.status).json({ success: false, message: errorResponse.message });
        }

        pagamento.pago = true;
        await pagamento.save();

        res.json({ success: true, message: 'Pagamento realizado com sucesso!' });
    } catch (error) {
        console.error('Erro ao processar pagamento:', error);
        res.status(500).json({ success: false, message: 'Erro ao processar pagamento. Por favor, tente novamente.' });
    }
});

module.exports = router;

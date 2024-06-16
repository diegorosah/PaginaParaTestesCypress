const express = require('express');
const router = express.Router();
const axios = require('axios');
const Oferta = require('../models/ofertas');
const authMiddleware = require('../middleware/auth');

// Função para limitar as casas decimais
const toTwoDecimals = (num) => parseFloat(num.toFixed(2));

// Rota para calcular os dados da oferta com base no histórico bancário
router.get('/calcular-oferta', authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ success: false, message: 'User ID não encontrado' });
        }

        // Excluir todas as ofertas existentes do usuário
        //await Oferta.deleteMany({ userId: req.userId });

        const [historicoUltimosTresAnos, historicoUltimosTresMeses] = await Promise.all([
            axios.get('http://localhost:3000/api/historico/historico-ultimos-3anos', {
                headers: { Authorization: req.headers.authorization }
            }),
            axios.get('http://localhost:3000/api/historico/historico-ultimos-3meses', {
                headers: { Authorization: req.headers.authorization }
            })
        ]);

        const mediaAnualEntradas = toTwoDecimals(historicoUltimosTresAnos.data.historico.reduce((acc, item) => acc + item.valor, 0) / 3);
        const mediaMensalEntradas = toTwoDecimals(historicoUltimosTresMeses.data.historico.reduce((acc, item) => acc + item.valor, 0) / 3);

        if (isNaN(mediaAnualEntradas) || mediaAnualEntradas <= 0 || isNaN(mediaMensalEntradas) || mediaMensalEntradas <= 0) {
            return res.status(400).json({ success: false, message: 'Médias de entradas inválidas' });
        }

        const valorMaximoOferta = toTwoDecimals(Math.max(0.3 * mediaAnualEntradas, 0));
        const valorMaximoParcela = toTwoDecimals(Math.max(0.3 * mediaMensalEntradas, 0));
        const valorMinimoEntrada = toTwoDecimals(Math.max((valorMaximoOferta - (valorMaximoParcela * 48)) / 48, 0));

        if (isNaN(valorMaximoOferta) || isNaN(valorMaximoParcela) || isNaN(valorMinimoEntrada) ||
            valorMaximoOferta <= 0 || valorMaximoParcela <= 0 || valorMinimoEntrada < 0) {
            return res.status(400).json({ success: false, message: 'Valores calculados inválidos' });
        }

        const ofertaEmprestimo = await Oferta.create({
            userId: req.userId,
            tipoProduto: 'Financiamento',
            valorMinimoEntrada,
            valorTotalPermitido: valorMaximoOferta,
            qtdParcelas: 48,
            valorParcela: valorMaximoParcela,
            txJuros: 0
        });

        res.json({ success: true, ofertaEmprestimo });
    } catch (error) {
        console.error('Erro ao calcular oferta:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao calcular oferta' });
    }
});

router.get('/ofertas', authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ success: false, message: 'User ID não encontrado' });
        }

        // Busca todas as ofertas do usuário pelo ID
        const ofertas = await Oferta.find({ userId: req.userId });

        res.json({ success: true, ofertas });
    } catch (error) {
        console.error('Erro ao obter ofertas:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao obter ofertas' });
    }
});

module.exports = router;


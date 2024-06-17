const express = require('express');
const router = express.Router();
const axios = require('axios');
const Oferta = require('../models/ofertas');
const authMiddleware = require('../middleware/auth');

function toTwoDecimals(value) {
    return Math.round(value * 100) / 100;
}

function calcularValorParcela(principal, txJuros, qtdParcelas) {
    const jurosMensal = txJuros / 100;
    return toTwoDecimals(principal * (jurosMensal * Math.pow(1 + jurosMensal, qtdParcelas)) / (Math.pow(1 + jurosMensal, qtdParcelas) - 1));
}

router.get('/calcular-oferta', authMiddleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ success: false, message: 'User ID não encontrado' });
        }

        // Excluir todas as ofertas existentes do usuário
        await Oferta.deleteMany({ userId: req.userId });

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

        const valorTotalPermitido = toTwoDecimals(0.5 * mediaAnualEntradas);

        // Função para calcular valores das ofertas
        const calcularOferta = (qtdParcelas, txJuros) => {
            let valorParcela = calcularValorParcela(valorTotalPermitido, txJuros, qtdParcelas);
            if (valorParcela > mediaMensalEntradas) {
                valorParcela = mediaMensalEntradas;
            }

            const valorTotalPermitidoAjustado = toTwoDecimals(valorParcela * qtdParcelas);
            const valorMinimoEntrada = toTwoDecimals(valorTotalPermitidoAjustado - valorTotalPermitido);
            const valorTotalPermitidoSemEntrada = toTwoDecimals(valorTotalPermitidoAjustado - valorMinimoEntrada);
            let valorParcelaSemEntrada = calcularValorParcela(valorTotalPermitidoSemEntrada, txJuros, qtdParcelas);
            if (valorParcelaSemEntrada > mediaMensalEntradas) {
                valorParcelaSemEntrada = mediaMensalEntradas;
            }
            return {
                valorParcela,
                valorTotalPermitidoAjustado,
                valorMinimoEntrada,
                valorTotalPermitidoSemEntrada,
                valorParcelaSemEntrada
            };
        };

        // Calcular oferta de Financiamento
        const ofertaFinanciamento = calcularOferta(48, 3); // 3% de juros, 48 parcelas

        // Calcular oferta de Empréstimo
        const ofertaEmprestimo = calcularOferta(60, 1.5); // 1.5% de juros, 60 parcelas

        // Verificar se os valores calculados são válidos
        if (isNaN(valorTotalPermitido) ||
            isNaN(ofertaFinanciamento.valorParcela) || ofertaFinanciamento.valorParcela <= 0 ||
            isNaN(ofertaFinanciamento.valorMinimoEntrada) || ofertaFinanciamento.valorMinimoEntrada < 0 ||
            isNaN(ofertaEmprestimo.valorParcela) || ofertaEmprestimo.valorParcela <= 0 ||
            isNaN(ofertaEmprestimo.valorMinimoEntrada) || ofertaEmprestimo.valorMinimoEntrada < 0) {
            console.log({
                valorTotalPermitido,
                ofertaFinanciamento,
                ofertaEmprestimo
            });
            return res.status(400).json({ success: false, message: 'Valores calculados inválidos' });
        }

        // Criar ofertas no banco de dados
        const novaOfertaFinanciamento = await Oferta.create({
            userId: req.userId,
            tipoProduto: 'Financiamento',
            valorMinimoEntrada: ofertaFinanciamento.valorMinimoEntrada,
            valorTotalPermitido: ofertaFinanciamento.valorTotalPermitidoAjustado,
            qtdParcelas: 48,
            valorParcela: ofertaFinanciamento.valorParcela,
            txJuros: 3
        });

        const novaOfertaFinanciamentoSemEntrada = await Oferta.create({
            userId: req.userId,
            tipoProduto: 'Financiamento',
            valorMinimoEntrada: 0,
            valorTotalPermitido: ofertaFinanciamento.valorTotalPermitidoSemEntrada,
            qtdParcelas: 48,
            valorParcela: ofertaFinanciamento.valorParcelaSemEntrada,
            txJuros: 3
        });

        const novaOfertaEmprestimo = await Oferta.create({
            userId: req.userId,
            tipoProduto: 'Emprestimo',
            valorMinimoEntrada: ofertaEmprestimo.valorMinimoEntrada,
            valorTotalPermitido: ofertaEmprestimo.valorTotalPermitidoAjustado,
            qtdParcelas: 60,
            valorParcela: ofertaEmprestimo.valorParcela,
            txJuros: 1.5
        });

        const novaOfertaEmprestimoSemEntrada = await Oferta.create({
            userId: req.userId,
            tipoProduto: 'Emprestimo',
            valorMinimoEntrada: 0,
            valorTotalPermitido: ofertaEmprestimo.valorTotalPermitidoSemEntrada,
            qtdParcelas: 60,
            valorParcela: ofertaEmprestimo.valorParcelaSemEntrada,
            txJuros: 1.5
        });

        res.json({
            success: true,
            ofertaFinanciamento: novaOfertaFinanciamento,
            ofertaFinanciamentoSemEntrada: novaOfertaFinanciamentoSemEntrada,
            ofertaEmprestimo: novaOfertaEmprestimo,
            ofertaEmprestimoSemEntrada: novaOfertaEmprestimoSemEntrada
        });
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

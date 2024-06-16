const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Historico = require('../models/historicoBancario');
const authMiddleware = require('../middleware/auth'); // Middleware de autenticação

// Rota para adicionar um novo histórico
router.post('/adicionar', authMiddleware, async (req, res) => {
    const { tipo, periodo, frequencia, valor, dataInicio } = req.body;

    try {
        // Converte a data de início para o formato Date
        const dataInicioDate = new Date(dataInicio);

        // Calcula o número de registros a serem inseridos
        let qtdRegistros = 0;
        switch (frequencia) {
            case 'mensal':
                qtdRegistros = periodo * 12;
                break;
            case 'bimestral':
                qtdRegistros = periodo * 6;
                break;
            case 'trimestral':
                qtdRegistros = periodo * 4;
                break;
            case 'semestral':
                qtdRegistros = periodo * 2;
                break;
            case 'anual':
                qtdRegistros = periodo;
                break;
        }

        // Insere os registros de histórico bancário
        const registros = [];
        for (let i = 0; i < qtdRegistros; i++) {
            registros.push({
                userId: req.userId, // Supondo que você tenha o userId disponível no middleware de autenticação
                tipo,
                valor,
                data: new Date(dataInicioDate.getFullYear(), dataInicioDate.getMonth() + i, dataInicioDate.getDate())
            });
        }

        // Salva os registros no banco de dados
        await Historico.insertMany(registros);

        res.json({ success: true, message: 'Histórico bancário inserido com sucesso' });
    } catch (error) {
        console.error('Erro ao inserir histórico bancário:', error);
        res.status(500).json({ success: false, message: 'Erro ao inserir histórico bancário' });
    }
});

// Rota para remover um histórico
router.delete('/remover/:id', authMiddleware, async (req, res) => {
    try {
        const historicoRemovido = await Historico.findByIdAndDelete(req.params.id);
        if (!historicoRemovido) {
            return res.status(404).json({ success: false, message: 'Histórico não encontrado' });
        }
        res.json({ success: true, data: historicoRemovido });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Erro ao remover o histórico' });
    }
});

router.get('/historico-ultimos-3anos', authMiddleware, async (req, res) => {
    try {
        // Calcular a data de 3 anos atrás a partir de hoje
        const hoje = new Date();
        const ultimos3anos = new Date(hoje.getFullYear() - 3, hoje.getMonth(), hoje.getDate());

        // Buscar o histórico bancário dos últimos 3 anos para o usuário logado
        const historico = await Historico.find({
            userId: req.userId,
            data: { $gte: ultimos3anos, $lte: hoje }
        });

        res.json({ success: true, historico });
    } catch (error) {
        console.error('Erro ao recuperar histórico bancário:', error);
        res.status(500).json({ success: false, message: 'Erro ao recuperar histórico bancário' });
    }
});

router.get('/historico-ultimos-3meses', authMiddleware, async (req, res) => {
    try {
        // Calcular a data de 3 meses atrás a partir de hoje
        const hoje = new Date();
        const ultimos3meses = new Date(hoje.getFullYear(), hoje.getMonth() - 3, hoje.getDate());

        // Buscar o histórico bancário dos últimos 3 anos para o usuário logado
        const historico = await Historico.find({
            userId: req.userId,
            data: { $gte: ultimos3meses, $lte: hoje }
        });

        res.json({ success: true, historico });
    } catch (error) {
        console.error('Erro ao recuperar histórico bancário:', error);
        res.status(500).json({ success: false, message: 'Erro ao recuperar histórico bancário' });
    }
});

module.exports = router;

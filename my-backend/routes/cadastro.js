const express = require('express');
const router = express.Router();
const Cadastro = require('../models/cadastro');
const authMiddleware = require('../middleware/auth');

// Rota para cadastrar dados do usuário
router.post('/cadastrar', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const {
        tipoPessoa, nome, dataNascimento, cpf, endereco, telefone, email, estadoCivil,
        nomeConjuge, cpfConjuge, ocupacao, renda, escolaridade, numeroConta,
        preferenciasContato, preferenciasProdutos, cnpj, nomeEmpresa, setorAtuacao
    } = req.body;

    try {
        const newCadastro = new Cadastro({
            userId, tipoPessoa, nome, dataNascimento, cpf, endereco, telefone, email, estadoCivil,
            nomeConjuge, cpfConjuge, ocupacao, renda, escolaridade, numeroConta,
            preferenciasContato, preferenciasProdutos, cnpj, nomeEmpresa, setorAtuacao
        });

        await newCadastro.save();

        res.json({ success: true, message: 'Dados cadastrados com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar dados do usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar dados do usuário. Por favor, tente novamente.' });
    }
});

// Rota para obter dados do usuário
router.get('/dados', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const usuario = await Cadastro.findOne({ userId });
        if (!usuario) {
            return res.status(200).json({ success: true, usuario: null });
        }
        res.json({ success: true, usuario });
    } catch (err) {
        console.error('Erro ao obter dados do usuário:', err);
        res.status(500).json({ success: false, message: 'Erro ao obter dados do usuário' });
    }
});

// Rota para atualizar os dados do usuário
router.post('/atualizar', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const {
            tipoPessoa, nome, dataNascimento, cpf, endereco, telefone, email, estadoCivil,
            nomeConjuge, cpfConjuge, ocupacao, renda, escolaridade, numeroConta,
            preferenciasContato, preferenciasProdutos, cnpj, nomeEmpresa, setorAtuacao
        } = req.body;

        // Encontrar e atualizar usuário pelo ID
        const updatedUsuario = await Cadastro.findOneAndUpdate({ userId }, {
            tipoPessoa, nome, dataNascimento, cpf, endereco, telefone, email, estadoCivil,
            nomeConjuge, cpfConjuge, ocupacao, renda, escolaridade, numeroConta,
            preferenciasContato, preferenciasProdutos, cnpj, nomeEmpresa, setorAtuacao
        }, { new: true });

        if (!updatedUsuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        res.json({ success: true, message: 'Dados do usuário atualizados com sucesso', usuario: updatedUsuario });
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar dados do usuário' });
    }
});

module.exports = router;

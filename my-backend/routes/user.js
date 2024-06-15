const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }

        user.tipoPessoa = tipoPessoa;
        user.nome = nome;
        user.dataNascimento = dataNascimento;
        user.cpf = cpf;
        user.endereco = endereco;
        user.telefone = telefone;
        user.email = email;
        user.estadoCivil = estadoCivil;
        if (estadoCivil === 'Casado') {
            user.nomeConjuge = nomeConjuge;
            user.cpfConjuge = cpfConjuge;
        } else {
            user.nomeConjuge = null;
            user.cpfConjuge = null;
        }
        user.ocupacao = ocupacao;
        user.renda = renda;
        user.escolaridade = escolaridade;
        user.numeroConta = numeroConta;
        user.preferenciasContato = preferenciasContato;
        user.preferenciasProdutos = preferenciasProdutos;

        if (tipoPessoa === 'Juridica') {
            user.cnpj = cnpj;
            user.nomeEmpresa = nomeEmpresa;
            user.setorAtuacao = setorAtuacao;
        }

        await user.save();

        res.json({ success: true, message: 'Dados cadastrados com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar dados do usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao cadastrar dados do usuário. Por favor, tente novamente.' });
    }
});

router.get('/dados', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        res.json({ success: true, usuario });
    } catch (err) {
        console.error('Erro ao obter dados do usuário:', err);
        res.status(500).json({ success: false, message: 'Erro ao obter dados do usuário' });
    }
});

// Rota para atualizar os dados do usuário
router.put('/atualizar', authMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const { nome, email, cpf, telefone, endereco, numero, complemento, cidade, estado, pais, cep, estadoCivil } = req.body;

        // Encontrar e atualizar usuário pelo ID
        await User.findByIdAndUpdate(userId, {
            nome,
            email,
            cpf,
            telefone,
            endereco,
            numero,
            complemento,
            cidade,
            estado,
            pais,
            cep,
            estadoCivil
            // Restante dos campos...
        });

        res.json({ success: true, message: 'Dados do usuário atualizados com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        res.status(500).json({ success: false, message: 'Erro ao atualizar dados do usuário' });
    }
});

module.exports = router;

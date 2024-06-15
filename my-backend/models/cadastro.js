const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tipoPessoa: { type: String, required: true }, // Novo campo para tipo de pessoa (física ou jurídica)
    // Campos comuns
    nome: { type: String, required: true },
    dataNascimento: { type: Date, required: true },
    cpf: { type: String, required: true },
    endereco: {
        cep: { type: String, required: true },
        endereco: { type: String, required: true },
        numero: { type: String, required: true },
        complemento: { type: String },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
        pais: { type: String, required: true }
    },
    telefone: { type: String, required: true },
    email: { type: String, required: true },
    estadoCivil: { type: String, required: true },
    nomeConjuge: { type: String },
    cpfConjuge: { type: String },
    ocupacao: { type: String, required: true },
    renda: { type: Number, required: true },
    escolaridade: { type: String, required: true },
    numeroConta: { type: String, required: true },
    preferenciasContato: { type: String, required: true },
    preferenciasProdutos: {
        type: [String],
        // Campos específicos para pessoa jurídica
        cnpj: { type: String },
        nomeEmpresa: { type: String },
        setorAtuacao: { type: String }
    }
});

module.exports = mongoose.model('Cadastro', userSchema);
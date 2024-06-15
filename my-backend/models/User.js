const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    token: { type: String }, // Campo para armazenar o token JWT
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
    email: { type: String, required: true, unique: true },
    estadoCivil: { type: String, required: true },
    nomeConjuge: { type: String },
    cpfConjuge: { type: String },
    ocupacao: { type: String, required: true },
    renda: { type: Number, required: true },
    escolaridade: { type: String, required: true },
    numeroConta: { type: String, required: true },
    preferenciasContato: { type: String, required: true },
    preferenciasProdutos: { type: [String], required: true },
    // Campos específicos para pessoa jurídica
    cnpj: { type: String },
    nomeEmpresa: { type: String },
    setorAtuacao: { type: String }
});

// Antes de salvar o usuário, hash a senha se ela foi modificada
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar senhas
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

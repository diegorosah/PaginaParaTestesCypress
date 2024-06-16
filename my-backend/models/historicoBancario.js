const mongoose = require('mongoose');

const historicoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao usuário
    data: { type: Date, default: Date.now },
    tipo: { type: String, enum: ['entrada', 'saída'] }, // Tipo de transação
    valor: Number
});

const Historico = mongoose.model('Historico', historicoSchema);

module.exports = Historico;

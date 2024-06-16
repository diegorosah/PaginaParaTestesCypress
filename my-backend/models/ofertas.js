const mongoose = require('mongoose');

const ofertaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao usuário
    idOferta: Number,
    tipoProduto: { type: String, enum: ['Emprestimo', 'Financiamento'] },
    valorMinimo: Number,
    valorMaximo: Number,
    minParcelas: Number,
    maxParcelas: Number,
    txJuros: Number,
});

const Oferta = mongoose.model('Oferta', ofertaSchema);

module.exports = Oferta;

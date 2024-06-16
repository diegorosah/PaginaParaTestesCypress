const mongoose = require('mongoose');

const toTwoDecimals = (num) => {
    return parseFloat(num.toFixed(2));
};

const ofertaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    idOferta: Number,
    tipoProduto: { type: String, enum: ['Emprestimo', 'Financiamento'] },
    valorMinimoEntrada: {
        type: Number,
        set: toTwoDecimals
    },
    valorTotalPermitido: {
        type: Number,
        set: toTwoDecimals
    },
    qtdParcelas: Number,
    txJuros: {
        type: Number,
        set: toTwoDecimals
    },
    valorParcela: {
        type: Number,
        set: toTwoDecimals
    }
});

const Oferta = mongoose.model('Oferta', ofertaSchema);

module.exports = Oferta;

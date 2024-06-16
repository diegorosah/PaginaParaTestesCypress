const mongoose = require('mongoose');

const dividaSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Referência ao usuário
    status: { type: String, enum: ['em dia', 'inadimplente', 'caducada', 'negociada'] },
    valorTotal: Number,
    valorParcela: Number,
    dataInicial: Date,
    dataFinal: Date,
    qtdParcelas: Number
});

const Divida = mongoose.model('Divida', dividaSchema);

module.exports = Divida;

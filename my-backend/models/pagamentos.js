const mongoose = require('mongoose');

const pagamentoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referência ao modelo de usuário
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    valor: {
        type: Number,
        required: true
    },
    vencimento: {
        type: Date,
        required: true
    },
    pago: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Pagamento', pagamentoSchema);

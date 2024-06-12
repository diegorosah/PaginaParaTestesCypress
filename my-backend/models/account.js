const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    saldo: {
        type: Number,
        default: 0
    },
    extrato: [{
        descricao: String,
        valor: Number,
        data: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Account', accountSchema);

const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    type: {
        type: String,
        enum: ['IN', 'OUT'], // IN = Restock, OUT = Sale
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Who performed the action
    },
    date: {
        type: Date,
        default: Date.now,
    },
    remarks: {
        type: String,
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);

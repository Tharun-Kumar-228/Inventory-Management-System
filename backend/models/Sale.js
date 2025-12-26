const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantitySold: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    soldBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
});

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;

const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Transaction = require('../models/Transaction');

// @desc    Create a new Bill (Checkout)
// @route   POST /api/bills
// @access  Private
const createBill = async (req, res) => {
    const { customerName, items, paymentMode } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in bill' });
    }

    try {
        let totalAmount = 0;
        const processedItems = [];

        // 1. Verify Stock and Calculate Total
        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productName}` });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }

            const amount = product.price * item.quantity;
            totalAmount += amount;

            processedItems.push({
                product: product._id,
                productName: product.name,
                quantity: Number(item.quantity),
                price: product.price,
                amount: amount
            });
        }

        // 2. Create Bill Record
        const bill = await Bill.create({
            customerName: customerName || 'Walk-in Customer',
            items: processedItems,
            totalAmount,
            paymentMode,
            soldBy: req.user._id
        });

        // 3. Update Stock & Create Logs
        for (const item of processedItems) {
            // Update Product Quantity
            const product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            await product.save();

            // Create Sales Analytics Record (keeping legacy Sale model for existing stats)
            await Sale.create({
                product: item.product,
                quantitySold: item.quantity,
                totalPrice: item.amount,
                soldBy: req.user._id
            });

            // Create Transaction Log
            await Transaction.create({
                product: item.product,
                type: 'OUT',
                quantity: item.quantity,
                user: req.user._id,
                remarks: `Bill #${bill._id}`
            });
        }

        res.status(201).json(bill);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Billing failed', error: error.message });
    }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
const getBills = async (req, res) => {
    try {
        const bills = await Bill.find({}).sort({ date: -1 }).populate('soldBy', 'name');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createBill,
    getBills
};

const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
    const { name, category, price, quantity, supplier } = req.body;

    try {
        const product = new Product({
            name,
            category,
            price,
            quantity,
            supplier,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Invalid product data' });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
    const { name, category, price, quantity, supplier } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.category = category || product.category;
            product.price = price || product.price;
            product.quantity = quantity !== undefined ? quantity : product.quantity;
            product.supplier = supplier || product.supplier;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.deleteOne(); // or product.remove() in older mongoose
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Restock a product
// @route   POST /api/products/:id/restock
// @access  Admin
const restockProduct = async (req, res) => {
    const { quantity, remarks } = req.body;
    console.log(`Restocking product ${req.params.id} with quantity: ${quantity}`);

    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            product.quantity += Number(quantity);
            await product.save();

            // Create Transaction Record
            // Need to require Transaction model at top, but for now assuming lazy require inside or top level if I can edit top
            const Transaction = require('../models/Transaction');
            await Transaction.create({
                product: product._id,
                type: 'IN',
                quantity: Number(quantity),
                user: req.user._id,
                remarks: remarks || 'Manual Restock'
            });

            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
};

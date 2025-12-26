const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Staff/Admin
const createSale = async (req, res) => {
    const { productId, quantitySold } = req.body;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.quantity < quantitySold) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const totalPrice = product.price * quantitySold;

        const sale = new Sale({
            product: productId,
            quantitySold,
            totalPrice,
            soldBy: req.user._id,
        });

        await sale.save();

        // Decrease product stock
        product.quantity = product.quantity - quantitySold;
        await product.save();

        res.status(201).json(sale);
    } catch (error) {
        res.status(400).json({ message: 'Invalid sale data' });
    }
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Admin
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find({}).populate('product').populate('soldBy', 'name');
        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/sales/stats
// @access  Protected
const getStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const products = await Product.find({});
        const totalStockValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
        const lowStockCount = products.filter(p => p.quantity < 5).length; // Low stock threshold 5

        // Today's sales
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todaysSales = await Sale.find({ date: { $gte: startOfDay } });
        const todaysRevenue = todaysSales.reduce((acc, s) => acc + s.totalPrice, 0);

        // Categories
        const categories = {};
        products.forEach(p => {
            categories[p.category] = (categories[p.category] || 0) + 1;
        });

        // Last 7 days sales for chart
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayStart = new Date(d.setHours(0, 0, 0, 0));
            const dayEnd = new Date(d.setHours(23, 59, 59, 999));

            const salesOnDay = await Sale.countDocuments({
                date: { $gte: dayStart, $lte: dayEnd }
            });
            const revenueOnDay = (await Sale.find({ date: { $gte: dayStart, $lte: dayEnd } })).reduce((acc, s) => acc + s.totalPrice, 0);

            last7Days.push({
                date: dayStart.toLocaleDateString(),
                sales: salesOnDay,
                revenue: revenueOnDay
            });
        }

        // Top selling products
        // This is a bit complex with standard find, simplified for 'beginner-friendly' without complex aggregation pipeline if possible
        // But aggregation is better
        const topProducts = await Sale.aggregate([
            {
                $group: {
                    _id: '$product',
                    totalSold: { $sum: '$quantitySold' },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails',
                },
            },
            {
                $unwind: '$productDetails',
            },
            {
                $project: {
                    name: '$productDetails.name',
                    totalSold: 1,
                }
            }
        ]);

        res.json({
            totalProducts,
            totalStockValue,
            lowStockCount,
            todaysRevenue,
            categoryDistribution: categories,
            last7Days,
            topProducts
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get daily sales report
// @route   GET /api/sales/daily
// @access  Admin
const getDailyReport = async (req, res) => {
    try {
        const dailySales = await Sale.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$totalPrice" },
                    totalItemsSold: { $sum: "$quantitySold" }
                }
            },
            { $sort: { _id: -1 } } // Sort by date descending
        ]);

        res.json(dailySales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};



// @desc    Export daily sales to CSV
// @route   GET /api/sales/export
// @access  Admin
const exportSales = async (req, res) => {
    try {
        // Fetch all sales for today (or all time, let's do all time by default or query param?)
        // Let's do daily report export
        const sales = await Sale.find({}).populate('product', 'name').populate('soldBy', 'name').sort({ date: -1 });

        const fields = [
            { label: 'Date', value: (row) => new Date(row.date).toLocaleDateString() },
            { label: 'Product', value: 'product.name' },
            { label: 'Quantity', value: 'quantitySold' },
            { label: 'Total Price', value: 'totalPrice' },
            { label: 'Sold By', value: 'soldBy.name' }
        ];

        const { Parser } = require('json2csv');
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(sales);

        res.header('Content-Type', 'text/csv');
        res.attachment('sales_report.csv');
        return res.send(csv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error exporting CSV' });
    }
};

module.exports = { createSale, getSales, getStats, getDailyReport, exportSales };

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();

        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: 'password123',
                role: 'admin',
            },
            {
                name: 'Staff User',
                email: 'staff@example.com',
                password: 'password123',
                role: 'staff',
            },
        ]);

        const adminUser = createdUsers[0]._id;

        await Product.create([
            {
                name: 'Wireless Mouse',
                category: 'Electronics',
                price: 29.99,
                quantity: 50,
                supplier: 'Tech Supplies Inc.',
                user: adminUser,
            },
            {
                name: 'Keyboard',
                category: 'Electronics',
                price: 59.99,
                quantity: 30,
                supplier: 'KeyWorld',
                user: adminUser,
            },
            {
                name: 'Office Chair',
                category: 'Furniture',
                price: 150.00,
                quantity: 10,
                supplier: 'ComfySit',
                user: adminUser,
            },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData(); // Not implementing destroy for safety
} else {
    importData();
}

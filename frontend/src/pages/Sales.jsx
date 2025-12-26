import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import AuthContext from '../context/AuthContext';

const Sales = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('Walk-in Customer');
    const [paymentMode, setPaymentMode] = useState('Cash');
    const [lastBill, setLastBill] = useState(null);

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/products`, config);
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [user]);

    // Search Logic
    useEffect(() => {
        setFilteredProducts(
            products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        );
    }, [search, products]);

    // Add to Cart
    const addToCart = (product) => {
        if (product.quantity <= 0) return alert('Out of Stock!');

        const existItem = cart.find(x => x._id === product._id);

        if (existItem) {
            if (existItem.qty + 1 > product.quantity) return alert('No more stock available!');
            setCart(cart.map(x => x._id === product._id ? { ...existItem, qty: existItem.qty + 1 } : x));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    // Remove from Cart
    const removeFromCart = (id) => {
        setCart(cart.filter(x => x._id !== id));
    };

    // Adjust Qty
    const updateQty = (id, amount) => {
        const item = cart.find(x => x._id === id);
        const product = products.find(p => p._id === id);

        const newQty = item.qty + amount;

        if (newQty > product.quantity) return alert('Stock limit reached!');
        if (newQty < 1) return removeFromCart(id);

        setCart(cart.map(x => x._id === id ? { ...item, qty: newQty } : x));
    };

    // Calculate Total
    const grandTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Checkout
    const handleCheckout = async () => {
        if (cart.length === 0) return alert('Cart is empty!');
        if (!window.confirm(`Confirm Sale for $${grandTotal.toFixed(2)}?`)) return;

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };

            const billData = {
                customerName,
                paymentMode,
                items: cart.map(item => ({
                    product: item._id,
                    productName: item.name,
                    quantity: item.qty,
                    price: item.price
                }))
            };

            const { data } = await axios.post(`${API_BASE_URL}/api/bills`, billData, config);

            setLastBill(data);
            alert('Bill Created Successfully!');
            setCart([]);
            setCustomerName('Walk-in Customer');
            fetchProducts(); // Refresh stock
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || 'Checkout Failed');
        }
    };

    // Print Invoice
    const handlePrint = () => {
        const printContent = document.getElementById('invoice-preview').innerHTML;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore SPA state
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen-minus-navbar gap-4 p-4">

            {/* LEFT: Product Selection */}
            <div className="lg:w-2/3 bg-white rounded-xl shadow-lg p-4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Select Products</h2>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="border p-2 rounded-lg w-1/3 focus:ring-2 ring-blue-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2">
                    {filteredProducts.map(product => (
                        <div
                            key={product._id}
                            onClick={() => addToCart(product)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${product.quantity > 0 ? 'bg-white hover:border-blue-500' : 'bg-gray-100 opacity-60 cursor-not-allowed'}`}
                        >
                            <div className="font-bold text-gray-800 truncate">{product.name}</div>
                            <div className="text-sm text-gray-500">{product.category}</div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-green-600 font-bold">${product.price}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {product.quantity > 0 ? `${product.quantity} left` : 'Out of Stock'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: Cart & Billing */}
            <div className="lg:w-1/3 flex flex-col gap-4">

                {/* CART SECTION */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Current Bill</h2>

                    {/* Customer Info */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                        <input
                            className="border p-2 rounded text-sm"
                            placeholder="Customer Name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        <select
                            className="border p-2 rounded text-sm"
                            value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                        >
                            <option>Cash</option>
                            <option>Card</option>
                            <option>UPI</option>
                        </select>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto space-y-2 mb-4">
                        {cart.length === 0 ? <p className="text-gray-400 text-center mt-10">Cart is empty</p> :
                            cart.map(item => (
                                <div key={item._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <div className="w-1/3 truncate font-medium">{item.name}</div>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={() => updateQty(item._id, -1)} className="px-2 bg-gray-200 rounded hover:bg-gray-300">-</button>
                                        <span className="w-6 text-center">{item.qty}</span>
                                        <button onClick={() => updateQty(item._id, 1)} className="px-2 bg-gray-200 rounded hover:bg-gray-300">+</button>
                                    </div>
                                    <div className="font-bold">${(item.price * item.qty).toFixed(2)}</div>
                                    <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">×</button>
                                </div>
                            ))
                        }
                    </div>

                    {/* Total & Checkout */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between text-xl font-bold mb-4">
                            <span>Total:</span>
                            <span className="text-blue-600">${grandTotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            GENERATE BILL
                        </button>
                    </div>
                </div>

                {/* INVOICE PREVIEW (Hidden until generated) */}
                {lastBill && (
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-bold text-green-600">Last Bill Generated!</h3>
                            <button onClick={handlePrint} className="text-sm bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">Print</button>
                        </div>

                        {/* Hidden Printable Area */}
                        <div id="invoice-preview" className="hidden">
                            <div className="p-8 border-2 border-gray-800 max-w-2xl mx-auto">
                                <h1 className="text-3xl font-bold text-center mb-2">INVENTORY STORE</h1>
                                <p className="text-center text-gray-500 mb-6">123 Market Street, City, Country</p>

                                <div className="flex justify-between mb-6">
                                    <div>
                                        <p><strong>Bill To:</strong> {lastBill.customerName}</p>
                                        <p><strong>Date:</strong> {new Date(lastBill.date).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p><strong>Invoice #:</strong> {lastBill._id.slice(-6).toUpperCase()}</p>
                                        <p><strong>Mode:</strong> {lastBill.paymentMode}</p>
                                    </div>
                                </div>

                                <table className="w-full mb-6 border-collapse">
                                    <thead>
                                        <tr className="border-b-2 border-gray-800">
                                            <th className="text-left py-2">Item</th>
                                            <th className="text-center py-2">Qty</th>
                                            <th className="text-right py-2">Price</th>
                                            <th className="text-right py-2">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lastBill.items.map((item, index) => (
                                            <tr key={index} className="border-b border-gray-300">
                                                <td className="py-2">{item.productName}</td>
                                                <td className="text-center py-2">{item.quantity}</td>
                                                <td className="text-right py-2">${item.price}</td>
                                                <td className="text-right py-2">${item.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="text-right text-2xl font-bold border-t-2 border-gray-800 pt-4">
                                    Total: ${lastBill.totalAmount}
                                </div>
                                <div className="text-center text-gray-500 mt-12 text-sm">
                                    Thank you for your business!
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Sales;

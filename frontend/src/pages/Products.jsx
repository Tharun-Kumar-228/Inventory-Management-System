import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import AuthContext from '../context/AuthContext';

const Products = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        supplier: '',
    });
    const [editId, setEditId] = useState(null);
    const [showRestock, setShowRestock] = useState(false);
    const [restockItem, setRestockItem] = useState(null);
    const [restockQty, setRestockQty] = useState('');

    const fetchProducts = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('${API_BASE_URL}/api/products', config);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        try {
            if (editId) {
                await axios.put(``${API_BASE_URL}/api/products/${editId}`, formData, config);
            } else {
                await axios.post('${API_BASE_URL}/api/products', formData, config);
            }
            setShowForm(false);
            setEditId(null);
            setFormData({ name: '', category: '', price: '', quantity: '', supplier: '' });
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        }
    };

    const handleEdit = (product) => {
        setEditId(product._id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            quantity: product.quantity,
            supplier: product.supplier,
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(``${API_BASE_URL}/api/products/${id}`, config);
                fetchProducts();
            } catch (error) {
                console.error(error);
                alert('Error deleting product');
            }
        }
    };

    const TableHeader = ({ title }) => (
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            {title}
        </th>
    );

    if (loading) return <div className="p-8 flex justify-center text-gray-500">Loading products...</div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Products Inventory</h1>
                    <p className="text-sm text-gray-500">Manage your store's inventory items</p>
                </div>
                {user.role === 'admin' && (
                    <button
                        onClick={() => {
                            setEditId(null);
                            setFormData({ name: '', category: '', price: '', quantity: '', supplier: '' });
                            setShowForm(!showForm);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-all flex items-center space-x-2"
                    >
                        <span>{showForm ? 'Cancel' : 'Add Product'}</span>
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 animate-fade-in-down">
                    <h2 className="text-lg font-bold text-gray-700 mb-4 pb-2 border-b">
                        {editId ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Product Name</label>
                            <input name="name" placeholder="e.g. Wireless Mouse" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Category</label>
                            <input name="category" placeholder="e.g. Electronics" value={formData.category} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Price ($)</label>
                            <input name="price" type="number" placeholder="0.00" value={formData.price} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-600">Quantity (Stock)</label>
                            <input name="quantity" type="number" placeholder="0" value={formData.quantity} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium text-gray-600">Supplier Name</label>
                            <input name="supplier" placeholder="e.g. Tech Distributors Inc." value={formData.supplier} onChange={handleChange} required className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow transition-colors">
                                {editId ? 'Update Product' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <TableHeader title="Name" />
                                <TableHeader title="Category" />
                                <TableHeader title="Price" />
                                <TableHeader title="Stock" />
                                <TableHeader title="Supplier" />
                                {user.role === 'admin' && <TableHeader title="Actions" />}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-blue-50 transition-colors duration-150">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.quantity < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {product.quantity} units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.supplier}</td>
                                    {user.role === 'admin' && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleEdit(product)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">Edit</button>
                                            <button onClick={() => { setRestockItem(product); setShowRestock(true); }} className="text-green-600 hover:text-green-900 mr-4 transition-colors">Restock</button>
                                            <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700 transition-colors">Delete</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 text-lg">No products found.</p>
                        <p className="text-gray-400 text-sm mt-1">Add a new product to get started.</p>
                    </div>
                )}
            </div>

            {
                showRestock && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-xl shadow-2xl w-96 animate-fade-in-up border border-gray-100">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">Restock Product</h2>
                            <p className="mb-4 text-gray-600">Adding stock for: <span className="font-semibold text-blue-600">{restockItem?.name}</span></p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Add</label>
                                <input
                                    type="number"
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(e.target.value)}
                                    placeholder="Enter quantity"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-lg"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => { setShowRestock(false); setRestockQty(''); }}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={async () => {
                                        console.log('Restock confirmed. Qty:', restockQty);
                                        if (!restockQty || Number(restockQty) <= 0) {
                                            alert('Please enter a valid quantity greater than 0');
                                            return;
                                        }
                                        try {
                                            const config = { headers: { Authorization: `Bearer ${user.token}` } };
                                            console.log('Sending restock request...');
                                            await axios.post(``${API_BASE_URL}/api/products/${restockItem._id}/restock`, {
                                                quantity: restockQty,
                                                remarks: 'Manual Restock'
                                            }, config);
                                            console.log('Restock success');
                                            alert('Restock Successful!');
                                            setShowRestock(false);
                                            setRestockItem(null);
                                            setRestockQty('');
                                            fetchProducts();
                                        } catch (error) {
                                            console.error('Restock Error:', error);
                                            alert(error.response?.data?.message || 'Restock failed');
                                        }
                                    }}
                                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 shadow-md transition-colors"
                                >
                                    Confirm Restock
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default Products;

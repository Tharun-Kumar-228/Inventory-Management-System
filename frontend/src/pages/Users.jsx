import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import AuthContext from '../context/AuthContext';

const Users = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'staff',
    });
    const [message, setMessage] = useState(null);

    const fetchUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/api/auth/users`, config);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_BASE_URL}/api/auth/register`, formData, config);
            setMessage({ type: 'success', text: 'User created successfully!' });
            setShowForm(false);
            setFormData({ name: '', email: '', password: '', role: 'staff' });
            fetchUsers();
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: error.response?.data?.message || 'Error creating user' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`${API_BASE_URL}/api/auth/users/${id}`, config);
                fetchUsers();
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Error deleting user');
            }
        }
    };

    if (loading) return <div className="p-8">Loading users...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    {showForm ? 'Cancel' : 'Add New User'}
                </button>
            </div>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-6 max-w-lg">
                    <h2 className="text-xl mb-4 font-semibold">Add New Staff</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full border p-2 rounded mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="w-full border p-2 rounded mt-1">
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Create User
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{u.name}</td>
                                <td className="py-3 px-4">{u.email}</td>
                                <td className="py-3 px-4 capitalize">{u.role}</td>
                                <td className="py-3 px-4">
                                    {u.email !== 'admin@example.com' && u._id !== user._id && (
                                        <button onClick={() => handleDelete(u._id)} className="text-red-600 hover:text-red-800">Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;

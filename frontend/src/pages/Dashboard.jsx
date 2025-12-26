import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import API_BASE_URL from '../config/api';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`${API_BASE_URL}/api/sales/stats`, config);
                setStats(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    if (user && user.role !== 'admin') {
        // Staff simplified dashboard
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}</h1>
                <p>Select an option from the sidebar to manage inventory or sales.</p>
            </div>
        )
    }

    if (loading) return <div className="p-8">Loading stats...</div>;
    if (!stats) return <div className="p-8">Error loading stats</div>;

    const barData = {
        labels: stats.last7Days.map((d) => d.date),
        datasets: [
            {
                label: 'Daily Sales ($)',
                data: stats.last7Days.map((d) => d.revenue),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const pieData = {
        labels: Object.keys(stats.categoryDistribution),
        datasets: [
            {
                data: Object.values(stats.categoryDistribution),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Overview</h1>
            <p className="text-gray-500 mb-8">Real-time insights and performance metrics</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Products</h3>
                        <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">{stats.totalProducts}</p>
                    <span className="text-xs text-green-500 font-medium">+ New added</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Stock Value</h3>
                        <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">${stats.totalStockValue.toLocaleString()}</p>
                    <span className="text-xs text-slate-400 font-medium">Total inventory asset</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Today's Sales</h3>
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-slate-800">${stats.todaysRevenue.toLocaleString()}</p>
                    <span className="text-xs text-slate-400 font-medium">Revenue generated today</span>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Low Stock</h3>
                        <span className={`p-2 rounded-lg ${stats.lowStockCount > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </span>
                    </div>
                    <p className={`text-3xl font-bold ${stats.lowStockCount > 0 ? 'text-red-500' : 'text-slate-800'}`}>{stats.lowStockCount}</p>
                    <span className="text-xs text-slate-400 font-medium">Items requiring attention</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart - Takes up 2/3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
                    <h2 className="text-lg font-bold text-slate-800 mb-6">Sales Trends (Last 7 Days)</h2>
                    <div className="h-72">
                        <Bar
                            data={barData}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f1f5f9' }
                                    },
                                    x: {
                                        grid: { display: false }
                                    }
                                },
                                plugins: {
                                    legend: { display: false }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Pie Chart / Top Products - Takes up 1/3 */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-6">Categories</h2>
                        <div className="h-64 flex justify-center">
                            <Pie
                                data={pieData}
                                options={{
                                    maintainAspectRatio: false,
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'bottom', labels: { boxWidth: 12 } }
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Top Sellers</h2>
                        <ul className="space-y-3">
                            {stats.topProducts.slice(0, 3).map((p, index) => (
                                <li key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">{p.name}</span>
                                    <span className="bg-white px-2 py-1 rounded shadow-sm text-sm font-bold text-indigo-600 border border-slate-100">{p.totalSold} sold</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

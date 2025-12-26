import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const DailyReports = () => {
    const { user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/sales/daily', config);
                setReports(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchReports();
        }
    }, [user]);

    if (loading) return <div className="p-8">Loading reports...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daily Sales Reports</h1>
                <button
                    onClick={async () => {
                        try {
                            const response = await axios.get('http://localhost:5000/api/sales/export', {
                                headers: { Authorization: `Bearer ${user.token}` },
                                responseType: 'blob',
                            });
                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', 'sales_report.csv');
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        } catch (error) {
                            console.error('Export failed', error);
                            alert('Failed to export CSV');
                        }
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Total Orders</th>
                            <th className="py-3 px-4 text-left">Items Sold</th>
                            <th className="py-3 px-4 text-left">Total Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report._id} className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">{report._id}</td>
                                <td className="py-3 px-4">{report.totalOrders}</td>
                                <td className="py-3 px-4">{report.totalItemsSold}</td>
                                <td className="py-3 px-4 font-bold text-green-600">
                                    ${report.totalRevenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reports.length === 0 && (
                    <div className="p-4 text-center text-gray-500">No sales history found.</div>
                )}
            </div>
        </div>
    );
};

export default DailyReports;

import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import DailyReports from './pages/DailyReports';
import Users from './pages/Users';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={
            <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
              <Navbar />
              <main className="flex-1 w-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <ProtectedRoute />
              </main>
            </div>
          }>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/daily-reports" element={<DailyReports />} />
            <Route path="/users" element={<Users />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;


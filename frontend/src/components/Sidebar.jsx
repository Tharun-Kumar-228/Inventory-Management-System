import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// Simple SVG Icons
const Icons = {
    Dashboard: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Products: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
    Sales: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Reports: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    Users: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    Logout: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
    MenuLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>,
    MenuRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
};

const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);

    if (!user) return null;

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ path, icon: Icon, label }) => (
        <Link
            to={path}
            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 mt-2
                ${isActive(path)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } ${!isOpen && 'justify-center px-0'}`}
            title={!isOpen ? label : ''}
        >
            <Icon />
            {isOpen && <span className="font-medium whitespace-nowrap overflow-hidden">{label}</span>}
        </Link>
    );

    return (
        <div
            className={`flex flex-col h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out relative border-r border-gray-800
            ${isOpen ? 'w-64' : 'w-20'} flex-shrink-0`}
        >
            {/* Header / Logo */}
            <div className={`h-16 flex items-center ${isOpen ? 'justify-between px-4' : 'justify-center'} border-b border-gray-800`}>
                {isOpen ? (
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                        InventoryPro
                    </span>
                ) : (
                    <span className="text-xl font-bold text-blue-500">IP</span>
                )}
                {/* Integrated Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white focus:outline-none ${!isOpen && 'hidden'}`}
                >
                    <Icons.MenuLeft />
                </button>
            </div>

            {/* Closed State Toggle (Top Center) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full py-2 flex justify-center hover:bg-gray-800 text-gray-400 hover:text-white border-b border-gray-800"
                >
                    <Icons.MenuRight />
                </button>
            )}


            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
                <nav>
                    {isOpen && <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Main</div>}

                    <NavItem path="/" icon={Icons.Dashboard} label="Dashboard" />
                    <NavItem path="/products" icon={Icons.Products} label="Products" />
                    <NavItem path="/sales" icon={Icons.Sales} label="Sales" />

                    {user.role === 'admin' && (
                        <>
                            <div className="mt-6 mb-2">
                                {isOpen && <div className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</div>}
                                <NavItem path="/daily-reports" icon={Icons.Reports} label="Daily Reports" />
                                <NavItem path="/users" icon={Icons.Users} label="Manage Users" />
                            </div>
                        </>
                    )}
                </nav>
            </div>

            {/* Footer / User Info */}
            <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'}`}>
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    {isOpen && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-gray-400 truncate capitalize">{user.role}</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    className={`mt-4 w-full flex items-center rounded-lg text-sm text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors p-2
                    ${isOpen ? 'justify-start space-x-3 px-3' : 'justify-center'}`}
                    title="Logout"
                >
                    <Icons.Logout />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;

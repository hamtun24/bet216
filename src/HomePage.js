import React from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import Admin from './Admin';
import Commercial from './Commercial';
import Vouchers from './Vouchers';

const HomePage = () => {
    return (
        <div className="home-container">
            <nav className="navbar">
                <ul>
                    <li>
                        <Link to="/home">Home</Link>
                    </li>
                    <li>
                        <Link to="/home/admin">G.Admin</Link>
                    </li>
                    <li>
                        <Link to="/home/commercial">G.Commercial</Link>
                    </li>
                    <li>
                        <Link to="/home/vouchers">G.Vouchers</Link>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomeContent />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="commercial" element={<Commercial />} />
                    <Route path="vouchers" element={<Vouchers />} />
                </Routes>
            </div>
        </div>
    );
};

const HomeContent = () => {
    let tt = new Date().toLocaleString(); // Using toLocaleString() for better date formatting
    
    return (
        <div>
            <h1>{tt}</h1>
            <p>You have successfully logged in.</p>
            <Outlet /> {/* Render nested routes */}
        </div>
    );
};

export default HomePage;

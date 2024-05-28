import React, { useEffect, useState } from 'react';
import { Link, Outlet, Route, Routes } from 'react-router-dom';
import Admin from './Admin';
import Commercial from './Commercial';
import Stat from './Stat';
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
                        <Link to="/home/vouchers">G.Cartes</Link>
                    </li>
                    <li>
                        <Link to="/home/stat">Statistiques</Link>
                    </li>
                </ul>
            </nav>
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomeContent />} />
                    <Route path="admin" element={<Admin />} />
                    <Route path="commercial" element={<Commercial />} />
                    <Route path="vouchers" element={<Vouchers />} />
                    <Route path="stat" element={<Stat />} />
                </Routes>
            </div>
        </div>
    );
};

const HomeContent = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000); // Update time every second

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    return (
        <div>
            <h1>{currentTime}</h1>
            <p>You have successfully logged in.</p>
            <Outlet /> {/* Render nested routes */}
        </div>
    );
};

export default HomePage;

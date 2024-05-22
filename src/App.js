import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './HomePage';
import LoginForm from './LoginForm';

const App = () => {
    return (
       
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/home/*" element={<HomePage />} />
            </Routes>
    
    );
};

export default App;

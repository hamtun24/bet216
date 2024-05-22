import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import supabase from './supabaseClient';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
      
        // Query the 'admin' table in Supabase for user data
        const { data, error } = await supabase.from('admin').select('*').eq('username', email).single();
 
        if (error) {
            setError(error.message);
        } else if (!data) {
            setError('User not found or incorrect credentials.');
        } else if (data.password !== password) {
            setError('Incorrect password.');
        } else {
            // Successful login
            navigate('/home');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <p className="error">{error}</p>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" onClick={handleSubmit} className="login-button">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
